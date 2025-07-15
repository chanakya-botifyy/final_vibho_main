// Subscription Store for VibhoHCM
// This store manages subscription-related state and actions

import { create } from 'zustand';
import * as subscriptionApi from '../api/subscription';
import { parseApiError } from '../utils/errorHandler';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  features: Array<{
    name: string;
    included: boolean;
  }>;
  limits: {
    users: number | string;
    storage: number | string;
    apiRequests: number | string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TenantSubscription {
  id: string;
  tenantId: string;
  tenantName: string;
  domain: string;
  plan: string;
  status: 'active' | 'trial' | 'suspended' | 'pending';
  usersCount: number;
  createdAt: Date;
  lastBillingDate: Date | null;
  nextBillingDate: Date | null;
  storageUsed: number;
  apiUsage: number;
  adminEmail: string;
}

interface SubscriptionHistory {
  id: string;
  tenantId: string;
  tenantName: string;
  action: 'plan_change' | 'trial_started' | 'suspension' | 'reactivation';
  fromPlan: string | null;
  toPlan: string;
  date: Date;
  performedBy: string;
  notes: string;
}

interface SubscriptionStore {
  // State
  plans: SubscriptionPlan[];
  tenantSubscriptions: TenantSubscription[];
  subscriptionHistory: SubscriptionHistory[];
  metrics: any;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPlans: () => Promise<void>;
  fetchPlan: (planId: string) => Promise<void>;
  createPlan: (planData: Partial<SubscriptionPlan>) => Promise<void>;
  updatePlan: (planId: string, planData: Partial<SubscriptionPlan>) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
  
  fetchTenantSubscriptions: () => Promise<void>;
  fetchTenantSubscription: (tenantId: string) => Promise<void>;
  changeTenantPlan: (tenantId: string, changeData: any) => Promise<void>;
  suspendTenantSubscription: (tenantId: string, reason: string) => Promise<void>;
  reactivateTenantSubscription: (tenantId: string) => Promise<void>;
  
  fetchSubscriptionHistory: (tenantId?: string) => Promise<void>;
  fetchSubscriptionMetrics: () => Promise<void>;
  
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  // Initial state
  plans: [],
  tenantSubscriptions: [],
  subscriptionHistory: [],
  metrics: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.getSubscriptionPlans();
      set({ plans: response, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchPlan: async (planId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.getSubscriptionPlan(planId);
      
      // Update the plan in the plans array
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === planId ? response : plan
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  createPlan: async (planData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.createSubscriptionPlan(planData);
      
      // Add the new plan to the plans array
      set(state => ({
        plans: [...state.plans, response],
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  updatePlan: async (planId, planData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.updateSubscriptionPlan(planId, planData);
      
      // Update the plan in the plans array
      set(state => ({
        plans: state.plans.map(plan => 
          plan.id === planId ? response : plan
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  deletePlan: async (planId) => {
    set({ isLoading: true, error: null });
    
    try {
      await subscriptionApi.deleteSubscriptionPlan(planId);
      
      // Remove the plan from the plans array
      set(state => ({
        plans: state.plans.filter(plan => plan.id !== planId),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchTenantSubscriptions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.getTenantSubscriptions();
      set({ tenantSubscriptions: response, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchTenantSubscription: async (tenantId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.getTenantSubscription(tenantId);
      
      // Update the tenant subscription in the tenantSubscriptions array
      set(state => ({
        tenantSubscriptions: state.tenantSubscriptions.map(subscription => 
          subscription.tenantId === tenantId ? response : subscription
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  changeTenantPlan: async (tenantId, changeData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.changeTenantPlan(tenantId, changeData);
      
      // Update the tenant subscription in the tenantSubscriptions array
      set(state => ({
        tenantSubscriptions: state.tenantSubscriptions.map(subscription => 
          subscription.tenantId === tenantId ? response : subscription
        ),
        isLoading: false
      }));
      
      // Fetch updated subscription history
      await get().fetchSubscriptionHistory();
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  suspendTenantSubscription: async (tenantId, reason) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.suspendTenantSubscription(tenantId, reason);
      
      // Update the tenant subscription in the tenantSubscriptions array
      set(state => ({
        tenantSubscriptions: state.tenantSubscriptions.map(subscription => 
          subscription.tenantId === tenantId ? response : subscription
        ),
        isLoading: false
      }));
      
      // Fetch updated subscription history
      await get().fetchSubscriptionHistory();
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  reactivateTenantSubscription: async (tenantId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.reactivateTenantSubscription(tenantId);
      
      // Update the tenant subscription in the tenantSubscriptions array
      set(state => ({
        tenantSubscriptions: state.tenantSubscriptions.map(subscription => 
          subscription.tenantId === tenantId ? response : subscription
        ),
        isLoading: false
      }));
      
      // Fetch updated subscription history
      await get().fetchSubscriptionHistory();
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchSubscriptionHistory: async (tenantId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.getSubscriptionHistory(tenantId);
      set({ subscriptionHistory: response, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchSubscriptionMetrics: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await subscriptionApi.getSubscriptionMetrics();
      set({ metrics: response, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useSubscriptionStore;