import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  SupervisorAccount,
  Business,
  People,
  Person,
  Group,
  AccessTime,
  CalendarMonth,
  AccountBalance,
  Receipt,
  Assignment,
  Work,
  CheckCircle,
  ArrowForward,
  Settings,
  PersonAdd,
  Security,
  Schedule,
  Logout,
  Email,
  Description
} from '@mui/icons-material';

const WorkflowDiagram: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          VibhoHCM Workflow
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive workflow from platform setup to daily operations
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardHeader title="End-to-End Workflow Overview" />
        <CardContent>
          <Stepper orientation="vertical">
            <Step active completed>
              <StepLabel StepIconComponent={() => <SupervisorAccount color="primary" />}>
                <Typography variant="h6">Super Admin: Platform and Tenant Setup</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" paragraph>
                  The process begins at the highest level with the Super Admin, who manages the entire SaaS platform.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Business fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Creates Companies" secondary="The Super Admin onboards new organizations, setting them up as distinct 'tenants' within the platform" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Assigns Company Admins" secondary="For each new company, a primary Admin account is created and given full administrative rights for that specific tenant" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Manages Subscriptions and Billing" secondary="The Super Admin defines subscription plans, handles billing, and manages the payment status for each company" />
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowForward color="action" />
                </Box>
              </StepContent>
            </Step>

            <Step active completed>
              <StepLabel StepIconComponent={() => <Business color="primary" />}>
                <Typography variant="h6">Company Admin: Organizational Configuration</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" paragraph>
                  Once a company is set up, its designated Admin logs in to build the internal structure and configure settings.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Group fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Creates User Roles" secondary="The Admin establishes different roles within the company, such as Employee, HR, and Manager/Team Lead" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Defines Permissions" secondary="For each role, the Admin assigns specific read/write permissions for every module, ensuring users can only access relevant features" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Settings fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Sets Up Master Data" secondary="The Admin configures core organizational data, including departments, job designations, leave types, claim types, and client information" />
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowForward color="action" />
                </Box>
              </StepContent>
            </Step>

            <Step active completed>
              <StepLabel StepIconComponent={() => <People color="primary" />}>
                <Typography variant="h6">HR: Employee Onboarding and Management</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" paragraph>
                  With the organizational structure in place, the HR role takes over the management of the employee lifecycle.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Work fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Creates Job Postings" secondary="HR uses the recruitment module to create and publish job openings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Manages Recruitment Pipeline" secondary="As applications are received, HR tracks candidates through all hiring stages, from initial contact to final selection" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Onboards New Employees" secondary="After a candidate is hired, HR creates their profile in the system via a comprehensive 7-step process, capturing all necessary personal and professional details" />
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowForward color="action" />
                </Box>
              </StepContent>
            </Step>

            <Step active completed>
              <StepLabel StepIconComponent={() => <Person color="primary" />}>
                <Typography variant="h6">Employee: Self-Service and Daily Tasks</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" paragraph>
                  Employees are empowered with self-service tools to manage their own information and daily activities.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Description fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Profile Management" secondary="New employees log in to complete their profiles by uploading documents like a profile picture and signature" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Daily Attendance" secondary="Employees mark their daily attendance using the 'Check-In' and 'Check-Out' features on their dashboard or via the WhatsApp chatbot" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Timesheet Entry" secondary="Employees log their daily work hours, assigning them to specific projects and tasks in their timesheets" />
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowForward color="action" />
                </Box>
              </StepContent>
            </Step>

            <Step active completed>
              <StepLabel StepIconComponent={() => <Group color="primary" />}>
                <Typography variant="h6">Manager: Team Oversight and Approvals</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" paragraph>
                  Managers use the platform to oversee their teams and approve requests.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Timesheet Approval" secondary="Managers review and approve the timesheets submitted by their team members" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarMonth fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Leave Requests" secondary="When an employee applies for leave, the request is automatically routed to their manager for approval" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Attendance Regularization" secondary="Managers approve any requests from team members to correct their attendance records" />
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowForward color="action" />
                </Box>
              </StepContent>
            </Step>

            <Step active completed>
              <StepLabel StepIconComponent={() => <AccountBalance color="primary" />}>
                <Typography variant="h6">Admin/HR: Payroll and Financial Processing</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" paragraph>
                  At the end of each month, the Admin and HR roles manage the payroll cycle.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Timesheet Freezing" secondary="To ensure data accuracy, an Admin or HR manager freezes all employee timesheets for the payroll period" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalance fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Payroll Run" secondary="The Admin initiates the pay run, and the system automatically calculates salaries, taxes, and deductions based on the month's data" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Payslip Distribution" secondary="After the payroll is finalized, payslips are uploaded, and employees can access them through their portal or the WhatsApp chatbot" />
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowForward color="action" />
                </Box>
              </StepContent>
            </Step>

            <Step active completed>
              <StepLabel StepIconComponent={() => <Logout color="primary" />}>
                <Typography variant="h6">Employee: Resignation and Offboarding</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2" paragraph>
                  The system also handles the process for employees leaving the company.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Logout fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Submits Resignation" secondary="An employee initiates their resignation through the self-service portal" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Manager Approval" secondary="The request is first sent to the employee's manager for approval" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Final Offboarding" secondary="After the manager's approval, HR and the Admin manage the final offboarding procedures to complete the employee's lifecycle" />
                  </ListItem>
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CheckCircle color="success" />
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Super Admin Workflow" />
            <CardContent>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <SupervisorAccount sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Platform Setup and Management
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Configure global system settings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Subscriptions fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Create and manage subscription plans" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Domain fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Set up tenant domains and configurations" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <Business sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Tenant Management
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Create tenant admin accounts" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CompareArrows fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Manage tenant subscription changes" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Monitor tenant usage and compliance" />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Company Admin Workflow" />
            <CardContent>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <Settings sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Initial Setup
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Business fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Configure company information" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Group fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Define departments and reporting structure" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Set up roles and permissions" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <People sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  User Management
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Create HR and manager accounts" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Configure module-specific settings" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Set up approval workflows" />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="HR Workflow" />
            <CardContent>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <Work sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Recruitment Process
                </Typography>
                <Stepper orientation="vertical" activeStep={4} sx={{ ml: 1 }}>
                  <Step completed>
                    <StepLabel>Create Job Posting</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Screen Candidates</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Conduct Interviews</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Select Candidate</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Generate Offer Letter</StepLabel>
                  </Step>
                </Stepper>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <PersonAdd sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Employee Onboarding
                </Typography>
                <Stepper orientation="vertical" activeStep={7} sx={{ ml: 1 }}>
                  <Step completed>
                    <StepLabel>Personal Information</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Company Information</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Banking Information</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Document Upload</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Educational Qualifications</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Previous Employment</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Additional Information</StepLabel>
                  </Step>
                </Stepper>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Employee Daily Workflow" />
            <CardContent>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Attendance Management
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle fontSize="small" color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Check In" 
                      secondary="Employee marks attendance at the start of the workday" 
                    />
                    <Chip label="9:00 AM" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule fontSize="small" color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Break Time" 
                      secondary="Employee can log breaks during the day" 
                    />
                    <Chip label="Optional" size="small" variant="outlined" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Check Out" 
                      secondary="Employee marks end of workday" 
                    />
                    <Chip label="6:00 PM" size="small" />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Timesheet Management
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Log Time Entries" 
                      secondary="Employee logs time spent on projects and tasks" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Submit Timesheet" 
                      secondary="Employee submits timesheet for approval at the end of the week" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarMonth fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Apply for Leave" 
                      secondary="Employee submits leave requests as needed" 
                    />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Manager Approval Workflow" />
            <CardContent>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <Group sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Team Management
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Timesheet Approval" 
                      secondary="Review and approve team timesheets" 
                    />
                    <Chip label="Weekly" size="small" color="primary" variant="outlined" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarMonth fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Leave Approval" 
                      secondary="Review and approve leave requests" 
                    />
                    <Chip label="As Needed" size="small" color="secondary" variant="outlined" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Attendance Regularization" 
                      secondary="Approve attendance correction requests" 
                    />
                    <Chip label="As Needed" size="small" color="info" variant="outlined" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Performance Reviews" 
                      secondary="Conduct regular performance evaluations" 
                    />
                    <Chip label="Quarterly" size="small" color="warning" variant="outlined" />
                  </ListItem>
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Payroll Processing Workflow" />
            <CardContent>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <AccountBalance sx={{ mr: 1, verticalAlign: 'middle' }} color="primary" />
                  Monthly Payroll Cycle
                </Typography>
                <Stepper orientation="vertical" activeStep={5} sx={{ ml: 1 }}>
                  <Step completed>
                    <StepLabel>Freeze Timesheets</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Calculate Salaries</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Process Deductions</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Generate Payslips</StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>Distribute Payslips</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Process Bank Transfers</StepLabel>
                  </Step>
                </Stepper>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Employee Lifecycle Management" />
            <CardContent>
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      <Work sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" gutterBottom>Recruitment</Typography>
                      <Typography variant="body2">Job posting, candidate screening, interviews, selection</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                      <PersonAdd sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" gutterBottom>Onboarding</Typography>
                      <Typography variant="body2">Profile creation, document collection, training</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                      <AccessTime sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" gutterBottom>Daily Operations</Typography>
                      <Typography variant="body2">Attendance, timesheets, leave management</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                      <Assignment sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" gutterBottom>Performance</Typography>
                      <Typography variant="body2">Goals, reviews, career development</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                      <AccountBalance sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" gutterBottom>Compensation</Typography>
                      <Typography variant="body2">Payroll, benefits, claims, expenses</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
                      <Logout sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h6" gutterBottom>Offboarding</Typography>
                      <Typography variant="body2">Resignation, exit interview, clearance</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkflowDiagram;