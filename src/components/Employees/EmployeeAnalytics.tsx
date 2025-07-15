import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  PersonAdd,
  ExitToApp,
  Star,
  Warning,
  CheckCircle,
  Schedule,
  Business,
  LocationOn,
  School,
  Work
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '@mui/material/styles';

export const EmployeeAnalytics: React.FC = () => {
  const theme = useTheme();

  // Mock analytics data
  const headcountTrend = [
    { month: 'Jan', total: 1180, hired: 25, terminated: 8 },
    { month: 'Feb', total: 1197, hired: 22, terminated: 5 },
    { month: 'Mar', total: 1215, hired: 28, terminated: 10 },
    { month: 'Apr', total: 1233, hired: 30, terminated: 12 },
    { month: 'May', total: 1247, hired: 20, terminated: 6 },
    { month: 'Jun', total: 1261, hired: 18, terminated: 4 }
  ];

  const departmentDistribution = [
    { name: 'Engineering', value: 450, color: '#1976d2' },
    { name: 'Sales', value: 280, color: '#2e7d32' },
    { name: 'Marketing', value: 180, color: '#ed6c02' },
    { name: 'HR', value: 120, color: '#9c27b0' },
    { name: 'Finance', value: 90, color: '#d32f2f' },
    { name: 'Operations', value: 141, color: '#00796b' }
  ];

  const ageDistribution = [
    { range: '20-25', count: 156 },
    { range: '26-30', count: 324 },
    { range: '31-35', count: 298 },
    { range: '36-40', count: 245 },
    { range: '41-45', count: 142 },
    { range: '46-50', count: 82 }
  ];

  const topPerformers = [
    {
      id: '1',
      name: 'Alice Johnson',
      department: 'Engineering',
      rating: 4.8,
      achievements: 12,
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '2',
      name: 'Bob Smith',
      department: 'Sales',
      rating: 4.7,
      achievements: 10,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      id: '3',
      name: 'Carol Davis',
      department: 'Marketing',
      rating: 4.6,
      achievements: 8,
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  ];

  const retentionMetrics = {
    overall: 94.2,
    byDepartment: [
      { department: 'Engineering', retention: 96.5 },
      { department: 'Sales', retention: 92.8 },
      { department: 'Marketing', retention: 94.1 },
      { department: 'HR', retention: 97.2 },
      { department: 'Finance', retention: 95.8 },
      { department: 'Operations', retention: 91.3 }
    ]
  };

  const diversityMetrics = {
    gender: [
      { category: 'Male', percentage: 58 },
      { category: 'Female', percentage: 40 },
      { category: 'Other', percentage: 2 }
    ],
    education: [
      { level: 'Bachelor\'s', percentage: 45 },
      { level: 'Master\'s', percentage: 38 },
      { level: 'PhD', percentage: 12 },
      { level: 'Other', percentage: 5 }
    ]
  };

  const upcomingEvents = [
    {
      type: 'birthday',
      title: 'John Smith\'s Birthday',
      date: 'Today',
      icon: <CheckCircle color="success" />
    },
    {
      type: 'anniversary',
      title: '5 Work Anniversaries',
      date: 'This Week',
      icon: <Star color="warning" />
    },
    {
      type: 'probation',
      title: '3 Probation Endings',
      date: 'Next Week',
      icon: <Schedule color="info" />
    },
    {
      type: 'document',
      title: '8 Document Expiries',
      date: 'This Month',
      icon: <Warning color="error" />
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive workforce analytics and insights for data-driven HR decisions.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Key Workforce Metrics" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="primary.main" gutterBottom>
                      1,247
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Employees
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main">
                        +5.2% from last month
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="success.main" gutterBottom>
                      23
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      New Hires (This Month)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main">
                        +15% from last month
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="error.main" gutterBottom>
                      6
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Departures (This Month)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <TrendingDown color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main">
                        -25% from last month
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="warning.main" gutterBottom>
                      94.2%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Retention Rate
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <TrendingUp color="success" fontSize="small" />
                      <Typography variant="caption" color="success.main">
                        +1.8% from last year
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Headcount Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Headcount Trend" subtitle="Monthly hiring and termination trends" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={headcountTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                    name="Total Employees"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hired" 
                    stroke={theme.palette.success.main}
                    strokeWidth={2}
                    name="New Hires"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="terminated" 
                    stroke={theme.palette.error.main}
                    strokeWidth={2}
                    name="Departures"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Department Distribution" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {departmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Age Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Age Distribution" />
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Top Performers" subtitle="Based on performance ratings and achievements" />
            <CardContent>
              <List>
                {topPerformers.map((performer, index) => (
                  <React.Fragment key={performer.id}>
                    <ListItem>
                      <Avatar
                        src={performer.avatar}
                        sx={{ mr: 2 }}
                      >
                        {performer.name.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {performer.name}
                            </Typography>
                            <Chip
                              icon={<Star />}
                              label={performer.rating}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {performer.department} • {performer.achievements} achievements
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < topPerformers.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Retention by Department */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Retention Rate by Department" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {retentionMetrics.byDepartment.map((dept) => (
                  <Box key={dept.department}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{dept.department}</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {dept.retention}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={dept.retention}
                      sx={{ height: 8, borderRadius: 4 }}
                      color={dept.retention >= 95 ? 'success' : dept.retention >= 90 ? 'warning' : 'error'}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Diversity Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Diversity & Inclusion" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>Gender Distribution</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {diversityMetrics.gender.map((item) => (
                      <Box key={item.category} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{item.category}</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {item.percentage}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>Education Level</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {diversityMetrics.education.map((item) => (
                      <Box key={item.level} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{item.level}</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {item.percentage}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Upcoming HR Events" subtitle="Important dates and milestones" />
            <CardContent>
              <Grid container spacing={2}>
                {upcomingEvents.map((event, index) => (
                  <Grid item xs={12} md={3} key={index}>
                    <Paper sx={{ p: 2 }} variant="outlined">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {event.icon}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {event.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {event.date}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};