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
  TableRow
} from '@mui/material';
import {
  BarChart,
  PieChart,
  Timeline,
  TrendingUp,
  TrendingDown,
  Download,
  Refresh,
  Psychology,
  Analytics,
  CalendarToday,
  FilterList
} from '@mui/icons-material';
import { format, subDays, subMonths } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

const AIUsageAnalytics: React.FC = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [featureFilter, setFeatureFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Usage statistics (simulated)
  const [usageStats, setUsageStats] = useState({
    totalRequests: 12458,
    requestsToday: 342,
    averageResponseTime: 245, // ms
    successRate: 99.7, // percentage
    topFeature: 'chatbot',
    storageUsed: 1.2, // GB
    costSavings: 8750, // USD
    aiAccuracy: 92.5 // percentage
  });
  
  // Feature usage breakdown (simulated)
  const [featureUsage, setFeatureUsage] = useState([
    { feature: 'AI Assistant', requests: 5842, percentage: 46.9 },
    { feature: 'Resume Parser', requests: 2134, percentage: 17.1 },
    { feature: 'Document Processor', requests: 1876, percentage: 15.1 },
    { feature: 'Attendance Analytics', requests: 1245, percentage: 10.0 },
    { feature: 'Performance Insights', requests: 876, percentage: 7.0 },
    { feature: 'Payroll Prediction', requests: 345, percentage: 2.8 },
    { feature: 'Recruitment Assistant', requests: 140, percentage: 1.1 }
  ]);
  
  // Department usage breakdown (simulated)
  const [departmentUsage, setDepartmentUsage] = useState([
    { department: 'HR', requests: 4983, percentage: 40.0 },
    { department: 'Engineering', requests: 3245, percentage: 26.0 },
    { department: 'Sales', requests: 1876, percentage: 15.1 },
    { department: 'Marketing', requests: 1245, percentage: 10.0 },
    { department: 'Finance', requests: 876, percentage: 7.0 },
    { department: 'Operations', requests: 233, percentage: 1.9 }
  ]);
  
  // Daily usage data (simulated)
  const [dailyUsage, setDailyUsage] = useState([
    { date: '2024-05-01', requests: 345 },
    { date: '2024-05-02', requests: 412 },
    { date: '2024-05-03', requests: 387 },
    { date: '2024-05-04', requests: 245 },
    { date: '2024-05-05', requests: 198 },
    { date: '2024-05-06', requests: 456 },
    { date: '2024-05-07', requests: 512 },
    { date: '2024-05-08', requests: 478 },
    { date: '2024-05-09', requests: 423 },
    { date: '2024-05-10', requests: 401 },
    { date: '2024-05-11', requests: 367 },
    { date: '2024-05-12', requests: 289 },
    { date: '2024-05-13', requests: 456 },
    { date: '2024-05-14', requests: 478 },
    { date: '2024-05-15', requests: 512 },
    { date: '2024-05-16', requests: 489 },
    { date: '2024-05-17', requests: 467 },
    { date: '2024-05-18', requests: 345 },
    { date: '2024-05-19', requests: 312 },
    { date: '2024-05-20', requests: 478 },
    { date: '2024-05-21', requests: 512 },
    { date: '2024-05-22', requests: 489 },
    { date: '2024-05-23', requests: 467 },
    { date: '2024-05-24', requests: 423 },
    { date: '2024-05-25', requests: 345 },
    { date: '2024-05-26', requests: 312 },
    { date: '2024-05-27', requests: 389 },
    { date: '2024-05-28', requests: 412 },
    { date: '2024-05-29', requests: 423 },
    { date: '2024-05-30', requests: 401 },
    { date: '2024-05-31', requests: 342 }
  ]);
  
  // Recent AI requests (simulated)
  const [recentRequests, setRecentRequests] = useState([
    { 
      id: '1', 
      timestamp: new Date('2024-05-31T10:30:00'), 
      user: 'John Smith', 
      feature: 'AI Assistant', 
      query: 'What is my leave balance?', 
      responseTime: 245, 
      status: 'success' 
    },
    { 
      id: '2', 
      timestamp: new Date('2024-05-31T10:15:00'), 
      user: 'Sarah Johnson', 
      feature: 'Resume Parser', 
      query: 'Parse candidate resume', 
      responseTime: 1245, 
      status: 'success' 
    },
    { 
      id: '3', 
      timestamp: new Date('2024-05-31T10:00:00'), 
      user: 'Michael Chen', 
      feature: 'Document Processor', 
      query: 'Categorize invoice document', 
      responseTime: 876, 
      status: 'success' 
    },
    { 
      id: '4', 
      timestamp: new Date('2024-05-31T09:45:00'), 
      user: 'Emily Rodriguez', 
      feature: 'AI Assistant', 
      query: 'When is the next company holiday?', 
      responseTime: 198, 
      status: 'success' 
    },
    { 
      id: '5', 
      timestamp: new Date('2024-05-31T09:30:00'), 
      user: 'David Wilson', 
      feature: 'Performance Insights', 
      query: 'Generate performance insights', 
      responseTime: 3456, 
      status: 'success' 
    }
  ]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Update usage stats with slight variations
      setUsageStats(prev => ({
        ...prev,
        requestsToday: prev.requestsToday + Math.floor(Math.random() * 10),
        averageResponseTime: prev.averageResponseTime + Math.floor(Math.random() * 10) - 5,
        successRate: Math.min(100, prev.successRate + (Math.random() * 0.2 - 0.1))
      }));
      
      // Add a new recent request
      const newRequest = {
        id: `${Date.now()}`,
        timestamp: new Date(),
        user: ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Wilson'][Math.floor(Math.random() * 5)],
        feature: ['AI Assistant', 'Resume Parser', 'Document Processor', 'Attendance Analytics', 'Performance Insights'][Math.floor(Math.random() * 5)],
        query: 'New AI request',
        responseTime: Math.floor(Math.random() * 1000) + 100,
        status: 'success'
      };
      
      setRecentRequests(prev => [newRequest, ...prev.slice(0, 4)]);
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
          AI Usage Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and analyze AI feature usage across your organization.
        </Typography>
      </Box>
      
      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary" display="inline">
            Loading analytics data...
          </Typography>
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
                <InputLabel>Feature</InputLabel>
                <Select
                  value={featureFilter}
                  onChange={(e) => setFeatureFilter(e.target.value)}
                  label="Feature"
                >
                  <MenuItem value="all">All Features</MenuItem>
                  <MenuItem value="chatbot">AI Assistant</MenuItem>
                  <MenuItem value="resume-parser">Resume Parser</MenuItem>
                  <MenuItem value="document-processor">Document Processor</MenuItem>
                  <MenuItem value="attendance-analytics">Attendance Analytics</MenuItem>
                  <MenuItem value="performance-insights">Performance Insights</MenuItem>
                  <MenuItem value="payroll-prediction">Payroll Prediction</MenuItem>
                  <MenuItem value="recruitment-assistant">Recruitment Assistant</MenuItem>
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
                  <MenuItem value="hr">HR</MenuItem>
                  <MenuItem value="engineering">Engineering</MenuItem>
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
      
      {/* Usage Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Psychology sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {usageStats.totalRequests.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total AI Requests
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {usageStats.requestsToday.toLocaleString()} today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Analytics sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {usageStats.averageResponseTime} ms
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Response Time
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {usageStats.successRate}% success rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                ${usageStats.costSavings.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estimated Cost Savings
              </Typography>
              <Typography variant="caption" color="text.secondary">
                vs. cloud-based AI services
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {usageStats.aiAccuracy}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average AI Accuracy
              </Typography>
              <Typography variant="caption" color="text.secondary">
                across all features
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Usage Breakdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Feature Usage" 
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
                          <TableCell>Feature</TableCell>
                          <TableCell align="right">Requests</TableCell>
                          <TableCell align="right">Percentage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {featureUsage.map((feature) => (
                          <TableRow key={feature.feature} hover>
                            <TableCell>{feature.feature}</TableCell>
                            <TableCell align="right">{feature.requests.toLocaleString()}</TableCell>
                            <TableCell align="right">{feature.percentage}%</TableCell>
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
              title="Department Usage" 
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
                          <TableCell>Department</TableCell>
                          <TableCell align="right">Requests</TableCell>
                          <TableCell align="right">Percentage</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {departmentUsage.map((dept) => (
                          <TableRow key={dept.department} hover>
                            <TableCell>{dept.department}</TableCell>
                            <TableCell align="right">{dept.requests.toLocaleString()}</TableCell>
                            <TableCell align="right">{dept.percentage}%</TableCell>
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
              title="Daily Usage Trend" 
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
              title="Recent AI Requests" 
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Feature</TableCell>
                      <TableCell>Query</TableCell>
                      <TableCell>Response Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentRequests.map((request) => (
                      <TableRow key={request.id} hover>
                        <TableCell>
                          {format(request.timestamp, 'MMM dd, HH:mm:ss')}
                        </TableCell>
                        <TableCell>{request.user}</TableCell>
                        <TableCell>
                          <Chip 
                            label={request.feature} 
                            size="small" 
                            variant="outlined" 
                          />
                        </TableCell>
                        <TableCell>{request.query}</TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color={request.responseTime > 1000 ? 'warning.main' : 'success.main'}
                          >
                            {request.responseTime} ms
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={request.status.toUpperCase()} 
                            color={request.status === 'success' ? 'success' : 'error'} 
                            size="small" 
                          />
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
    </Box>
  );
};

export default AIUsageAnalytics;