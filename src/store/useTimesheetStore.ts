// Timesheet Store for VibhoHCM
// This store manages timesheet-related state and actions

import { create } from 'zustand';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import * as timesheetApi from '../api/timesheet';
import { parseApiError } from '../utils/errorHandler';

interface TimesheetEntry {
  id: string;
  employeeId: string;
  date: Date;
  projectId: string;
  projectName: string;
  taskId: string;
  taskName: string;
  hours: number;
  description: string;
  billable: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

interface TimesheetSubmission {
  id: string;
  employeeId: string;
  employeeName: string;
  weekStartDate: Date;
  weekEndDate: Date;
  totalHours: number;
  billableHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  comments?: string;
  entries: TimesheetEntry[];
}

interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'on_hold';
}

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'active' | 'completed';
}

interface TimesheetStore {
  // State
  entries: TimesheetEntry[];
  submissions: TimesheetSubmission[];
  projects: Project[];
  tasks: Record<string, Task[]>; // Keyed by projectId
  currentWeek: {
    startDate: Date;
    endDate: Date;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEntries: (startDate: Date, endDate: Date, employeeId?: string) => Promise<void>;
  fetchSubmissions: (status?: string, employeeId?: string) => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>;
  submitEntry: (entryData: Partial<TimesheetEntry>) => Promise<void>;
  updateEntry: (entryId: string, entryData: Partial<TimesheetEntry>) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  submitForApproval: (submissionData: { weekStartDate: string; comments?: string }) => Promise<void>;
  approveTimesheet: (submissionId: string, comments?: string) => Promise<void>;
  rejectTimesheet: (submissionId: string, reason: string) => Promise<void>;
  nextWeek: () => void;
  previousWeek: () => void;
  setCurrentWeek: (startDate: Date) => void;
  fetchTimesheetSummary: (params: any) => Promise<any>;
}

export const useTimesheetStore = create<TimesheetStore>((set, get) => {
  // Initialize current week
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  
  return {
    // Initial state
    entries: [],
    submissions: [],
    projects: [],
    tasks: {},
    currentWeek: {
      startDate: weekStart,
      endDate: weekEnd
    },
    isLoading: false,
    error: null,
    
    // Actions
    fetchEntries: async (startDate, endDate, employeeId) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.getTimesheetEntries(startDate, endDate, employeeId);
        set({ entries: response, isLoading: false });
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    fetchSubmissions: async (status, employeeId) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.getTimesheetSubmissions(status, employeeId);
        set({ submissions: response, isLoading: false });
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    fetchProjects: async () => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.getTimesheetProjects();
        set({ projects: response, isLoading: false });
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    fetchTasks: async (projectId) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.getProjectTasks(projectId);
        
        set(state => ({
          tasks: {
            ...state.tasks,
            [projectId]: response
          },
          isLoading: false
        }));
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    submitEntry: async (entryData) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.createTimesheetEntry(entryData as any);
        
        // Add the new entry to the entries array
        set(state => ({
          entries: [...state.entries, response],
          isLoading: false
        }));
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    updateEntry: async (entryId, entryData) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.updateTimesheetEntry(entryId, entryData);
        
        // Update the entry in the entries array
        set(state => ({
          entries: state.entries.map(entry => 
            entry.id === entryId ? response : entry
          ),
          isLoading: false
        }));
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    deleteEntry: async (entryId) => {
      set({ isLoading: true, error: null });
      
      try {
        await timesheetApi.deleteTimesheetEntry(entryId);
        
        // Remove the entry from the entries array
        set(state => ({
          entries: state.entries.filter(entry => entry.id !== entryId),
          isLoading: false
        }));
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    submitForApproval: async (submissionData) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.submitTimesheetForApproval(submissionData);
        
        // Add the new submission to the submissions array
        set(state => ({
          submissions: [...state.submissions, response],
          isLoading: false
        }));
        
        // Update entries status
        const { currentWeek } = get();
        await get().fetchEntries(currentWeek.startDate, currentWeek.endDate);
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    approveTimesheet: async (submissionId, comments) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.approveTimesheet(submissionId, comments);
        
        // Update the submission in the submissions array
        set(state => ({
          submissions: state.submissions.map(submission => 
            submission.id === submissionId ? response : submission
          ),
          isLoading: false
        }));
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    rejectTimesheet: async (submissionId, reason) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.rejectTimesheet(submissionId, reason);
        
        // Update the submission in the submissions array
        set(state => ({
          submissions: state.submissions.map(submission => 
            submission.id === submissionId ? response : submission
          ),
          isLoading: false
        }));
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
      }
    },
    
    nextWeek: () => {
      const { currentWeek } = get();
      const nextWeekStart = addWeeks(currentWeek.startDate, 1);
      const nextWeekEnd = addWeeks(currentWeek.endDate, 1);
      
      set({
        currentWeek: {
          startDate: nextWeekStart,
          endDate: nextWeekEnd
        }
      });
    },
    
    previousWeek: () => {
      const { currentWeek } = get();
      const prevWeekStart = subWeeks(currentWeek.startDate, 1);
      const prevWeekEnd = subWeeks(currentWeek.endDate, 1);
      
      set({
        currentWeek: {
          startDate: prevWeekStart,
          endDate: prevWeekEnd
        }
      });
    },
    
    setCurrentWeek: (startDate) => {
      const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 });
      
      set({
        currentWeek: {
          startDate: weekStart,
          endDate: weekEnd
        }
      });
    },
    
    fetchTimesheetSummary: async (params) => {
      set({ isLoading: true, error: null });
      
      try {
        const response = await timesheetApi.getTimesheetSummary(params);
        set({ isLoading: false });
        return response;
      } catch (error) {
        const parsedError = parseApiError(error);
        set({ error: parsedError.message, isLoading: false });
        return null;
      }
    }
  };
});

export default useTimesheetStore;