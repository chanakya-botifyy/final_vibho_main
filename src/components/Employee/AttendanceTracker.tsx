import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Divider,
  Badge,
  Switch,
  FormControlLabel,
  Tooltip,
  LinearProgress,
  List
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  PlayArrow,
  Stop,
  Edit,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
  Warning,
  Home,
  Business,
  MyLocation,
  History,
  CalendarMonth,
  Timer,
  Pause,
  FastForward,
  Refresh,
  Download,
  Upload,
  Visibility,
  Add
} from '@mui/icons-material';
import { format, differenceInHours, differenceInMinutes, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO, addDays, subDays, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';

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
      id={`attendance-tabpanel-${index}`}
      aria-labelledby={`attendance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const EmployeeAttendanceTracker: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    currentSession, 
    records, 
    checkIn, 
    checkOut, 
    startBreak, 
    endBreak,
    submitRegularization,
    fetchAttendanceRecords,
    isLoading,
    error
  } = useAttendanceStore();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [regularizationDialogOpen, setRegularizationDialogOpen] = useState(false);
  const [newRegularization, setNewRegularization] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    checkInTime: '',
    checkOutTime: '',
    reason: ''
  });
  const [workLocation, setWorkLocation] = useState<'office' | 'home' | 'client'>('office');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user?.id) {
      const startDate = startOfMonth(selectedDate);
      const endDate = endOfMonth(selectedDate);
      fetchAttendanceRecords(user.id, startDate, endDate);
    }
  }, [user, selectedDate, fetchAttendanceRecords]);

  // Mock attendance records
  const attendanceRecords = [
    {
      date: new Date('2024-02-20'),
      checkIn: new Date('2024-02-20T09:05:00'),
      checkOut: new Date('2024-02-20T18:10:00'),
      totalHours: 9.08,
      breakTime: 60,
      status: 'present',
      location: 'Office'
    },
    {
      date: new Date('2024-02-19'),
      checkIn: new Date('2024-02-19T08:55:00'),
      checkOut: new Date('2024-02-19T17:50:00'),
      totalHours: 8.92,
      breakTime: 60,
      status: 'present',
      location: 'Office'
    },
    {
      date: new Date('2024-02-16'),
      checkIn: new Date('2024-02-16T09:10:00'),
      checkOut: new Date('2024-02-16T18:05:00'),
      totalHours: 8.92,
      breakTime: 60,
      status: 'present',
      location: 'Home'
    },
    {
      date: new Date('2024-02-15'),
      checkIn: new Date('2024-02-15T09:30:00'),
      checkOut: new Date('2024-02-15T18:15:00'),
      totalHours: 8.75,
      breakTime: 60,
      status: 'late',
      location: 'Office'
    },
    {
      date: new Date('2024-02-14'),
      checkIn: new Date('2024-02-14T09:00:00'),
      checkOut: new Date('2024-02-14T18:00:00'),
      totalHours: 9.00,
      breakTime: 60,
      status: 'present',
      location: 'Office'
    }
  ];

  // Mock regularization requests
  const regularizationRequests = [
    {
      id: '1',
      date: new Date('2024-02-13'),
      requestedCheckIn: '09:00',
      requestedCheckOut: '18:00',
      reason: 'Forgot to check in due to system issues',
      status: 'approved',
      submittedDate: new Date('2024-02-14'),
      approvedBy: 'Michael Chen',
      approvedDate: new Date('2024-02-15')
    },
    {
      id: '2',
      date: new Date('2024-02-08'),
      requestedCheckIn: '09:15',
      requestedCheckOut: '18:30',
      reason: 'Internet connectivity issues while working from home',
      status: 'pending',
      submittedDate: new Date('2024-02-09')
    }
  ];

  // Calculate attendance statistics
  const attendanceStats = {
    totalDays: attendanceRecords.length,
    presentDays: attendanceRecords.filter(r => r.status === 'present').length,
    lateDays: attendanceRecords.filter(r => r.status === 'late').length,
    absentDays: 0,
    totalHours: attendanceRecords.reduce((sum, r) => sum + r.totalHours, 0),
    averageHours: attendanceRecords.length > 0 
      ? attendanceRecords.reduce((sum, r) => sum + r.totalHours, 0) / attendanceRecords.length 
      : 0,
    attendanceRate: attendanceRecords.length > 0 
      ? (attendanceRecords.filter(r => r.status !== 'absent').length / attendanceRecords.length) * 100 
      : 0
  };

  const handleCheckIn = async () => {
    try {
      // In a real app, we would get the actual location
      const location = { latitude: 40.7128, longitude: -74.0060 };
      await checkIn(location, workLocation);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'error';
      case 'holiday': return 'info';
      case 'weekend': return 'default';
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle />;
      case 'late': return <Schedule />;
      case 'absent': return <Cancel />;
      case 'holiday': return <EventAvailable />;
      case 'weekend': return <CalendarMonth />;
      case 'approved': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'rejected': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'Office': return <Business />;
      case 'Home': return <Home />;
      case 'Client': return <LocationOn />;
      default: return <Business />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your attendance, view history, and manage regularization requests.
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
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
                <FormControl component="fieldset">
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Work Location
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant={workLocation === 'office' ? 'contained' : 'outlined'} 
                      startIcon={<Business />}
                      onClick={() => setWorkLocation('office')}
                      size="small"
                    >
                      Office
                    </Button>
                    <Button 
                      variant={workLocation === 'home' ? 'contained' : 'outlined'} 
                      startIcon={<Home />}
                      onClick={() => setWorkLocation('home')}
                      size="small"
                    >
                      Home
                    </Button>
                    <Button 
                      variant={workLocation === 'client' ? 'contained' : 'outlined'} 
                      startIcon={<LocationOn />}
                      onClick={() => setWorkLocation('client')}
                      size="small"
                    >
                      Client
                    </Button>
                  </Box>
                </FormControl>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
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
                    startIcon={<Pause />}
                    onClick={startBreak}
                  >
                    Start Break
                  </Button>
                )}
                
                {currentSession.isCheckedIn && currentSession.isOnBreak && (
                  <Button
                    variant="outlined"
                    startIcon={<FastForward />}
                    onClick={endBreak}
                  >
                    End Break
                  </Button>
                )}
              </Box>
              
              {currentSession.isCheckedIn && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Chip
                    icon={currentSession.isOnBreak ? <Pause /> : <AccessTime />}
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

        {/* Today's Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Today's Summary" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <AccessTime sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" color="primary.main">
                      {currentSession.isCheckedIn 
                        ? format(currentSession.checkInTime || new Date(), 'HH:mm') 
                        : '--:--'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check In
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Timer sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6" color="warning.main">
                      {currentSession.isCheckedIn 
                        ? `${Math.floor(differenceInHours(new Date(), currentSession.checkInTime || new Date()))}h ${differenceInMinutes(new Date(), currentSession.checkInTime || new Date()) % 60}m` 
                        : '0h 0m'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Pause sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h6" color="info.main">
                      {`${Math.floor(currentSession.totalBreakTime / 60)}h ${currentSession.totalBreakTime % 60}m`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Break Time
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <LocationOn sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" color="success.main">
                      {workLocation.charAt(0).toUpperCase() + workLocation.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Weekly Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Attendance Rate</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {attendanceStats.attendanceRate.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={attendanceStats.attendanceRate} 
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Avg. Hours/Day</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {attendanceStats.averageHours.toFixed(1)}h
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(attendanceStats.averageHours / 10) * 100} 
                      color="primary"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Punctuality</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {((attendanceStats.presentDays / attendanceStats.totalDays) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(attendanceStats.presentDays / attendanceStats.totalDays) * 100} 
                      color="info"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance History Tabs */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Attendance History" />
                <Tab label="Regularization Requests" />
                <Tab label="Monthly Report" />
              </Tabs>
            </Box>

            {/* Attendance History Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Attendance Records</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                  >
                    Export
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CalendarMonth />}
                  >
                    Change Month
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Check In</TableCell>
                      <TableCell>Check Out</TableCell>
                      <TableCell>Total Hours</TableCell>
                      <TableCell>Break Time</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceRecords.map((record, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={isToday(record.date) ? 'bold' : 'regular'}>
                            {format(record.date, 'EEE, MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(record.checkIn, 'HH:mm')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(record.checkOut, 'HH:mm')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {record.totalHours.toFixed(2)} hrs
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {record.breakTime} mins
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getLocationIcon(record.location)}
                            <Typography variant="body2">
                              {record.location}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(record.status)}
                            label={record.status.toUpperCase()}
                            color={getStatusColor(record.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Regularization Requests Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Regularization Requests</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setRegularizationDialogOpen(true)}
                >
                  New Request
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Requested Times</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Submitted On</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regularizationRequests.map((request, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {format(request.date, 'EEE, MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {request.requestedCheckIn} - {request.requestedCheckOut}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {request.reason}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(request.submittedDate, 'MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(request.status)}
                            label={request.status.toUpperCase()}
                            color={getStatusColor(request.status)}
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
                            {request.status === 'pending' && (
                              <Tooltip title="Cancel Request">
                                <IconButton size="small" color="error">
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            {/* Monthly Report Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Monthly Attendance Report</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                  >
                    Export Report
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CalendarMonth />}
                  >
                    Change Month
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card variant="outlined">
                    <CardHeader title="Monthly Statistics" />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="primary.main">
                              {attendanceStats.totalDays}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Working Days
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main">
                              {attendanceStats.presentDays}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Present Days
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main">
                              {attendanceStats.lateDays}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Late Days
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main">
                              {attendanceStats.absentDays}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Absent Days
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Working Hours
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Total Hours Worked</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {attendanceStats.totalHours.toFixed(2)} hours
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Average Hours/Day</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {attendanceStats.averageHours.toFixed(2)} hours
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Expected Hours</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {(attendanceStats.totalDays * 8).toFixed(2)} hours
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Overtime</Typography>
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {Math.max(0, attendanceStats.totalHours - (attendanceStats.totalDays * 8)).toFixed(2)} hours
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardHeader title="Attendance Insights" />
                    <CardContent>
                      <List>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Attendance Rate</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {attendanceStats.attendanceRate.toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={attendanceStats.attendanceRate} 
                            color="success"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Punctuality Rate</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {((attendanceStats.presentDays / attendanceStats.totalDays) * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(attendanceStats.presentDays / attendanceStats.totalDays) * 100} 
                            color="primary"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Work Hour Compliance</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {Math.min(100, (attendanceStats.totalHours / (attendanceStats.totalDays * 8)) * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, (attendanceStats.totalHours / (attendanceStats.totalDays * 8)) * 100)} 
                            color="info"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

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
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              fullWidth
            >
              Attach Supporting Document (Optional)
              <input type="file" hidden />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegularizationDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRegularizationSubmit}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};