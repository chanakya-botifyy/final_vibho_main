// AI API service for VibhoHCM
// This file contains API calls for AI features

import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';

// Process chatbot message
export const processChatbotMessage = async (message: string, context = {}) => {
  try {
    const response = await api.post('/ai/chatbot', { message, context });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Analyze resume
export const analyzeResume = async (resumeText: string) => {
  try {
    const response = await api.post('/ai/resume', { text: resumeText });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Analyze attendance patterns
export const analyzeAttendance = async (employeeId: string, startDate: string, endDate: string) => {
  try {
    const response = await api.post('/ai/attendance', { employeeId, startDate, endDate });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Predict payroll costs
export const predictPayroll = async (period: string) => {
  try {
    const response = await api.post('/ai/payroll/predict', { period });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Process document with OCR and classification
export const processDocument = async (documentFile: File) => {
  try {
    const formData = new FormData();
    formData.append('document', documentFile);
    
    const response = await api.post('/ai/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Generate performance insights
export const generatePerformanceInsights = async (employeeId: string) => {
  try {
    const response = await api.get(`/ai/performance/insights/${employeeId}`);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Match candidate to job
export const matchCandidateToJob = async (candidateId: string, jobId: string) => {
  try {
    const response = await api.post('/ai/recruitment/match', { candidateId, jobId });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get AI model status
export const getAIModelStatus = async () => {
  try {
    const response = await api.get('/ai/models/status');
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Update AI model
export const updateAIModel = async (modelId: string, modelData: any) => {
  try {
    const response = await api.put(`/ai/models/${modelId}`, modelData);
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};

// Get AI usage statistics
export const getAIUsageStats = async (startDate: string, endDate: string) => {
  try {
    const response = await api.get('/ai/usage', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw parseApiError(error);
  }
};