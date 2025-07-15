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
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  AccessTime,
  Person,
  CalendarMonth,
  Schedule,
  Analytics,
  Insights,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { aiService, openSourceAI } from '../../utils/ai';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';

const AIAttendanceAnalytics: React.FC = () => {
  const { employees } = useEmployeeStore();
  const { records, getAttendanceStats } = useAttendanceStore();
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Generate mock attendance data for analysis
  const generateAttendanceData = (employeeId: string) => {
    // In a real app, this would come from the attendance records
    const days = 60; // 2 months of data
    return Array.from({ length: days }, (_, i) => {
      // Generate check-in times with some variation
      const hour = 9 + (Math.random() > 0.8 ? Math.floor(Math.random() * 2) : 0);
      const minute = Math.floor(Math.random() * 60);
      
      // Generate check-out times
      const outHour = 17 + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0);
      const outMinute = Math.floor(Math.random() * 60);
      
      // Calculate hours worked
      const hoursWorked = (outHour - hour) + (outMinute - minute) / 60;
      
      return {
        date: format(subMonths(new Date(), 2), 'yyyy-MM-dd'),
        checkIn: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        checkOut: `${outHour.toString().padStart(2, '0')}:${outMinute.toString().padStart(2, '0')}`,
        hoursWorked,
        isLate: hour > 9 || (hour === 9 && minute > 15),
        isEarlyDeparture: outHour < 17,
        isAbsent: Math.random() > 0.95 // 5% chance of absence
      };
    });
  };
  
  const handleAnalyzeAttendance = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your self-hosted attendance analysis model
      // For demo purposes, we'll use the mock implementation
      const attendanceData = generateAttendanceData(selectedEmployee);
      
      // Extract hours worked for anomaly detection
      const hoursWorkedData = attendanceData
        .filter(day => !day.isAbsent)
        .map(day => day.hoursWorked);
      
      // Detect anomalies in hours worked
      const anomalyResults = await openSourceAI.detectAnomalies(hoursWorkedData);
      
      // Get attendance pattern from AI service
      const pattern = await aiService.analyzeAttendancePattern(selectedEmployee);
      
      // Combine results
      const result = {
        ...pattern,
        anomalies: anomalyResults
          .filter(a => a.isAnomaly)
          .map(a => ({
            date: attendanceData[a.index].date,
            hours: hoursWorkedData[a.index],
            score: a.score,
            type: hoursWorkedData[a.index] > 10 ? 'Excessive hours' : 'Insufficient hours'
          }))
      };
      
      setAnalysisResult(result);
      setAnomalies(result.anomalies);
    } catch (error) {
      console.error('Error analyzing attendance:', error);
      setError('Failed to analyze attendance. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Attendance Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze attendance patterns and detect anomalies using AI-powered insights.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Attendance Analysis Parameters" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Employee</InputLabel>
                    <Select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value as string)}
                      label="Employee"
                    >
                      <MenuItem value="">Select Employee</MenuItem>
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleAnalyzeAttendance}
                    disabled={isAnalyzing || !selectedEmployee}
                    startIcon={<Analytics />}
                  >
                    Analyze Attendance
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
                Analyzing attendance patterns...
              </Typography>
              <LinearProgress />
            </Box>
          </Grid>
        )}
        
        {analysisResult && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Attendance Patterns" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="error.main">
                          {analysisResult.patterns.lateArrivals}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Late Arrivals
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="warning.main">
                          {analysisResult.patterns.earlyDepartures}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Early Departures
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="success.main">
                          {analysisResult.patterns.overtimeHours}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Overtime Hours
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="error.main">
                          {analysisResult.patterns.absenteeism}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Absences
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Detected Patterns
                  </Typography>
                  
                  <List>
                    {analysisResult.anomalies.map((anomaly: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Warning color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={anomaly} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Predictions & Insights" />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Attendance Predictions
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h5" color="primary.main">
                            {analysisResult.predictions.nextWeekAttendance}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Next Week Attendance
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h5" color={analysisResult.predictions.riskScore > 50 ? "error.main" : "success.main"}>
                            {analysisResult.predictions.riskScore}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Risk Score
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Anomaly Detection
                  </Typography>
                  
                  {anomalies.length > 0 ? (
                    <List>
                      {anomalies.map((anomaly, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <ErrorIcon color="error" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${anomaly.type} on ${anomaly.date}`}
                            secondary={`${anomaly.hours.toFixed(1)} hours (Anomaly score: ${anomaly.score.toFixed(2)})`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="success">
                      No significant anomalies detected in the attendance pattern.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Recommendations" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          For Employee
                        </Typography>
                        <List dense>
                          {analysisResult.patterns.lateArrivals > 3 && (
                            <ListItem>
                              <ListItemIcon>
                                <AccessTime color="warning" />
                              </ListItemIcon>
                              <ListItemText primary="Consider adjusting your morning routine to arrive on time consistently." />
                            </ListItem>
                          )}
                          {analysisResult.patterns.earlyDepartures > 3 && (
                            <ListItem>
                              <ListItemIcon>
                                <Schedule color="warning" />
                              </ListItemIcon>
                              <ListItemText primary="Try to complete your full work hours to maintain productivity standards." />
                            </ListItem>
                          )}
                          {analysisResult.patterns.overtimeHours > 10 && (
                            <ListItem>
                              <ListItemIcon>
                                <Warning color="error" />
                              </ListItemIcon>
                              <ListItemText primary="You're working significant overtime. Consider discussing workload management with your manager." />
                            </ListItem>
                          )}
                          {analysisResult.patterns.absenteeism > 2 && (
                            <ListItem>
                              <ListItemIcon>
                                <CalendarMonth color="error" />
                              </ListItemIcon>
                              <ListItemText primary="Your absence rate is higher than average. Please ensure you're using leave appropriately." />
                            </ListItem>
                          )}
                        </List>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          For Manager
                        </Typography>
                        <List dense>
                          {analysisResult.patterns.lateArrivals > 3 && (
                            <ListItem>
                              <ListItemIcon>
                                <Person color="info" />
                              </ListItemIcon>
                              <ListItemText primary="Consider discussing punctuality with this employee during your next 1:1 meeting." />
                            </ListItem>
                          )}
                          {analysisResult.patterns.overtimeHours > 10 && (
                            <ListItem>
                              <ListItemIcon>
                                <Person color="info" />
                              </ListItemIcon>
                              <ListItemText primary="This employee is working significant overtime. Consider workload redistribution." />
                            </ListItem>
                          )}
                          {analysisResult.predictions.riskScore > 50 && (
                            <ListItem>
                              <ListItemIcon>
                                <Warning color="error" />
                              </ListItemIcon>
                              <ListItemText primary="This employee has a high attendance risk score. Proactive intervention may be needed." />
                            </ListItem>
                          )}
                          {analysisResult.patterns.absenteeism > 2 && (
                            <ListItem>
                              <ListItemIcon>
                                <Person color="error" />
                              </ListItemIcon>
                              <ListItemText primary="Higher than average absence rate detected. Consider checking on employee wellbeing." />
                            </ListItem>
                          )}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default AIAttendanceAnalytics;