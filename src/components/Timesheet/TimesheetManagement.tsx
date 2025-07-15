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
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Paper,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
  Schedule,
  PlayArrow,
  Stop,
  Pause,
  Save,
  Business,
  Work,
  Assignment,
  CalendarMonth,
  Timer,
  Download,
  Upload,
  BarChart,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isToday, isSameDay } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';

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
      id={`timesheet-tabpanel-${index}`}
      aria-labelledby={`timesheet-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface TimesheetEntry {
  id: string;
  date: Date;
  project: string;
  task: string;
  description: string;
  hours: number;
  billable: boolean;
  category: 'development' | 'design' | 'meeting' | 'documentation' | 'testing' | 'other';
}

interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  weekStartDate: Date;
  weekEndDate: Date;
  entries: TimesheetEntry[];
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
  comments?: string;
}

interface Project {
  id: string;
  name: string;
  code: string;
  client: string;
  billable: boolean;
}

export const TimesheetManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { can } = usePermission();
  const [tabValue, setTabValue] = useState(0);
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [timesheetDialogOpen, setTimesheetDialogOpen] = useState(false);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<TimesheetEntry | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingProject, setTrackingProject] = useState<string>('');
  const [trackingTask, setTrackingTask] = useState<string>('');
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const [trackingPausedTime, setTrackingPausedTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [newEntry, setNewEntry] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    project: '',
    task: '',
    description: '',
    hours: '',
    billable: true,
    category: 'development' as const
  });

  // Mock projects
  const projects: Project[] = [
    { id: '1', name: 'Project Alpha', code: 'PA001', client: 'ABC Corp', billable: true },
    { id: '2', name: 'Project Beta', code: 'PB002', client: 'XYZ Inc', billable: true },
    { id: '3', name: 'Internal Training', code: 'IT003', client: 'Internal', billable: false },
    { id: '4', name: 'Project Gamma', code: 'PG004', client: 'DEF Ltd', billable: true },
    { id: '5', name: 'Research & Development', code: 'RD005', client: 'Internal', billable: false }
  ];

  // Mock timesheets
  const timesheets: Timesheet[] = [
    {
      id: '1',
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      weekStartDate: subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1),
      weekEndDate: subWeeks(endOfWeek(new Date(), { weekStartsOn: 1 }), 1),
      entries: [
        {
          id: '1',
          date: subWeeks(new Date(), 1),
          project: 'Project Alpha',
          task: 'Frontend Development',
          description: 'Implemented new dashboard components',
          hours: 8,
          billable: true,
          category: 'development'
        },
        {
          id: '2',
          date: subWeeks(addDays(new Date(), 1), 1),
          project: 'Project Alpha',
          task: 'Frontend Development',
          description: 'Fixed responsive design issues',
          hours: 6,
          billable: true,
          category: 'development'
        },
        {
          id: '3',
          date: subWeeks(addDays(new Date(), 1), 1),
          project: 'Internal Training',
          task: 'React Advanced Course',
          description: 'Attended training session',
          hours: 2,
          billable: false,
          category: 'other'
        }
      ],
      totalHours: 16,
      billableHours: 14,
      nonBillableHours: 2,
      status: 'approved',
      submittedDate: subWeeks(new Date(), 1),
      approvedBy: 'Michael Chen',
      approvedDate: subWeeks(new Date(), 1)
    },
    {
      id: '2',
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      weekStartDate: subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 2),
      weekEndDate: subWeeks(endOfWeek(new Date(), { weekStartsOn: 1 }), 2),
      entries: [
        {
          id: '4',
          date: subWeeks(new Date(), 2),
          project: 'Project Beta',
          task: 'API Integration',
          description: 'Integrated payment gateway API',
          hours: 8,
          billable: true,
          category: 'development'
        },
        {
          id: '5',
          date: subWeeks(addDays(new Date(), 1), 2),
          project: 'Project Beta',
          task: 'Testing',
          description: 'Unit testing for API integration',
          hours: 4,
          billable: true,
          category: 'testing'
        },
        {
          id: '6',
          date: subWeeks(addDays(new Date(), 1), 2),
          project: 'Project Beta',
          task: 'Documentation',
          description: 'API documentation',
          hours: 4,
          billable: true,
          category: 'documentation'
        },
        {
          id: '7',
          date: subWeeks(addDays(new Date(), 2), 2),
          project: 'Project Beta',
          task: 'Meeting',
          description: 'Client progress meeting',
          hours: 2,
          billable: true,
          category: 'meeting'
        }
      ],
      totalHours: 18,
      billableHours: 18,
      nonBillableHours: 0,
      status: 'approved',
      submittedDate: subWeeks(new Date(), 2),
      approvedBy: 'Michael Chen',
      approvedDate: subWeeks(new Date(), 2)
    },
    {
      id: '3',
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      weekStartDate: currentWeek,
      weekEndDate: endOfWeek(currentWeek, { weekStartsOn: 1 }),
      entries: [
        {
          id: '8',
          date: addDays(currentWeek, 0),
          project: 'Project Gamma',
          task: 'UI Design',
          description: 'Created wireframes for new features',
          hours: 8,
          billable: true,
          category: 'design'
        },
        {
          id: '9',
          date: addDays(currentWeek, 1),
          project: 'Project Gamma',
          task: 'UI Implementation',
          description: 'Implemented new UI components',
          hours: 8,
          billable: true,
          category: 'development'
        }
      ],
      totalHours: 16,
      billableHours: 16,
      nonBillableHours: 0,
      status: 'draft'
    }
  ];

  // Update current time for timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const getCurrentWeekTimesheet = () => {
    return timesheets.find(t => 
      isSameDay(t.weekStartDate, currentWeek)
    ) || {
      id: 'new',
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      weekStartDate: currentWeek,
      weekEndDate: endOfWeek(currentWeek, { weekStartsOn: 1 }),
      entries: [],
      totalHours: 0,
      billableHours: 0,
      nonBillableHours: 0,
      status: 'draft' as const
    };
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prevWeek => subWeeks(prevWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1));
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    setTrackingStartTime(new Date());
    setTrackingPausedTime(0);
    setIsPaused(false);
  };

  const handlePauseTracking = () => {
    setIsPaused(true);
    setPauseStartTime(new Date());
  };

  const handleResumeTracking = () => {
    setIsPaused(false);
    if (pauseStartTime) {
      const pauseDuration = (new Date().getTime() - pauseStartTime.getTime()) / 1000 / 60;
      setTrackingPausedTime(prev => prev + pauseDuration);
    }
    setPauseStartTime(null);
  };

  const handleStopTracking = () => {
    if (!trackingStartTime) return;

    const now = new Date();
    let totalMinutes = (now.getTime() - trackingStartTime.getTime()) / 1000 / 60;
    
    // Subtract paused time
    totalMinutes -= trackingPausedTime;
    
    // Convert to hours (rounded to 2 decimal places)
    const hours = Math.round(totalMinutes / 60 * 100) / 100;

    // Create new entry
    const newEntryData = {
      date: format(now, 'yyyy-MM-dd'),
      project: trackingProject,
      task: trackingTask,
      description: `Time tracked: ${format(trackingStartTime, 'HH:mm')} - ${format(now, 'HH:mm')}`,
      hours: hours.toString(),
      billable: projects.find(p => p.name === trackingProject)?.billable || false,
      category: 'development' as const
    };

    setNewEntry(newEntryData);
    setEntryDialogOpen(true);
    
    // Reset tracking state
    setIsTracking(false);
    setTrackingStartTime(null);
    setTrackingPausedTime(0);
    setIsPaused(false);
    setPauseStartTime(null);
  };

  const handleAddEntry = () => {
    // Reset form
    setNewEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      project: '',
      task: '',
      description: '',
      hours: '',
      billable: true,
      category: 'development'
    });
    setSelectedEntry(null);
    setEntryDialogOpen(true);
  };

  const handleEditEntry = (entry: TimesheetEntry) => {
    setSelectedEntry(entry);
    setNewEntry({
      date: format(entry.date, 'yyyy-MM-dd'),
      project: entry.project,
      task: entry.task,
      description: entry.description,
      hours: entry.hours.toString(),
      billable: entry.billable,
      category: entry.category
    });
    setEntryDialogOpen(true);
  };

  const handleSaveEntry = () => {
    console.log('Saving entry:', newEntry);
    setEntryDialogOpen(false);
  };

  const handleSubmitTimesheet = (timesheet: Timesheet) => {
    console.log('Submitting timesheet:', timesheet);
  };

  const handleApproval = (timesheet: Timesheet, action: 'approve' | 'reject') => {
    setSelectedTimesheet(timesheet);
    setApprovalAction(action);
    setApprovalDialogOpen(true);
  };

  const submitApproval = () => {
    console.log(`${approvalAction} timesheet:`, selectedTimesheet, 'Notes:', approvalNotes);
    setApprovalDialogOpen(false);
    setApprovalNotes('');
    setSelectedTimesheet(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'submitted': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit />;
      case 'submitted': return <Schedule />;
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'primary';
      case 'design': return 'secondary';
      case 'meeting': return 'info';
      case 'documentation': return 'warning';
      case 'testing': return 'success';
      default: return 'default';
    }
  };

  const calculateTrackedTime = () => {
    if (!trackingStartTime) return '00:00:00';
    
    let totalSeconds = Math.floor((currentTime.getTime() - trackingStartTime.getTime()) / 1000);
    
    // Subtract paused time
    totalSeconds -= Math.floor(trackingPausedTime * 60);
    
    if (isPaused && pauseStartTime) {
      totalSeconds -= Math.floor((currentTime.getTime() - pauseStartTime.getTime()) / 1000);
    }
    
    // Ensure we don't go negative
    totalSeconds = Math.max(0, totalSeconds);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timesheet Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your time across projects with detailed reporting and analytics.
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="My Timesheet" />
            <Tab label="Time Tracker" />
            <Tab label="History" />
            <PermissionGate permission={[PERMISSIONS.REPORTS_TEAM, PERMISSIONS.REPORTS_ALL]}>
              <Tab label="Reports" />
            </PermissionGate>
            <PermissionGate permission={[PERMISSIONS.ATTENDANCE_APPROVE]}>
              <Tab label="Approvals" />
            </PermissionGate>
          </Tabs>
        </Box>

        {/* My Timesheet Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" onClick={handlePreviousWeek}>Previous Week</Button>
              <Typography variant="h6">
                Week of {format(currentWeek, 'MMM dd')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
              </Typography>
              <Button variant="outlined" onClick={handleNextWeek}>Next Week</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddEntry}
              >
                Add Entry
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSubmitTimesheet(getCurrentWeekTimesheet())}
                disabled={getCurrentWeekTimesheet().status !== 'draft'}
              >
                Submit Timesheet
              </Button>
            </Box>
          </Box>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Week Summary</Typography>
                <Chip
                  icon={getStatusIcon(getCurrentWeekTimesheet().status)}
                  label={getCurrentWeekTimesheet().status.toUpperCase()}
                  color={getStatusColor(getCurrentWeekTimesheet().status)}
                  variant="outlined"
                />
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {getCurrentWeekTimesheet().totalHours}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Hours
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {getCurrentWeekTimesheet().billableHours}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Billable Hours
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {getCurrentWeekTimesheet().nonBillableHours}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Non-Billable Hours
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {getCurrentWeekTimesheet().entries.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Entries
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Billable</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCurrentWeekTimesheet().entries.map((entry) => (
                  <TableRow key={entry.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {format(entry.date, 'EEE, MMM dd')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {entry.project}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {entry.task}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {entry.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entry.category}
                        color={getCategoryColor(entry.category)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {entry.hours}h
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entry.billable ? 'Billable' : 'Non-Billable'}
                        color={entry.billable ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditEntry(entry)}
                            disabled={getCurrentWeekTimesheet().status !== 'draft'}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={getCurrentWeekTimesheet().status !== 'draft'}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {getCurrentWeekTimesheet().entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        No entries for this week. Click "Add Entry" to add time entries.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Time Tracker Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Time Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Track your time in real-time for accurate project reporting.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h3" color="primary.main">
                      {isTracking ? calculateTrackedTime() : '00:00:00'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isTracking ? (isPaused ? 'Timer Paused' : 'Timer Running') : 'Timer Stopped'}
                    </Typography>
                  </Box>

                  {!isTracking ? (
                    <Box>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Project</InputLabel>
                        <Select
                          value={trackingProject}
                          onChange={(e) => setTrackingProject(e.target.value)}
                          label="Project"
                        >
                          {projects.map((project) => (
                            <MenuItem key={project.id} value={project.name}>
                              {project.name} ({project.client})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Task"
                        value={trackingTask}
                        onChange={(e) => setTrackingTask(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayArrow />}
                        onClick={handleStartTracking}
                        disabled={!trackingProject || !trackingTask}
                      >
                        Start Tracking
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Project:</Typography>
                        <Typography variant="body2" fontWeight="medium">{trackingProject}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Task:</Typography>
                        <Typography variant="body2" fontWeight="medium">{trackingTask}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Started at:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {trackingStartTime ? format(trackingStartTime, 'HH:mm:ss') : ''}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        {isPaused ? (
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<PlayArrow />}
                            onClick={handleResumeTracking}
                          >
                            Resume
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<Pause />}
                            onClick={handlePauseTracking}
                          >
                            Pause
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="error"
                          fullWidth
                          startIcon={<Stop />}
                          onClick={handleStopTracking}
                        >
                          Stop & Save
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Today's Entries" />
                <CardContent>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Project</TableCell>
                          <TableCell>Task</TableCell>
                          <TableCell>Hours</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getCurrentWeekTimesheet().entries
                          .filter(entry => isToday(entry.date))
                          .map((entry) => (
                            <TableRow key={entry.id} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {entry.project}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {entry.task}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {entry.hours}h
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditEntry(entry)}
                                >
                                  <Edit />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        {getCurrentWeekTimesheet().entries.filter(entry => isToday(entry.date)).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                No entries for today
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardHeader title="Weekly Summary" />
                <CardContent>
                  <Grid container spacing={2}>
                    {weekDays.map((day, index) => {
                      const dayEntries = getCurrentWeekTimesheet().entries.filter(entry => 
                        isSameDay(entry.date, day)
                      );
                      const totalHours = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
                      
                      return (
                        <Grid item xs={12} sm={6} md={3} lg={12/7} key={index}>
                          <Paper 
                            sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              bgcolor: isToday(day) ? 'primary.50' : 'background.paper',
                              border: isToday(day) ? '1px solid' : '1px solid',
                              borderColor: isToday(day) ? 'primary.main' : 'divider'
                            }}
                          >
                            <Typography 
                              variant="body1" 
                              fontWeight={isToday(day) ? 'bold' : 'medium'}
                              color={isToday(day) ? 'primary.main' : 'text.primary'}
                            >
                              {format(day, 'EEE')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {format(day, 'MMM dd')}
                            </Typography>
                            <Typography variant="h5" sx={{ my: 1 }}>
                              {totalHours}h
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setNewEntry(prev => ({
                                  ...prev,
                                  date: format(day, 'yyyy-MM-dd')
                                }));
                                handleAddEntry();
                              }}
                            >
                              Add
                            </Button>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* History Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Timesheet History</Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export History
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Week</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Billable Hours</TableCell>
                  <TableCell>Projects</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheets.map((timesheet) => (
                  <TableRow key={timesheet.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {format(timesheet.weekStartDate, 'MMM dd')} - {format(timesheet.weekEndDate, 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {timesheet.totalHours}h
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {timesheet.billableHours}h ({Math.round((timesheet.billableHours / timesheet.totalHours) * 100)}%)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {Array.from(new Set(timesheet.entries.map(e => e.project))).map((project, index) => (
                        <Chip
                          key={index}
                          label={project}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {timesheet.submittedDate ? format(timesheet.submittedDate, 'MMM dd, yyyy') : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(timesheet.status)}
                        label={timesheet.status.toUpperCase()}
                        color={getStatusColor(timesheet.status)}
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
                              setSelectedTimesheet(timesheet);
                              setTimesheetDialogOpen(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton size="small">
                            <Download />
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

        {/* Reports Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Timesheet Reports</Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export Reports
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Hours by Project" />
                <CardContent>
                  <Box sx={{ height: 300, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart sx={{ fontSize: 200, color: 'action.disabled' }} />
                    </Box>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      {projects.map((project, index) => {
                        const projectHours = timesheets.flatMap(t => t.entries)
                          .filter(e => e.project === project.name)
                          .reduce((sum, e) => sum + e.hours, 0);
                        
                        const totalHours = timesheets.reduce((sum, t) => sum + t.totalHours, 0);
                        const percentage = totalHours > 0 ? (projectHours / totalHours) * 100 : 0;
                        
                        return (
                          <Box key={project.id} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">{project.name}</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {projectHours}h ({percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              color={index % 5 === 0 ? 'primary' : index % 5 === 1 ? 'secondary' : index % 5 === 2 ? 'success' : index % 5 === 3 ? 'warning' : 'info'}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Hours by Category" />
                <CardContent>
                  <Box sx={{ height: 300, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BarChart sx={{ fontSize: 200, color: 'action.disabled' }} />
                    </Box>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      {['development', 'design', 'meeting', 'documentation', 'testing', 'other'].map((category, index) => {
                        const categoryHours = timesheets.flatMap(t => t.entries)
                          .filter(e => e.category === category)
                          .reduce((sum, e) => sum + e.hours, 0);
                        
                        const totalHours = timesheets.reduce((sum, t) => sum + t.totalHours, 0);
                        const percentage = totalHours > 0 ? (categoryHours / totalHours) * 100 : 0;
                        
                        return (
                          <Box key={category} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{category}</Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {categoryHours}h ({percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              color={getCategoryColor(category)}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardHeader title="Weekly Trends" />
                <CardContent>
                  <Box sx={{ height: 300, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp sx={{ fontSize: 200, color: 'action.disabled' }} />
                    </Box>
                    <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Total Hours Trend</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp color="success" fontSize="small" />
                            <Typography variant="body2" color="success.main">+5.2%</Typography>
                          </Box>
                        </Box>
                        <LinearProgress variant="determinate" value={75} color="primary" sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Billable Hours Trend</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp color="success" fontSize="small" />
                            <Typography variant="body2" color="success.main">+8.7%</Typography>
                          </Box>
                        </Box>
                        <LinearProgress variant="determinate" value={85} color="success" sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Productivity Score</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingDown color="error" fontSize="small" />
                            <Typography variant="body2" color="error.main">-2.1%</Typography>
                          </Box>
                        </Box>
                        <LinearProgress variant="determinate" value={68} color="warning" sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Approvals Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Pending Approvals</Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export Report
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Week</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Billable Hours</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>JS</Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        John Smith
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Feb 12 - Feb 18, 2024
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      40h
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      36h (90%)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Feb 19, 2024
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<Schedule />}
                      label="SUBMITTED"
                      color="info"
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
                        onClick={() => handleApproval({
                          id: 'mock-1',
                          employeeId: 'mock-employee-1',
                          employeeName: 'John Smith',
                          weekStartDate: new Date('2024-02-12'),
                          weekEndDate: new Date('2024-02-18'),
                          entries: [],
                          totalHours: 40,
                          billableHours: 36,
                          nonBillableHours: 4,
                          status: 'submitted',
                          submittedDate: new Date('2024-02-19')
                        }, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleApproval({
                          id: 'mock-1',
                          employeeId: 'mock-employee-1',
                          employeeName: 'John Smith',
                          weekStartDate: new Date('2024-02-12'),
                          weekEndDate: new Date('2024-02-18'),
                          entries: [],
                          totalHours: 40,
                          billableHours: 36,
                          nonBillableHours: 4,
                          status: 'submitted',
                          submittedDate: new Date('2024-02-19')
                        }, 'reject')}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>SD</Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        Sarah Davis
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Feb 12 - Feb 18, 2024
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      38h
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      32h (84%)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Feb 18, 2024
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<Schedule />}
                      label="SUBMITTED"
                      color="info"
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
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* Time Entry Dialog */}
      <Dialog
        open={entryDialogOpen}
        onClose={() => setEntryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEntry ? 'Edit Time Entry' : 'Add Time Entry'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={newEntry.project}
                    onChange={(e) => setNewEntry(prev => ({ 
                      ...prev, 
                      project: e.target.value,
                      billable: projects.find(p => p.name === e.target.value)?.billable || false
                    }))}
                    label="Project"
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.name}>
                        {project.name} ({project.client})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Task"
                  value={newEntry.task}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, task: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hours"
                  type="number"
                  inputProps={{ step: 0.25, min: 0.25, max: 24 }}
                  value={newEntry.hours}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, hours: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value as any }))}
                    label="Category"
                  >
                    <MenuItem value="development">Development</MenuItem>
                    <MenuItem value="design">Design</MenuItem>
                    <MenuItem value="meeting">Meeting</MenuItem>
                    <MenuItem value="documentation">Documentation</MenuItem>
                    <MenuItem value="testing">Testing</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Billable</InputLabel>
                  <Select
                    value={newEntry.billable ? 'yes' : 'no'}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, billable: e.target.value === 'yes' }))}
                    label="Billable"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newEntry.description}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEntryDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEntry}>
            {selectedEntry ? 'Update Entry' : 'Add Entry'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Timesheet Details Dialog */}
      <Dialog
        open={timesheetDialogOpen}
        onClose={() => setTimesheetDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedTimesheet && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Timesheet: {format(selectedTimesheet.weekStartDate, 'MMM dd')} - {format(selectedTimesheet.weekEndDate, 'MMM dd, yyyy')}
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedTimesheet.status)}
                  label={selectedTimesheet.status.toUpperCase()}
                  color={getStatusColor(selectedTimesheet.status)}
                  variant="outlined"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main">
                        {selectedTimesheet.totalHours}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Hours
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {selectedTimesheet.billableHours}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Billable Hours
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        {selectedTimesheet.nonBillableHours}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Non-Billable Hours
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Time Entries</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Task</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Hours</TableCell>
                      <TableCell>Billable</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTimesheet.entries.map((entry) => (
                      <TableRow key={entry.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {format(entry.date, 'EEE, MMM dd')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {entry.project}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {entry.task}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {entry.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.category}
                            color={getCategoryColor(entry.category)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {entry.hours}h
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.billable ? 'Billable' : 'Non-Billable'}
                            color={entry.billable ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedTimesheet.status !== 'draft' && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Submission Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Submitted Date:</Typography>
                      <Typography variant="body1">
                        {selectedTimesheet.submittedDate ? format(selectedTimesheet.submittedDate, 'MMM dd, yyyy HH:mm') : '-'}
                      </Typography>
                    </Grid>
                    {selectedTimesheet.status === 'approved' && (
                      <>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">Approved By:</Typography>
                          <Typography variant="body1">
                            {selectedTimesheet.approvedBy || '-'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">Approved Date:</Typography>
                          <Typography variant="body1">
                            {selectedTimesheet.approvedDate ? format(selectedTimesheet.approvedDate, 'MMM dd, yyyy HH:mm') : '-'}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    {selectedTimesheet.status === 'rejected' && (
                      <>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary">Rejected By:</Typography>
                          <Typography variant="body1">
                            {selectedTimesheet.rejectedBy || '-'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Rejection Reason:</Typography>
                          <Typography variant="body1">
                            {selectedTimesheet.rejectionReason || '-'}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTimesheetDialogOpen(false)}>Close</Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Download PDF
              </Button>
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
        <DialogTitle>
          {approvalAction === 'approve' ? 'Approve Timesheet' : 'Reject Timesheet'}
        </DialogTitle>
        <DialogContent>
          {selectedTimesheet && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Employee:</strong> {selectedTimesheet.employeeName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Week:</strong> {format(selectedTimesheet.weekStartDate, 'MMM dd')} - {format(selectedTimesheet.weekEndDate, 'MMM dd, yyyy')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Total Hours:</strong> {selectedTimesheet.totalHours}h ({selectedTimesheet.billableHours}h billable)
              </Typography>
              
              <TextField
                fullWidth
                label={approvalAction === 'approve' ? 'Approval Comments (Optional)' : 'Rejection Reason'}
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

export default TimesheetManagement;