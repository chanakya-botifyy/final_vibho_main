@@ .. @@
 import { EmployeeLeaveManagement } from './components/Employee/LeaveManagement';
 import { EmployeePayrollView } from './components/Employee/PayrollView';
 import { EmployeeDocumentManagement } from './components/Employee/DocumentManagement';
+import TimesheetDashboard from './components/Timesheet/TimesheetDashboard';
import AIDashboard from './components/AI/AIDashboard';
import AIResumeParser from './components/AI/AIResumeParser';
import AIAttendanceAnalytics from './components/AI/AIAttendanceAnalytics';
import AIPayrollPrediction from './components/AI/AIPayrollPrediction';
import AIDocumentProcessor from './components/AI/AIDocumentProcessor';
import AIChatbot from './components/AI/AIChatbot';
import AIPerformanceInsights from './components/AI/AIPerformanceInsights';
import AIRecruitmentAssistant from './components/AI/AIRecruitmentAssistant';
 import { GlobalPayrollDashboard, PayrollAdminDashboard, WhatsAppPayslipService } from './components/Payroll';
 import { EmployeeProfileManagement } from './components/Employee/ProfileManagement';
 import { ManagerDashboard } from './components/Manager/ManagerDashboard';
@@ .. @@
       case 'employee-documents':
         return <EmployeeDocumentManagement />;
       case 'employee-profile':
         return <EmployeeProfileManagement />;
+      case 'timesheet':
+        return <TimesheetDashboard />;
      case 'ai-dashboard':
        return <AIDashboard />;
      case 'ai-resume-parser':
        return <AIResumeParser />;
      case 'ai-attendance-analytics':
        return <AIAttendanceAnalytics />;
      case 'ai-payroll-prediction':
        return <AIPayrollPrediction />;
      case 'ai-document-processor':
        return <AIDocumentProcessor />;
      case 'ai-chatbot':
        return <AIChatbot />;
      case 'ai-performance-insights':
        return <AIPerformanceInsights />;
      case 'ai-recruitment-assistant':
        return <AIRecruitmentAssistant />;
       case 'manager-dashboard':
         return <ManagerDashboard />;
       case 'team-calendar':