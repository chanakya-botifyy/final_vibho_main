// Attendance Store for VibhoHCM
// This store manages attendance-related state and actions

import { create } from 'zustand';
import { format } from 'date-fns';
import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';

interface AttendanceEntry {
  id: string;
  employeeId: string;
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day';
  location: 'office' | 'home' | 'client';
  workHours?: number;
  breakTime?: number;
  notes?: string;
}

interface RegularizationRequest {
  id: string;
  employeeId: string;
  date: Date;
  requestType: 'check_in' | 'check_out' | 'absent';
  requestedTime?: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
}

interface AttendanceSession {
  isCheckedIn: boolean;
  checkInTime?: Date;
  isOnBreak: boolean;
  breakStartTime?: Date;
  totalBreakTime: number; // in minutes
}

interface AttendanceStore {
  // State
  records: AttendanceEntry[];
  regularizationRequests: RegularizationRequest[];
  currentSession: AttendanceSession;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAttendanceRecords: (employeeId: string, startDate: Date, endDate: Date) => Promise<void>;
  fetchRegularizationRequests: (employeeId: string, status?: string) => Promise<void>;
  checkIn: (location: { latitude: number; longitude: number }, locationType: 'office' | 'home' | 'client') => Promise<void>;
  checkOut: () => Promise<void>;
  startBreak: () => Promise<void>;
  endBreak: () => Promise<void>;
  submitRegularization: (data: {
    date: Date;
    requestType: 'check_in' | 'check_out' | 'absent';
    requestedTime?: Date;
    reason: string;
  }) => Promise<void>;
  approveRegularization: (requestId: string, comments?: string) => Promise<void>;
  rejectRegularization: (requestId: string, reason: string) => Promise<void>;
  getAttendanceStats: (employeeId: string) => Promise<any>;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  // Initial state
  records: [],
  regularizationRequests: [],
  currentSession: {
    isCheckedIn: false,
    isOnBreak: false,
    totalBreakTime: 0
  },
  isLoading: false,
  error: null,
  
  // Actions
  fetchAttendanceRecords: async (employeeId, startDate, endDate) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/attendance/records', {
        params: {
          employeeId,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      });
      
      set({ records: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchRegularizationRequests: async (employeeId, status) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/attendance/regularization', {
        params: { employeeId, status }
      });
      
      set({ regularizationRequests: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  checkIn: async (location, locationType) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/attendance/check-in', {
        location,
        locationType
      });
      
      set({ 
        currentSession: {
          isCheckedIn: true,
          checkInTime: new Date(response.data.checkInTime),
          isOnBreak: false,
          totalBreakTime: 0
        },
        isLoading: false
      });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  checkOut: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/attendance/check-out');
      
      set({ 
        currentSession: {
          isCheckedIn: false,
          isOnBreak: false,
          totalBreakTime: get().currentSession.totalBreakTime
        },
        isLoading: false
      });
      
      // Add the new record to the records array
      set(state => ({
        records: [...state.records, response.data]
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  startBreak: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/attendance/break/start');
      
      set({ 
        currentSession: {
          ...get().currentSession,
          isOnBreak: true,
          breakStartTime: new Date(response.data.breakStartTime)
        },
        isLoading: false
      });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  endBreak: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/attendance/break/end');
      
      // Calculate total break time
      const currentBreakTime = response.data.breakDuration; // in minutes
      const totalBreakTime = get().currentSession.totalBreakTime + currentBreakTime;
      
      set({ 
        currentSession: {
          ...get().currentSession,
          isOnBreak: false,
          breakStartTime: undefined,
          totalBreakTime
        },
        isLoading: false
      });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  submitRegularization: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/attendance/regularization', {
        ...data,
        date: format(data.date, 'yyyy-MM-dd'),
        requestedTime: data.requestedTime ? format(data.requestedTime, "yyyy-MM-dd'T'HH:mm:ss") : undefined
      });
      
      // Add the new request to the regularizationRequests array
      set(state => ({
        regularizationRequests: [...state.regularizationRequests, response.data],
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  approveRegularization: async (requestId, comments) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/attendance/regularization/${requestId}/approve`, { comments });
      
      // Update the request in the regularizationRequests array
      set(state => ({
        regularizationRequests: state.regularizationRequests.map(request => 
          request.id === requestId ? response.data : request
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  rejectRegularization: async (requestId, reason) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/attendance/regularization/${requestId}/reject`, { reason });
      
      // Update the request in the regularizationRequests array
      set(state => ({
        regularizationRequests: state.regularizationRequests.map(request => 
          request.id === requestId ? response.data : request
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  getAttendanceStats: async (employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get(`/attendance/stats/${employeeId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
      return null;
    }
  }
}));

export default useAttendanceStore;