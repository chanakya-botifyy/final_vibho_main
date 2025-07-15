// Performance Store for VibhoHCM
// This store manages performance-related state and actions

import { create } from 'zustand';
import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  reviewDate: Date;
  reviewType: 'annual' | 'quarterly' | 'probation' | 'project';
  overallRating: number;
  currentDesignation: string;
  newDesignation?: string;
  currentSalary: number;
  newSalary?: number;
  percentageHike?: number;
  hrComments?: string;
  managerComments?: string;
  employeeComments?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'acknowledged';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'project' | 'learning';
  startDate: Date;
  targetDate: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  metrics: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CareerPath {
  id: string;
  employeeId: string;
  currentRole: string;
  targetRole: string;
  requiredSkills: string[];
  requiredTraining: string[];
  estimatedTimeframe: number; // in months
  progress: number;
  status: 'active' | 'completed' | 'on_hold';
  createdAt: Date;
  updatedAt: Date;
}

interface SkillAssessment {
  id: string;
  employeeId: string;
  skillName: string;
  category: 'technical' | 'soft' | 'leadership';
  currentLevel: number;
  targetLevel: number;
  lastAssessedDate?: Date;
  assessedBy?: string;
  comments?: string;
}

interface PerformanceStore {
  // State
  reviews: PerformanceReview[];
  goals: PerformanceGoal[];
  careerPaths: CareerPath[];
  skillAssessments: SkillAssessment[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchReviews: (employeeId?: string) => Promise<void>;
  fetchGoals: (employeeId?: string) => Promise<void>;
  fetchCareerPaths: (employeeId?: string) => Promise<void>;
  fetchSkillAssessments: (employeeId?: string) => Promise<void>;
  
  createReview: (reviewData: Partial<PerformanceReview>) => Promise<void>;
  updateReview: (reviewId: string, reviewData: Partial<PerformanceReview>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  
  createGoal: (goalData: Partial<PerformanceGoal>) => Promise<void>;
  updateGoal: (goalId: string, goalData: Partial<PerformanceGoal>) => Promise<void>;
  updateGoalProgress: (goalId: string, progress: number, feedback?: string) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  
  createCareerPath: (pathData: Partial<CareerPath>) => Promise<void>;
  updateCareerPath: (pathId: string, pathData: Partial<CareerPath>) => Promise<void>;
  deleteCareerPath: (pathId: string) => Promise<void>;
  
  createSkillAssessment: (assessmentData: Partial<SkillAssessment>) => Promise<void>;
  updateSkillAssessment: (assessmentId: string, assessmentData: Partial<SkillAssessment>) => Promise<void>;
  deleteSkillAssessment: (assessmentId: string) => Promise<void>;
}

export const usePerformanceStore = create<PerformanceStore>((set, get) => ({
  // Initial state
  reviews: [],
  goals: [],
  careerPaths: [],
  skillAssessments: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchReviews: async (employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/performance/reviews', {
        params: { employeeId }
      });
      
      set({ reviews: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchGoals: async (employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/performance/goals', {
        params: { employeeId }
      });
      
      set({ goals: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchCareerPaths: async (employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/performance/career-paths', {
        params: { employeeId }
      });
      
      set({ careerPaths: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchSkillAssessments: async (employeeId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/performance/skills', {
        params: { employeeId }
      });
      
      set({ skillAssessments: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  createReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/performance/reviews', reviewData);
      
      // Add the new review to the reviews array
      set(state => ({
        reviews: [...state.reviews, response.data],
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  updateReview: async (reviewId, reviewData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/performance/reviews/${reviewId}`, reviewData);
      
      // Update the review in the reviews array
      set(state => ({
        reviews: state.reviews.map(review => 
          review.id === reviewId ? response.data : review
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  deleteReview: async (reviewId) => {
    set({ isLoading: true, error: null });
    
    try {
      await api.delete(`/performance/reviews/${reviewId}`);
      
      // Remove the review from the reviews array
      set(state => ({
        reviews: state.reviews.filter(review => review.id !== reviewId),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  createGoal: async (goalData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/performance/goals', goalData);
      
      // Add the new goal to the goals array
      set(state => ({
        goals: [...state.goals, response.data],
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  updateGoal: async (goalId, goalData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/performance/goals/${goalId}`, goalData);
      
      // Update the goal in the goals array
      set(state => ({
        goals: state.goals.map(goal => 
          goal.id === goalId ? response.data : goal
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  updateGoalProgress: async (goalId, progress, feedback) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/performance/goals/${goalId}/progress`, { progress, feedback });
      
      // Update the goal in the goals array
      set(state => ({
        goals: state.goals.map(goal => 
          goal.id === goalId ? response.data : goal
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  deleteGoal: async (goalId) => {
    set({ isLoading: true, error: null });
    
    try {
      await api.delete(`/performance/goals/${goalId}`);
      
      // Remove the goal from the goals array
      set(state => ({
        goals: state.goals.filter(goal => goal.id !== goalId),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  createCareerPath: async (pathData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/performance/career-paths', pathData);
      
      // Add the new career path to the careerPaths array
      set(state => ({
        careerPaths: [...state.careerPaths, response.data],
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  updateCareerPath: async (pathId, pathData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/performance/career-paths/${pathId}`, pathData);
      
      // Update the career path in the careerPaths array
      set(state => ({
        careerPaths: state.careerPaths.map(path => 
          path.id === pathId ? response.data : path
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  deleteCareerPath: async (pathId) => {
    set({ isLoading: true, error: null });
    
    try {
      await api.delete(`/performance/career-paths/${pathId}`);
      
      // Remove the career path from the careerPaths array
      set(state => ({
        careerPaths: state.careerPaths.filter(path => path.id !== pathId),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  createSkillAssessment: async (assessmentData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/performance/skills', assessmentData);
      
      // Add the new skill assessment to the skillAssessments array
      set(state => ({
        skillAssessments: [...state.skillAssessments, response.data],
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  updateSkillAssessment: async (assessmentId, assessmentData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/performance/skills/${assessmentId}`, assessmentData);
      
      // Update the skill assessment in the skillAssessments array
      set(state => ({
        skillAssessments: state.skillAssessments.map(assessment => 
          assessment.id === assessmentId ? response.data : assessment
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  deleteSkillAssessment: async (assessmentId) => {
    set({ isLoading: true, error: null });
    
    try {
      await api.delete(`/performance/skills/${assessmentId}`);
      
      // Remove the skill assessment from the skillAssessments array
      set(state => ({
        skillAssessments: state.skillAssessments.filter(assessment => assessment.id !== assessmentId),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  }
}));

export default usePerformanceStore;