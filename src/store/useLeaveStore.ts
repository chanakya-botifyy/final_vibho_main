// Leave Store for VibhoHCM
// This store manages leave-related state and actions

import { create } from 'zustand';
import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';

interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectedBy?: string;
  rejectedDate?: Date;
  rejectionReason?: string;
  cancelledDate?: Date;
  attachments?: string[];
}

interface LeaveBalance {
  employeeId: string;
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  casual: { total: number; used: number; remaining: number };
  [key: string]: any; // For custom leave types
}

interface LeaveStore {
  // State
  requests: LeaveRequest[];
  balances: Record<string, LeaveBalance>; // Keyed by employeeId
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchLeaveRequests: (employeeId?: string, status?: string) => Promise<void>;
  fetchLeaveBalance: (employeeId: string) => Promise<void>;
  submitLeaveRequest: (requestData: Partial<LeaveRequest>) => Promise<void>;
  approveLeaveRequest: (requestId: string, comments?: string) => Promise<void>;
  rejectLeaveRequest: (requestId: string, reason: string) => Promise<void>;
  cancelLeaveRequest: (requestId: string) => Promise<void>;
  getLeaveStats: (employeeId: string) => Promise<any>;
}

export const useLeaveStore = create<LeaveStore>((set, get) => ({
  // Initial state
  requests: [],
  balances: {},
  isLoading: false,
  error: null,
  
  // Actions
  fetchLeaveRequests: async (employeeId, status) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/leave/requests', {
        params: { employeeId, status }
      });
      
      set({ requests: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchLeaveBalance: async (employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get(`/leave/balance/${employeeId}`);
      
      set(state => ({
        balances: {
          ...state.balances,
          [employeeId]: response.data
        },
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  submitLeaveRequest: async (requestData) => {
    set({ isLoading: true, error: null });
    
    try {
      const formattedData = {
        ...requestData,
        startDate: requestData.startDate instanceof Date 
          ? requestData.startDate.toISOString().split('T')[0] 
          : requestData.startDate,
        endDate: requestData.endDate instanceof Date 
          ? requestData.endDate.toISOString().split('T')[0] 
          : requestData.endDate
      };
      
      const response = await api.post('/leave/requests', formattedData);
      
      // Add the new request to the requests array
      set(state => ({
        requests: [...state.requests, response.data],
        isLoading: false
      }));
      
      // Update leave balance for the employee
      if (requestData.employeeId) {
        await get().fetchLeaveBalance(requestData.employeeId);
      }
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  approveLeaveRequest: async (requestId, comments) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/leave/requests/${requestId}/approve`, { comments });
      
      // Update the request in the requests array
      set(state => ({
        requests: state.requests.map(request => 
          request.id === requestId ? response.data : request
        ),
        isLoading: false
      }));
      
      // Update leave balance for the employee
      const employeeId = get().requests.find(r => r.id === requestId)?.employeeId;
      if (employeeId) {
        await get().fetchLeaveBalance(employeeId);
      }
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  rejectLeaveRequest: async (requestId, reason) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/leave/requests/${requestId}/reject`, { reason });
      
      // Update the request in the requests array
      set(state => ({
        requests: state.requests.map(request => 
          request.id === requestId ? response.data : request
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  cancelLeaveRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/leave/requests/${requestId}/cancel`);
      
      // Update the request in the requests array
      set(state => ({
        requests: state.requests.map(request => 
          request.id === requestId ? response.data : request
        ),
        isLoading: false
      }));
      
      // Update leave balance for the employee
      const employeeId = get().requests.find(r => r.id === requestId)?.employeeId;
      if (employeeId) {
        await get().fetchLeaveBalance(employeeId);
      }
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  getLeaveStats: async (employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get(`/leave/stats/${employeeId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
      return null;
    }
  }
}));

export default useLeaveStore;