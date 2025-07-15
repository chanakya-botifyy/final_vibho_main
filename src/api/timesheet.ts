// Timesheet API service for VibhoHCM
// This file contains API calls for timesheet management

import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';

// Get timesheet entries for a date range
export const getTimesheetEntries = async (startDate: Date, endDate: Date, employeeId?: string) => {
  try {
    const response = await api.get('/timesheets/entries', {
      params: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        employeeId
      }
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Create timesheet entry
export const createTimesheetEntry = async (entryData: {
  employeeId: string;
  date: Date;
  projectId: string;
  taskId: string;
  hours: number;
  description: string;
  billable: boolean;
}) => {
  try {
    const response = await api.post('/timesheets/entries', {
      ...entryData,
      date: entryData.date.toISOString().split('T')[0]
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Update timesheet entry
export const updateTimesheetEntry = async (entryId: string, entryData: {
  projectId?: string;
  taskId?: string;
  hours?: number;
  description?: string;
  billable?: boolean;
}) => {
  try {
    const response = await api.put(`/timesheets/entries/${entryId}`, entryData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Delete timesheet entry
export const deleteTimesheetEntry = async (entryId: string) => {
  try {
    const response = await api.delete(`/timesheets/entries/${entryId}`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Submit timesheet for approval
export const submitTimesheetForApproval = async (data: {
  weekStartDate: string;
  comments?: string;
}) => {
  try {
    const response = await api.post('/timesheets/submit', data);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get timesheet submissions
export const getTimesheetSubmissions = async (status?: string, employeeId?: string) => {
  try {
    const response = await api.get('/timesheets/submissions', {
      params: { status, employeeId }
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Approve timesheet
export const approveTimesheet = async (submissionId: string, comments?: string) => {
  try {
    const response = await api.put(`/timesheets/submissions/${submissionId}/approve`, { comments });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Reject timesheet
export const rejectTimesheet = async (submissionId: string, reason: string) => {
  try {
    const response = await api.put(`/timesheets/submissions/${submissionId}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get timesheet projects
export const getTimesheetProjects = async () => {
  try {
    const response = await api.get('/timesheets/projects');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Create timesheet project
export const createTimesheetProject = async (projectData: {
  name: string;
  client: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'on_hold';
}) => {
  try {
    const response = await api.post('/timesheets/projects', {
      ...projectData,
      startDate: projectData.startDate.toISOString().split('T')[0],
      endDate: projectData.endDate ? projectData.endDate.toISOString().split('T')[0] : undefined
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Update timesheet project
export const updateTimesheetProject = async (projectId: string, projectData: {
  name?: string;
  client?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'completed' | 'on_hold';
}) => {
  try {
    const formattedData = {
      ...projectData,
      startDate: projectData.startDate ? projectData.startDate.toISOString().split('T')[0] : undefined,
      endDate: projectData.endDate ? projectData.endDate.toISOString().split('T')[0] : undefined
    };
    
    const response = await api.put(`/timesheets/projects/${projectId}`, formattedData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Delete timesheet project
export const deleteTimesheetProject = async (projectId: string) => {
  try {
    const response = await api.delete(`/timesheets/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get project tasks
export const getProjectTasks = async (projectId: string) => {
  try {
    const response = await api.get(`/timesheets/projects/${projectId}/tasks`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Create project task
export const createProjectTask = async (projectId: string, taskData: {
  name: string;
  description: string;
  status: 'active' | 'completed';
}) => {
  try {
    const response = await api.post(`/timesheets/projects/${projectId}/tasks`, taskData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Update project task
export const updateProjectTask = async (taskId: string, taskData: {
  name?: string;
  description?: string;
  status?: 'active' | 'completed';
}) => {
  try {
    const response = await api.put(`/timesheets/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Delete project task
export const deleteProjectTask = async (taskId: string) => {
  try {
    const response = await api.delete(`/timesheets/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get timesheet summary
export const getTimesheetSummary = async (params: {
  startDate: Date;
  endDate: Date;
  employeeId?: string;
  projectId?: string;
  departmentId?: string;
}) => {
  try {
    const formattedParams = {
      startDate: params.startDate.toISOString().split('T')[0],
      endDate: params.endDate.toISOString().split('T')[0],
      employeeId: params.employeeId,
      projectId: params.projectId,
      departmentId: params.departmentId
    };
    
    const response = await api.get('/timesheets/summary', { params: formattedParams });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get timesheet settings
export const getTimesheetSettings = async () => {
  try {
    const response = await api.get('/timesheets/settings');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Update timesheet settings
export const updateTimesheetSettings = async (settings: any) => {
  try {
    const response = await api.put('/timesheets/settings', settings);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Export timesheet data
export const exportTimesheetData = async (params: {
  startDate: Date;
  endDate: Date;
  employeeId?: string;
  projectId?: string;
  format: 'csv' | 'excel' | 'pdf';
}) => {
  try {
    const formattedParams = {
      startDate: params.startDate.toISOString().split('T')[0],
      endDate: params.endDate.toISOString().split('T')[0],
      employeeId: params.employeeId,
      projectId: params.projectId,
      format: params.format
    };
    
    const response = await api.get('/timesheets/export', { 
      params: formattedParams,
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};