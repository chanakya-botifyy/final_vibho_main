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
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  InputAdornment,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Assignment,
  Download,
  Refresh,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Timeline,
  People,
  AttachMoney,
  CalendarMonth,
  AccessTime,
  Work,
  School,
  Business,
  FilterList,
  Search,
  Save,
  Share,
  Print,
  Add
} from '@mui/icons-material';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useLeaveStore } from '../../store/useLeaveStore';
import { usePayrollStore } from '../../store/usePayrollStore';

export const ReportsAnalytics: React.FC = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { getAttendanceStats } = useAttendanceStore();
  const { getLeaveStats } = useLeaveStore();
  const { getPayrollStats } = usePayrollStore();
  
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>({
    start: startOfMonth(subMonths(new Date(), 1)),
    end: endOfMonth(new Date())
  });
  const [filters, setFilters] = useState<{
    department: string;
    status: string;
    location: string;
  }>({
    department: '',
    status: '',
    location: ''
  });
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>('pdf');

  // Available reports based on user role
  const availableReports = [
    { id: 'employee-headcount', name: 'Employee Headcount', icon: <People />, roles: ['admin', 'hr'] },
    { id: 'attendance-summary', name: 'Attendance Summary', icon: <AccessTime />, roles: ['admin', 'hr', 'manager'] },
    { id: 'leave-balance', name: 'Leave Balance', icon: <CalendarMonth />, roles: ['admin', 'hr', 'manager'] },
    { id: 'payroll-summary', name: 'Payroll Summary', icon: <AttachMoney />, roles: ['admin', 'hr'] },
    { id: 'department-distribution', name: 'Department Distribution', icon: <Business />, roles: ['admin', 'hr'] },
    { id: 'recruitment-metrics', name: 'Recruitment Metrics', icon: <Work />, roles: ['admin', 'hr'] },
    { id: 'performance-overview', name: 'Performance Overview', icon: <BarChart />, roles: ['admin', 'hr', 'manager'] },
    { id: 'training-completion', name: 'Training Completion', icon: <School />, roles: ['admin', 'hr', 'manager'] }
  ];

  // Filter reports based on user role
  const filteredReports = availableReports.filter(report => 
    report.roles.includes(user?.role || 'employee')
  );

  // Generate report data
  const generateReport = async (reportId: string) => {
    setIsLoading(true);
    setSelectedReport(reportId);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let data;
      switch (reportId) {
        case 'employee-headcount':
          data = {
            title: 'Employee Headcount Report',
            summary: {
              totalEmployees: employees.length,
              activeEmployees: employees.filter(e => e.status === 'active').length,
              newHires: employees.filter(e => {
                const joinDate = new Date(e.companyInfo.dateOfJoining);
                return joinDate >= dateRange.start && joinDate <= dateRange.end;
              }).length,
              turnover: 5 // Mock data
            },
            departmentBreakdown: [
              { department: 'Engineering', count: 45, percentage: 36 },
              { department: 'Sales', count: 30, percentage: 24 },
              { department: 'Marketing', count: 15, percentage: 12 },
              { department: 'HR', count: 10, percentage: 8 },
              { department: 'Finance', count: 12, percentage: 10 },
              { department: 'Operations', count: 13, percentage: 10 }
            ],
            monthlyTrend: [
              { month: 'Jan', employees: 120 },
              { month: 'Feb', employees: 125 },
              { month: 'Mar', employees: 130 },
              { month: 'Apr', employees: 128 },
              { month: 'May', employees: 135 },
              { month: 'Jun', employees: 140 }
            ]
          };
          break;
          
        case 'attendance-summary':
          data = {
            title: 'Attendance Summary Report',
            summary: {
              averageAttendance: 92.5,
              lateArrivals: 45,
              absentDays: 28,
              workFromHome: 120
            },
            departmentBreakdown: [
              { department: 'Engineering', attendance: 94.2 },
              { department: 'Sales', attendance: 91.5 },
              { department: 'Marketing', attendance: 93.8 },
              { department: 'HR', attendance: 96.7 },
              { department: 'Finance', attendance: 95.3 },
              { department: 'Operations', attendance: 90.1 }
            ],
            dailyTrend: [
              { day: 'Monday', attendance: 95 },
              { day: 'Tuesday', attendance: 97 },
              { day: 'Wednesday', attendance: 94 },
              { day: 'Thursday', attendance: 93 },
              { day: 'Friday', attendance: 89 }
            ]
          };
          break;
          
        case 'leave-balance':
          data = {
            title: 'Leave Balance Report',
            summary: {
              totalLeavesTaken: 450,
              pendingRequests: 28,
              approvedRequests: 412,
              rejectedRequests: 15
            },
            leaveTypeBreakdown: [
              { type: 'Annual', taken: 320, remaining: 1240 },
              { type: 'Sick', taken: 85, remaining: 865 },
              { type: 'Maternity', taken: 180, remaining: 0 },
              { type: 'Paternity', taken: 15, remaining: 0 },
              { type: 'Emergency', taken: 35, remaining: 90 }
            ],
            departmentBreakdown: [
              { department: 'Engineering', leavesTaken: 150 },
              { department: 'Sales', leavesTaken: 120 },
              { department: 'Marketing', leavesTaken: 75 },
              { department: 'HR', leavesTaken: 35 },
              { department: 'Finance', leavesTaken: 40 },
              { department: 'Operations', leavesTaken: 30 }
            ]
          };
          break;
          
        case 'payroll-summary':
          data = {
            title: 'Payroll Summary Report',
            summary: {
              totalGrossPay: 2100000,
              totalNetPay: 1680000,
              totalTax: 294000,
              totalDeductions: 126000,
              averageSalary: 13440
            },
            departmentBreakdown: [
              { department: 'Engineering', totalSalary: 750000, averageSalary: 16667 },
              { department: 'Sales', totalSalary: 450000, averageSalary: 15000 },
              { department: 'Marketing', totalSalary: 225000, averageSalary: 15000 },
              { department: 'HR', totalSalary: 150000, averageSalary: 15000 },
              { department: 'Finance', totalSalary: 300000, averageSalary: 25000 },
              { department: 'Operations', totalSalary: 225000, averageSalary: 17308 }
            ],
            monthlyTrend: [
              { month: 'Jan', totalSalary: 2050000 },
              { month: 'Feb', totalSalary: 2075000 },
              { month: 'Mar', totalSalary: 2100000 },
              { month: 'Apr', totalSalary: 2100000 },
              { month: 'May', totalSalary: 2150000 },
              { month: 'Jun', totalSalary: 2100000 }
            ]
          };
          break;
          
        default:
          data = {
            title: 'Report Not Available',
            message: 'The selected report is not available or is still in development.'
          };
      }
      
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    console.log(`Exporting ${selectedReport} as ${exportFormat}`);
    setExportDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate comprehensive reports and analytics for data-driven decision making.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Report Selection */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader title="Available Reports" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {filteredReports.map((report) => (
                  <Button
                    key={report.id}
                    variant={selectedReport === report.id ? 'contained' : 'outlined'}
                    startIcon={report.icon}
                    onClick={() => generateReport(report.id)}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    {report.name}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Report Content */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardHeader
              title={reportData?.title || 'Select a Report'}
              action={
                selectedReport && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={() => generateReport(selectedReport)}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={() => setExportDialogOpen(true)}
                    >
                      Export
                    </Button>
                  </Box>
                )
              }
            />
            <CardContent>
              {isLoading ? (
                <Box sx={{ width: '100%', mt: 2, mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Generating report...
                  </Typography>
                  <LinearProgress />
                </Box>
              ) : !selectedReport ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Assignment sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a report from the left panel
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose from various reports to analyze your organization's data
                  </Typography>
                </Box>
              ) : !reportData ? (
                <Alert severity="warning">
                  No data available for the selected report.
                </Alert>
              ) : (
                <Box>
                  {/* Report Filters */}
                  <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={format(dateRange.start, 'yyyy-MM-dd')}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      value={format(dateRange.end, 'yyyy-MM-dd')}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={filters.department}
                        onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                        label="Department"
                      >
                        <MenuItem value="">All Departments</MenuItem>
                        <MenuItem value="Engineering">Engineering</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Operations">Operations</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={() => generateReport(selectedReport)}
                    >
                      Apply Filters
                    </Button>
                  </Box>

                  {/* Report Content */}
                  {selectedReport === 'employee-headcount' && (
                    <Box>
                      {/* Summary Cards */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="primary.main">
                              {reportData.summary.totalEmployees}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Employees
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main">
                              {reportData.summary.activeEmployees}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Active Employees
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="info.main">
                              {reportData.summary.newHires}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              New Hires
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main">
                              {reportData.summary.turnover}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Turnover Rate
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Department Breakdown */}
                      <Typography variant="h6" gutterBottom>
                        Department Distribution
                      </Typography>
                      <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Department</TableCell>
                              <TableCell align="right">Employees</TableCell>
                              <TableCell align="right">Percentage</TableCell>
                              <TableCell>Distribution</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportData.departmentBreakdown.map((dept) => (
                              <TableRow key={dept.department} hover>
                                <TableCell>{dept.department}</TableCell>
                                <TableCell align="right">{dept.count}</TableCell>
                                <TableCell align="right">{dept.percentage}%</TableCell>
                                <TableCell>
                                  <LinearProgress
                                    variant="determinate"
                                    value={dept.percentage}
                                    sx={{ height: 10, borderRadius: 5 }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {selectedReport === 'attendance-summary' && (
                    <Box>
                      {/* Summary Cards */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="primary.main">
                              {reportData.summary.averageAttendance}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Average Attendance
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main">
                              {reportData.summary.lateArrivals}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Late Arrivals
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main">
                              {reportData.summary.absentDays}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Absent Days
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="info.main">
                              {reportData.summary.workFromHome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Work From Home
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Department Breakdown */}
                      <Typography variant="h6" gutterBottom>
                        Attendance by Department
                      </Typography>
                      <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Department</TableCell>
                              <TableCell align="right">Attendance Rate</TableCell>
                              <TableCell>Distribution</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportData.departmentBreakdown.map((dept) => (
                              <TableRow key={dept.department} hover>
                                <TableCell>{dept.department}</TableCell>
                                <TableCell align="right">{dept.attendance}%</TableCell>
                                <TableCell>
                                  <LinearProgress
                                    variant="determinate"
                                    value={dept.attendance}
                                    sx={{ height: 10, borderRadius: 5 }}
                                    color={dept.attendance > 95 ? 'success' : dept.attendance > 90 ? 'info' : 'warning'}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {selectedReport === 'payroll-summary' && (
                    <Box>
                      {/* Summary Cards */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="primary.main">
                              {formatCurrency(reportData.summary.totalGrossPay)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Gross Pay
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="success.main">
                              {formatCurrency(reportData.summary.totalNetPay)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Net Pay
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="error.main">
                              {formatCurrency(reportData.summary.totalTax)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Tax
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="info.main">
                              {formatCurrency(reportData.summary.averageSalary)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Average Salary
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Department Breakdown */}
                      <Typography variant="h6" gutterBottom>
                        Payroll by Department
                      </Typography>
                      <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Department</TableCell>
                              <TableCell align="right">Total Salary</TableCell>
                              <TableCell align="right">Average Salary</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportData.departmentBreakdown.map((dept) => (
                              <TableRow key={dept.department} hover>
                                <TableCell>{dept.department}</TableCell>
                                <TableCell align="right">{formatCurrency(dept.totalSalary)}</TableCell>
                                <TableCell align="right">{formatCurrency(dept.averageSalary)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {selectedReport === 'leave-balance' && (
                    <Box>
                      {/* Summary Cards */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="primary.main">
                              {reportData.summary.totalLeavesTaken}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Leaves Taken
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="warning.main">
                              {reportData.summary.pendingRequests}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pending Requests
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="success.main">
                              {reportData.summary.approvedRequests}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Approved Requests
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h4" color="error.main">
                              {reportData.summary.rejectedRequests}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Rejected Requests
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      {/* Leave Type Breakdown */}
                      <Typography variant="h6" gutterBottom>
                        Leave Balance by Type
                      </Typography>
                      <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Leave Type</TableCell>
                              <TableCell align="right">Taken</TableCell>
                              <TableCell align="right">Remaining</TableCell>
                              <TableCell>Usage</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {reportData.leaveTypeBreakdown.map((leave) => (
                              <TableRow key={leave.type} hover>
                                <TableCell>{leave.type}</TableCell>
                                <TableCell align="right">{leave.taken}</TableCell>
                                <TableCell align="right">{leave.remaining}</TableCell>
                                <TableCell>
                                  <LinearProgress
                                    variant="determinate"
                                    value={(leave.taken / (leave.taken + leave.remaining)) * 100}
                                    sx={{ height: 10, borderRadius: 5 }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Export Dialog */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Export Report</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                label="Export Format"
              >
                <MenuItem value="pdf">PDF Document</MenuItem>
                <MenuItem value="excel">Excel Spreadsheet</MenuItem>
                <MenuItem value="csv">CSV File</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Paper Size</InputLabel>
              <Select defaultValue="a4" label="Paper Size">
                <MenuItem value="a4">A4</MenuItem>
                <MenuItem value="letter">Letter</MenuItem>
                <MenuItem value="legal">Legal</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Include charts and graphs"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleExport}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsAnalytics;