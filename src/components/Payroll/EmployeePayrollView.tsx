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
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Download,
  Visibility,
  AttachMoney,
  AccountBalance,
  Receipt,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Schedule,
  Error as ErrorIcon,
  Email,
  Print,
  Share,
  Calculate,
  CreditCard,
  Savings,
  AccountBalanceWallet,
  CalendarMonth,
  Payments,
  MonetizationOn,
  CurrencyExchange
} from '@mui/icons-material';
import { format, addMonths, subMonths } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { usePayrollStore } from '../../store/usePayrollStore';

const EmployeePayrollView: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    records, 
    fetchPayrollRecords, 
    isLoading, 
    error 
  } = usePayrollStore();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
  const [taxCalculatorOpen, setTaxCalculatorOpen] = useState(false);
  const [taxCalculation, setTaxCalculation] = useState({
    annualSalary: '75000',
    deductions: '9000',
    taxableIncome: '66000',
    taxAmount: '13200',
    effectiveRate: '17.6'
  });

  // Mock payroll data
  const currentPayroll = {
    id: '1',
    employeeId: user?.id || '',
    employeeName: user?.name || '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 6250,
    allowances: [
      { name: 'House Rent Allowance', amount: 2500 },
      { name: 'Transport Allowance', amount: 500 },
      { name: 'Medical Allowance', amount: 250 },
      { name: 'Performance Bonus', amount: 1000 }
    ],
    deductions: [
      { name: 'Provident Fund', amount: 750 },
      { name: 'Professional Tax', amount: 200 },
      { name: 'Income Tax', amount: 1125 }
    ],
    grossSalary: 10500,
    netSalary: 8425,
    tax: 1125,
    currency: 'USD',
    paymentDate: new Date(),
    status: 'paid'
  };

  const payrollHistory = [
    {
      id: '1',
      month: 'February 2024',
      year: 2024,
      monthNum: 2,
      basicSalary: 6250,
      allowances: [
        { name: 'House Rent Allowance', amount: 2500 },
        { name: 'Transport Allowance', amount: 500 },
        { name: 'Medical Allowance', amount: 250 },
        { name: 'Performance Bonus', amount: 1000 }
      ],
      deductions: [
        { name: 'Provident Fund', amount: 750 },
        { name: 'Professional Tax', amount: 200 },
        { name: 'Income Tax', amount: 1125 }
      ],
      grossSalary: 10500,
      netSalary: 8425,
      paymentDate: new Date('2024-02-28'),
      status: 'paid'
    },
    {
      id: '2',
      month: 'January 2024',
      year: 2024,
      monthNum: 1,
      basicSalary: 6250,
      allowances: [
        { name: 'House Rent Allowance', amount: 2500 },
        { name: 'Transport Allowance', amount: 500 },
        { name: 'Medical Allowance', amount: 250 }
      ],
      deductions: [
        { name: 'Provident Fund', amount: 750 },
        { name: 'Professional Tax', amount: 200 },
        { name: 'Income Tax', amount: 1125 }
      ],
      grossSalary: 9500,
      netSalary: 7425,
      paymentDate: new Date('2024-01-31'),
      status: 'paid'
    },
    {
      id: '3',
      month: 'December 2023',
      year: 2023,
      monthNum: 12,
      basicSalary: 6250,
      allowances: [
        { name: 'House Rent Allowance', amount: 2500 },
        { name: 'Transport Allowance', amount: 500 },
        { name: 'Medical Allowance', amount: 250 },
        { name: 'Year-End Bonus', amount: 6250 }
      ],
      deductions: [
        { name: 'Provident Fund', amount: 750 },
        { name: 'Professional Tax', amount: 200 },
        { name: 'Income Tax', amount: 2250 }
      ],
      grossSalary: 15750,
      netSalary: 12550,
      paymentDate: new Date('2023-12-31'),
      status: 'paid'
    }
  ];

  // Financial insights
  const financialInsights = {
    ytdEarnings: payrollHistory.reduce((sum, p) => sum + p.netSalary, 0),
    ytdTax: payrollHistory.reduce((sum, p) => sum + p.deductions.find(d => d.name === 'Income Tax')?.amount || 0, 0),
    averageMonthlySalary: payrollHistory.reduce((sum, p) => sum + p.netSalary, 0) / payrollHistory.length,
    salaryGrowth: 5.2, // percentage
    savingsRate: 15.8, // percentage
    retirementContributions: payrollHistory.reduce((sum, p) => sum + p.deductions.find(d => d.name === 'Provident Fund')?.amount || 0, 0)
  };

  const handleViewPayslip = (payslip: any) => {
    setSelectedPayslip(payslip);
    setPayslipDialogOpen(true);
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle />;
      case 'processing': return <Schedule />;
      case 'pending': return <Schedule />;
      default: return <CheckCircle />;
    }
  };

  const calculateTotalAllowances = (allowances: any[]) => {
    return allowances.reduce((total, allowance) => total + allowance.amount, 0);
  };

  const calculateTotalDeductions = (deductions: any[]) => {
    return deductions.reduce((total, deduction) => total + deduction.amount, 0);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Payroll
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your salary details, payslips, and financial insights.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Financial Summary */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Financial Summary" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h5" color="success.main">
                      {formatCurrency(financialInsights.ytdEarnings)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      YTD Earnings
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Receipt sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                    <Typography variant="h5" color="error.main">
                      {formatCurrency(financialInsights.ytdTax)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      YTD Tax
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <AccountBalance sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h5" color="primary.main">
                      {formatCurrency(financialInsights.averageMonthlySalary)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg. Monthly
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h5" color="info.main">
                      {financialInsights.salaryGrowth}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Salary Growth
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Savings sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h5" color="warning.main">
                      {financialInsights.savingsRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Savings Rate
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <CreditCard sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h5" color="secondary.main">
                      {formatCurrency(financialInsights.retirementContributions)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Retirement
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Payslip */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title={`Latest Payslip - ${currentPayroll.month}/${currentPayroll.year}`}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => handleViewPayslip(currentPayroll)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                  >
                    Download
                  </Button>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 0 } }}>
                    <Typography variant="h4" color="primary.main">
                      {formatCurrency(currentPayroll.netSalary)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Net Salary
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Paid on {format(currentPayroll.paymentDate, 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Basic Salary
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatCurrency(currentPayroll.basicSalary)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Allowances
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" color="success.main">
                          +{formatCurrency(calculateTotalAllowances(currentPayroll.allowances))}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Deductions
                        </Typography>
                        <Typography variant="body1" fontWeight="medium" color="error.main">
                          -{formatCurrency(calculateTotalDeductions(currentPayroll.deductions))}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Gross Salary
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatCurrency(currentPayroll.grossSalary)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Tax Deducted
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {formatCurrency(currentPayroll.tax)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Calculate />}
                  fullWidth
                  onClick={() => setTaxCalculatorOpen(true)}
                >
                  Tax Calculator
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Email />}
                  fullWidth
                >
                  Email Payslip
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  fullWidth
                >
                  Print Payslip
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  fullWidth
                >
                  Download All Payslips
                </Button>
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
                      <TableCell>Month</TableCell>
                      <TableCell>Gross Salary</TableCell>
                      <TableCell>Deductions</TableCell>
                      <TableCell>Net Salary</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrollHistory.map((payslip) => (
                      <TableRow key={payslip.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {payslip.month}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatCurrency(payslip.grossSalary)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error.main">
                            -{formatCurrency(calculateTotalDeductions(payslip.deductions))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {formatCurrency(payslip.netSalary)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(payslip.paymentDate, 'MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(payslip.status)}
                            label={payslip.status.toUpperCase()}
                            color={getStatusColor(payslip.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewPayslip(payslip)}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Payslip">
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
            </CardContent>
          </Card>
        </Grid>

        {/* Earnings Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Earnings Breakdown" />
            <CardContent>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MonetizationOn sx={{ fontSize: 200, color: 'action.disabled' }} />
                </Box>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {currentPayroll.allowances.concat([{ name: 'Basic Salary', amount: currentPayroll.basicSalary }])
                    .sort((a, b) => b.amount - a.amount)
                    .map((earning, index) => {
                      const percentage = (earning.amount / currentPayroll.grossSalary) * 100;
                      return (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{earning.name}</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(earning.amount)} ({percentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            color={earning.name === 'Basic Salary' ? 'primary' : 'success'}
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

        {/* Deductions Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Deductions Breakdown" />
            <CardContent>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccountBalanceWallet sx={{ fontSize: 200, color: 'action.disabled' }} />
                </Box>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {currentPayroll.deductions
                    .sort((a, b) => b.amount - a.amount)
                    .map((deduction, index) => {
                      const percentage = (deduction.amount / calculateTotalDeductions(currentPayroll.deductions)) * 100;
                      return (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{deduction.name}</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(deduction.amount)} ({percentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            color="error"
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

        {/* Year-to-Date Summary */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Year-to-Date Summary" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      YTD Earnings
                    </Typography>
                    <Typography variant="h4" color="primary.main" gutterBottom>
                      {formatCurrency(financialInsights.ytdEarnings)}
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
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      YTD Tax Paid
                    </Typography>
                    <Typography variant="h4" color="error.main" gutterBottom>
                      {formatCurrency(financialInsights.ytdTax)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={28}
                      sx={{ mb: 1 }}
                      color="error"
                    />
                    <Typography variant="caption" color="text.secondary">
                      28% of estimated annual tax
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Retirement Contributions
                    </Typography>
                    <Typography variant="h4" color="success.main" gutterBottom>
                      {formatCurrency(financialInsights.retirementContributions)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={25}
                      sx={{ mb: 1 }}
                      color="success"
                    />
                    <Typography variant="caption" color="text.secondary">
                      25% of annual goal
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
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
        {selectedPayslip && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Receipt />
                Payslip Details - {selectedPayslip.month}
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
                        Payslip for {selectedPayslip.month}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Employee Details</Typography>
                    <Typography variant="body2">Name: {selectedPayslip.employeeName}</Typography>
                    <Typography variant="body2">Employee ID: {selectedPayslip.employeeId}</Typography>
                    <Typography variant="body2">Department: {user?.department}</Typography>
                    <Typography variant="body2">Designation: {user?.designation}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Payment Details</Typography>
                    <Typography variant="body2">Pay Period: {selectedPayslip.month}</Typography>
                    <Typography variant="body2">Payment Date: {format(selectedPayslip.paymentDate, 'MMM dd, yyyy')}</Typography>
                    <Typography variant="body2">Payment Method: Direct Deposit</Typography>
                    <Typography variant="body2">Account: XXXX-XXXX-1234</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Earnings</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Basic Salary</Typography>
                        <Typography variant="body2">{formatCurrency(selectedPayslip.basicSalary)}</Typography>
                      </Box>
                      {selectedPayslip.allowances.map((allowance: any, index: number) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{allowance.name}</Typography>
                          <Typography variant="body2">{formatCurrency(allowance.amount)}</Typography>
                        </Box>
                      ))}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" fontWeight="medium">Total Earnings</Typography>
                        <Typography variant="body1" fontWeight="medium">{formatCurrency(selectedPayslip.grossSalary)}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Deductions</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selectedPayslip.deductions.map((deduction: any, index: number) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">{deduction.name}</Typography>
                          <Typography variant="body2">{formatCurrency(deduction.amount)}</Typography>
                        </Box>
                      ))}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" fontWeight="medium">Total Deductions</Typography>
                        <Typography variant="body1" fontWeight="medium">{formatCurrency(calculateTotalDeductions(selectedPayslip.deductions))}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="h6">Net Salary</Typography>
                      <Typography variant="h6" color="success.main">{formatCurrency(selectedPayslip.netSalary)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPayslipDialogOpen(false)}>
                Close
              </Button>
              <Button variant="outlined" startIcon={<Email />}>
                Email
              </Button>
              <Button variant="outlined" startIcon={<Print />}>
                Print
              </Button>
              <Button variant="contained" startIcon={<Download />}>
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
                    fullWidth
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
                        {formatCurrency(parseFloat(taxCalculation.annualSalary))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Total Deductions:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(parseFloat(taxCalculation.deductions))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Taxable Income:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(parseFloat(taxCalculation.taxableIncome))}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="medium">Estimated Tax Amount:</Typography>
                      <Typography variant="body1" fontWeight="medium" color="error.main">
                        {formatCurrency(parseFloat(taxCalculation.taxAmount))}
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
                        {formatCurrency(parseFloat(taxCalculation.annualSalary) - parseFloat(taxCalculation.taxAmount))}
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

export default EmployeePayrollView;