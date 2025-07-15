import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Business,
  Domain,
  Email,
  Person,
  Group,
  Storage,
  Security,
  Settings,
  Save,
  Refresh,
  Visibility,
  CloudUpload,
  CloudDownload,
  CompareArrows
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';

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
      id={`tenant-tabpanel-${index}`}
      aria-labelledby={`tenant-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock tenants
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
    adminEmail: 'admin@acme.com',
    adminName: 'John Smith',
    adminPhone: '+1-555-0123',
    country: 'United States',
    industry: 'Technology',
    employees: 1500,
    modules: [
      { name: 'Core HR', enabled: true },
      { name: 'Attendance', enabled: true },
      { name: 'Leave Management', enabled: true },
      { name: 'Payroll', enabled: true },
      { name: 'Performance', enabled: true },
      { name: 'Recruitment', enabled: true },
      { name: 'Asset Management', enabled: true },
      { name: 'Claims & Expenses', enabled: true },
      { name: 'AI Features', enabled: true }
    ]
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
    adminEmail: 'admin@techstart.com',
    adminName: 'Sarah Johnson',
    adminPhone: '+1-555-0124',
    country: 'Canada',
    industry: 'Software',
    employees: 120,
    modules: [
      { name: 'Core HR', enabled: true },
      { name: 'Attendance', enabled: true },
      { name: 'Leave Management', enabled: true },
      { name: 'Payroll', enabled: true },
      { name: 'Performance', enabled: true },
      { name: 'Recruitment', enabled: true },
      { name: 'Asset Management', enabled: true },
      { name: 'Claims & Expenses', enabled: true },
      { name: 'AI Features', enabled: false }
    ]
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
    adminEmail: 'admin@global.com',
    adminName: 'Michael Chen',
    adminPhone: '+1-555-0125',
    country: 'Global',
    industry: 'Manufacturing',
    employees: 5000,
    modules: [
      { name: 'Core HR', enabled: true },
      { name: 'Attendance', enabled: true },
      { name: 'Leave Management', enabled: true },
      { name: 'Payroll', enabled: true },
      { name: 'Performance', enabled: true },
      { name: 'Recruitment', enabled: true },
      { name: 'Asset Management', enabled: true },
      { name: 'Claims & Expenses', enabled: true },
      { name: 'AI Features', enabled: true }
    ]
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
    adminEmail: 'admin@startuplabs.com',
    adminName: 'Emily Rodriguez',
    adminPhone: '+1-555-0126',
    country: 'United States',
    industry: 'Technology',
    employees: 30,
    modules: [
      { name: 'Core HR', enabled: true },
      { name: 'Attendance', enabled: true },
      { name: 'Leave Management', enabled: true },
      { name: 'Payroll', enabled: false },
      { name: 'Performance', enabled: false },
      { name: 'Recruitment', enabled: false },
      { name: 'Asset Management', enabled: false },
      { name: 'Claims & Expenses', enabled: false },
      { name: 'AI Features', enabled: false }
    ]
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
    adminEmail: 'admin@innovate.com',
    adminName: 'David Wilson',
    adminPhone: '+1-555-0127',
    country: 'United Kingdom',
    industry: 'Consulting',
    employees: 150,
    modules: [
      { name: 'Core HR', enabled: true },
      { name: 'Attendance', enabled: true },
      { name: 'Leave Management', enabled: true },
      { name: 'Payroll', enabled: true },
      { name: 'Performance', enabled: true },
      { name: 'Recruitment', enabled: true },
      { name: 'Asset Management', enabled: true },
      { name: 'Claims & Expenses', enabled: true },
      { name: 'AI Features', enabled: false }
    ]
  }
];

// Mock subscription plans
const plans = [
  { id: '1', name: 'Standard' },
  { id: '2', name: 'Professional' },
  { id: '3', name: 'Enterprise' }
];

const TenantManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { plans: subscriptionPlans, fetchPlans } = useSubscriptionStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state for new/edit tenant
  const [tenantForm, setTenantForm] = useState({
    name: '',
    domain: '',
    plan: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    country: '',
    industry: '',
    employees: 0,
    modules: [
      { name: 'Core HR', enabled: true },
      { name: 'Attendance', enabled: true },
      { name: 'Leave Management', enabled: true },
      { name: 'Payroll', enabled: false },
      { name: 'Performance', enabled: false },
      { name: 'Recruitment', enabled: false },
      { name: 'Asset Management', enabled: false },
      { name: 'Claims & Expenses', enabled: false },
      { name: 'AI Features', enabled: false }
    ]
  });
  
  // Initialize form when editing a tenant
  useEffect(() => {
    if (selectedTenant) {
      setTenantForm({
        name: selectedTenant.name,
        domain: selectedTenant.domain,
        plan: selectedTenant.plan.toLowerCase(),
        adminName: selectedTenant.adminName,
        adminEmail: selectedTenant.adminEmail,
        adminPhone: selectedTenant.adminPhone,
        country: selectedTenant.country,
        industry: selectedTenant.industry,
        employees: selectedTenant.employees,
        modules: [...selectedTenant.modules]
      });
    } else {
      // Reset form for new tenant
      setTenantForm({
        name: '',
        domain: '',
        plan: 'standard',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        country: '',
        industry: '',
        employees: 0,
        modules: [
          { name: 'Core HR', enabled: true },
          { name: 'Attendance', enabled: true },
          { name: 'Leave Management', enabled: true },
          { name: 'Payroll', enabled: false },
          { name: 'Performance', enabled: false },
          { name: 'Recruitment', enabled: false },
          { name: 'Asset Management', enabled: false },
          { name: 'Claims & Expenses', enabled: false },
          { name: 'AI Features', enabled: false }
        ]
      });
    }
  }, [selectedTenant]);
  
  // Fetch subscription plans
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  
  const handleCreateTenant = () => {
    setSelectedTenant(null);
    setIsCreating(true);
    setTenantDialogOpen(true);
  };
  
  const handleEditTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsCreating(false);
    setTenantDialogOpen(true);
  };
  
  const handleSaveTenant = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving tenant:', tenantForm);
      setIsLoading(false);
      setTenantDialogOpen(false);
    }, 1000);
  };
  
  const handleModuleToggle = (moduleName: string) => {
    setTenantForm(prev => ({
      ...prev,
      modules: prev.modules.map(module => 
        module.name === moduleName 
          ? { ...module, enabled: !module.enabled } 
          : module
      )
    }));
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return format(date, 'MMM dd, yyyy');
  };
  
  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'standard': return 'default';
      case 'professional': return 'primary';
      case 'enterprise': return 'secondary';
      default: return 'default';
    }
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
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tenant Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and manage multi-tenant instances of VibhoHCM.
        </Typography>
      </Box>
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Active Tenants" />
          <Tab label="Trial Tenants" />
          <Tab label="Suspended Tenants" />
        </Tabs>
      </Box>
      
      {/* Active Tenants Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Active Tenants</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateTenant}
          >
            Create Tenant
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tenant</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Storage</TableCell>
                <TableCell>API Usage</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.filter(t => t.status === 'active').map((tenant) => (
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
                      color={getPlanColor(tenant.plan)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{tenant.usersCount.toLocaleString()}</Typography>
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
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditTenant(tenant)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Suspend">
                        <IconButton size="small" color="error">
                          <Cancel />
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
      
      {/* Trial Tenants Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Trial Tenants</Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tenant</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Trial Ends</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.filter(t => t.status === 'trial').map((tenant) => (
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
                      color={getPlanColor(tenant.plan)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{tenant.usersCount.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(tenant.createdAt)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(tenant.nextBillingDate)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditTenant(tenant)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Convert to Paid">
                        <IconButton size="small" color="success">
                          <CheckCircle />
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
      
      {/* Suspended Tenants Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Suspended Tenants</Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tenant</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Suspended Since</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.filter(t => t.status === 'suspended').map((tenant) => (
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
                      color={getPlanColor(tenant.plan)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{tenant.usersCount.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(tenant.lastBillingDate)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reactivate">
                        <IconButton size="small" color="success">
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <Delete />
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
      
      {/* Create/Edit Tenant Dialog */}
      <Dialog
        open={tenantDialogOpen}
        onClose={() => setTenantDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isCreating ? 'Create New Tenant' : `Edit Tenant: ${selectedTenant?.name}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tenant Name"
                  value={tenantForm.name}
                  onChange={(e) => setTenantForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Domain"
                  value={tenantForm.domain}
                  onChange={(e) => setTenantForm(prev => ({ ...prev, domain: e.target.value }))}
                  required
                  sx={{ mb: 2 }}
                  helperText="e.g., company.vibhohcm.com"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Subscription Plan</InputLabel>
                  <Select
                    value={tenantForm.plan}
                    onChange={(e) => setTenantForm(prev => ({ ...prev, plan: e.target.value }))}
                    label="Subscription Plan"
                  >
                    {plans.map((plan) => (
                      <MenuItem key={plan.id} value={plan.name.toLowerCase()}>
                        {plan.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Employees"
                  type="number"
                  value={tenantForm.employees}
                  onChange={(e) => setTenantForm(prev => ({ ...prev, employees: parseInt(e.target.value) }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Admin Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Admin Name"
                  value={tenantForm.adminName}
                  onChange={(e) => setTenantForm(prev => ({ ...prev, adminName: e.target.value }))}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Admin Email"
                  type="email"
                  value={tenantForm.adminEmail}
                  onChange={(e) => setTenantForm(prev => ({ ...prev, adminEmail: e.target.value }))}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Admin Phone"
                  value={tenantForm.adminPhone}
                  onChange={(e) => setTenantForm(prev => ({ ...prev, adminPhone: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={tenantForm.country}
                  onChange={(e) => setTenantForm(prev => ({ ...prev, country: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  value={tenantForm.industry}
                  onChange={(e) => setTenantForm(prev => ({ ...prev, industry: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Enabled Modules
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {tenantForm.modules.map((module, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Switch
                          checked={module.enabled}
                          onChange={() => handleModuleToggle(module.name)}
                        />
                      }
                      label={module.name}
                    />
                  ))}
                </Box>
              </Grid>
              
              {isCreating && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    A welcome email with login instructions will be sent to the admin email address.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTenantDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveTenant}
            disabled={isLoading || !tenantForm.name || !tenantForm.domain || !tenantForm.adminEmail}
          >
            {isLoading ? <CircularProgress size={24} /> : (isCreating ? 'Create Tenant' : 'Save Changes')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantManagement;