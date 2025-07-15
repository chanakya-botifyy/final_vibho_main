import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import {
  People,
  PersonAdd,
  Assignment,
  CheckCircle,
  Pending,
  Warning,
  TrendingUp,
  TrendingDown,
  Work,
  CalendarMonth,
  AccountBalance,
  Notifications,
  Settings,
  Analytics,
  Description,
  Inventory,
  Receipt,
  Business,
  Group,
  Star,
  Schedule,
  Email,
  Phone,
  LocationOn,
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Upload,
  Refresh
} from '@mui/icons-material';
import { format, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useLeaveStore } from '../../store/useLeaveStore';
import { usePayrollStore } from '../../store/usePayrollStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hr-tabpanel-${index}`}
      aria-labelledby={`hr-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const HRDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const { can } = usePermission();
  const { getAttendanceStats } = useAttendanceStore();
  const { requests: leaveRequests, getLeaveStats } = useLeaveStore();
  const { records: payrollRecords, getPayrollStats } = usePayrollStore();
  
  const [tabValue, setTabValue] = React.useState(0);
  const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<any>(null);
  const [approvalAction, setApprovalAction] = React.useState<'approve' | 'reject'>('approve');
  const [approvalNotes, setApprovalNotes] = React.useState('');

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // HR Dashboard Metrics
  const hrMetrics = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    newHiresThisMonth: employees.filter(e => 
      differenceInDays(new Date(), e.companyInfo.dateOfJoining) <= 30
    ).length,
    pendingOnboarding: employees.filter(e => e.onboardingStep < 7).length,
    pendingLeaveRequests: leaveRequests.filter(r => r.status === 'pending').length,
    pendingRegularizations: 5, // Mock data
    documentsExpiring: 8, // Mock data
    upcomingReviews: 12, // Mock data
    averageAttendance: 94.2,
    retentionRate: 96.5,
    payrollProcessed: payrollRecords.filter(r => r.status === 'processed').length,
    complianceScore: 98.5
  };

  // Pending Approvals
  const pendingApprovals = [
    {
      id: '1',
      type: 'leave',
      employee: 'John Smith',
      description: 'Annual Leave - 3 days',
      submittedDate: new Date('2024-02-20'),
      priority: 'medium'
    },
    {
      id: '2',
      type: 'regularization',
      employee: 'Sarah Johnson',
      description: 'Attendance Regularization',
      submittedDate: new Date('2024-02-19'),
      priority: 'low'
    },
    {
      id: '3',
      type: 'expense',
      employee: 'Michael Chen',
      description: 'Travel Expense - $450',
      submittedDate: new Date('2024-02-18'),
      priority: 'high'
    }
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: '1',
      type: 'employee_added',
      description: 'New employee Alice Johnson added to Engineering',
      timestamp: new Date('2024-02-20T10:30:00'),
      icon: <PersonAdd color="success" />
    },
    {
      id: '2',
      type: 'leave_approved',
      description: 'Leave request approved for Bob Smith',
      timestamp: new Date('2024-02-20T09:15:00'),
      icon: <CheckCircle color="success" />
    },
    {
      id: '3',
      type: 'payroll_generated',
      description: 'February payroll generated for 1,247 employees',
      timestamp: new Date('2024-02-19T16:45:00'),
      icon: <AccountBalance color="info" />
    },
    {
      id: '4',
      type: 'document_expiry',
      description: 'Document expiry alert for 5 employees',
      timestamp: new Date('2024-02-19T14:20:00'),
      icon: <Warning color="warning" />
    }
  ];

  // Upcoming Events
  const upcomingEvents = [
    {
      id: '1',
      type: 'birthday',
      title: '3 Birthdays Today',
      date: 'Today',
      employees: ['John Smith', 'Sarah Wilson', 'Mike Davis']
    },
    {
      id: '2',
      type: 'anniversary',
      title: '5 Work Anniversaries',
      date: 'This Week',
      employees: ['Alice Johnson (2 years)', 'Bob Chen (5 years)']
    },
    {
      id: '3',
      type: 'probation',
      title: '8 Probation Endings',
      date: 'Next 30 Days',
      employees: ['New hires completing probation']
    },
    {
      id: '4',
      type: 'review',
      title: '15 Performance Reviews Due',
      date: 'This Month',
      employees: ['Annual performance review cycle']
    }
  ];

  const handleApproval = (request: any, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setApprovalAction(action);
    setApprovalDialogOpen(true);
  };

  const submitApproval = () => {
    console.log(`${approvalAction} request:`, selectedRequest, 'Notes:', approvalNotes);
    setApprovalDialogOpen(false);
    setApprovalNotes('');
    setSelectedRequest(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          HR Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive HR management with employee lifecycle, compliance, and analytics.
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {hrMetrics.totalEmployees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Employees
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="caption" color="success.main">
                  +{hrMetrics.newHiresThisMonth} this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {hrMetrics.pendingLeaveRequests + hrMetrics.pendingRegularizations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approvals
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hrMetrics.pendingLeaveRequests} leaves, {hrMetrics.pendingRegularizations} regularizations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {hrMetrics.complianceScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compliance Score
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Documents, policies, regulations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                {hrMetrics.retentionRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Retention Rate
              </Typography>
              <Typography variant="caption" color="text.secondary">
                12-month rolling average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <PermissionGate permission={[PERMISSIONS.LEAVE_APPROVE, PERMISSIONS.ATTENDANCE_APPROVE]}>
              <Tab label="Pending Approvals" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.EMPLOYEE_READ_ALL}>
              <Tab label="Employee Lifecycle" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.EMPLOYEE_READ_ALL}>
              <Tab label="Compliance & Documents" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.REPORTS_HR}>
              <Tab label="Analytics & Reports" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.SYSTEM_CONFIGURE}>
              <Tab label="System Configuration" />
            </PermissionGate>
          </Tabs>
        </Box>

        {/* Pending Approvals Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Pending Approvals ({pendingApprovals.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Employee</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingApprovals.map((approval) => (
                      <TableRow key={approval.id} hover>
                        <TableCell>
                          <Chip
                            label={approval.type.toUpperCase()}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {approval.employee}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {approval.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(approval.submittedDate, 'MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={approval.priority.toUpperCase()}
                            color={getPriorityColor(approval.priority)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleApproval(approval, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleApproval(approval, 'reject')}
                            >
                              Reject
                            </Button>
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardHeader title="Recent Activities" />
                <CardContent>
                  <List>
                    {recentActivities.slice(0, 5).map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem>
                          <ListItemIcon>
                            {activity.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={activity.description}
                            secondary={format(activity.timestamp, 'MMM dd, HH:mm')}
                          />
                        </ListItem>
                        {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Employee Lifecycle Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Onboarding Pipeline" 
                  action={
                    <Button variant="contained" startIcon={<PersonAdd />}>
                      Add Employee
                    </Button>
                  }
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Pending Onboarding</Typography>
                      <Chip label={hrMetrics.pendingOnboarding} color="warning" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">In Progress</Typography>
                      <Chip label="5" color="info" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Completed This Month</Typography>
                      <Chip label={hrMetrics.newHiresThisMonth} color="success" size="small" />
                    </Box>
                    <Divider />
                    <Button variant="outlined" fullWidth>
                      View Onboarding Dashboard
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Performance Management" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Reviews Due</Typography>
                      <Chip label={hrMetrics.upcomingReviews} color="warning" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Completed This Quarter</Typography>
                      <Chip label="45" color="success" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Average Rating</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star color="warning" fontSize="small" />
                        <Typography variant="body2" fontWeight="medium">4.2</Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <Button
                      variant="outlined"
                      startIcon={<Assignment />}
                      onClick={() => window.location.href = '#/workflow-diagram'}
                      fullWidth
                    >
                      View Complete Workflow
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Upcoming HR Events" />
                <CardContent>
                  <Grid container spacing={2}>
                    {upcomingEvents.map((event) => (
                      <Grid item xs={12} md={3} key={event.id}>
                        <Paper sx={{ p: 2 }} variant="outlined">
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            {event.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" gutterBottom>
                            {event.date}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {event.employees.slice(0, 2).join(', ')}
                            {event.employees.length > 2 && ` +${event.employees.length - 2} more`}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Compliance & Documents Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Document Compliance" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Documents Verified</Typography>
                        <Typography variant="body2" fontWeight="medium">92%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={92} color="success" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Expiring Soon</Typography>
                        <Typography variant="body2" fontWeight="medium" color="warning.main">
                          {hrMetrics.documentsExpiring}
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={15} color="warning" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Background Checks</Typography>
                        <Typography variant="body2" fontWeight="medium">98%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={98} color="success" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Policy Compliance" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="GDPR Compliance"
                        secondary="All data protection measures active"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="SOX Compliance"
                        secondary="Financial controls verified"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Training Compliance"
                        secondary="5 employees need safety training"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Audit Trail" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Recent compliance activities
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Document verification completed"
                        secondary="2 hours ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Policy update distributed"
                        secondary="1 day ago"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Compliance report generated"
                        secondary="3 days ago"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Analytics & Reports Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Workforce Analytics" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary.main">
                          {hrMetrics.averageAttendance}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Attendance
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {hrMetrics.retentionRate}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Retention Rate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">
                          4.2
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Performance
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          2.3
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Turnover Rate
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Quick Reports" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Employee Headcount Report
                    </Button>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Attendance Summary
                    </Button>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Leave Balance Report
                    </Button>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Payroll Summary
                    </Button>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Compliance Dashboard
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* System Configuration Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Master Data" />
                <CardContent>
                  <List>
                    <ListItem button>
                      <ListItemIcon>
                        <Business />
                      </ListItemIcon>
                      <ListItemText primary="Departments" secondary="Manage organizational structure" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Group />
                      </ListItemIcon>
                      <ListItemText primary="Designations" secondary="Job titles and roles" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <CalendarMonth />
                      </ListItemIcon>
                      <ListItemText primary="Leave Types" secondary="Configure leave policies" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Receipt />
                      </ListItemIcon>
                      <ListItemText primary="Claim Types" secondary="Expense categories" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Workflow Configuration" />
                <CardContent>
                  <List>
                    <ListItem button>
                      <ListItemIcon>
                        <Assignment />
                      </ListItemIcon>
                      <ListItemText primary="Approval Workflows" secondary="Configure approval chains" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Notifications />
                      </ListItemIcon>
                      <ListItemText primary="Notifications" secondary="Email and SMS settings" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Settings />
                      </ListItemIcon>
                      <ListItemText primary="System Settings" secondary="General configuration" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Analytics />
                      </ListItemIcon>
                      <ListItemText primary="Report Templates" secondary="Custom report builder" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Integration Management" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemText primary="WhatsApp API" secondary="Connected" />
                      <ListItemSecondaryAction>
                        <Chip label="Active" color="success" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Email Service" secondary="SendGrid" />
                      <ListItemSecondaryAction>
                        <Chip label="Active" color="success" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Document Storage" secondary="AWS S3" />
                      <ListItemSecondaryAction>
                        <Chip label="Active" color="success" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Payment Gateway" secondary="Stripe" />
                      <ListItemSecondaryAction>
                        <Chip label="Inactive" color="default" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {approvalAction === 'approve' ? 'Approve Request' : 'Reject Request'}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Employee:</strong> {selectedRequest.employee}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Type:</strong> {selectedRequest.type}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Description:</strong> {selectedRequest.description}
              </Typography>
              <TextField
                fullWidth
                label={approvalAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason'}
                multiline
                rows={3}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                sx={{ mt: 2 }}
                required={approvalAction === 'reject'}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={approvalAction === 'approve' ? 'success' : 'error'}
            onClick={submitApproval}
            disabled={approvalAction === 'reject' && !approvalNotes.trim()}
          >
            {approvalAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};