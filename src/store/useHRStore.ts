import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApprovalRequest {
  id: string;
  type: 'leave' | 'expense' | 'regularization' | 'recruitment' | 'performance';
  employeeId: string;
  employeeName: string;
  description: string;
  submittedDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  data: any; // Specific data for each request type
}

interface HRMetrics {
  totalEmployees: number;
  activeEmployees: number;
  newHiresThisMonth: number;
  pendingOnboarding: number;
  pendingApprovals: number;
  documentsExpiring: number;
  complianceScore: number;
  retentionRate: number;
  averageAttendance: number;
}

interface HRState {
  approvalRequests: ApprovalRequest[];
  hrMetrics: HRMetrics;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchApprovalRequests: () => Promise<void>;
  approveRequest: (requestId: string, notes?: string) => Promise<void>;
  rejectRequest: (requestId: string, reason: string) => Promise<void>;
  fetchHRMetrics: () => Promise<void>;
  generateReport: (type: string, filters: any) => Promise<void>;
  sendNotification: (employeeIds: string[], message: string, type: 'email' | 'sms' | 'whatsapp') => Promise<void>;
  clearError: () => void;
}

const mockAPI = {
  fetchApprovalRequests: async (): Promise<ApprovalRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        type: 'leave',
        employeeId: 'EMP001',
        employeeName: 'John Smith',
        description: 'Annual Leave - 3 days',
        submittedDate: new Date('2024-02-20'),
        priority: 'medium',
        status: 'pending',
        data: {
          leaveType: 'annual',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-03-03'),
          reason: 'Family vacation'
        }
      },
      {
        id: '2',
        type: 'expense',
        employeeId: 'EMP002',
        employeeName: 'Sarah Johnson',
        description: 'Travel Expense - $450',
        submittedDate: new Date('2024-02-19'),
        priority: 'high',
        status: 'pending',
        data: {
          amount: 450,
          category: 'travel',
          receipts: ['receipt1.pdf', 'receipt2.pdf']
        }
      }
    ];
  },

  approveRequest: async (requestId: string, notes?: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Approved request ${requestId} with notes: ${notes}`);
  },

  rejectRequest: async (requestId: string, reason: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Rejected request ${requestId} with reason: ${reason}`);
  },

  fetchHRMetrics: async (): Promise<HRMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
      totalEmployees: 1247,
      activeEmployees: 1198,
      newHiresThisMonth: 23,
      pendingOnboarding: 8,
      pendingApprovals: 15,
      documentsExpiring: 12,
      complianceScore: 98.5,
      retentionRate: 96.2,
      averageAttendance: 94.8
    };
  },

  generateReport: async (type: string, filters: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Generated ${type} report with filters:`, filters);
  },

  sendNotification: async (employeeIds: string[], message: string, type: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Sent ${type} notification to ${employeeIds.length} employees: ${message}`);
  }
};

export const useHRStore = create<HRState>()(
  persist(
    (set, get) => ({
      approvalRequests: [],
      hrMetrics: {
        totalEmployees: 0,
        activeEmployees: 0,
        newHiresThisMonth: 0,
        pendingOnboarding: 0,
        pendingApprovals: 0,
        documentsExpiring: 0,
        complianceScore: 0,
        retentionRate: 0,
        averageAttendance: 0
      },
      isLoading: false,
      error: null,

      fetchApprovalRequests: async () => {
        set({ isLoading: true, error: null });
        try {
          const requests = await mockAPI.fetchApprovalRequests();
          set({ approvalRequests: requests, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch approval requests',
            isLoading: false 
          });
        }
      },

      approveRequest: async (requestId: string, notes?: string) => {
        set({ isLoading: true, error: null });
        try {
          await mockAPI.approveRequest(requestId, notes);
          set(state => ({
            approvalRequests: state.approvalRequests.map(req => 
              req.id === requestId 
                ? { ...req, status: 'approved' as const, approvedDate: new Date() }
                : req
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to approve request',
            isLoading: false 
          });
        }
      },

      rejectRequest: async (requestId: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
          await mockAPI.rejectRequest(requestId, reason);
          set(state => ({
            approvalRequests: state.approvalRequests.map(req => 
              req.id === requestId 
                ? { ...req, status: 'rejected' as const, rejectionReason: reason, approvedDate: new Date() }
                : req
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to reject request',
            isLoading: false 
          });
        }
      },

      fetchHRMetrics: async () => {
        set({ isLoading: true, error: null });
        try {
          const metrics = await mockAPI.fetchHRMetrics();
          set({ hrMetrics: metrics, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch HR metrics',
            isLoading: false 
          });
        }
      },

      generateReport: async (type: string, filters: any) => {
        set({ isLoading: true, error: null });
        try {
          await mockAPI.generateReport(type, filters);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to generate report',
            isLoading: false 
          });
        }
      },

      sendNotification: async (employeeIds: string[], message: string, type: 'email' | 'sms' | 'whatsapp') => {
        set({ isLoading: true, error: null });
        try {
          await mockAPI.sendNotification(employeeIds, message, type);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to send notification',
            isLoading: false 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'hr-storage',
      partialize: (state) => ({
        approvalRequests: state.approvalRequests,
        hrMetrics: state.hrMetrics
      })
    }
  )
);