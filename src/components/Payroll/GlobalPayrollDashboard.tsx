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
  Avatar,
  Divider,
  Paper,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  AccountBalance,
  Download as DownloadIcon,
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
  Warning as WarningIcon
} from '@mui/icons-material';
import { format, addMonths, subMonths } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { usePayrollStore } from '../../store/usePayrollStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';

export const GlobalPayrollDashboard: React.FC = () => {
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
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [taxCalculatorOpen, setTaxCalculatorOpen] = useState(false);
  const [taxCalculation, setTaxCalculation] = useState({
    annualSalary: '75000',
    deductions: '9000',
    taxableIncome: '66000',
    taxAmount: '13200',
    effectiveRate: '17.6'
  });

  // Mock payroll data
  const currentPayroll = records.find(r => 
    r.employeeId === user?.id && 
    r.month === new Date().getMonth() + 1 && 
    r.year === new Date().getFullYear()
  ) || {
    id: '1',
    employeeId: user?.id || '',
    employeeName: user?.name || '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 75000,
    allowances: [
      { name: 'House Rent Allowance', amount: 30000, type: 'allowance', taxable: true },
      { name: 'Transport Allowance', amount: 5000, type: 'allowance', taxable: false },
      { name: 'Medical Allowance', amount: 2500, type: 'allowance', taxable: false },
      { name: 'Performance Bonus', amount: 10000, type: 'allowance', taxable: true }
    ],
    deductions: [
      { name: 'Provident Fund', amount: 9000, type: 'deduction', taxable: false },
      { name: 'Professional Tax', amount: 200, type: 'deduction', taxable: false },
      { name: 'Insurance Premium', amount: 1500, type: 'deduction', taxable: false }
    ],
    grossSalary: 122500,
    netSalary: 98300,
    tax: 13500,
    currency: 'INR',
    country: 'India',
    paymentDate: new Date(),
    status: 'paid' as const
  };

  const payrollHistory = records.filter(r => r.employeeId === user?.id);

  const payrollSummary = getPayrollStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'processed': return 'info';
      case 'draft': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle />;
      case 'processed': return <Schedule />;
      case 'draft': return <Pending />;
      case 'cancelled': return <ErrorIcon />;
      default: return <Pending />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotalAllowances = (allowances: any[]) => {
    return allowances.reduce((total, allowance) => total + allowance.amount, 0);
  };

  const calculateTotalDeductions = (deductions: any[]) => {
    return deductions.reduce((total, deduction) => total + deduction.amount, 0);
  };

  const handleGeneratePayroll = async () => {
    if (user?.id) {
      await generatePayroll(user.id, selectedMonth.getMonth() + 1, selectedMonth.getFullYear());
    }
  };

  const handleProcessPayroll = async (recordId: string) => {
    await processPayroll(recordId);
  };

  const handleMarkAsPaid = async (recordId: string) => {
    await markAsPaid(recordId);
  };

  const downloadPayslip = (payroll: any) => {
    console.log('Downloading payslip for:', payroll.id);
    // In a real app, this would generate and download a PDF payslip
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Payroll Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Multi-country payroll processing with tax compliance and automated calculations.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Current Month Payroll Summary */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Current Month Payroll Summary"
              subtitle={`${format(new Date(), 'MMMM yyyy')} - Organization Overview`}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main" gutterBottom>
                      {employees.length.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Employees
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" gutterBottom>
                      {formatCurrency(payrollSummary.totalGrossPay / 1000000)}M
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gross Payroll
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main">
                        +5.2%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main" gutterBottom>
                      {formatCurrency(payrollSummary.totalNetPay / 1000000)}M
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net Payroll
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main">
                        +4.8%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" gutterBottom>
                      {formatCurrency(payrollSummary.totalTax / 1000000)}M
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Tax
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <TrendingDown color="error" fontSize="small" />
                      <Typography variant="caption" color="error.main">
                        -2.1%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main" gutterBottom>
                      {formatCurrency(payrollSummary.totalDeductions / 1000000)}M
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deductions
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <TrendingUp color="warning" fontSize="small" />
                      <Typography variant="caption" color="warning.main">
                        +1.5%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary.main" gutterBottom>
                      {formatCurrency(payrollSummary.averageSalary / 1000)}K
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Salary
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main">
                        +3.2%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Payroll Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="My Payroll Details"
              subtitle={`${format(new Date(), 'MMMM yyyy')} Salary Breakdown`}
              action={
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => downloadPayslip(currentPayroll)}
                  disabled={isLoading}
                >
                  Download Payslip
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Salary Overview */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Salary Overview</Typography>
                    <Chip
                      icon={getStatusIcon(currentPayroll.status)}
                      label={currentPayroll.status.toUpperCase()}
                      color={getStatusColor(currentPayroll.status)}
                      variant="outlined"
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main">
                          {formatCurrency(currentPayroll.grossSalary, currentPayroll.currency)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Gross Salary
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="error.main">
                          -{formatCurrency(currentPayroll.tax + calculateTotalDeductions(currentPayroll.deductions), currentPayroll.currency)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Deductions
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="success.main">
                          {formatCurrency(currentPayroll.netSalary, currentPayroll.currency)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Net Salary
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Earnings Breakdown */}
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    Earnings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Basic Salary</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(currentPayroll.basicSalary, currentPayroll.currency)}
                      </Typography>
                    </Box>
                    {currentPayroll.allowances.map((allowance: any, index: number) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{allowance.name}</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(allowance.amount, currentPayroll.currency)}
                        </Typography>
                      </Box>
                    ))}
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="medium">Total Earnings</Typography>
                      <Typography variant="body1" fontWeight="medium" color="success.main">
                        {formatCurrency(currentPayroll.grossSalary, currentPayroll.currency)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Deductions Breakdown */}
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    Deductions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Income Tax</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(currentPayroll.tax, currentPayroll.currency)}
                      </Typography>
                    </Box>
                    {currentPayroll.deductions.map((deduction: any, index: number) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{deduction.name}</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(deduction.amount, currentPayroll.currency)}
                        </Typography>
                      </Box>
                    ))}
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="medium">Total Deductions</Typography>
                      <Typography variant="body1" fontWeight="medium" color="error.main">
                        {formatCurrency(currentPayroll.tax + calculateTotalDeductions(currentPayroll.deductions), currentPayroll.currency)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Payroll Analytics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Payroll Analytics"
              subtitle="Your salary trends and insights"
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Year-to-Date Earnings
                </Typography>
                <Typography variant="h4" color="primary.main" gutterBottom>
                  {formatCurrency(currentPayroll.netSalary * 4, currentPayroll.currency)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={33}
                  sx={{ mb: 1 }}
                  color="primary"
                />
                <Typography variant="caption" color="text.secondary">
                  33% of annual target
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tax Savings Utilized
                </Typography>
                <Typography variant="h4" color="success.main" gutterBottom>
                  {formatCurrency(54000, currentPayroll.currency)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={72}
                  sx={{ mb: 1 }}
                  color="success"
                />
                <Typography variant="caption" color="text.secondary">
                  72% of ₹1.5L limit
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Effective Tax Rate</Typography>
                  <Typography variant="body2" fontWeight="medium">11.02%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Take Home %</Typography>
                  <Typography variant="body2" fontWeight="medium">80.25%</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">PF Contribution</Typography>
                  <Typography variant="body2" fontWeight="medium">12%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payroll History */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Payroll History"
              subtitle="Your salary history and payment records"
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month/Year</TableCell>
                      <TableCell>Gross Salary</TableCell>
                      <TableCell>Deductions</TableCell>
                      <TableCell>Net Salary</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrollHistory.map((payroll) => (
                      <TableRow key={payroll.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {format(new Date(payroll.year, payroll.month - 1), 'MMM yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(payroll.grossSalary, payroll.currency)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error.main">
                            {formatCurrency(payroll.tax + calculateTotalDeductions(payroll.deductions), payroll.currency)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {formatCurrency(payroll.netSalary, payroll.currency)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {payroll.paymentDate ? format(new Date(payroll.paymentDate), 'MMM dd, yyyy') : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(payroll.status)}
                            label={payroll.status.toUpperCase()}
                            color={getStatusColor(payroll.status)}
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
                                  setSelectedPayroll(payroll);
                                  setPayslipDialogOpen(true);
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Payslip">
                              <IconButton
                                size="small"
                                onClick={() => downloadPayslip(payroll)}
                                disabled={payroll.status === 'draft'}
                              >
                                <DownloadIcon />
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

      {/* Payslip Details Dialog */}
      <Dialog
        open={payslipDialogOpen}
        onClose={() => setPayslipDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPayroll && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Receipt />
                Payslip Details - {format(new Date(selectedPayroll.year, selectedPayroll.month - 1), 'MMM yyyy')}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h5" gutterBottom>
                        VibhoHCM Solutions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Payslip for {format(new Date(selectedPayroll.year, selectedPayroll.month - 1), 'MMMM yyyy')}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Employee Details</Typography>
                    <Typography variant="body2">Name: {selectedPayroll.employeeName}</Typography>
                    <Typography variant="body2">Employee ID: {selectedPayroll.employeeId}</Typography>
                    <Typography variant="body2">Department: {user?.department}</Typography>
                    <Typography variant="body2">Designation: {user?.designation}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Payment Details</Typography>
                    <Typography variant="body2">Pay Period: {format(new Date(selectedPayroll.year, selectedPayroll.month - 1), 'MMM yyyy')}</Typography>
                    <Typography variant="body2">Payment Date: {selectedPayroll.paymentDate ? format(new Date(selectedPayroll.paymentDate), 'MMM dd, yyyy') : 'Pending'}</Typography>
                    <Typography variant="body2">Currency: {selectedPayroll.currency}</Typography>
                    <Typography variant="body2">Country: {selectedPayroll.country}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Earnings</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Basic Salary</Typography>
                        <Typography variant="body2">{formatCurrency(selectedPayroll.basicSalary, selectedPayroll.currency)}</Typography>
                      </Box>
                      {selectedPayroll.allowances.map((allowance: any, index: number) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{allowance.name}</Typography>
                          <Typography variant="body2">{formatCurrency(allowance.amount, selectedPayroll.currency)}</Typography>
                        </Box>
                      ))}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" fontWeight="medium">Total Earnings</Typography>
                        <Typography variant="body1" fontWeight="medium">{formatCurrency(selectedPayroll.grossSalary, selectedPayroll.currency)}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Deductions</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Income Tax</Typography>
                        <Typography variant="body2">{formatCurrency(selectedPayroll.tax, selectedPayroll.currency)}</Typography>
                      </Box>
                      {selectedPayroll.deductions.map((deduction: any, index: number) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{deduction.name}</Typography>
                          <Typography variant="body2">{formatCurrency(deduction.amount, selectedPayroll.currency)}</Typography>
                        </Box>
                      ))}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" fontWeight="medium">Total Deductions</Typography>
                        <Typography variant="body1" fontWeight="medium">{formatCurrency(selectedPayroll.tax + calculateTotalDeductions(selectedPayroll.deductions), selectedPayroll.currency)}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="h6">Net Salary</Typography>
                      <Typography variant="h6" color="success.main">{formatCurrency(selectedPayroll.netSalary, selectedPayroll.currency)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPayslipDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => downloadPayslip(selectedPayroll)}
              >
                Download PDF
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Tax Calculator Dialog */}
      <Dialog
        open={taxCalculatorOpen}
        onClose={() => setTaxCalculatorOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calculate />
            Tax Calculator
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a simplified tax calculator for demonstration purposes. Actual tax calculations may vary based on your jurisdiction and specific tax laws.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Input Values</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Annual Gross Salary"
                    type="number"
                    value={taxCalculation.annualSalary}
                    onChange={(e) => setTaxCalculation(prev => ({ ...prev, annualSalary: e.target.value }))}
                    InputProps={{
                      startAdornment: <AttachMoney sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Total Deductions"
                    type="number"
                    value={taxCalculation.deductions}
                    onChange={(e) => setTaxCalculation(prev => ({ ...prev, deductions: e.target.value }))}
                    InputProps={{
                      startAdornment: <AttachMoney sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      const annualSalary = parseFloat(taxCalculation.annualSalary);
                      const deductions = parseFloat(taxCalculation.deductions);
                      const taxableIncome = annualSalary - deductions;
                      const taxAmount = taxableIncome * 0.2; // Simplified 20% tax rate
                      const effectiveRate = (taxAmount / annualSalary) * 100;
                      
                      setTaxCalculation(prev => ({
                        ...prev,
                        taxableIncome: taxableIncome.toString(),
                        taxAmount: taxAmount.toString(),
                        effectiveRate: effectiveRate.toFixed(1)
                      }));
                    }}
                  >
                    Calculate Tax
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Results</Typography>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Annual Gross Salary:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(parseFloat(taxCalculation.annualSalary), 'USD')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Total Deductions:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(parseFloat(taxCalculation.deductions), 'USD')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Taxable Income:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(parseFloat(taxCalculation.taxableIncome), 'USD')}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="medium">Estimated Tax Amount:</Typography>
                      <Typography variant="body1" fontWeight="medium" color="error.main">
                        {formatCurrency(parseFloat(taxCalculation.taxAmount), 'USD')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="medium">Effective Tax Rate:</Typography>
                      <Typography variant="body1" fontWeight="medium" color="warning.main">
                        {taxCalculation.effectiveRate}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="medium">After-Tax Income:</Typography>
                      <Typography variant="body1" fontWeight="medium" color="success.main">
                        {formatCurrency(parseFloat(taxCalculation.annualSalary) - parseFloat(taxCalculation.taxAmount), 'USD')}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Note: This is a simplified calculation. Actual tax rates may vary based on your jurisdiction, filing status, and other factors.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaxCalculatorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GlobalPayrollDashboard;