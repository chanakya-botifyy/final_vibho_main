import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Divider,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  AccountBalance,
  Timeline,
  Insights,
  Calculate,
  Warning,
  Lightbulb
} from '@mui/icons-material';
import { format, addMonths } from 'date-fns';
import { aiService, openSourceAI } from '../../utils/ai';
import { usePayrollStore } from '../../store/usePayrollStore';

const AIPayrollPrediction: React.FC = () => {
  const { records, getPayrollStats } = usePayrollStore();
  
  const [predictionMonths, setPredictionMonths] = useState<number>(3);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [predictionResult, setPredicationResult] = useState<any>(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Generate historical payroll data for forecasting
  const generateHistoricalData = () => {
    // In a real app, this would come from actual payroll records
    const months = 12; // 1 year of data
    const baseAmount = 2000000; // $2M monthly payroll
    
    return Array.from({ length: months }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (months - i));
      
      // Add some seasonal variation and trend
      const seasonality = 1 + 0.1 * Math.sin(i * Math.PI / 6); // Seasonal cycle
      const trend = 1 + 0.005 * i; // Slight upward trend
      const random = 1 + (Math.random() * 0.05 - 0.025); // Random noise ±2.5%
      
      const amount = baseAmount * seasonality * trend * random;
      
      return {
        date: format(date, 'yyyy-MM-dd'),
        value: Math.round(amount)
      };
    });
  };
  
  const handleGeneratePrediction = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Generate historical data
      const historicalData = generateHistoricalData();
      
      // In a real implementation, this would call your self-hosted forecasting model
      const forecast = await openSourceAI.forecastTimeSeries(historicalData, predictionMonths);
      
      // Get cost optimization suggestions
      const payrollPrediction = await aiService.predictPayrollCosts('next-quarter');
      
      setPredicationResult({
        historicalData,
        forecast,
        totalPredicted: forecast.reduce((sum, item) => sum + item.value, 0)
      });
      
      setOptimizationSuggestions(payrollPrediction.costOptimization);
    } catch (error) {
      console.error('Error generating payroll prediction:', error);
      setError('Failed to generate payroll prediction. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate month-over-month change
  const calculateMoMChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Payroll Prediction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Forecast future payroll costs and identify optimization opportunities using AI-powered analytics.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Payroll Forecast Parameters" />
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Prediction Horizon</InputLabel>
                    <Select
                      value={predictionMonths}
                      onChange={(e) => setPredictionMonths(Number(e.target.value))}
                      label="Prediction Horizon"
                    >
                      <MenuItem value={3}>Next 3 Months</MenuItem>
                      <MenuItem value={6}>Next 6 Months</MenuItem>
                      <MenuItem value={12}>Next 12 Months</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleGeneratePrediction}
                    disabled={isAnalyzing}
                    startIcon={<Timeline />}
                  >
                    Generate Forecast
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        
        {isAnalyzing && (
          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Generating payroll forecast...
              </Typography>
              <LinearProgress />
            </Box>
          </Grid>
        )}
        
        {predictionResult && (
          <>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Payroll Forecast" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main">
                          {formatCurrency(predictionResult.totalPredicted)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Predicted Payroll (Next {predictionMonths} Months)
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="info.main">
                          {formatCurrency(predictionResult.forecast[0].value)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Next Month Forecast
                        </Typography>
                        
                        {predictionResult.historicalData && (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            {calculateMoMChange(
                              predictionResult.forecast[0].value,
                              predictionResult.historicalData[predictionResult.historicalData.length - 1].value
                            ) > 0 ? (
                              <>
                                <TrendingUp color="error" fontSize="small" />
                                <Typography variant="caption" color="error.main">
                                  +{calculateMoMChange(
                                    predictionResult.forecast[0].value,
                                    predictionResult.historicalData[predictionResult.historicalData.length - 1].value
                                  ).toFixed(1)}%
                                </Typography>
                              </>
                            ) : (
                              <>
                                <TrendingDown color="success" fontSize="small" />
                                <Typography variant="caption" color="success.main">
                                  {calculateMoMChange(
                                    predictionResult.forecast[0].value,
                                    predictionResult.historicalData[predictionResult.historicalData.length - 1].value
                                  ).toFixed(1)}%
                                </Typography>
                              </>
                            )}
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="warning.main">
                          {formatCurrency(predictionResult.forecast[predictionResult.forecast.length - 1].value)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {predictionMonths} Month Forecast
                        </Typography>
                        
                        {predictionResult.historicalData && (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            {calculateMoMChange(
                              predictionResult.forecast[predictionResult.forecast.length - 1].value,
                              predictionResult.historicalData[predictionResult.historicalData.length - 1].value
                            ) > 0 ? (
                              <>
                                <TrendingUp color="error" fontSize="small" />
                                <Typography variant="caption" color="error.main">
                                  +{calculateMoMChange(
                                    predictionResult.forecast[predictionResult.forecast.length - 1].value,
                                    predictionResult.historicalData[predictionResult.historicalData.length - 1].value
                                  ).toFixed(1)}%
                                </Typography>
                              </>
                            ) : (
                              <>
                                <TrendingDown color="success" fontSize="small" />
                                <Typography variant="caption" color="success.main">
                                  {calculateMoMChange(
                                    predictionResult.forecast[predictionResult.forecast.length - 1].value,
                                    predictionResult.historicalData[predictionResult.historicalData.length - 1].value
                                  ).toFixed(1)}%
                                </Typography>
                              </>
                            )}
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Monthly Forecast
                    </Typography>
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell align="right">Forecasted Amount</TableCell>
                            <TableCell align="right">Lower Bound</TableCell>
                            <TableCell align="right">Upper Bound</TableCell>
                            <TableCell align="right">Change</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {predictionResult.forecast.map((item: any, index: number) => {
                            const previousValue = index === 0 
                              ? predictionResult.historicalData[predictionResult.historicalData.length - 1].value
                              : predictionResult.forecast[index - 1].value;
                            
                            const change = calculateMoMChange(item.value, previousValue);
                            
                            return (
                              <TableRow key={index} hover>
                                <TableCell>{format(new Date(item.date), 'MMMM yyyy')}</TableCell>
                                <TableCell align="right">{formatCurrency(item.value)}</TableCell>
                                <TableCell align="right">{formatCurrency(item.lower)}</TableCell>
                                <TableCell align="right">{formatCurrency(item.upper)}</TableCell>
                                <TableCell 
                                  align="right"
                                  sx={{ 
                                    color: change > 0 ? 'error.main' : 'success.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                  }}
                                >
                                  {change > 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Cost Optimization Insights" />
                <CardContent>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Our AI has analyzed your payroll data and identified the following optimization opportunities.
                  </Alert>
                  
                  <Grid container spacing={2}>
                    {optimizationSuggestions.map((suggestion, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                            <Lightbulb color="warning" />
                            <Typography variant="body1" fontWeight="medium">
                              Optimization Opportunity
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {suggestion}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Potential Savings Estimate
                    </Typography>
                    
                    <Paper sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" color="success.main">
                              {formatCurrency(predictionResult.totalPredicted * 0.05)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Potential Savings (5%)
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" color="success.main">
                              {formatCurrency(predictionResult.totalPredicted * 0.08)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Potential Savings (8%)
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" color="success.main">
                              {formatCurrency(predictionResult.totalPredicted * 0.12)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Potential Savings (12%)
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default AIPayrollPrediction;