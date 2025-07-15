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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Autocomplete
} from '@mui/material';
import {
  Add,
  CalendarMonth,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Pending,
  TrendingUp,
  TrendingDown,
  Event,
  Person,
  Schedule,
  Approval,
  History,
  Analytics,
  Download,
  Upload,
  Notifications,
  Group,
  Business,
  Home,
  Flight,
  LocalHospital,
  ChildCare,
  Warning
} from '@mui/icons-material';
import { format, addDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useLeaveStore } from '../../store/useLeaveStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '@mui/material/styles';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency' | 'unpaid' | 'compensatory';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  documents?: File[];
  isHalfDay?: boolean;
  contactDuringLeave?: string;
  workHandover?: string;
}

interface LeaveBalance {
  annual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  maternity: { total: number; used: number; remaining: number };
  paternity: { total: number; used: number; remaining: number };
  emergency: { total: number; used: number; remaining: number };
  compensatory: { total: number; used: number; remaining: number };
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
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const LeaveManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    requests, 
    balances, 
    submitLeaveRequest, 
    fetchLeaveBalance, 
    getLeaveStats,
    isLoading,
    error 
  } = useLeaveStore();
  const { employees } = useEmployeeStore();
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);
  const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false);
  const [selectedLeave, setSelectedLeave] = React.useState<LeaveRequest | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = React.useState(false);
  const [bulkApprovalOpen, setBulkApprovalOpen] = React.useState(false);
  const [selectedRequests, setSelectedRequests] = React.useState<string[]>([]);
  
  const [newLeave, setNewLeave] = React.useState({
    type: 'annual' as const,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    reason: '',
    isHalfDay: false,
    contactDuringLeave: '',
    workHandover: ''
  });

  // Mock leave balance data
  const leaveBalance = balances.find(b => b.employeeId === user?.id) || {
    employeeId: user?.id || '',
    annual: { total: 21, used: 8, remaining: 13 },
    sick: { total: 12, used: 3, remaining: 9 },
    maternity: { total: 180, used: 0, remaining: 180 },
    paternity: { total: 15, used: 0, remaining: 15 },
    emergency: { total: 5, used: 1, remaining: 4 },
    compensatory: { total: 10, used: 2, remaining: 8 },
    year: new Date().getFullYear()
  };

  // Mock leave requests
  const leaveRequests = requests.filter(r => r.employeeId === user?.id);

  // Mock team leave calendar
  const teamLeaveCalendar = [
    { date: '2024-03-01', employees: ['John Smith'], type: 'annual' },
    { date: '2024-03-05', employees: ['Sarah Johnson'], type: 'sick' },
    { date: '2024-03-10', employees: ['Michael Chen', 'Emily Rodriguez'], type: 'annual' },
    { date: '2024-03-15', employees: ['John Smith'], type: 'emergency' }
  ];

  // Mock analytics data
  const leaveAnalytics = {
    monthlyTrend: [
      { month: 'Jan', annual: 45, sick: 12, emergency: 3, total: 60 },
      { month: 'Feb', annual: 52, sick: 8, emergency: 5, total: 65 },
      { month: 'Mar', annual: 48, sick: 15, emergency: 2, total: 65 },
      { month: 'Apr', annual: 55, sick: 10, emergency: 4, total: 69 },
      { month: 'May', annual: 42, sick: 18, emergency: 6, total: 66 },
      { month: 'Jun', annual: 38, sick: 14, emergency: 3, total: 55 }
    ],
    typeDistribution: [
      { name: 'Annual', value: 65, color: '#4caf50' },
      { name: 'Sick', value: 20, color: '#ff9800' },
      { name: 'Emergency', value: 8, color: '#f44336' },
      { name: 'Maternity', value: 5, color: '#e91e63' },
      { name: 'Other', value: 2, color: '#9c27b0' }
    ],
    departmentStats: [
      { department: 'Engineering', avgDays: 18.5, utilizationRate: 88 },
      { department: 'Sales', avgDays: 16.2, utilizationRate: 77 },
      { department: 'Marketing', avgDays: 19.8, utilizationRate: 94 },
      { department: 'HR', avgDays: 15.5, utilizationRate: 74 },
      { department: 'Finance', avgDays: 17.3, utilizationRate: 82 }
    ]
  };

  React.useEffect(() => {
    if (user?.id) {
      fetchLeaveBalance(user.id);
    }
  }, [user?.id, fetchLeaveBalance]);

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'primary';
      case 'sick': return 'warning';
      case 'maternity': return 'secondary';
      case 'paternity': return 'info';
      case 'emergency': return 'error';
      case 'compensatory': return 'success';
      case 'unpaid': return 'default';
      default: return 'default';
    }
  };

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'annual': return <Flight />;
      case 'sick': return <LocalHospital />;
      case 'maternity': return <ChildCare />;
      case 'paternity': return <ChildCare />;
      case 'emergency': return <Warning />;
      case 'compensatory': return <Schedule />;
      default: return <CalendarMonth />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      case 'pending': return <Pending />;
      case 'cancelled': return <Cancel />;
      default: return <Pending />;
    }
  };

  const handleSubmitLeave = async () => {
    const days = differenceInDays(new Date(newLeave.endDate), new Date(newLeave.startDate)) + 1;
    
    if (user?.id) {
      await submitLeaveRequest({
        employeeId: user.id,
        employeeName: user.name,
        type: newLeave.type,
        startDate: new Date(newLeave.startDate),
        endDate: new Date(newLeave.endDate),
        days,
        reason: newLeave.reason
      });
    }
    
    setLeaveDialogOpen(false);
    setNewLeave({
      type: 'annual',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      reason: '',
      isHalfDay: false,
      contactDuringLeave: '',
      workHandover: ''
    });
  };

  const handleApproveLeave = (leaveId: string, approved: boolean, reason?: string) => {
    console.log('Leave approval:', { leaveId, approved, reason });
    setApprovalDialogOpen(false);
    setSelectedLeave(null);
  };

  const handleBulkApproval = (action: 'approve' | 'reject') => {
    console.log('Bulk action:', action, selectedRequests);
    setBulkApprovalOpen(false);
    setSelectedRequests([]);
  };

  const calculateProgress = (used: number, total: number) => {
    return (used / total) * 100;
  };

  const getWorkingDays = (startDate: Date, endDate: Date) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days.filter(day => !isWeekend(day)).length;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Leave Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive leave management with multi-step workflows and team calendar integration.
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="My Leaves" />
        <Tab label="Team Calendar" />
        <Tab label="Approvals" />
        <Tab label="Analytics" />
      </Tabs>

      {/* My Leaves Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Leave Balance Cards */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Leave Balance Overview"
                subtitle="Current year leave allocation and usage"
                action={
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setLeaveDialogOpen(true)}
                    disabled={isLoading}
                  >
                    Apply Leave
                  </Button>
                }
              />
              <CardContent>
                <Grid container spacing={3}>
                  {Object.entries(leaveBalance).map(([type, balance]) => (
                    <Grid item xs={12} sm={6} md={2} key={type}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                            {getLeaveTypeIcon(type)}
                          </Box>
                          <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                            {type}
                          </Typography>
                          <Typography variant="h4" color="primary.main" gutterBottom>
                            {balance.remaining}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            of {balance.total} days
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={calculateProgress(balance.used, balance.total)}
                            sx={{ mt: 1, mb: 1 }}
                            color={calculateProgress(balance.used, balance.total) > 80 ? 'error' : 'primary'}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {balance.used} used
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Leave Requests Table */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Leave Requests"
                subtitle="Your recent and upcoming leave requests"
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" startIcon={<Download />}>
                      Export
                    </Button>
                    <Button variant="outlined" startIcon={<Analytics />}>
                      Reports
                    </Button>
                  </Box>
                }
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Days</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRequests.filter(leave => leave.employeeId === user?.id).map((leave) => (
                        <TableRow key={leave.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getLeaveTypeIcon(leave.type)}
                              <Chip
                                label={leave.type.toUpperCase()}
                                color={getLeaveTypeColor(leave.type)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {format(leave.startDate, 'MMM dd')} - {format(leave.endDate, 'MMM dd, yyyy')}
                              </Typography>
                              {leave.isHalfDay && (
                                <Chip label="Half Day" size="small" variant="outlined" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {leave.days} {leave.days === 1 ? 'day' : 'days'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200 }}>
                              {leave.reason}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {format(leave.appliedDate, 'MMM dd, yyyy')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(leave.status)}
                              label={leave.status.toUpperCase()}
                              color={getStatusColor(leave.status)}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setDetailsDialogOpen(true);
                                  }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              {leave.status === 'pending' && (
                                <>
                                  <Tooltip title="Edit">
                                    <IconButton size="small">
                                      <Edit />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Cancel">
                                    <IconButton size="small" color="error">
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Leave Calendar & Analytics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Leave Calendar"
                subtitle="Your upcoming leaves and holidays"
              />
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CalendarMonth sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Calendar View
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interactive calendar showing your leaves and company holidays
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Leave Analytics"
                subtitle="Your leave patterns and trends"
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        11
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Leaves Taken
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        <TrendingUp color="success" fontSize="small" />
                        <Typography variant="caption" color="success.main">
                          +2 from last year
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main">
                        2.1
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Days/Month
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        <TrendingDown color="error" fontSize="small" />
                        <Typography variant="caption" color="error.main">
                          -0.5 from last year
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Most Used Leave Types
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Annual Leave</Typography>
                    <Typography variant="body2" fontWeight="medium">8 days</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Sick Leave</Typography>
                    <Typography variant="body2" fontWeight="medium">3 days</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Emergency Leave</Typography>
                    <Typography variant="body2" fontWeight="medium">1 day</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Team Calendar Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Team Leave Calendar"
                subtitle="Overview of team leaves and availability"
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" startIcon={<Download />}>
                      Export Calendar
                    </Button>
                    <Button variant="outlined" startIcon={<Notifications />}>
                      Set Alerts
                    </Button>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Team Leaves
                  </Typography>
                  <List>
                    {teamLeaveCalendar.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getLeaveTypeIcon(item.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {format(new Date(item.date), 'MMM dd, yyyy')}
                              </Typography>
                              <Chip
                                label={item.type}
                                color={getLeaveTypeColor(item.type)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={`${item.employees.join(', ')} will be on leave`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CalendarMonth sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Interactive Team Calendar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Full calendar view with team availability and leave conflicts
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Approvals Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Pending Approvals"
                subtitle="Leave requests requiring your approval"
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<CheckCircle />}
                      onClick={() => setBulkApprovalOpen(true)}
                      disabled={selectedRequests.length === 0}
                    >
                      Bulk Approve ({selectedRequests.length})
                    </Button>
                    <Button variant="outlined" startIcon={<Download />}>
                      Export
                    </Button>
                  </Box>
                }
              />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedRequests.length > 0 && selectedRequests.length < leaveRequests.filter(l => l.status === 'pending').length}
                            checked={selectedRequests.length === leaveRequests.filter(l => l.status === 'pending').length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRequests(leaveRequests.filter(l => l.status === 'pending').map(l => l.id));
                              } else {
                                setSelectedRequests([]);
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>Employee</TableCell>
                        <TableCell>Leave Type</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Days</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveRequests.filter(leave => leave.status === 'pending').map((leave) => (
                        <TableRow key={leave.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRequests.includes(leave.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRequests(prev => [...prev, leave.id]);
                                } else {
                                  setSelectedRequests(prev => prev.filter(id => id !== leave.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar>
                                {leave.employeeName.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {leave.employeeName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getLeaveTypeIcon(leave.type)}
                              <Chip
                                label={leave.type.toUpperCase()}
                                color={getLeaveTypeColor(leave.type)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {format(leave.startDate, 'MMM dd')} - {format(leave.endDate, 'MMM dd, yyyy')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {leave.days} {leave.days === 1 ? 'day' : 'days'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {format(leave.appliedDate, 'MMM dd, yyyy')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setDetailsDialogOpen(true);
                                  }}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Approve/Reject">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setApprovalDialogOpen(true);
                                  }}
                                >
                                  <Approval />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Leave Trends" subtitle="Monthly leave analytics across the organization" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={leaveAnalytics.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      name="Total Leaves"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="annual" 
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                      name="Annual Leaves"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sick" 
                      stroke={theme.palette.warning.main}
                      strokeWidth={2}
                      name="Sick Leaves"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="emergency" 
                      stroke={theme.palette.error.main}
                      strokeWidth={2}
                      name="Emergency Leaves"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Leave Type Distribution" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leaveAnalytics.typeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {leaveAnalytics.typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title="Department Leave Statistics" />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell>Average Days Taken</TableCell>
                        <TableCell>Utilization Rate</TableCell>
                        <TableCell>Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leaveAnalytics.departmentStats.map((dept) => (
                        <TableRow key={dept.department}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {dept.department}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {dept.avgDays} days
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {dept.utilizationRate}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <LinearProgress
                              variant="determinate"
                              value={dept.utilizationRate}
                              sx={{ width: 100 }}
                              color={dept.utilizationRate >= 85 ? 'success' : dept.utilizationRate >= 70 ? 'warning' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Apply Leave Dialog */}
      <Dialog
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add />
            Apply for Leave
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={newLeave.type}
                    onChange={(e) => setNewLeave(prev => ({ ...prev, type: e.target.value as any }))}
                    label="Leave Type"
                  >
                    <MenuItem value="annual">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Flight fontSize="small" />
                        Annual Leave
                      </Box>
                    </MenuItem>
                    <MenuItem value="sick">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalHospital fontSize="small" />
                        Sick Leave
                      </Box>
                    </MenuItem>
                    <MenuItem value="maternity">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChildCare fontSize="small" />
                        Maternity Leave
                      </Box>
                    </MenuItem>
                    <MenuItem value="paternity">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChildCare fontSize="small" />
                        Paternity Leave
                      </Box>
                    </MenuItem>
                    <MenuItem value="emergency">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Warning fontSize="small" />
                        Emergency Leave
                      </Box>
                    </MenuItem>
                    <MenuItem value="compensatory">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule fontSize="small" />
                        Compensatory Leave
                      </Box>
                    </MenuItem>
                    <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newLeave.isHalfDay}
                      onChange={(e) => setNewLeave(prev => ({ ...prev, isHalfDay: e.target.checked }))}
                    />
                  }
                  label="Half Day Leave"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  disabled={newLeave.isHalfDay}
                />
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Duration: {newLeave.isHalfDay ? '0.5' : differenceInDays(new Date(newLeave.endDate), new Date(newLeave.startDate)) + 1} day(s)
              </Typography>
              <Typography variant="body2">
                Remaining {newLeave.type} leave: {leaveBalance[newLeave.type]?.remaining || 0} days
              </Typography>
              <Typography variant="body2">
                Working days: {getWorkingDays(new Date(newLeave.startDate), new Date(newLeave.endDate))}
              </Typography>
            </Alert>

            <TextField
              fullWidth
              label="Reason for Leave"
              multiline
              rows={3}
              value={newLeave.reason}
              onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Please provide a reason for your leave request..."
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Contact During Leave"
              value={newLeave.contactDuringLeave}
              onChange={(e) => setNewLeave(prev => ({ ...prev, contactDuringLeave: e.target.value }))}
              placeholder="Phone number or email for emergency contact"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Work Handover Details"
              multiline
              rows={3}
              value={newLeave.workHandover}
              onChange={(e) => setNewLeave(prev => ({ ...prev, workHandover: e.target.value }))}
              placeholder="Describe how your work will be handled during your absence..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitLeave}
            disabled={!newLeave.reason.trim() || isLoading}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leave Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedLeave && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Event />
                Leave Request Details
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{selectedLeave.employeeName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedLeave.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Leave Type</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getLeaveTypeIcon(selectedLeave.type)}
                      <Chip
                        label={selectedLeave.type.toUpperCase()}
                        color={getLeaveTypeColor(selectedLeave.type)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      icon={getStatusIcon(selectedLeave.status)}
                      label={selectedLeave.status.toUpperCase()}
                      color={getStatusColor(selectedLeave.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Start Date</Typography>
                    <Typography variant="body1">{format(selectedLeave.startDate, 'MMM dd, yyyy')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">End Date</Typography>
                    <Typography variant="body1">{format(selectedLeave.endDate, 'MMM dd, yyyy')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Duration</Typography>
                    <Typography variant="body1">{selectedLeave.days} day(s)</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Applied Date</Typography>
                    <Typography variant="body1">{format(selectedLeave.appliedDate, 'MMM dd, yyyy')}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Reason</Typography>
                    <Typography variant="body1">{selectedLeave.reason}</Typography>
                  </Grid>
                  {selectedLeave.contactDuringLeave && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Contact During Leave</Typography>
                      <Typography variant="body1">{selectedLeave.contactDuringLeave}</Typography>
                    </Grid>
                  )}
                  {selectedLeave.workHandover && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Work Handover</Typography>
                      <Typography variant="body1">{selectedLeave.workHandover}</Typography>
                    </Grid>
                  )}
                  {selectedLeave.approvedBy && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Approved By</Typography>
                        <Typography variant="body1">{selectedLeave.approvedBy}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Approved Date</Typography>
                        <Typography variant="body1">
                          {selectedLeave.approvedDate && format(selectedLeave.approvedDate, 'MMM dd, yyyy')}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  {selectedLeave.rejectionReason && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Rejection Reason</Typography>
                      <Typography variant="body1" color="error.main">
                        {selectedLeave.rejectionReason}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>
                Close
              </Button>
              {selectedLeave.status === 'pending' && user?.role !== 'employee' && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    setApprovalDialogOpen(true);
                  }}
                >
                  Approve/Reject
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Leave Approval</DialogTitle>
        <DialogContent>
          {selectedLeave && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" gutterBottom>
                <strong>{selectedLeave.employeeName}</strong> has requested {selectedLeave.days} day(s) of {selectedLeave.type} leave.
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Duration: {format(selectedLeave.startDate, 'MMM dd')} - {format(selectedLeave.endDate, 'MMM dd, yyyy')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Reason: {selectedLeave.reason}
              </Typography>
              
              <TextField
                fullWidth
                label="Comments (Optional)"
                multiline
                rows={3}
                sx={{ mt: 2 }}
                placeholder="Add any comments for the employee..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApprovalDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => handleApproveLeave(selectedLeave?.id || '', false)}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleApproveLeave(selectedLeave?.id || '', true)}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Approval Dialog */}
      <Dialog
        open={bulkApprovalOpen}
        onClose={() => setBulkApprovalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Bulk Leave Approval</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            You have selected {selectedRequests.length} leave request(s) for bulk action.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action will apply to all selected requests. You can add a common comment below.
          </Typography>
          
          <TextField
            fullWidth
            label="Comments (Optional)"
            multiline
            rows={3}
            sx={{ mt: 2 }}
            placeholder="Add any comments for all selected requests..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkApprovalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => handleBulkApproval('reject')}
          >
            Reject All
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleBulkApproval('approve')}
          >
            Approve All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};