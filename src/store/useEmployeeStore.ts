// Employee Store for VibhoHCM
// This store manages employee-related state and actions

import { create } from 'zustand';
import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';
import { Employee, EmployeeStatus } from '../types';

interface EmployeeStore {
  // State
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEmployees: () => Promise<void>;
  fetchEmployee: (id: string) => Promise<void>;
  createEmployee: (employeeData: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, employeeData: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  setSelectedEmployee: (employee: Employee | null) => void;
  clearError: () => void;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  // Initial state
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/employees');
      set({ employees: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  fetchEmployee: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get(`/employees/${id}`);
      set({ selectedEmployee: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  createEmployee: async (employeeData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/employees', employeeData);
      
      // Add the new employee to the employees array
      set(state => ({
        employees: [...state.employees, response.data],
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  updateEmployee: async (id, employeeData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/employees/${id}`, employeeData);
      
      // Update the employee in the employees array
      set(state => ({
        employees: state.employees.map(employee => 
          employee.id === id ? response.data : employee
        ),
        selectedEmployee: state.selectedEmployee?.id === id ? response.data : state.selectedEmployee,
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  deleteEmployee: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await api.delete(`/employees/${id}`);
      
      // Remove the employee from the employees array
      set(state => ({
        employees: state.employees.filter(employee => employee.id !== id),
        selectedEmployee: state.selectedEmployee?.id === id ? null : state.selectedEmployee,
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  setSelectedEmployee: (employee) => {
    set({ selectedEmployee: employee });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export default useEmployeeStore;