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
  Avatar,
  IconButton,
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
  Tooltip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

import {
  Dashboard,
  People,
  Assignment,
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Timeline,
  CalendarMonth as CalendarMonthIcon,
  Star,
  Warning,
  Visibility,
  Edit,
  ThumbUp,
  ThumbDown,
  Comment,
  Notifications,
  Email,
  Phone,
  LocationOn,
  Work,
  Analytics,
  Group,
  PersonAdd,
  Assessment as AssessmentIcon,
  Event,
  Task,
  Support,
  Business,
  Storage,
  Security,
  Settings,
  SupervisorAccount as SupervisorAccountIcon,
  Domain,
  CloudUpload,
  CloudDownload,
  Refresh,
  Add,
  CompareArrows
} from '@mui/icons-material';

import { format, differenceInDays, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';


// Mock data for tenants
const tenants = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.vibhohcm.com',
    plan: 'Enterprise',
    status: 'active',
    usersCount: 1250,
    createdAt: new Date('2023-01-15'),
    lastBillingDate: new Date('2024-02-01'),
    nextBillingDate: new Date('2024-03-01'),
    storageUsed: 75.4, // GB
    apiUsage: 85.2, // percentage of limit
    adminEmail: 'admin@acme.com'
  },
  {
    id: '2',
    name: 'TechStart Inc',
    domain: 'techstart.vibhohcm.com',
    plan: 'Professional',
    status: 'active',
    usersCount: 85,
    createdAt: new Date('2023-03-10'),
    lastBillingDate: new Date('2024-02-10'),
    nextBillingDate: new Date('2024-03-10'),
    storageUsed: 12.8, // GB
    apiUsage: 45.7, // percentage of limit
    adminEmail: 'admin@techstart.com'
  },
  {
    id: '3',
    name: 'Global Enterprises',
    domain: 'global.vibhohcm.com',
    plan: 'Enterprise',
    status: 'active',
    usersCount: 3200,
    createdAt: new Date('2023-02-05'),
    lastBillingDate: new Date('2024-02-05'),
    nextBillingDate: new Date('2024-03-05'),
    storageUsed: 92.1, // GB
    apiUsage: 78.3, // percentage of limit
    adminEmail: 'admin@global.com'
  },
  {
    id: '4',
    name: 'Startup Labs',
    domain: 'startuplabs.vibhohcm.com',
    plan: 'Standard',
    status: 'trial',
    usersCount: 25,
    createdAt: new Date('2024-01-20'),
    lastBillingDate: null,
    nextBillingDate: new Date('2024-03-20'),
    storageUsed: 2.3, // GB
    apiUsage: 12.5, // percentage of limit
    adminEmail: 'admin@startuplabs.com'
  },
  {
    id: '5',
    name: 'Innovate Solutions',
    domain: 'innovate.vibhohcm.com',
    plan: 'Professional',
    status: 'suspended',
    usersCount: 120,
    createdAt: new Date('2023-05-12'),
    lastBillingDate: new Date('2024-01-12'),
    nextBillingDate: new Date('2024-02-12'),
    storageUsed: 18.7, // GB
    apiUsage: 0, // percentage of limit
    adminEmail: 'admin@innovate.com'
  }
];

// Mock system metrics
const systemMetrics = {
  totalTenants: tenants.length,
  activeTenants: tenants.filter(t => t.status === 'active').length,
  totalUsers: tenants.reduce((sum, t) => sum + t.usersCount, 0),
  totalRevenue: 45250, // Monthly recurring revenue
  storageUsed: 201.3, // GB
  cpuUsage: 42.5, // percentage
  memoryUsage: 68.3, // percentage
  databaseSize: 156.8, // GB
  apiRequests: 1245789, // last 24 hours
  averageResponseTime: 235, // ms
  uptime: 99.98 // percentage
};

// Recent activities
const recentActivities = [
  {
    id: '1',
    tenantId: '4',
    tenantName: 'Startup Labs',
    action: 'tenant_created',
    timestamp: new Date('2024-01-20T10:30:00'),
    performedBy: 'admin@vibhohcm.com',
    details: 'New tenant created with Standard plan (30-day trial)'
  },
  {
    id: '2',
    tenantId: '1',
    tenantName: 'Acme Corporation',
    action: 'plan_upgraded',
    timestamp: new Date('2023-12-15T14:45:00'),
    performedBy: 'admin@acme.com',
    details: 'Upgraded from Professional to Enterprise plan'
  },
  {
    id: '3',
    tenantId: '5',
    tenantName: 'Innovate Solutions',
    action: 'tenant_suspended',
    timestamp: new Date('2024-02-12T09:15:00'),
    performedBy: 'system',
    details: 'Tenant suspended due to payment failure'
  },
  {
    id: '4',
    tenantId: '2',
    tenantName: 'TechStart Inc',
    action: 'user_limit_increased',
    timestamp: new Date('2024-01-05T11:20:00'),
    performedBy: 'admin@vibhohcm.com',
    details: 'User limit increased from 50 to 100'
  },
  {
    id: '5',
    tenantId: '3',
    tenantName: 'Global Enterprises',
    action: 'storage_limit_increased',
    timestamp: new Date('2024-01-28T16:10:00'),
    performedBy: 'admin@global.com',
    details: 'Storage limit increased from 50GB to 100GB'
  }
];

// Upcoming renewals
const upcomingRenewals = tenants
  .filter(t => t.nextBillingDate && t.status !== 'suspended')
  .sort((a, b) => a.nextBillingDate!.getTime() - b.nextBillingDate!.getTime())
  .slice(0, 3);

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return format(date, 'MMM dd, yyyy');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'trial': return 'info';
      case 'suspended': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'tenant_created': return 'success';
      case 'plan_upgraded': return 'primary';
      case 'tenant_suspended': return 'error';
      case 'user_limit_increased': return 'warning';
      case 'storage_limit_increased': return 'info';
      default: return 'default';
    }
  };

  const handleViewTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setTenantDialogOpen(true);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Super Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage multi-tenant system, monitor performance, and configure global settings.
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* System Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Domain sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {systemMetrics.totalTenants}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tenants
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {systemMetrics.activeTenants} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {systemMetrics.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Across all tenants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {formatCurrency(systemMetrics.totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly Revenue
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <TrendingUp color="success" fontSize="small" />
                <Typography variant="caption" color="success.main">
                  +12.5% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Storage sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                {systemMetrics.storageUsed.toFixed(1)} GB
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Storage Used
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {systemMetrics.databaseSize.toFixed(1)} GB database size
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health */}
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="System Health" 
          action={
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefreshData}
              size="small"
            >
              Refresh
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">CPU Usage</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {systemMetrics.cpuUsage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={systemMetrics.cpuUsage} 
                  color={systemMetrics.cpuUsage > 80 ? 'error' : systemMetrics.cpuUsage > 60 ? 'warning' : 'success'} 
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Memory Usage</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {systemMetrics.memoryUsage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={systemMetrics.memoryUsage} 
                  color={systemMetrics.memoryUsage > 80 ? 'error' : systemMetrics.memoryUsage > 60 ? 'warning' : 'success'} 
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Storage Usage</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {(systemMetrics.storageUsed / 500 * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={systemMetrics.storageUsed / 500 * 100} 
                  color={(systemMetrics.storageUsed / 500 * 100) > 80 ? 'error' : (systemMetrics.storageUsed / 500 * 100) > 60 ? 'warning' : 'success'} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  System Metrics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="API Requests (24h)" 
                      secondary={systemMetrics.apiRequests.toLocaleString()} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Avg Response Time" 
                      secondary={`${systemMetrics.averageResponseTime} ms`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="System Uptime" 
                      secondary={`${systemMetrics.uptime}%`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Database Size" 
                      secondary={`${systemMetrics.databaseSize.toFixed(1)} GB`} 
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Upcoming Renewals
                </Typography>
                <List dense>
                  {upcomingRenewals.map((tenant) => (
                    <ListItem key={tenant.id}>
                      <ListItemText 
                        primary={tenant.name} 
                        secondary={`${tenant.plan} - ${formatDate(tenant.nextBillingDate)}`} 
                      />
                      <ListItemSecondaryAction>
                        <Chip 
                          label={tenant.status.toUpperCase()} 
                          color={getStatusColor(tenant.status)}
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tenant List */}
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Tenant Management" 
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Create Tenant
            </Button>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tenant</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Storage</TableCell>
                  <TableCell>API Usage</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {tenant.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tenant.domain}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tenant.plan}
                        color={tenant.plan === 'Enterprise' ? 'secondary' : tenant.plan === 'Professional' ? 'primary' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{tenant.usersCount.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tenant.status.toUpperCase()}
                        color={getStatusColor(tenant.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(tenant.createdAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={tenant.plan === 'Enterprise' ? tenant.storageUsed / 100 * 100 : tenant.plan === 'Professional' ? tenant.storageUsed / 20 * 100 : tenant.storageUsed / 5 * 100} 
                          sx={{ width: 60 }}
                          color={tenant.storageUsed > 80 ? 'error' : tenant.storageUsed > 60 ? 'warning' : 'success'}
                        />
                        <Typography variant="body2">
                          {tenant.storageUsed.toFixed(1)} GB
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={tenant.apiUsage} 
                          sx={{ width: 60 }}
                          color={tenant.apiUsage > 80 ? 'error' : tenant.apiUsage > 60 ? 'warning' : 'success'}
                        />
                        <Typography variant="body2">
                          {tenant.apiUsage}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small"
                            onClick={() => handleViewTenant(tenant)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        {tenant.status === 'active' ? (
                          <Tooltip title="Suspend">
                            <IconButton size="small" color="error">
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        ) : tenant.status === 'suspended' ? (
                          <Tooltip title="Reactivate">
                            <IconButton size="small" color="success">
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Activity" />
        <CardContent>
          <List>
            {recentActivities.map((activity) => (
              <ListItem key={activity.id} divider>
                <ListItemIcon>
                  {activity.action === 'tenant_created' && <Domain color="success" />}
                  {activity.action === 'plan_upgraded' && <TrendingUp color="primary" />}
                  {activity.action === 'tenant_suspended' && <Cancel color="error" />}
                  {activity.action === 'user_limit_increased' && <People color="warning" />}
                  {activity.action === 'storage_limit_increased' && <Storage color="info" />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {activity.tenantName}
                      </Typography>
                      <Chip
                        label={activity.action.replace('_', ' ').toUpperCase()}
                        color={getActionColor(activity.action)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">{activity.details}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(activity.timestamp, 'MMM dd, yyyy HH:mm')} • by {activity.performedBy}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Tenant Details Dialog */}
      <Dialog
        open={tenantDialogOpen}
        onClose={() => setTenantDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTenant && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {selectedTenant.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedTenant.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedTenant.domain}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    label={selectedTenant.status.toUpperCase()}
                    color={getStatusColor(selectedTenant.status)}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Tenant Information</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Plan:</Typography>
                      <Chip
                        label={selectedTenant.plan}
                        color={selectedTenant.plan === 'Enterprise' ? 'secondary' : selectedTenant.plan === 'Professional' ? 'primary' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Users:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedTenant.usersCount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Created:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(selectedTenant.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Admin Email:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedTenant.adminEmail}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Subscription Details</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Last Billing:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(selectedTenant.lastBillingDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Next Billing:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(selectedTenant.nextBillingDate)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Storage Used:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedTenant.storageUsed.toFixed(1)} GB
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">API Usage:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedTenant.apiUsage}% of limit
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Edit />}>
                      Edit Tenant
                    </Button>
                    <Button variant="outlined" startIcon={<CompareArrows />}>
                      Change Plan
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Timeline />}
                      onClick={() => window.location.href = '#/workflow-diagram'}
                    >
                      View Workflow
                    </Button>
                    {selectedTenant.status === 'active' ? (
                      <Button variant="outlined" color="error" startIcon={<Cancel />}>
                        Suspend Tenant
                      </Button>
                    ) : selectedTenant.status === 'suspended' ? (
                      <Button variant="outlined" color="success" startIcon={<CheckCircle />}>
                        Reactivate Tenant
                      </Button>
                    ) : null}
                    <Button variant="outlined" startIcon={<Email />}>
                      Contact Admin
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTenantDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SuperAdminDashboard;