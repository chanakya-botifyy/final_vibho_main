import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { PermissionProvider } from './contexts/PermissionContext';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { lightTheme, darkTheme } from './theme';
import AuthPage from './pages/AuthPage';
import AIFeatureConfig from './components/AI/AIFeatureConfig';
import AIModelManagement from './components/AI/AIModelManagement';
import AIUsageAnalytics from './components/AI/AIUsageAnalytics';
import ProjectTaskManagement from './components/Timesheet/ProjectTaskManagement';
import TimesheetSettings from './components/Timesheet/TimesheetSettings';
import TimesheetAnalytics from './components/Timesheet/TimesheetAnalytics';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { MainLayout } from './components/Layout/MainLayout';
import { IntegratedDashboard } from './components/Dashboard/IntegratedDashboard';
import { EmployeeList } from './components/Employees/EmployeeList';
import { SuperAdminDashboard } from './components/SuperAdmin/SuperAdminDashboard';
import SubscriptionPlans from './components/SuperAdmin/SubscriptionPlans';
import TenantManagement from './components/SuperAdmin/TenantManagement';
import { EmployeeAnalytics } from './components/Employees/EmployeeAnalytics';
import { AttendanceTracker } from './components/Attendance/AttendanceTracker';
import { HRDashboard } from './components/HR/HRDashboard';
import WorkflowDiagram from './components/Workflow/WorkflowDiagram';
import { MasterDataManagement } from './components/HR/MasterDataManagement';
import { WorkflowManagement } from './components/HR/WorkflowManagement';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { SystemConfiguration } from './components/Admin/SystemConfiguration';
import { UserManagement } from './components/Admin/UserManagement';
import { EmployeeDashboard } from './components/Employee/EmployeeDashboard';
import { EmployeeAttendanceTracker } from './components/Employee/AttendanceTracker';
import { EmployeeLeaveManagement } from './components/Employee/LeaveManagement';
import { EmployeePayrollView } from './components/Employee/PayrollView';
import { EmployeeDocumentManagement } from './components/Employee/DocumentManagement';
import { GlobalPayrollDashboard, PayrollAdminDashboard, WhatsAppPayslipService } from './components/Payroll';
import { EmployeeProfileManagement } from './components/Employee/ProfileManagement';
import { ManagerDashboard } from './components/Manager/ManagerDashboard';
import { TeamCalendar } from './components/Manager/TeamCalendar';
import { ClaimsManagement } from './components/Claims/ClaimsManagement';
import { DocumentManagement } from './components/Documents/DocumentManagement';
import { ReportsAnalytics } from './components/Reports/ReportsAnalytics';
import { SupportTicketing } from './components/Support/SupportTicketing';
import { PerformanceManagement } from './components/Performance/PerformanceManagement';
import { LeaveManagement } from './components/Leave/LeaveManagement';
import { PayrollDashboard } from './components/Payroll/PayrollDashboard';
import { RecruitmentDashboard } from './components/Recruitment/RecruitmentDashboard';
import { AssetManagement } from './components/Assets/AssetManagement';
import { initializeSocket, closeSocket } from './api/notification';
import { Chatbot } from './components/Common/Chatbot';
import { LoadingSpinner } from './components/Common/LoadingSpinner';
import { ErrorBoundary } from './components/Common/ErrorBoundary';

function App() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { theme } = useThemeStore();
  const [selectedSection, setSelectedSection] = React.useState('dashboard');

  // Initialize socket connection when user is authenticated
  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      initializeSocket(user.id);
    }
    
    return () => {
      closeSocket();
    };
  }, [isAuthenticated, user?.id]);

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <IntegratedDashboard onNavigate={setSelectedSection} />;
      case 'super-admin-dashboard':
        return <SuperAdminDashboard />;
      case 'subscription-plans':
        return <SubscriptionPlans />;
      case 'tenant-management':
        return <TenantManagement />;
      case 'workflow-diagram':
        return <WorkflowDiagram />;
      case 'employees':
      case 'employee-list':
        return <EmployeeList />;
      case 'employee-analytics':
        return <EmployeeAnalytics />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'hr-dashboard':
        return <HRDashboard />;
      case 'master-data':
        return <MasterDataManagement />;
      case 'workflow-management':
        return <WorkflowManagement />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'system-configuration':
        return <SystemConfiguration />;
      case 'user-management':
        return <UserManagement />;
      case 'ai-feature-config':
        return <AIFeatureConfig />;
      case 'ai-model-management':
        return <AIModelManagement />;
      case 'ai-usage-analytics':
        return <AIUsageAnalytics />;
      case 'timesheet-projects':
        return <ProjectTaskManagement />;
      case 'timesheet-settings':
        return <TimesheetSettings />;
      case 'timesheet-analytics':
        return <TimesheetAnalytics />;
      case 'employee-dashboard':
        return <EmployeeDashboard />;
      case 'employee-attendance':
        return <EmployeeAttendanceTracker />;
      case 'employee-leave':
        return <EmployeeLeaveManagement />;
      case 'employee-payroll':
        return <EmployeePayrollView />;
      case 'employee-documents':
        return <EmployeeDocumentManagement />;
      case 'employee-profile':
        return <EmployeeProfileManagement />;
      case 'leave':
        return <LeaveManagement />;
      case 'payroll':
        return <GlobalPayrollDashboard />;
      case 'payroll-admin':
        return <PayrollAdminDashboard />;
      case 'payroll-whatsapp':
        return <WhatsAppPayslipService />;
      case 'recruitment':
        return <RecruitmentDashboard />;
      case 'assets':
        return <AssetManagement />;
      case 'claims-management':
        return <ClaimsManagement />;
      case 'documents-management':
        return <DocumentManagement />;
      case 'reports-analytics':
        return <ReportsAnalytics />;
      case 'support-ticketing':
        return <SupportTicketing />;
      case 'performance-management':
        return <PerformanceManagement />;
      case 'claims':
        return (
          <div>
            <h2>Claims & Expense Management</h2>
            <p>OCR-powered receipt processing and automated expense approvals.</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2>System Configuration</h2>
            <p>Multi-tenant settings, workflows, and integration management.</p>
          </div>
        );
      default:
        return <IntegratedDashboard onNavigate={setSelectedSection} />;
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingSpinner message="Initializing VibhoHCM..." />
      </ThemeProvider>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <PermissionProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {!isAuthenticated ? (
              <Routes>
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="*" element={<AuthPage />} />
              </Routes>
            ) : (
              <MainLayout
                selectedItem={selectedSection}
                onItemSelect={setSelectedSection}
              >
                {renderContent()}
              </MainLayout>
            )}
            <Chatbot />
          </ThemeProvider>
        </PermissionProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;