import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Performance Reviews

// Create performance review
export const createPerformanceReview = async (reviewData: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_URL}/performance/reviews`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get performance reviews
export const getPerformanceReviews = async (params?: {
  employeeId?: string;
  status?: string;
  period?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/reviews`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get performance review by ID
export const getPerformanceReviewById = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Update performance review
export const updatePerformanceReview = async (id: string, updates: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.put(`${API_URL}/performance/reviews/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Delete performance review
export const deletePerformanceReview = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.delete(`${API_URL}/performance/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Performance Goals

// Create performance goal
export const createPerformanceGoal = async (goalData: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_URL}/performance/goals`, goalData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get performance goals
export const getPerformanceGoals = async (params?: {
  employeeId?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/goals`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get performance goal by ID
export const getPerformanceGoalById = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/goals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Update performance goal
export const updatePerformanceGoal = async (id: string, updates: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.put(`${API_URL}/performance/goals/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Update goal progress
export const updateGoalProgress = async (id: string, progress: number, feedback?: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.put(
      `${API_URL}/performance/goals/${id}/progress`,
      { progress, feedback },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Delete performance goal
export const deletePerformanceGoal = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.delete(`${API_URL}/performance/goals/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Career Paths

// Create career path
export const createCareerPath = async (pathData: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_URL}/performance/career-paths`, pathData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get career paths
export const getCareerPaths = async (params?: {
  employeeId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/career-paths`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get career path by ID
export const getCareerPathById = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/career-paths/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Update career path
export const updateCareerPath = async (id: string, updates: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.put(`${API_URL}/performance/career-paths/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Delete career path
export const deleteCareerPath = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.delete(`${API_URL}/performance/career-paths/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Skill Assessments

// Create skill assessment
export const createSkillAssessment = async (assessmentData: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_URL}/performance/skills`, assessmentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get skill assessments
export const getSkillAssessments = async (params?: {
  employeeId?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/skills`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get skill assessment by ID
export const getSkillAssessmentById = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/skills/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Update skill assessment
export const updateSkillAssessment = async (id: string, updates: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.put(`${API_URL}/performance/skills/${id}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Delete skill assessment
export const deleteSkillAssessment = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.delete(`${API_URL}/performance/skills/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get performance statistics
export const getPerformanceStats = async (params?: {
  employeeId?: string;
  period?: string;
}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.get(`${API_URL}/performance/stats`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};