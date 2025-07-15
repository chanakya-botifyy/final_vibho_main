// Subscription API service for VibhoHCM
// This file contains API calls for subscription management

import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';

// Get all subscription plans
export const getSubscriptionPlans = async () => {
  try {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get subscription plan by ID
export const getSubscriptionPlan = async (planId: string) => {
  try {
    const response = await api.get(`/subscriptions/plans/${planId}`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Create subscription plan
export const createSubscriptionPlan = async (planData: any) => {
  try {
    const response = await api.post('/subscriptions/plans', planData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Update subscription plan
export const updateSubscriptionPlan = async (planId: string, planData: any) => {
  try {
    const response = await api.put(`/subscriptions/plans/${planId}`, planData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Delete subscription plan
export const deleteSubscriptionPlan = async (planId: string) => {
  try {
    const response = await api.delete(`/subscriptions/plans/${planId}`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get all tenant subscriptions
export const getTenantSubscriptions = async () => {
  try {
    const response = await api.get('/subscriptions/tenants');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get tenant subscription by ID
export const getTenantSubscription = async (tenantId: string) => {
  try {
    const response = await api.get(`/subscriptions/tenants/${tenantId}`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Change tenant subscription plan
export const changeTenantPlan = async (tenantId: string, changeData: any) => {
  try {
    const response = await api.post(`/subscriptions/tenants/${tenantId}/change-plan`, changeData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Suspend tenant subscription
export const suspendTenantSubscription = async (tenantId: string, reason: string) => {
  try {
    const response = await api.post(`/subscriptions/tenants/${tenantId}/suspend`, { reason });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Reactivate tenant subscription
export const reactivateTenantSubscription = async (tenantId: string) => {
  try {
    const response = await api.post(`/subscriptions/tenants/${tenantId}/reactivate`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get subscription history
export const getSubscriptionHistory = async (tenantId?: string) => {
  try {
    const response = await api.get('/subscriptions/history', {
      params: { tenantId }
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get subscription metrics
export const getSubscriptionMetrics = async () => {
  try {
    const response = await api.get('/subscriptions/metrics');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};