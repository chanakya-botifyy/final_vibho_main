// Payroll Store for VibhoHCM
// This store manages payroll-related state and actions

import { create } from 'zustand';
import api from '../utils/api';
import { parseApiError } from '../utils/errorHandler';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: Array<{
    name: string;
    amount: number;
    type: 'allowance';
    taxable: boolean;
  }>;
  deductions: Array<{
    name: string;
    amount: number;
    type: 'deduction';
    taxable: boolean;
  }>;
  grossSalary: number;
  netSalary: number;
  tax: number;
  currency: string;
  country: string;
  paymentDate: Date;
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
}

interface PayrollStore {
  // State
  records: PayrollRecord[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPayrollRecords: (employeeId?: string, month?: number, year?: number) => Promise<void>;
  generatePayroll: (employeeId: string, month: number, year: number) => Promise<void>;
  processPayroll: (recordId: string) => Promise<void>;
  markAsPaid: (recordId: string) => Promise<void>;
  calculateSalary: (employeeId: string, month: number, year: number) => Promise<any>;
  getPayrollStats: () => any;
}

export const usePayrollStore = create<PayrollStore>((set, get) => ({
  // Initial state
  records: [],
  isLoading: false,
  error: null,
  
  // Actions
  fetchPayrollRecords: async (employeeId, month, year) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.get('/payroll/records', {
        params: { employeeId, month, year }
      });
      
      set({ records: response.data, isLoading: false });
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  generatePayroll: async (employeeId, month, year) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/payroll/generate', { employeeId, month, year });
      
      // Add the new record to the records array
      set(state => ({
        records: [...state.records, response.data],
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  processPayroll: async (recordId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/payroll/records/${recordId}/process`);
      
      // Update the record in the records array
      set(state => ({
        records: state.records.map(record => 
          record.id === recordId ? response.data : record
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  markAsPaid: async (recordId) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.put(`/payroll/records/${recordId}/pay`);
      
      // Update the record in the records array
      set(state => ({
        records: state.records.map(record => 
          record.id === recordId ? response.data : record
        ),
        isLoading: false
      }));
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
    }
  },
  
  calculateSalary: async (employeeId, month, year) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/payroll/calculate', { employeeId, month, year });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      set({ error: parsedError.message, isLoading: false });
      return null;
    }
  },
  
  getPayrollStats: () => {
    const records = get().records;
    
    // Calculate total gross pay
    const totalGrossPay = records.reduce((sum, record) => sum + record.grossSalary, 0);
    
    // Calculate total net pay
    const totalNetPay = records.reduce((sum, record) => sum + record.netSalary, 0);
    
    // Calculate total tax
    const totalTax = records.reduce((sum, record) => sum + record.tax, 0);
    
    // Calculate total deductions
    const totalDeductions = records.reduce((sum, record) => {
      const deductionsSum = record.deductions.reduce((dSum, d) => dSum + d.amount, 0);
      return sum + deductionsSum;
    }, 0);
    
    // Calculate average salary
    const averageSalary = records.length > 0 ? totalNetPay / records.length : 0;
    
    return {
      totalGrossPay,
      totalNetPay,
      totalTax,
      totalDeductions,
      averageSalary,
      recordCount: records.length
    };
  }
}));

export default usePayrollStore;