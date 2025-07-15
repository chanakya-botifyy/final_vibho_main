import React, { useState } from 'react';
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
  ListItemSecondaryAction,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  AccountBalance,
  Download,
  Visibility,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Receipt,
  Calculate,
  Schedule,
  CheckCircle,
  Pending,
  Error as ErrorIcon,
  PlayArrow,
  Stop,
  Edit,
  Delete,
  CloudUpload,
  Email,
  Print,
  Refresh,
  Add,
  Save,
  Cancel,
  Settings,
  History,
  Payments,
  AccountBalanceWallet,
  CreditCard,
  Savings,
  MonetizationOn,
  CurrencyExchange
} from '@mui/icons-material';
import { format, addMonths, subMonths } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { usePayrollStore } from '../../store/usePayrollStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';

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
      id={`payroll-admin-tabpanel-${index}`}
      aria-labelledby={`payroll-admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const PayrollAdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    records, 
    generatePayroll, 
    processPayroll, 
    markAsPaid, 
    getPayrollStats,
    calculateSalary,
    isLoading,
    error 
  } = usePayrollStore();
  const { employees } = useEmployeeStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [payRunDialogOpen, setPayRunDialogOpen] = useState(false);
  const [employeeSalaryDialogOpen, setEmployeeSalaryDialogOpen] = useState(false);
  const [payslipUploadDialogOpen, setPayslipUploadDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [payRunData, setPayRunData] = useState({
    month: format(new Date(), 'yyyy-MM'),
    department: 'all',
    includeVariablePay: true,
    processAdvances: true,
    notes: ''
  });
  const [employeeSalary, setEmployeeSalary] = useState({
    employeeId: '',
    basicSalary: '',
    hra: '',
    transportAllowance: '',
    medicalAllowance: '',
    specialAllowance: '',
    providentFund: '',
    professionalTax: '',
    incomeTax: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mock payroll data
  const payrollSummary = {
    totalEmployees: 1247,
    totalGrossPay: 2100000,
    totalNetPay: 1680000,
    totalTax: 294000,
    totalDeductions: 126000,
    averageSalary: 1347,
    processingStatus: 'completed',
    lastProcessed: new Date('2024-02-28'),
    nextScheduled: new Date('2024-03-31')
  };

  // Mock payroll records
  const payrollRecords = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'John Smith',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      basicSalary: 8000,
      grossSalary: 10000,
      totalDeductions: 2500,
      netSalary: 7500,
      status: 'paid',
      paymentDate: new Date('2024-02-28')
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Sarah Johnson',
      department: 'HR',
      designation: 'HR Manager',
      basicSalary: 7000,
      grossSalary: 8500,
      totalDeductions: 2000,
      netSalary: 6500,
      status: 'paid',
      paymentDate: new Date('2024-02-28')
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Michael Chen',
      department: 'Engineering',
      designation: 'Engineering Manager',
      basicSalary: 9000,
      grossSalary: 12000,
      totalDeductions: 3000,
      netSalary: 9000,
      status: 'paid',
      paymentDate: new Date('2024-02-28')
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Emily Rodriguez',
      department: 'Marketing',
      designation: 'Marketing Specialist',
      basicSalary: 6000,
      grossSalary: 7500,
      totalDeductions: 1800,
      netSalary: 5700,
      status: 'paid',
      paymentDate: new Date('2024-02-28')
    },
    {
      id: '5',
      employeeId: '5',
      employeeName: 'David Wilson',
      department: 'Sales',
      designation: 'Sales Representative',
      basicSalary: 5500,
      grossSalary: 8000,
      totalDeductions: 1900,
      netSalary: 6100,
      status: 'processing',
      paymentDate: null
    }
  ];

  // Mock payroll logs
  const payrollLogs = [
    {
      id: '1',
      action: 'Payroll Generated',
      period: 'February 2024',
      timestamp: new Date('2024-02-25T10:30:00'),
      user: 'Admin User',
      details: 'Generated payroll for 1,247 employees'
    },
    {
      id: '2',
      action: 'Payroll Processed',
      period: 'February 2024',
      timestamp: new Date('2024-02-26T14:15:00'),
      user: 'Admin User',
      details: 'Processed payroll for 1,247 employees'
    },
    {
      id: '3',
      action: 'Payslips Generated',
      period: 'February 2024',
      timestamp: new Date('2024-02-27T09:45:00'),
      user: 'Admin User',
      details: 'Generated payslips for 1,247 employees'
    },
    {
      id: '4',
      action: 'Bank Transfer Initiated',
      period: 'February 2024',
      timestamp: new Date('2024-02-28T11:20:00'),
      user: 'Admin User',
      details: 'Initiated bank transfer for 1,247 employees'
    }
  ];

  // Mock employee salary structures
  const employeeSalaries = [
    {
      employeeId: '1',
      employeeName: 'John Smith',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      ctc: 120000,
      basicSalary: 60000,
      hra: 24000,
      transportAllowance: 6000,
      medicalAllowance: 3000,
      specialAllowance: 27000,
      providentFund: 7200,
      professionalTax: 2400,
      incomeTax: 18000
    },
    {
      employeeId: '2',
      employeeName: 'Sarah Johnson',
      department: 'HR',
      designation: 'HR Manager',
      ctc: 100000,
      basicSalary: 50000,
      hra: 20000,
      transportAllowance: 5000,
      medicalAllowance: 2500,
      specialAllowance: 22500,
      providentFund: 6000,
      professionalTax: 2000,
      incomeTax: 15000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle />;
      case 'processing': return <Pending />;
      case 'pending': return <Schedule />;
      case 'cancelled': return <ErrorIcon />;
      default: return <Pending />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const handleStartPayRun = () => {
    console.log('Starting pay run:', payRunData);
    setPayRunDialogOpen(false);
  };

  const handleSaveEmployeeSalary = () => {
    console.log('Saving employee salary:', employeeSalary);
    setEmployeeSalaryDialogOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadPayslips = () => {
    console.log('Uploading payslips:', selectedFile);
    setPayslipUploadDialogOpen(false);
    setSelectedFile(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Payroll Administration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage payroll processing, salary structures, and payslip administration.
        </Typography>
      </Box>

      {/* Payroll Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalance sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {formatCurrency(payrollSummary.totalGrossPay)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Payroll
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="caption" color="success.main">
                  +5.2% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MonetizationOn sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {formatCurrency(payrollSummary.totalNetPay)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Net Payroll
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="caption" color="success.main">
                  +4.8% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {formatCurrency(payrollSummary.totalTax)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tax
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <TrendingDown color="error" fontSize="small" />
                <Typography variant="caption" color="error.main">
                  -2.1% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                {format(payrollSummary.nextScheduled, 'MMM dd')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Next Pay Run
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {payrollSummary.processingStatus === 'completed' ? 'Last run completed' : 'Processing in progress'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Payroll Processing" />
            <Tab label="Salary Management" />
            <Tab label="Payslip Administration" />
            <Tab label="Payroll Logs" />
          </Tabs>
        </Box>

        {/* Payroll Processing Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Payroll Processing</Typography>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => setPayRunDialogOpen(true)}
            >
              Start Pay Run
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Current payroll period: {format(selectedMonth, 'MMMM yyyy')}. 
            {payrollSummary.processingStatus === 'completed' 
              ? ' Last payroll was processed on ' + format(payrollSummary.lastProcessed, 'MMMM d, yyyy') + '.'
              : ' Payroll processing is in progress.'}
          </Alert>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Payroll Processing Steps" />
            <CardContent>
              <Box sx={{ width: '100%' }}>
                <Stepper activeStep={3} orientation="vertical">
                  <Step completed>
                    <StepLabel>
                      <Typography variant="body1">Data Verification</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Verify employee data, attendance, and leave records
                      </Typography>
                    </StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>
                      <Typography variant="body1">Salary Calculation</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Calculate gross salary, deductions, and net pay
                      </Typography>
                    </StepLabel>
                  </Step>
                  <Step completed>
                    <StepLabel>
                      <Typography variant="body1">Review & Approval</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Review payroll data and get necessary approvals
                      </Typography>
                    </StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>
                      <Typography variant="body1">Payslip Generation</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Generate and distribute payslips to employees
                      </Typography>
                    </StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>
                      <Typography variant="body1">Bank Transfer</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Process salary transfers to employee bank accounts
                      </Typography>
                    </StepLabel>
                  </Step>
                </Stepper>
              </Box>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader 
              title={`Payroll Records - ${format(selectedMonth, 'MMMM yyyy')}`}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={handlePreviousMonth}>
                    <TrendingDown />
                  </IconButton>
                  <IconButton onClick={handleNextMonth}>
                    <TrendingUp />
                  </IconButton>
                </Box>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Gross Salary</TableCell>
                      <TableCell>Deductions</TableCell>
                      <TableCell>Net Salary</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrollRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {record.employeeName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {record.employeeId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{record.department}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{record.designation}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(record.grossSalary)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error.main">
                            {formatCurrency(record.totalDeductions)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {formatCurrency(record.netSalary)}
                          </Typography>
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
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <span style={{ display: 'inline-block' }}>
                                <IconButton size="small" disabled={record.status === 'paid'}>
                                  <Edit />
                                </IconButton>
                              </span>
                            </Tooltip>
                            {record.status === 'processing' && (
                              <Tooltip title="Mark as Paid">
                                <IconButton size="small" color="success">
                                  <CheckCircle />
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
            </CardContent>
          </Card>
        </TabPanel>

        {/* Salary Management Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Employee Salary Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setEmployeeSalaryDialogOpen(true)}
            >
              Add Salary Structure
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>CTC</TableCell>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell>Allowances</TableCell>
                  <TableCell>Deductions</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employeeSalaries.map((salary) => (
                  <TableRow key={salary.employeeId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {salary.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {salary.employeeId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{salary.department}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{salary.designation}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(salary.ctc)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatCurrency(salary.basicSalary)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="success.main">
                        {formatCurrency(salary.hra + salary.transportAllowance + salary.medicalAllowance + salary.specialAllowance)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="error.main">
                        {formatCurrency(salary.providentFund + salary.professionalTax + salary.incomeTax)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small"
                            onClick={() => {
                              setSelectedEmployee(salary);
                              setEmployeeSalary({
                                employeeId: salary.employeeId,
                                basicSalary: salary.basicSalary.toString(),
                                hra: salary.hra.toString(),
                                transportAllowance: salary.transportAllowance.toString(),
                                medicalAllowance: salary.medicalAllowance.toString(),
                                specialAllowance: salary.specialAllowance.toString(),
                                providentFund: salary.providentFund.toString(),
                                professionalTax: salary.professionalTax.toString(),
                                incomeTax: salary.incomeTax.toString()
                              });
                              setEmployeeSalaryDialogOpen(true);
                            }}
                          >
                            <Edit />
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

        {/* Payslip Administration Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Payslip Administration</Typography>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => setPayslipUploadDialogOpen(true)}
            >
              Upload Payslips
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Manage and distribute employee payslips for {format(selectedMonth, 'MMMM yyyy')}.
          </Alert>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader title="Payslip Distribution Status" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      {payrollRecords.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Payslips
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {payrollRecords.filter(r => r.status === 'paid').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Distributed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {payrollRecords.filter(r => r.status === 'processing').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {payrollRecords.filter(r => r.status === 'paid').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Downloaded
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader title="Payslip Distribution" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Payslip</TableCell>
                      <TableCell>Generated On</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrollRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {record.employeeName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {record.employeeId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{record.department}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{record.employeeName.toLowerCase().replace(' ', '.') + '@company.com'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {`Payslip_${record.employeeId}_${format(selectedMonth, 'MMM_yyyy')}.pdf`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {record.paymentDate ? format(record.paymentDate, 'MMM dd, yyyy') : 'Pending'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(record.status)}
                            label={record.status === 'paid' ? 'DISTRIBUTED' : 'PENDING'}
                            color={getStatusColor(record.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Payslip">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton size="small">
                                <Download />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Email">
                              <IconButton size="small">
                                <Email />
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
        </TabPanel>

        {/* Payroll Logs Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Payroll Activity Logs</Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
            >
              Export Logs
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Comprehensive audit trail of all payroll-related activities for compliance and review.
          </Alert>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrollLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {log.action}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.period}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(log.timestamp, 'MMM dd, yyyy HH:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.user}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.details}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>

      {/* Pay Run Dialog */}
      <Dialog
        open={payRunDialogOpen}
        onClose={() => setPayRunDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Start New Pay Run</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              This will initiate the payroll processing for the selected period.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pay Period"
                  type="month"
                  value={payRunData.month}
                  onChange={(e) => setPayRunData(prev => ({ ...prev, month: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={payRunData.department}
                    onChange={(e) => setPayRunData(prev => ({ ...prev, department: e.target.value }))}
                    label="Department"
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="HR">Human Resources</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={payRunData.includeVariablePay}
                      onChange={(e) => setPayRunData(prev => ({ ...prev, includeVariablePay: e.target.checked }))}
                    />
                  }
                  label="Include Variable Pay Components"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={payRunData.processAdvances}
                      onChange={(e) => setPayRunData(prev => ({ ...prev, processAdvances: e.target.checked }))}
                    />
                  }
                  label="Process Loan & Advance Deductions"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={payRunData.notes}
                  onChange={(e) => setPayRunData(prev => ({ ...prev, notes: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayRunDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStartPayRun}>
            Start Pay Run
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Salary Dialog */}
      <Dialog
        open={employeeSalaryDialogOpen}
        onClose={() => setEmployeeSalaryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEmployee ? 'Edit Salary Structure' : 'Add Salary Structure'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Employee</InputLabel>
                  <Select
                    value={employeeSalary.employeeId}
                    onChange={(e) => setEmployeeSalary(prev => ({ ...prev, employeeId: e.target.value }))}
                    label="Employee"
                    disabled={!!selectedEmployee}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Basic Salary"
                  type="number"
                  value={employeeSalary.basicSalary}
                  onChange={(e) => setEmployeeSalary(prev => ({ ...prev, basicSalary: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="House Rent Allowance (HRA)"
                  type="number"
                  value={employeeSalary.hra}
                  onChange={(e) => setEmployeeSalary(prev => ({ ...prev, hra: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Transport Allowance"
                  type="number"
                  value={employeeSalary.transportAllowance}
                  onChange={(e) => setEmployeeSalary(prev => ({ ...prev, transportAllowance: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Medical Allowance"
                  type="number"
                  value={employeeSalary.medicalAllowance}
                  onChange={(e) => setEmployeeSalary(prev => ({ ...prev, medicalAllowance: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Special Allowance"
                  type="number"
                  value={employeeSalary.specialAllowance}
                  onChange={(e) => setEmployeeSalary(prev => ({ ...prev, specialAllowance: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>Deductions</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Provident Fund"
                  type="number"
                  value={employeeSalary.providentFund}
                  onChange={(e) => setEmployeeSalary(prev => ({ ...prev, providentFund: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Professional Tax"
                  type="number"
                  value={employeeSalary.professionalTax}
                  onChange={(e) => setEmployeeSalary(prev => ({ ...prev, professionalTax: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Income Tax"
                  type="number"
                  value={employeeSalary.incomeTax}
                  onChange={(e) => setEmployeeSalary(prev => ({ ...prev, incomeTax: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmployeeSalaryDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEmployeeSalary}>
            {selectedEmployee ? 'Update Salary' : 'Save Salary'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payslip Upload Dialog */}
      <Dialog
        open={payslipUploadDialogOpen}
        onClose={() => setPayslipUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Payslips</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Upload payslips for distribution to employees. Supported formats: PDF.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pay Period"
                  type="month"
                  defaultValue={format(new Date(), 'yyyy-MM')}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Department</InputLabel>
                  <Select defaultValue="all" label="Department">
                    <MenuItem value="all">All Departments</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="HR">Human Resources</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    mb: 2
                  }}
                >
                  <input
                    type="file"
                    id="payslip-upload"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.zip"
                    multiple
                  />
                  <label htmlFor="payslip-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUpload />}
                    >
                      Choose Files
                    </Button>
                  </label>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {selectedFile 
                      ? `Selected: ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)` 
                      : 'Drag and drop files here, or click to select files'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Supported formats: PDF, ZIP (for bulk upload)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Send email notification to employees"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayslipUploadDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUploadPayslips}
            disabled={!selectedFile}
          >
            Upload Payslips
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Stepper components
const Stepper: React.FC<{ activeStep: number, orientation: 'horizontal' | 'vertical', children: React.ReactNode }> = ({ 
  activeStep, 
  orientation, 
  children 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      gap: 2
    }}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            completed: index < activeStep,
            active: index === activeStep
          });
        }
        return child;
      })}
    </Box>
  );
};

const Step: React.FC<{ completed?: boolean, active?: boolean, children: React.ReactNode }> = ({ 
  completed, 
  active, 
  children 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      mb: 2,
      opacity: completed || active ? 1 : 0.5
    }}>
      <Box sx={{ 
        mr: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Box sx={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%', 
          bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.400',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 1
        }}>
          {completed ? <CheckCircle fontSize="small" /> : null}
        </Box>
        {active && (
          <Box sx={{ 
            height: 24, 
            width: 2, 
            bgcolor: 'primary.main' 
          }} />
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

const StepLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  );
};

export default PayrollAdminDashboard;