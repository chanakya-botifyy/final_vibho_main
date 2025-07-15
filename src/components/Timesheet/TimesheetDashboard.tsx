import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Paper,
  Divider,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  AccessTime,
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  CalendarMonth,
  BarChart,
  Person,
  Group,
  Business,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { format, startOfWeek, endOfWeek, addDays, isToday } from 'date-fns';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import { useAuthStore } from '../../store/useAuthStore';
import * as timesheetApi from '../../api/timesheet';
import WeeklyTimesheet from './WeeklyTimesheet';
import TimesheetApproval from './TimesheetApproval';
import TimesheetReports from './TimesheetReports';

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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const TimesheetDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    entries, 
    submissions, 
    currentWeek,
    fetchEntries,
    fetchTimesheetSummary,
    isLoading,
    error
  } = useTimesheetStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [summaryData, setSummaryData] = useState<any>(null);
  
  // Fetch entries and summary on mount
  useEffect(() => {
    if (user?.id) {
      const loadData = async () => {
        try {
          // Fetch entries for current week
          await fetchEntries(currentWeek.startDate, currentWeek.endDate, user.id);
          
          // Fetch summary for current month
          const startDate = new Date();
          startDate.setDate(1); // First day of current month
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);
          endDate.setDate(0); // Last day of current month
          
          const summary = await timesheetApi.getTimesheetSummary({
            startDate,
            endDate,
            employeeId: user.id
          });
          
          setSummaryData(summary);
        } catch (error) {
          console.error('Error loading timesheet data:', error);
        }
      };
      
      loadData();
    }
  }, [currentWeek, fetchEntries, fetchTimesheetSummary, user?.id]);
  
  // Calculate weekly stats
  const weeklyStats = {
    totalHours: entries.reduce((sum, entry) => sum + entry.hours, 0),
    billableHours: entries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.hours, 0),
    pendingSubmissions: submissions.filter(s => s.status === 'submitted').length,
    completedDays: new Set(entries.map(entry => format(new Date(entry.date), 'yyyy-MM-dd'))).size
  };
  
  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeek.startDate, i)
  );
  
  // Get entries for a specific day
  const getEntriesForDay = (date: Date) => {
    return entries.filter(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };
  
  // Calculate daily hours
  const dailyHours = weekDays.map(day => 
    getEntriesForDay(day).reduce((sum, entry) => sum + entry.hours, 0)
  );
  
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timesheet Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track, manage, and report on time spent on projects and tasks.
        </Typography>
      </Box>
      
      {/* Dashboard Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTime sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {weeklyStats.totalHours}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hours This Week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {weeklyStats.billableHours}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Billable Hours
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {weeklyStats.totalHours > 0 
                  ? `${((weeklyStats.billableHours / weeklyStats.totalHours) * 100).toFixed(1)}%`
                  : '0%'} of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {weeklyStats.pendingSubmissions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approvals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarMonth sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                {weeklyStats.completedDays}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Days Logged
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab label="My Timesheet" />
          <Tab label="Approvals" />
          <Tab label="Reports" />
        </Tabs>
      </Box>
      
      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <WeeklyTimesheet />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <TimesheetApproval />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <TimesheetReports />
      </TabPanel>
    </Box>
  );
};

export default TimesheetDashboard;