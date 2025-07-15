import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import {
  BarChart,
  PieChart,
  Timeline,
  TrendingUp,
  TrendingDown,
  Download,
  Refresh,
  AccessTime,
  Analytics,
  CalendarToday,
  FilterList,
  Work,
  Person,
  AttachMoney
} from '@mui/icons-material';
import { format, subDays, subMonths } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import * as timesheetApi from '../../api/timesheet';

const TimesheetAnalytics: React.FC = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Analytics data (simulated)
  const [analyticsData, setAnalyticsData] = useState({
    totalHours: 12458,
    billableHours: 9845,
    nonBillableHours: 2613,
    billablePercentage: 79,
    averageHoursPerDay: 7.8,
    averageUtilization: 85.2, // percentage
    topProject: 'Project Alpha',
    topEmployee: 'John Smith'
  });
  
  // Project breakdown (simulated)
  const [projectBreakdown, setProjectBreakdown] = useState([
    { project: 'Project Alpha', hours: 4256, billableHours: 3845, percentage: 34.2 },
    { project: 'Project Beta', hours: 3124, billableHours: 2987, percentage: 25.1 },
    { project: 'Project Gamma', hours: 2567, billableHours: 1876, percentage: 20.6 },
    { project: 'Project Delta', hours: 1876, billableHours: 1023, percentage: 15.1 },
    { project: 'Internal', hours: 635, billableHours: 114, percentage: 5.1 }
  ]);
  
  // Employee breakdown (simulated)
  const [employeeBreakdown, setEmployeeBreakdown] = useState([
    { employee: 'John Smith', hours: 168, utilization: 95.5, billablePercentage: 92.3 },
    { employee: 'Sarah Johnson', hours: 165, utilization: 93.8, billablePercentage: 89.7 },
    { employee: 'Michael Chen', hours: 172, utilization: 97.7, billablePercentage: 94.2 },
    { employee: 'Emily Rodriguez', hours: 160, utilization: 90.9, billablePercentage: 87.5 },
    { employee: 'David Wilson', hours: 155, utilization: 88.1, billablePercentage: 82.6 }
  ]);
  
  // Daily hours data (simulated)
  const [dailyHours, setDailyHours] = useState([
    { date: '2024-05-01', hours: 145, billableHours: 123 },
    { date: '2024-05-02', hours: 156, billableHours: 134 },
    { date: '2024-05-03', hours: 142, billableHours: 118 },
    { date: '2024-05-04', hours: 98, billableHours: 76 },
    { date: '2024-05-05', hours: 87, billableHours: 65 },
    { date: '2024-05-06', hours: 167, billableHours: 145 },
    { date: '2024-05-07', hours: 178, billableHours: 156 },
    { date: '2024-05-08', hours: 165, billableHours: 143 },
    { date: '2024-05-09', hours: 159, billableHours: 138 },
    { date: '2024-05-10', hours: 148, billableHours: 126 },
    { date: '2024-05-11', hours: 102, billableHours: 87 },
    { date: '2024-05-12', hours: 95, billableHours: 78 },
    { date: '2024-05-13', hours: 172, billableHours: 154 },
    { date: '2024-05-14', hours: 168, billableHours: 149 },
    { date: '2024-05-15', hours: 175, billableHours: 158 },
    { date: '2024-05-16', hours: 169, billableHours: 147 },
    { date: '2024-05-17', hours: 156, billableHours: 134 },
    { date: '2024-05-18', hours: 112, billableHours: 98 },
    { date: '2024-05-19', hours: 89, billableHours: 76 },
    { date: '2024-05-20', hours: 178, billableHours: 165 },
    { date: '2024-05-21', hours: 182, billableHours: 172 },
    { date: '2024-05-22', hours: 175, billableHours: 163 },
    { date: '2024-05-23', hours: 168, billableHours: 154 },
    { date: '2024-05-24', hours: 159, billableHours: 142 },
    { date: '2024-05-25', hours: 108, billableHours: 92 },
    { date: '2024-05-26', hours: 95, billableHours: 82 },
    { date: '2024-05-27', hours: 172, billableHours: 158 },
    { date: '2024-05-28', hours: 178, billableHours: 165 },
    { date: '2024-05-29', hours: 169, billableHours: 156 },
    { date: '2024-05-30', hours: 162, billableHours: 148 },
    { date: '2024-05-31', hours: 156, billableHours: 142 }
  ]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Update analytics data with slight variations
      setAnalyticsData(prev => ({
        ...prev,
        totalHours: prev.totalHours + Math.floor(Math.random() * 100),
        billableHours: prev.billableHours + Math.floor(Math.random() * 80),
        nonBillableHours: prev.nonBillableHours + Math.floor(Math.random() * 20),
        billablePercentage: Math.min(100, prev.billablePercentage + (Math.random() * 2 - 1)),
        averageHoursPerDay: Math.min(10, prev.averageHoursPerDay + (Math.random() * 0.4 - 0.2)),
        averageUtilization: Math.min(100, prev.averageUtilization + (Math.random() * 2 - 1))
      }));
    }, 1500);
  };
  
  const handleApplyFilters = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // In a real app, this would fetch filtered data from the API
      // For now, just show a success message
      alert('Filters applied successfully');
    }, 1000);
  };
  
  const handleExportData = () => {
    alert('Data export functionality would be implemented here');
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timesheet Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze timesheet data to gain insights into productivity and resource allocation.
        </Typography>
      </Box>
      
      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Analytics Filters" 
          avatar={<FilterList color="primary" />}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  label="Employee"
                >
                  <MenuItem value="all">All Employees</MenuItem>
                  {employees.map(employee => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
                  <MenuItem value="hr">Human Resources</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  onClick={() => setDateRange({
                    startDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
                    endDate: format(new Date(), 'yyyy-MM-dd')
                  })}
                >
                  Last 30 Days
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  onClick={() => setDateRange({
                    startDate: format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
                    endDate: format(new Date(), 'yyyy-MM-dd')
                  })}
                >
                  Last 90 Days
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FilterList />}
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccessTime sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {analyticsData.totalHours.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Hours
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {analyticsData.averageHoursPerDay} hours/day average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {analyticsData.billableHours.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Billable Hours
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {analyticsData.billablePercentage}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                {analyticsData.averageUtilization}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Utilization
              </Typography>
              <Typography variant="caption" color="text.secondary">
                across all employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Work sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {projectBreakdown.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Projects
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Top: {analyticsData.topProject}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Project Breakdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Project Breakdown" 
              action={
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportData}
                  size="small"
                >
                  Export
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart sx={{ fontSize: 200, color: 'action.disabled' }} />
                </Box>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Project</TableCell>
                          <TableCell align="right">Hours</TableCell>
                          <TableCell align="right">Billable</TableCell>
                          <TableCell align="right">Percentage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {projectBreakdown.map((project) => (
                          <TableRow key={project.project} hover>
                            <TableCell>{project.project}</TableCell>
                            <TableCell align="right">{project.hours.toLocaleString()}</TableCell>
                            <TableCell align="right">{project.billableHours.toLocaleString()}</TableCell>
                            <TableCell align="right">{project.percentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Employee Utilization" 
              action={
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportData}
                  size="small"
                >
                  Export
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart sx={{ fontSize: 200, color: 'action.disabled' }} />
                </Box>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee</TableCell>
                          <TableCell align="right">Hours</TableCell>
                          <TableCell align="right">Utilization</TableCell>
                          <TableCell align="right">Billable %</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employeeBreakdown.map((employee) => (
                          <TableRow key={employee.employee} hover>
                            <TableCell>{employee.employee}</TableCell>
                            <TableCell align="right">{employee.hours}</TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={employee.utilization} 
                                    color={employee.utilization > 90 ? 'success' : 'warning'}
                                  />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {employee.utilization}%
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">{employee.billablePercentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Daily Hours Trend" 
              action={
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleRefresh}
                  size="small"
                >
                  Refresh
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Timeline sx={{ fontSize: 200, color: 'action.disabled' }} />
                </Box>
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body2" color="text.secondary">
                    Chart visualization would appear here in a real application
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Insights & Recommendations" 
              avatar={<Analytics color="primary" />}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom color="primary.main">
                      Utilization Insights
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Team utilization is at {analyticsData.averageUtilization}%, which is {analyticsData.averageUtilization > 85 ? 'above' : 'below'} the target of 85%.
                    </Typography>
                    <Typography variant="body2">
                      {analyticsData.averageUtilization > 85 
                        ? 'Consider reviewing workload distribution to prevent burnout.'
                        : 'There may be capacity for additional projects or tasks.'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom color="warning.main">
                      Billability Analysis
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Billable hours represent {analyticsData.billablePercentage}% of total hours, {analyticsData.billablePercentage > 75 ? 'meeting' : 'below'} the target of 75%.
                    </Typography>
                    <Typography variant="body2">
                      {analyticsData.billablePercentage < 75 
                        ? 'Focus on increasing billable work allocation to improve profitability.'
                        : 'Current billability ratio is healthy and contributing to good profitability.'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom color="success.main">
                      Resource Optimization
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Top performing employee is {analyticsData.topEmployee} with {employeeBreakdown[0].utilization}% utilization.
                    </Typography>
                    <Typography variant="body2">
                      Consider balancing workload across team members to optimize resource allocation and prevent burnout.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimesheetAnalytics;