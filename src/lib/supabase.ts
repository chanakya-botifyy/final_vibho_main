import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          avatar_url: string | null;
          department: string | null;
          designation: string | null;
          employee_id: string | null;
          tenant_id: string;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: string;
          avatar_url?: string | null;
          department?: string | null;
          designation?: string | null;
          employee_id?: string | null;
          tenant_id: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: string;
          avatar_url?: string | null;
          department?: string | null;
          designation?: string | null;
          employee_id?: string | null;
          tenant_id?: string;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          employee_id: string;
          user_id: string;
          personal_info: any;
          company_info: any;
          bank_info: any;
          documents: any[];
          qualifications: any[];
          previous_employment: any[];
          status: string;
          onboarding_step: number;
          tenant_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          user_id: string;
          personal_info: any;
          company_info: any;
          bank_info: any;
          documents?: any[];
          qualifications?: any[];
          previous_employment?: any[];
          status: string;
          onboarding_step?: number;
          tenant_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          user_id?: string;
          personal_info?: any;
          company_info?: any;
          bank_info?: any;
          documents?: any[];
          qualifications?: any[];
          previous_employment?: any[];
          status?: string;
          onboarding_step?: number;
          tenant_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          employee_id: string;
          date: string;
          check_in: string | null;
          check_out: string | null;
          break_time: number;
          total_hours: number;
          overtime: number;
          status: string;
          location: any | null;
          work_location: string;
          notes: string | null;
          regularization_request: any | null;
          tenant_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          date: string;
          check_in?: string | null;
          check_out?: string | null;
          break_time?: number;
          total_hours?: number;
          overtime?: number;
          status: string;
          location?: any | null;
          work_location?: string;
          notes?: string | null;
          regularization_request?: any | null;
          tenant_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          date?: string;
          check_in?: string | null;
          check_out?: string | null;
          break_time?: number;
          total_hours?: number;
          overtime?: number;
          status?: string;
          location?: any | null;
          work_location?: string;
          notes?: string | null;
          regularization_request?: any | null;
          tenant_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      leave_requests: {
        Row: {
          id: string;
          employee_id: string;
          type: string;
          start_date: string;
          end_date: string;
          days: number;
          reason: string;
          status: string;
          applied_date: string;
          approved_by: string | null;
          approved_date: string | null;
          rejection_reason: string | null;
          documents: string[] | null;
          tenant_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          type: string;
          start_date: string;
          end_date: string;
          days: number;
          reason: string;
          status: string;
          applied_date: string;
          approved_by?: string | null;
          approved_date?: string | null;
          rejection_reason?: string | null;
          documents?: string[] | null;
          tenant_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          type?: string;
          start_date?: string;
          end_date?: string;
          days?: number;
          reason?: string;
          status?: string;
          applied_date?: string;
          approved_by?: string | null;
          approved_date?: string | null;
          rejection_reason?: string | null;
          documents?: string[] | null;
          tenant_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      leave_balances: {
        Row: {
          id: string;
          employee_id: string;
          annual: any;
          sick: any;
          maternity: any;
          paternity: any;
          emergency: any;
          year: number;
          tenant_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          annual: any;
          sick: any;
          maternity: any;
          paternity: any;
          emergency: any;
          year: number;
          tenant_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          annual?: any;
          sick?: any;
          maternity?: any;
          paternity?: any;
          emergency?: any;
          year?: number;
          tenant_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      payroll: {
        Row: {
          id: string;
          employee_id: string;
          month: number;
          year: number;
          basic_salary: number;
          allowances: any;
          deductions: any;
          gross_salary: number;
          net_salary: number;
          tax: number;
          currency: string;
          country: string;
          payment_date: string | null;
          payslip_url: string | null;
          status: string;
          tenant_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          month: number;
          year: number;
          basic_salary: number;
          allowances: any;
          deductions: any;
          gross_salary: number;
          net_salary: number;
          tax: number;
          currency: string;
          country: string;
          payment_date?: string | null;
          payslip_url?: string | null;
          status: string;
          tenant_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          month?: number;
          year?: number;
          basic_salary?: number;
          allowances?: any;
          deductions?: any;
          gross_salary?: number;
          net_salary?: number;
          tax?: number;
          currency?: string;
          country?: string;
          payment_date?: string | null;
          payslip_url?: string | null;
          status?: string;
          tenant_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};