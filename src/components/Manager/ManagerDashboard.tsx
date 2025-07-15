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
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Paper,
  Tab,
  Tabs,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Dashboard,
  People,
  Assignment,
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  TrendingUp,
  TrendingDown,
  AccessTime,
  CalendarMonth,
  Star,
  Warning,
  Visibility,
  Edit,
  Approve,
  ThumbUp,
  ThumbDown,
  Comment,
  Notifications,
  Email,
  Phone,
  LocationOn,
  Work,
  Analytics,
  Group,
  PersonAdd,
  Assessment,
  Timeline,
  Event,
  Task,
  Support
} from '@mui/icons-material';
import { format, differenceInDays, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useLeaveStore } from '../../store/useLeaveStore';

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'on_leave' | 'inactive';
  attendanceToday: 'present' | 'absent' | 'late' | 'not_checked_in';
  performanceRating: number;
  currentProjects: string[];
  leaveBalance: number;
  lastLogin: Date;
}

interface PendingApproval {
  id: string;
  type: 'leave' | 'attendance' | 'timesheet' | 'expense' | 'resignation';
  employeeId: string;
  employeeName: string;
  description: string;
  submittedDate: Date;
  priority: 'low' | 'medium' | 'high';
  details: any;
}

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: Date;
  selfAssessment: boolean;
  managerReview: boolean;
  rating?: number;
}

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
      id={`manager-tabpanel-${index}`}
      aria-labelledby={`manager-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { can } = usePermission();
  const { getAttendanceStats } = useAttendanceStore();
  const { requests: leaveRequests } = useLeaveStore();
  
  const [tabValue, setTabValue] = React.useState(0);
  const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false);
  const [performanceDialogOpen, setPerformanceDialogOpen] = React.useState(false);
  const [selectedApproval, setSelectedApproval] = React.useState<PendingApproval | null>(null);
  const [selectedReview, setSelectedReview] = React.useState<PerformanceReview | null>(null);
  const [approvalAction, setApprovalAction] = React.useState<'approve' | 'reject'>('approve');
  const [approvalNotes, setApprovalNotes] = React.useState('');

  // Mock team members data (employees reporting to current manager)
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      designation: 'Senior Software Engineer',
      email: 'alice.johnson@company.com',
      phone: '+1-555-0201',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'active',
      attendanceToday: 'present',
      performanceRating: 4.5,
      currentProjects: ['Project Alpha', 'Project Beta'],
      leaveBalance: 18,
      lastLogin: new Date('2024-02-20T09:30:00')
    },
    {
      id: '2',
      name: 'Bob Smith',
      designation: 'Software Engineer',
      email: 'bob.smith@company.com',
      phone: '+1-555-0202',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'active',
      attendanceToday: 'late',
      performanceRating: 4.2,
      currentProjects: ['Project Gamma'],
      leaveBalance: 15,
      lastLogin: new Date('2024-02-20T10:15:00')
    },
    {
      id: '3',
      name: 'Carol Davis',
      designation: 'Junior Software Engineer',
      email: 'carol.davis@company.com',
      phone: '+1-555-0203',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'on_leave',
      attendanceToday: 'absent',
      performanceRating: 4.0,
      currentProjects: ['Project Delta'],
      leaveBalance: 12,
      lastLogin: new Date('2024-02-19T17:00:00')
    },
    {
      id: '4',
      name: 'David Wilson',
      designation: 'Software Engineer',
      email: 'david.wilson@company.com',
      phone: '+1-555-0204',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'active',
      attendanceToday: 'not_checked_in',
      performanceRating: 3.8,
      currentProjects: ['Project Echo'],
      leaveBalance: 20,
      lastLogin: new Date('2024-02-19T18:30:00')
    }
  ];

  // Mock pending approvals
  const pendingApprovals: PendingApproval[] = [
    {
      id: '1',
      type: 'leave',
      employeeId: '1',
      employeeName: 'Alice Johnson',
      description: 'Annual Leave - 3 days',
      submittedDate: new Date('2024-02-20T08:30:00'),
      priority: 'medium',
      details: {
        leaveType: 'annual',
        startDate: new Date('2024-02-25'),
        endDate: new Date('2024-02-27'),
        reason: 'Family vacation',
        days: 3
      }
    },
    {
      id: '2',
      type: 'attendance',
      employeeId: '2',
      employeeName: 'Bob Smith',
      description: 'Attendance Regularization',
      submittedDate: new Date('2024-02-19T16:45:00'),
      priority: 'low',
      details: {
        date: new Date('2024-02-19'),
        reason: 'Traffic jam due to accident',
        requestedCheckIn: '09:30',
        actualCheckIn: '10:15'
      }
    },
    {
      id: '3',
      type: 'timesheet',
      employeeId: '4',
      employeeName: 'David Wilson',
      description: 'Timesheet Approval - Week 7',
      submittedDate: new Date('2024-02-18T17:00:00'),
      priority: 'high',
      details: {
        week: 'Week 7, 2024',
        totalHours: 42,
        projects: ['Project Echo: 35h', 'Training: 7h'],
        overtime: 2
      }
    }
  ];

  // Mock performance reviews
  const performanceReviews: PerformanceReview[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Alice Johnson',
      period: 'Q4 2023',
      status: 'pending',
      dueDate: new Date('2024-02-28'),
      selfAssessment: true,
      managerReview: false
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Bob Smith',
      period: 'Q4 2023',
      status: 'in_progress',
      dueDate: new Date('2024-02-25'),
      selfAssessment: true,
      managerReview: false
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Carol Davis',
      period: 'Q4 2023',
      status: 'completed',
      dueDate: new Date('2024-02-20'),
      selfAssessment: true,
      managerReview: true,
      rating: 4.0
    }
  ];

  // Team metrics
  const teamMetrics = {
    totalMembers: teamMembers.length,
    presentToday: teamMembers.filter(m => m.attendanceToday === 'present').length,
    onLeave: teamMembers.filter(m => m.status === 'on_leave').length,
    pendingApprovals: pendingApprovals.length,
    averagePerformance: teamMembers.reduce((sum, m) => sum + m.performanceRating, 0) / teamMembers.length,
    upcomingReviews: performanceReviews.filter(r => r.status !== 'completed').length,
    teamAttendanceRate: 85.5,
    teamProductivity: 92.3
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'error';
      case 'not_checked_in': return 'default';
      default: return 'default';
    }
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle />;
      case 'late': return <Schedule />;
      case 'absent': return <Cancel />;
      case 'not_checked_in': return <Pending />;
      default: return <Pending />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'on_leave': return 'warning';
      case 'inactive': return 'error';
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const handleApproval = (approval: PendingApproval, action: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setApprovalAction(action);
    setApprovalDialogOpen(true);
  };

  const submitApproval = () => {
    console.log(`${approvalAction} approval:`, selectedApproval, 'Notes:', approvalNotes);
    setApprovalDialogOpen(false);
    setApprovalNotes('');
    setSelectedApproval(null);
  };

  const handlePerformanceReview = (review: PerformanceReview) => {
    setSelectedReview(review);
    setPerformanceDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Team Management Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your team, approve requests, and monitor performance.
        </Typography>
      </Box>

      {/* Team Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {teamMetrics.totalMembers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team Members
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {teamMetrics.presentToday} present today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {teamMetrics.pendingApprovals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approvals
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Require your attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Star sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {teamMetrics.averagePerformance.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Performance
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Out of 5.0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                {teamMetrics.upcomingReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Reviews
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Due this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <PermissionGate permission={PERMISSIONS.EMPLOYEE_READ_TEAM}>
              <Tab label="Team Overview" />
            </PermissionGate>
            <PermissionGate permission={[PERMISSIONS.LEAVE_APPROVE, PERMISSIONS.ATTENDANCE_APPROVE]}>
              <Tab label="Pending Approvals" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.PERFORMANCE_VIEW_TEAM}>
              <Tab label="Performance Reviews" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.LEAVE_VIEW_TEAM}>
              <Tab label="Team Calendar" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.REPORTS_TEAM}>
              <Tab label="Analytics" />
            </PermissionGate>
          </Tabs>
        </Box>

        {/* Team Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">My Team</Typography>
            <Button variant="outlined" startIcon={<Analytics />}>
              Team Report
            </Button>
          </Box>

          <Grid container spacing={3}>
            {teamMembers.map((member) => (
              <Grid item xs={12} md={6} lg={4} key={member.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={member.avatar} sx={{ width: 50, height: 50 }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{member.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.designation}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getAttendanceIcon(member.attendanceToday)}
                        label={member.attendanceToday.replace('_', ' ').toUpperCase()}
                        color={getAttendanceColor(member.attendanceToday)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Status:</Typography>
                        <Chip
                          label={member.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(member.status)}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Performance:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Star color="warning" fontSize="small" />
                          <Typography variant="body2" fontWeight="medium">
                            {member.performanceRating}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Leave Balance:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {member.leaveBalance} days
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Projects:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {member.currentProjects.length}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Profile">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Message">
                        <IconButton size="small">
                          <Email />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Call">
                        <IconButton size="small">
                          <Phone />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Performance Review">
                        <IconButton size="small">
                          <Assessment />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Pending Approvals Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Pending Approvals ({pendingApprovals.length})</Typography>
            <Button variant="outlined" startIcon={<Notifications />}>
              Mark All as Read
            </Button>
          </Box>

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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {approval.employeeName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {approval.employeeName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{approval.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(approval.submittedDate, 'MMM dd, yyyy HH:mm')}
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
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApproval(approval, 'approve')}
                          >
                            <ThumbUp />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleApproval(approval, 'reject')}
                          >
                            <ThumbDown />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Performance Reviews Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Performance Reviews</Typography>
            <Button variant="contained" startIcon={<Assessment />}>
              Start Review Cycle
            </Button>
          </Box>

          <Grid container spacing={3}>
            {performanceReviews.map((review) => (
              <Grid item xs={12} md={6} key={review.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{review.employeeName}</Typography>
                      <Chip
                        label={review.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(review.status)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Review Period: {review.period}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Due Date: {format(review.dueDate, 'MMM dd, yyyy')}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Self Assessment:</Typography>
                        <Chip
                          label={review.selfAssessment ? 'Completed' : 'Pending'}
                          color={review.selfAssessment ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Manager Review:</Typography>
                        <Chip
                          label={review.managerReview ? 'Completed' : 'Pending'}
                          color={review.managerReview ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      {review.rating && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Final Rating:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star color="warning" fontSize="small" />
                            <Typography variant="body2" fontWeight="medium">
                              {review.rating}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handlePerformanceReview(review)}
                        disabled={review.status === 'completed'}
                      >
                        {review.status === 'completed' ? 'View Review' : 'Start Review'}
                      </Button>
                      <Button size="small" variant="text">
                        View History
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Team Calendar Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Team Calendar & Schedule
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card variant="outlined">
                <CardHeader title="This Week's Schedule" />
                <CardContent>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Calendar integration coming soon. View team schedules, meetings, and leave calendar.
                  </Alert>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Event color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Team Standup"
                        secondary="Daily at 9:00 AM"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarMonth color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Carol Davis - Annual Leave"
                        secondary="Feb 20-22, 2024"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Assessment color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Performance Review - Alice Johnson"
                        secondary="Feb 25, 2024 at 2:00 PM"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardHeader title="Quick Actions" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Schedule />} fullWidth>
                      Schedule Team Meeting
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CalendarMonth />}
                      onClick={() => window.location.href = '#/workflow-diagram'}
                      fullWidth
                    >
                      View Complete Workflow
                    </Button>
                    <Button variant="outlined" startIcon={<Assessment />} fullWidth>
                      Schedule 1:1 Meeting
                    </Button>
                    <Button variant="outlined" startIcon={<Event />} fullWidth>
                      Block Calendar Time
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Team Analytics & Insights
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Team Performance Metrics" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Team Attendance Rate</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {teamMetrics.teamAttendanceRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={teamMetrics.teamAttendanceRate}
                        color="success"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Team Productivity</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {teamMetrics.teamProductivity}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={teamMetrics.teamProductivity}
                        color="info"
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Average Performance</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {((teamMetrics.averagePerformance / 5) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(teamMetrics.averagePerformance / 5) * 100}
                        color="warning"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Team Insights" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Performance Improvement"
                        secondary="Team performance increased by 8% this quarter"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Attendance Alert"
                        secondary="2 team members have attendance concerns"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Star color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Top Performer"
                        secondary="Alice Johnson leads with 4.5/5 rating"
                      />
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
          {selectedApproval && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Employee:</strong> {selectedApproval.employeeName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Type:</strong> {selectedApproval.type}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Description:</strong> {selectedApproval.description}
              </Typography>
              
              {selectedApproval.type === 'leave' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Leave Details:</strong>
                  </Typography>
                  <Typography variant="body2">
                    Type: {selectedApproval.details.leaveType}<br />
                    Duration: {format(selectedApproval.details.startDate, 'MMM dd')} - {format(selectedApproval.details.endDate, 'MMM dd, yyyy')}<br />
                    Days: {selectedApproval.details.days}<br />
                    Reason: {selectedApproval.details.reason}
                  </Typography>
                </Box>
              )}

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

      {/* Performance Review Dialog */}
      <Dialog
        open={performanceDialogOpen}
        onClose={() => setPerformanceDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Performance Review - {selectedReview?.employeeName}
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Review Period:</strong> {selectedReview.period}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Due Date:</strong> {format(selectedReview.dueDate, 'MMM dd, yyyy')}
              </Typography>
              
              <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                Performance review system integration coming soon. This will include goal setting, 
                feedback collection, and rating management.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Overall Rating (1-5)"
                    type="number"
                    inputProps={{ min: 1, max: 5, step: 0.1 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Review Status</InputLabel>
                    <Select label="Review Status" defaultValue="in_progress">
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Manager Feedback"
                    multiline
                    rows={4}
                    placeholder="Provide detailed feedback on performance, achievements, and areas for improvement..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPerformanceDialogOpen(false)}>Cancel</Button>
          <Button variant="outlined">Save Draft</Button>
          <Button variant="contained">Submit Review</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};