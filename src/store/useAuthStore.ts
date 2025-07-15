// Auth Store for VibhoHCM
// This store manages authentication state and actions

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth';
import { parseApiError } from '../utils/errorHandler';
import { UserRole } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  designation?: string;
  employeeId?: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login(email, password);
          
          // Extract user data from response
          const { user, token } = response;
          
          // Store token in localStorage (handled in authApi)
          
          set({ 
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          const parsedError = parseApiError(error);
          set({ error: parsedError.message, isLoading: false });
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authApi.logout();
          
          // Clear user data
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        } catch (error) {
          // Even if API call fails, we still want to clear user data
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          await authApi.register(userData);
          set({ isLoading: false });
          
          // Note: We don't automatically log in after registration
          // User needs to verify email first (in a real implementation)
        } catch (error) {
          const parsedError = parseApiError(error);
          set({ error: parsedError.message, isLoading: false });
        }
      },
      
      updateUser: (userData) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      checkAuth: async () => {
        // Skip if already authenticated
        if (get().isAuthenticated && get().user) {
          return;
        }
        
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        
        set({ isLoading: true });
        
        try {
          // Verify token and get current user
          const user = await authApi.getCurrentUser();
          
          set({ 
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;