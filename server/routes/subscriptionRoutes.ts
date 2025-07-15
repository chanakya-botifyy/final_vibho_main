import express from 'express';
import {
  getSubscriptionPlans,
  getSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getTenantSubscriptions,
  getTenantSubscription,
  changeTenantPlan,
  suspendTenantSubscription,
  reactivateTenantSubscription,
  getSubscriptionHistory,
  getSubscriptionMetrics
} from '../controllers/subscriptionController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { PERMISSIONS } from '../utils/permissions';

const router = express.Router();

// Subscription Plans
router.get(
  '/plans',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  getSubscriptionPlans
);

router.get(
  '/plans/:planId',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  getSubscriptionPlan
);

router.post(
  '/plans',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  createSubscriptionPlan
);

router.put(
  '/plans/:planId',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  updateSubscriptionPlan
);

router.delete(
  '/plans/:planId',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  deleteSubscriptionPlan
);

// Tenant Subscriptions
router.get(
  '/tenants',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.TENANT_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  getTenantSubscriptions
);

router.get(
  '/tenants/:tenantId',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.TENANT_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  getTenantSubscription
);

router.post(
  '/tenants/:tenantId/change-plan',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  changeTenantPlan
);

router.post(
  '/tenants/:tenantId/suspend',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  suspendTenantSubscription
);

router.post(
  '/tenants/:tenantId/reactivate',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  reactivateTenantSubscription
);

// Subscription History
router.get(
  '/history',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  getSubscriptionHistory
);

// Subscription Metrics
router.get(
  '/metrics',
  authenticate,
  authorize([PERMISSIONS.SUBSCRIPTION_MANAGE, PERMISSIONS.SUPER_ADMIN_ACCESS]),
  getSubscriptionMetrics
);

export default router;