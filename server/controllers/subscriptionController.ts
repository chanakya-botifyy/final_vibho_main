// Subscription Controller for VibhoHCM
// This file contains the API endpoints for subscription management

import { Request, Response } from 'express';
import SubscriptionPlan from '../models/SubscriptionPlan';
import TenantSubscription from '../models/TenantSubscription';
import SubscriptionHistory from '../models/SubscriptionHistory';
import Tenant from '../models/Tenant';
import { sendEmail } from '../utils/emailService';

// Get all subscription plans
export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await SubscriptionPlan.find({ isDeleted: false }).sort({ price: 1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Failed to fetch subscription plans' });
  }
};

// Get subscription plan by ID
export const getSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const plan = await SubscriptionPlan.findById(planId);
    
    if (!plan || plan.isDeleted) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    res.status(200).json(plan);
  } catch (error) {
    console.error('Error fetching subscription plan:', error);
    res.status(500).json({ message: 'Failed to fetch subscription plan' });
  }
};

// Create subscription plan
export const createSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      billingCycle,
      features,
      limits,
      isActive
    } = req.body;
    
    // Validate required fields
    if (!name || !price || !billingCycle) {
      return res.status(400).json({ message: 'Name, price, and billing cycle are required' });
    }
    
    // Check if plan with same name already exists
    const existingPlan = await SubscriptionPlan.findOne({ name, isDeleted: false });
    if (existingPlan) {
      return res.status(400).json({ message: 'A plan with this name already exists' });
    }
    
    const newPlan = new SubscriptionPlan({
      name,
      description,
      price,
      billingCycle,
      features,
      limits,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id
    });
    
    await newPlan.save();
    
    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ message: 'Failed to create subscription plan' });
  }
};

// Update subscription plan
export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const {
      name,
      description,
      price,
      billingCycle,
      features,
      limits,
      isActive
    } = req.body;
    
    const plan = await SubscriptionPlan.findById(planId);
    
    if (!plan || plan.isDeleted) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    // Check if plan with same name already exists (excluding this plan)
    if (name && name !== plan.name) {
      const existingPlan = await SubscriptionPlan.findOne({ name, isDeleted: false, _id: { $ne: planId } });
      if (existingPlan) {
        return res.status(400).json({ message: 'A plan with this name already exists' });
      }
    }
    
    // Update plan
    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (billingCycle) plan.billingCycle = billingCycle;
    if (features) plan.features = features;
    if (limits) plan.limits = limits;
    if (isActive !== undefined) plan.isActive = isActive;
    
    plan.updatedBy = req.user.id;
    plan.updatedAt = new Date();
    
    await plan.save();
    
    res.status(200).json(plan);
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ message: 'Failed to update subscription plan' });
  }
};

// Delete subscription plan
export const deleteSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    
    const plan = await SubscriptionPlan.findById(planId);
    
    if (!plan || plan.isDeleted) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    // Check if any tenants are using this plan
    const tenantsUsingPlan = await TenantSubscription.countDocuments({ planId, status: { $ne: 'cancelled' } });
    
    if (tenantsUsingPlan > 0) {
      return res.status(400).json({ 
        message: `Cannot delete this plan as it is being used by ${tenantsUsingPlan} tenant(s)` 
      });
    }
    
    // Soft delete the plan
    plan.isDeleted = true;
    plan.updatedBy = req.user.id;
    plan.updatedAt = new Date();
    
    await plan.save();
    
    res.status(200).json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({ message: 'Failed to delete subscription plan' });
  }
};

// Get all tenant subscriptions
export const getTenantSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await TenantSubscription.find()
      .populate('tenantId', 'name domain')
      .populate('planId', 'name price billingCycle')
      .sort({ createdAt: -1 });
    
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error('Error fetching tenant subscriptions:', error);
    res.status(500).json({ message: 'Failed to fetch tenant subscriptions' });
  }
};

// Get tenant subscription by ID
export const getTenantSubscription = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    
    const subscription = await TenantSubscription.findOne({ tenantId })
      .populate('tenantId', 'name domain')
      .populate('planId', 'name price billingCycle features limits');
    
    if (!subscription) {
      return res.status(404).json({ message: 'Tenant subscription not found' });
    }
    
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching tenant subscription:', error);
    res.status(500).json({ message: 'Failed to fetch tenant subscription' });
  }
};

// Change tenant subscription plan
export const changeTenantPlan = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const {
      newPlanId,
      effectiveDate,
      prorated,
      sendNotification,
      notes
    } = req.body;
    
    // Validate required fields
    if (!newPlanId) {
      return res.status(400).json({ message: 'New plan ID is required' });
    }
    
    // Find tenant subscription
    const subscription = await TenantSubscription.findOne({ tenantId })
      .populate('tenantId', 'name domain adminEmail')
      .populate('planId', 'name');
    
    if (!subscription) {
      return res.status(404).json({ message: 'Tenant subscription not found' });
    }
    
    // Find new plan
    const newPlan = await SubscriptionPlan.findById(newPlanId);
    
    if (!newPlan || newPlan.isDeleted) {
      return res.status(404).json({ message: 'New subscription plan not found' });
    }
    
    // Get old plan details for history
    const oldPlanName = subscription.planId ? (subscription.planId as any).name : null;
    
    // Update subscription
    subscription.planId = newPlanId;
    subscription.updatedBy = req.user.id;
    subscription.updatedAt = new Date();
    
    // If tenant is suspended, reactivate it
    if (subscription.status === 'suspended') {
      subscription.status = 'active';
    }
    
    await subscription.save();
    
    // Create subscription history entry
    const history = new SubscriptionHistory({
      tenantId,
      action: 'plan_change',
      fromPlan: oldPlanName,
      toPlan: newPlan.name,
      performedBy: req.user.id,
      notes
    });
    
    await history.save();
    
    // Send notification if requested
    if (sendNotification && subscription.tenantId) {
      const tenant = subscription.tenantId as any;
      
      if (tenant.adminEmail) {
        await sendEmail({
          to: tenant.adminEmail,
          subject: 'Subscription Plan Changed',
          text: `Your subscription plan has been changed from ${oldPlanName} to ${newPlan.name}. The change will be effective from ${effectiveDate}.`,
          html: `
            <h2>Subscription Plan Changed</h2>
            <p>Dear Admin,</p>
            <p>Your subscription plan has been changed from <strong>${oldPlanName}</strong> to <strong>${newPlan.name}</strong>.</p>
            <p>The change will be effective from <strong>${effectiveDate}</strong>.</p>
            <p>Notes: ${notes || 'N/A'}</p>
            <p>If you have any questions, please contact support.</p>
          `
        });
      }
    }
    
    res.status(200).json({
      message: 'Tenant plan changed successfully',
      subscription
    });
  } catch (error) {
    console.error('Error changing tenant plan:', error);
    res.status(500).json({ message: 'Failed to change tenant plan' });
  }
};

// Suspend tenant subscription
export const suspendTenantSubscription = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { reason } = req.body;
    
    // Validate required fields
    if (!reason) {
      return res.status(400).json({ message: 'Reason for suspension is required' });
    }
    
    // Find tenant subscription
    const subscription = await TenantSubscription.findOne({ tenantId })
      .populate('tenantId', 'name domain adminEmail')
      .populate('planId', 'name');
    
    if (!subscription) {
      return res.status(404).json({ message: 'Tenant subscription not found' });
    }
    
    // Update subscription
    subscription.status = 'suspended';
    subscription.updatedBy = req.user.id;
    subscription.updatedAt = new Date();
    
    await subscription.save();
    
    // Create subscription history entry
    const history = new SubscriptionHistory({
      tenantId,
      action: 'suspension',
      fromPlan: subscription.planId ? (subscription.planId as any).name : null,
      toPlan: subscription.planId ? (subscription.planId as any).name : null,
      performedBy: req.user.id,
      notes: reason
    });
    
    await history.save();
    
    // Send notification to tenant admin
    if (subscription.tenantId) {
      const tenant = subscription.tenantId as any;
      
      if (tenant.adminEmail) {
        await sendEmail({
          to: tenant.adminEmail,
          subject: 'Subscription Suspended',
          text: `Your subscription has been suspended. Reason: ${reason}`,
          html: `
            <h2>Subscription Suspended</h2>
            <p>Dear Admin,</p>
            <p>Your subscription has been suspended.</p>
            <p>Reason: ${reason}</p>
            <p>Please contact support to resolve this issue.</p>
          `
        });
      }
    }
    
    res.status(200).json({
      message: 'Tenant subscription suspended successfully',
      subscription
    });
  } catch (error) {
    console.error('Error suspending tenant subscription:', error);
    res.status(500).json({ message: 'Failed to suspend tenant subscription' });
  }
};

// Reactivate tenant subscription
export const reactivateTenantSubscription = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    
    // Find tenant subscription
    const subscription = await TenantSubscription.findOne({ tenantId })
      .populate('tenantId', 'name domain adminEmail')
      .populate('planId', 'name');
    
    if (!subscription) {
      return res.status(404).json({ message: 'Tenant subscription not found' });
    }
    
    // Update subscription
    subscription.status = 'active';
    subscription.updatedBy = req.user.id;
    subscription.updatedAt = new Date();
    
    await subscription.save();
    
    // Create subscription history entry
    const history = new SubscriptionHistory({
      tenantId,
      action: 'reactivation',
      fromPlan: subscription.planId ? (subscription.planId as any).name : null,
      toPlan: subscription.planId ? (subscription.planId as any).name : null,
      performedBy: req.user.id,
      notes: 'Subscription reactivated'
    });
    
    await history.save();
    
    // Send notification to tenant admin
    if (subscription.tenantId) {
      const tenant = subscription.tenantId as any;
      
      if (tenant.adminEmail) {
        await sendEmail({
          to: tenant.adminEmail,
          subject: 'Subscription Reactivated',
          text: 'Your subscription has been reactivated.',
          html: `
            <h2>Subscription Reactivated</h2>
            <p>Dear Admin,</p>
            <p>Your subscription has been reactivated.</p>
            <p>You now have full access to the system again.</p>
          `
        });
      }
    }
    
    res.status(200).json({
      message: 'Tenant subscription reactivated successfully',
      subscription
    });
  } catch (error) {
    console.error('Error reactivating tenant subscription:', error);
    res.status(500).json({ message: 'Failed to reactivate tenant subscription' });
  }
};

// Get subscription history
export const getSubscriptionHistory = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    
    let query = {};
    
    if (tenantId) {
      query = { tenantId };
    }
    
    const history = await SubscriptionHistory.find(query)
      .populate('tenantId', 'name domain')
      .populate('performedBy', 'name email')
      .sort({ date: -1 });
    
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({ message: 'Failed to fetch subscription history' });
  }
};

// Get subscription metrics
export const getSubscriptionMetrics = async (req: Request, res: Response) => {
  try {
    // Get total number of tenants
    const totalTenants = await Tenant.countDocuments({ isDeleted: false });
    
    // Get active tenants
    const activeTenants = await TenantSubscription.countDocuments({ status: 'active' });
    
    // Get trial tenants
    const trialTenants = await TenantSubscription.countDocuments({ status: 'trial' });
    
    // Get suspended tenants
    const suspendedTenants = await TenantSubscription.countDocuments({ status: 'suspended' });
    
    // Get plan distribution
    const planDistribution = await TenantSubscription.aggregate([
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan'
        }
      },
      {
        $unwind: '$plan'
      },
      {
        $group: {
          _id: '$plan.name',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Calculate monthly recurring revenue
    const mrr = await TenantSubscription.aggregate([
      {
        $match: { status: { $in: ['active', 'trial'] } }
      },
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan'
        }
      },
      {
        $unwind: '$plan'
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$plan.price' }
        }
      }
    ]);
    
    const metrics = {
      totalTenants,
      activeTenants,
      trialTenants,
      suspendedTenants,
      planDistribution: planDistribution.map(item => ({
        plan: item._id,
        count: item.count
      })),
      monthlyRecurringRevenue: mrr.length > 0 ? mrr[0].total : 0
    };
    
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching subscription metrics:', error);
    res.status(500).json({ message: 'Failed to fetch subscription metrics' });
  }
};