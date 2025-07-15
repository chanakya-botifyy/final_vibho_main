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
  Divider,
  Badge
} from '@mui/material';
import {
  AccessTime,
  CalendarMonth,
  AccountBalance,
  Description,
  Person,
  PlayArrow,
  Stop,
  CheckCircle,
  Warning,
  Receipt,
  Download,
  Visibility,
  Edit,
  Add,
  Home,
  Business,
  LocationOn,
  Schedule,
  Notifications,
  Email,
  Phone,
  EventAvailable,
  EventBusy,
  Work,
  School,
  Assignment,
  AttachMoney,
  Logout
} from '@mui/icons-material';
import { Support } from '@mui/icons-material';
import { format, differenceInHours, differenceInMinutes, addDays, differenceInDays } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';
import { useLeaveStore } from '../../store/useLeaveStore';
import { usePayrollStore } from '../../store/usePayrollStore';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { can } = usePermission();
  const { 
    currentSession, 
    checkIn, 
    checkOut, 
    startBreak, 
    endBreak 
  } = useAttendanceStore();
  const { requests: leaveRequests, getLeaveStats } = useLeaveStore();
  const { records: payrollRecords } = usePayrollStore();
  
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false);
  const [regularizationDialogOpen, setRegularizationDialogOpen] = React.useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = React.useState(false);
  const [newLeaveRequest, setNewLeaveRequest] = React.useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    contactDetails: ''
  });
  const [newRegularization, setNewRegularization] = React.useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    checkInTime: '',
    checkOutTime: '',
    reason: ''
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock data for upcoming holidays
  const upcomingHolidays = [
    { name: 'Memorial Day', date: new Date('2024-05-27') },
    { name: 'Independence Day', date: new Date('2024-07-04') },
    { name: 'Labor Day', date: new Date('2024-09-02') }
  ];

  // Mock data for leave balances
  const leaveBalances = {
    annual: { total: 21, used: 5, remaining: 16 },
    sick: { total: 12, used: 2, remaining: 10 },
    casual: { total: 6, used: 1, remaining: 5 }
  };

  // Mock data for recent payslips
  const recentPayslips = [
    { month: 'February 2024', amount: 4250.00, date: new Date('2024-02-28') },
    { month: 'January 2024', amount: 4250.00, date: new Date('2024-01-31') },
    { month: 'December 2023', amount: 4250.00, date: new Date('2023-12-31') }
  ];

  // Mock data for recent documents
  const recentDocuments = [
    { name: 'Employment Certificate', type: 'certificate', date: new Date('2024-01-15') },
    { name: 'Tax Form 2023', type: 'tax', date: new Date('2024-01-10') },
    { name: 'Health Insurance Card', type: 'insurance', date: new Date('2023-12-05') }
  ];

  // Mock data for recent activities
  const recentActivities = [
    { type: 'attendance', description: 'Checked in at 09:05 AM', timestamp: new Date('2024-02-20T09:05:00') },
    { type: 'leave', description: 'Leave request approved', timestamp: new Date('2024-02-19T14:30:00') },
    { type: 'payroll', description: 'Payslip for January generated', timestamp: new Date('2024-02-01T10:00:00') }
  ];

  const handleCheckIn = async () => {
    try {
      // In a real app, we would get the actual location
      const location = { latitude: 40.7128, longitude: -74.0060 };
      await checkIn(location, 'office');
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
    } catch (error) {
      console.error('Check-out failed:', error);
    }
  };

  const handleLeaveSubmit = () => {
    console.log('Submitting leave request:', newLeaveRequest);
    setLeaveDialogOpen(false);
    setNewLeaveRequest({
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
      contactDetails: ''
    });
  };

  const handleRegularizationSubmit = () => {
    console.log('Submitting regularization request:', newRegularization);
    setRegularizationDialogOpen(false);
    setNewRegularization({
      date: format(new Date(), 'yyyy-MM-dd'),
      checkInTime: '',
      checkOutTime: '',
      reason: ''
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}! Here's your personal workspace.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Time Tracking Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Time Tracking" />
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h3" color="primary">
                  {format(currentTime, 'HH:mm:ss')}
                </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {format(currentTime, 'EEEE, MMMM d, yyyy')}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  {!currentSession.isCheckedIn ? (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<PlayArrow />}
                      onClick={handleCheckIn}
                      size="large"
                    >
                      Check In
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Stop />}
                      onClick={handleCheckOut}
                      size="large"
                    >
                      Check Out
                    </Button>
                  )}
                  
                  {currentSession.isCheckedIn && !currentSession.isOnBreak && (
                    <Button
                      variant="outlined"
                      onClick={startBreak}
                    >
                      Start Break
                    </Button>
                  )}
                  
                  {currentSession.isCheckedIn && currentSession.isOnBreak && (
                    <Button
                      variant="outlined"
                      onClick={endBreak}
                    >
                      End Break
                    </Button>
                  )}
                </Box>
                
                {currentSession.isCheckedIn && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip
                      icon={<AccessTime />}
                      label={currentSession.isOnBreak 
                        ? "On Break" 
                        : `Working since ${currentSession.checkInTime?.toLocaleTimeString()}`
                      }
                      color={currentSession.isOnBreak ? "warning" : "success"}
                      variant="outlined"
                    />
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setRegularizationDialogOpen(true)}
                      >
                        Request Regularization
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
        </Grid>

        {/* Leave Balance Card */}
        <Grid item xs={12} md={6}>
          <PermissionGate permission={[PERMISSIONS.LEAVE_VIEW_SELF, PERMISSIONS.LEAVE_APPLY]}>
            <Card>
              <CardHeader 
                title="Leave Balance" 
                action={
                  <PermissionGate permission={PERMISSIONS.LEAVE_APPLY}>
                    <Button 
                      variant="contained" 
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setLeaveDialogOpen(true)}
                    >
                      Apply Leave
                    </Button>
                  </PermissionGate>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main">
                        {leaveBalances.annual.remaining}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Annual Leave
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        of {leaveBalances.annual.total} days
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        {leaveBalances.sick.remaining}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sick Leave
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        of {leaveBalances.sick.total} days
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {leaveBalances.casual.remaining}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Casual Leave
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        of {leaveBalances.casual.total} days
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                  Recent Leave Requests
                </Typography>
                
                <List dense>
                  {leaveRequests.slice(0, 3).map((request, index) => (
                    <ListItem key={index} divider={index < 2}>
                      <ListItemIcon>
                        {request.status === 'approved' ? <EventAvailable color="success" /> : 
                         request.status === 'pending' ? <Schedule color="warning" /> : 
                         <EventBusy color="error" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${request.type} Leave (${request.days} days)`}
                        secondary={`${format(request.startDate, 'MMM dd')} - ${format(request.endDate, 'MMM dd')}`}
                      />
                      <Chip
                        label={request.status.toUpperCase()}
                        color={
                          request.status === 'approved' ? 'success' : 
                          request.status === 'pending' ? 'warning' : 
                          'error'
                        }
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </PermissionGate>
        </Grid>

        {/* Upcoming Holidays */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Upcoming Holidays" />
            <CardContent>
              <List dense>
                {upcomingHolidays.map((holiday, index) => (
                  <ListItem key={index} divider={index < upcomingHolidays.length - 1}>
                    <ListItemIcon>
                      <CalendarMonth color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={holiday.name}
                      secondary={format(holiday.date, 'EEEE, MMMM d, yyyy')}
                    />
                    <Typography variant="body2" color="text.secondary">
                      in {differenceInDays(holiday.date, new Date())} days
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Payslips */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Recent Payslips" />
            <CardContent>
              <List dense>
                {recentPayslips.map((payslip, index) => (
                  <ListItem key={index} divider={index < recentPayslips.length - 1}>
                    <ListItemIcon>
                      <Receipt color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={payslip.month}
                      secondary={format(payslip.date, 'MMM dd, yyyy')}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(payslip.amount)}
                      </Typography>
                      <IconButton size="small">
                        <Download fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="My Documents" 
              action={
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setDocumentDialogOpen(true)}
                >
                  Upload
                </Button>
              }
            />
            <CardContent>
              <List dense>
                {recentDocuments.map((document, index) => (
                  <ListItem key={index} divider={index < recentDocuments.length - 1}>
                    <ListItemIcon>
                      <Description color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={document.name}
                      secondary={format(document.date, 'MMM dd, yyyy')}
                    />
                    <IconButton size="small">
                      <Download fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="My Profile" 
              action={
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<Edit />}
                >
                  Edit
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar
                  src={user?.avatar}
                  sx={{ width: 80, height: 80 }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5">{user?.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user?.designation}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.department} • Employee ID: {user?.employeeId}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{user?.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">+1-555-0123</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">New York, USA</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Work fontSize="small" color="action" />
                    <Typography variant="body2">Joined: Jan 15, 2023</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Business fontSize="small" color="action" />
                    <Typography variant="body2">New York Office</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">Reports to: Michael Chen</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivities.length - 1}>
                    <ListItemIcon>
                      {activity.type === 'attendance' && <AccessTime color="primary" />}
                      {activity.type === 'leave' && <CalendarMonth color="success" />}
                      {activity.type === 'payroll' && <AccountBalance color="info" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={format(activity.timestamp, 'MMM dd, yyyy HH:mm')}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4} md={2}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => setLeaveDialogOpen(true)}
                  >
                    <CalendarMonth sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      Apply Leave
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Receipt sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      View Payslips
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      Submit Claim
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Assignment sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      Employment Letter
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Support sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      Raise Ticket
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Logout sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      Resignation
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leave Application Dialog */}
      <Dialog
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Apply for Leave</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={newLeaveRequest.type}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, type: e.target.value }))}
                    label="Leave Type"
                  >
                    <MenuItem value="annual">Annual Leave</MenuItem>
                    <MenuItem value="sick">Sick Leave</MenuItem>
                    <MenuItem value="casual">Casual Leave</MenuItem>
                    <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Alert severity="info" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  You have {leaveBalances.annual.remaining} annual leave days remaining.
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={newLeaveRequest.startDate}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={newLeaveRequest.endDate}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Leave"
                  multiline
                  rows={3}
                  value={newLeaveRequest.reason}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Details During Leave (Optional)"
                  value={newLeaveRequest.contactDetails}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, contactDetails: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleLeaveSubmit}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Attendance Regularization Dialog */}
      <Dialog
        open={regularizationDialogOpen}
        onClose={() => setRegularizationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Attendance Regularization</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Use this form to request correction of your attendance record.
            </Alert>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={newRegularization.date}
              onChange={(e) => setNewRegularization(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Check-In Time"
                  type="time"
                  value={newRegularization.checkInTime}
                  onChange={(e) => setNewRegularization(prev => ({ ...prev, checkInTime: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Check-Out Time"
                  type="time"
                  value={newRegularization.checkOutTime}
                  onChange={(e) => setNewRegularization(prev => ({ ...prev, checkOutTime: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Reason for Regularization"
              multiline
              rows={3}
              value={newRegularization.reason}
              onChange={(e) => setNewRegularization(prev => ({ ...prev, reason: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegularizationDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRegularizationSubmit}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Upload Dialog */}
      <Dialog
        open={documentDialogOpen}
        onClose={() => setDocumentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Document Name"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Document Type</InputLabel>
              <Select label="Document Type">
                <MenuItem value="identification">Identification</MenuItem>
                <MenuItem value="certificate">Certificate</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="tax">Tax Document</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Expiry Date (if applicable)"
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<Add />}
              sx={{ mb: 1 }}
            >
              Choose File
              <input type="file" hidden />
            </Button>
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, JPG, PNG (Max 5MB)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};