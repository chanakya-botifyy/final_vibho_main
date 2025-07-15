import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  Download,
  FilterList,
  Refresh,
  PieChart,
  BarChart,
  Print,
  Share,
  CalendarMonth
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import * as timesheetApi from '../../api/timesheet';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';

const TimesheetReports: React.FC = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { 
    fetchTimesheetSummary,
    fetchProjects,
    projects,
    isLoading,
    error
  } = useTimesheetStore();
  
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [reportData, setReportData] = useState<any>(null);
  
  // Fetch projects on mount
  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);
  
  // Generate report
  const generateReport = async () => {
    try {
      const summary = await timesheetApi.getTimesheetSummary({
        startDate: new Date(dateRange.startDate),
        endDate: new Date(dateRange.endDate),
        employeeId: selectedEmployee || undefined
      });
      
      setReportData(summary);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Set date range to current month
  const setCurrentMonth = () => {
    setDateRange({
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });
  };
  
  // Set date range to previous month
  const setPreviousMonth = () => {
    const prevMonth = subMonths(new Date(), 1);
    setDateRange({
      startDate: format(startOfMonth(prevMonth), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(prevMonth), 'yyyy-MM-dd')
    });
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timesheet Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate and analyze timesheet data for individuals and projects.
        </Typography>
      </Box>
      
      {/* Report Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Report Filters
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
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
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value as string)}
                label="Employee"
              >
                <MenuItem value="">All Employees</MenuItem>
                {employees.map(employee => (
                  <MenuItem 
                    key={employee.id} 
                    value={employee.id}
                  >
                    {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value as string)}
                label="Project"
              >
                <MenuItem value="">All Projects</MenuItem>
                {projects.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CalendarMonth />}
                onClick={setCurrentMonth}
              >
                Current Month
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarMonth />}
                onClick={setPreviousMonth}
              >
                Previous Month
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={generateReport}
              startIcon={<Refresh />}
              disabled={isLoading}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Report Results */}
      {reportData && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Report Results
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<Print />}
              >
                Print
              </Button>
            </Box>
          </Box>
          
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {reportData.totalHours}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {reportData.billableHours}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Billable Hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {reportData.nonBillableHours}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Non-Billable Hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {reportData.billablePercentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Billable Percentage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Project Breakdown */}
          <Card sx={{ mb: 4 }}>
            <CardHeader 
              title="Project Breakdown" 
              action={
                <Tooltip title="Download">
                  <IconButton>
                    <Download />
                  </IconButton>
                </Tooltip>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Project</TableCell>
                      <TableCell align="right">Total Hours</TableCell>
                      <TableCell align="right">Billable Hours</TableCell>
                      <TableCell align="right">Billable %</TableCell>
                      <TableCell align="right">Billable Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.projectSummary.map((project: any) => (
                      <TableRow key={project.projectId} hover>
                        <TableCell>{project.projectName}</TableCell>
                        <TableCell align="right">{project.totalHours}</TableCell>
                        <TableCell align="right">{project.billableHours}</TableCell>
                        <TableCell align="right">
                          {project.totalHours > 0 
                            ? ((project.billableHours / project.totalHours) * 100).toFixed(1) 
                            : 0}%
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(project.billableHours * 100)} {/* Assuming $100/hour rate */}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{reportData.totalHours}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{reportData.billableHours}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {reportData.billablePercentage.toFixed(1)}%
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(reportData.billableHours * 100)} {/* Assuming $100/hour rate */}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          
          {/* Visualization Placeholder */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Hours by Project" 
                  action={
                    <Tooltip title="Download">
                      <IconButton>
                        <Download />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <PieChart sx={{ fontSize: 100, color: 'action.disabled', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Chart visualization would appear here in a real application
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Daily Hours Distribution" 
                  action={
                    <Tooltip title="Download">
                      <IconButton>
                        <Download />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <CardContent sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <BarChart sx={{ fontSize: 100, color: 'action.disabled', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Chart visualization would appear here in a real application
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default TimesheetReports;