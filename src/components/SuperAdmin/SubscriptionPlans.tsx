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
  Checkbox,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  AttachMoney,
  Schedule,
  Settings,
  Save,
  Refresh,
  CompareArrows,
  Business,
  Group,
  Storage,
  CloudUpload,
  Security,
  Visibility
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

// Mock subscription plans
const initialPlans = [
  {
    id: '1',
    name: 'Standard',
    description: 'Basic plan for small businesses',
    price: 10,
    billingCycle: 'monthly',
    features: [
      { name: 'Core HR', included: true },
      { name: 'Attendance', included: true },
      { name: 'Leave Management', included: true },
      { name: 'Employee Self-Service', included: true },
      { name: 'Basic Reports', included: true },
      { name: 'Multi-Country Payroll', included: false },
      { name: 'Performance Management', included: false },
      { name: 'Recruitment', included: false },
      { name: 'Asset Management', included: false },
      { name: 'Claims & Expenses', included: false },
      { name: 'AI Features', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'API Access', included: false },
      { name: 'White Labeling', included: false }
    ],
    limits: {
      users: 50,
      storage: 5, // GB
      apiRequests: 1000 // per day
    },
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Professional',
    description: 'Advanced features for growing companies',
    price: 25,
    billingCycle: 'monthly',
    features: [
      { name: 'Core HR', included: true },
      { name: 'Attendance', included: true },
      { name: 'Leave Management', included: true },
      { name: 'Employee Self-Service', included: true },
      { name: 'Basic Reports', included: true },
      { name: 'Multi-Country Payroll', included: true },
      { name: 'Performance Management', included: true },
      { name: 'Recruitment', included: true },
      { name: 'Asset Management', included: true },
      { name: 'Claims & Expenses', included: true },
      { name: 'AI Features', included: false },
      { name: 'Advanced Analytics', included: true },
      { name: 'API Access', included: false },
      { name: 'White Labeling', included: false }
    ],
    limits: {
      users: 200,
      storage: 20, // GB
      apiRequests: 5000 // per day
    },
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'Complete solution for large enterprises',
    price: 50,
    billingCycle: 'monthly',
    features: [
      { name: 'Core HR', included: true },
      { name: 'Attendance', included: true },
      { name: 'Leave Management', included: true },
      { name: 'Employee Self-Service', included: true },
      { name: 'Basic Reports', included: true },
      { name: 'Multi-Country Payroll', included: true },
      { name: 'Performance Management', included: true },
      { name: 'Recruitment', included: true },
      { name: 'Asset Management', included: true },
      { name: 'Claims & Expenses', included: true },
      { name: 'AI Features', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'API Access', included: true },
      { name: 'White Labeling', included: true }
    ],
    limits: {
      users: 'Unlimited',
      storage: 100, // GB
      apiRequests: 'Unlimited' // per day
    },
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-10')
  }
];

// Mock tenants
const tenants = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.vibhohcm.com',
    plan: 'enterprise',
    status: 'active',
    usersCount: 1250,
    createdAt: new Date('2023-01-15'),
    lastBillingDate: new Date('2024-02-01'),
    nextBillingDate: new Date('2024-03-01')
  },
  {
    id: '2',
    name: 'TechStart Inc',
    domain: 'techstart.vibhohcm.com',
    plan: 'professional',
    status: 'active',
    usersCount: 85,
    createdAt: new Date('2023-03-10'),
    lastBillingDate: new Date('2024-02-10'),
    nextBillingDate: new Date('2024-03-10')
  },
  {
    id: '3',
    name: 'Global Enterprises',
    domain: 'global.vibhohcm.com',
    plan: 'enterprise',
    status: 'active',
    usersCount: 3200,
    createdAt: new Date('2023-02-05'),
    lastBillingDate: new Date('2024-02-05'),
    nextBillingDate: new Date('2024-03-05')
  },
  {
    id: '4',
    name: 'Startup Labs',
    domain: 'startuplabs.vibhohcm.com',
    plan: 'standard',
    status: 'trial',
    usersCount: 25,
    createdAt: new Date('2024-01-20'),
    lastBillingDate: null,
    nextBillingDate: new Date('2024-03-20')
  },
  {
    id: '5',
    name: 'Innovate Solutions',
    domain: 'innovate.vibhohcm.com',
    plan: 'professional',
    status: 'suspended',
    usersCount: 120,
    createdAt: new Date('2023-05-12'),
    lastBillingDate: new Date('2024-01-12'),
    nextBillingDate: new Date('2024-02-12')
  }
];

// Mock subscription history
const subscriptionHistory = [
  {
    id: '1',
    tenantId: '1',
    tenantName: 'Acme Corporation',
    action: 'plan_change',
    fromPlan: 'professional',
    toPlan: 'enterprise',
    date: new Date('2023-12-15'),
    performedBy: 'admin@vibhohcm.com',
    notes: 'Upgraded to Enterprise plan due to increased user count'
  },
  {
    id: '2',
    tenantId: '2',
    tenantName: 'TechStart Inc',
    action: 'plan_change',
    fromPlan: 'standard',
    toPlan: 'professional',
    date: new Date('2023-11-10'),
    performedBy: 'admin@vibhohcm.com',
    notes: 'Upgraded to Professional plan to access additional features'
  },
  {
    id: '3',
    tenantId: '5',
    tenantName: 'Innovate Solutions',
    action: 'suspension',
    fromPlan: 'professional',
    toPlan: 'professional',
    date: new Date('2024-02-12'),
    performedBy: 'system',
    notes: 'Subscription suspended due to payment failure'
  },
  {
    id: '4',
    tenantId: '4',
    tenantName: 'Startup Labs',
    action: 'trial_started',
    fromPlan: null,
    toPlan: 'standard',
    date: new Date('2024-01-20'),
    performedBy: 'admin@vibhohcm.com',
    notes: '30-day trial period started'
  }
];

const SubscriptionPlans: React.FC = () => {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState(initialPlans);
  const [planDialogOpen, setplanDialogOpen] = useState(false);
  const [changePlanDialogOpen, setChangePlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Form state for new/edit plan
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: 0,
    billingCycle: 'monthly',
    features: initialPlans[0].features.map(f => ({ ...f, included: false })),
    limits: {
      users: 0,
      storage: 0,
      apiRequests: 0
    },
    isActive: true
  });

  // Form state for changing tenant plan
  const [changePlanForm, setChangePlanForm] = useState({
    newPlanId: '',
    effectiveDate: format(new Date(), 'yyyy-MM-dd'),
    prorated: true,
    sendNotification: true,
    notes: ''
  });

  // Initialize form when editing a plan
  useEffect(() => {
    if (selectedPlan) {
      setPlanForm({
        name: selectedPlan.name,
        description: selectedPlan.description,
        price: selectedPlan.price,
        billingCycle: selectedPlan.billingCycle,
        features: selectedPlan.features,
        limits: { ...selectedPlan.limits },
        isActive: selectedPlan.isActive
      });
    } else {
      // Reset form for new plan
      setPlanForm({
        name: '',
        description: '',
        price: 0,
        billingCycle: 'monthly',
        features: initialPlans[0].features.map(f => ({ ...f, included: false })),
        limits: {
          users: 0,
          storage: 0,
          apiRequests: 0
        },
        isActive: true
      });
    }
  }, [selectedPlan]);

  // Initialize form when changing tenant plan
  useEffect(() => {
    if (selectedTenant) {
      setChangePlanForm({
        newPlanId: '',
        effectiveDate: format(new Date(), 'yyyy-MM-dd'),
        prorated: true,
        sendNotification: true,
        notes: ''
      });
    }
  }, [selectedTenant]);

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setplanDialogOpen(true);
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setplanDialogOpen(true);
  };

  const handleChangeTenantPlan = (tenant: any) => {
    setSelectedTenant(tenant);
    setChangePlanDialogOpen(true);
  };

  const handleSavePlan = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedPlan) {
        // Update existing plan
        setPlans(prevPlans => 
          prevPlans.map(p => 
            p.id === selectedPlan.id 
              ? { 
                  ...p, 
                  ...planForm,
                  updatedAt: new Date()
                } 
              : p
          )
        );
      } else {
        // Create new plan
        const newPlan = {
          ...planForm,
          id: `${plans.length + 1}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setPlans(prevPlans => [...prevPlans, newPlan]);
      }
      
      setIsLoading(false);
      setplanDialogOpen(false);
    }, 1000);
  };

  const handleSubmitPlanChange = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would update the tenant's plan
      console.log('Changing plan for tenant:', selectedTenant?.name);
      console.log('New plan:', plans.find(p => p.id === changePlanForm.newPlanId)?.name);
      console.log('Change details:', changePlanForm);
      
      // Add to subscription history
      const newHistoryEntry = {
        id: `${subscriptionHistory.length + 1}`,
        tenantId: selectedTenant.id,
        tenantName: selectedTenant.name,
        action: 'plan_change',
        fromPlan: selectedTenant.plan,
        toPlan: plans.find(p => p.id === changePlanForm.newPlanId)?.name || '',
        date: new Date(),
        performedBy: user?.name || 'admin',
        notes: changePlanForm.notes
      };
      
      // In a real app, this would be handled by the API
      
      setIsLoading(false);
      setChangePlanDialogOpen(false);
    }, 1000);
  };

  const handleDeletePlan = (planId: string) => {
    // Check if any tenants are using this plan
    const tenantsUsingPlan = tenants.filter(t => 
      t.plan === plans.find(p => p.id === planId)?.name
    );
    
    if (tenantsUsingPlan.length > 0) {
      alert(`Cannot delete this plan as it is being used by ${tenantsUsingPlan.length} tenant(s).`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setPlans(prevPlans => prevPlans.filter(p => p.id !== planId));
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleFeatureToggle = (featureName: string) => {
    setPlanForm(prev => ({
      ...prev,
      features: prev.features.map(feature => 
        feature.name === featureName 
          ? { ...feature, included: !feature.included } 
          : feature
      )
    }));
  };

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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'plan_change': return 'primary';
      case 'trial_started': return 'info';
      case 'suspension': return 'error';
      case 'reactivation': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Subscription Plans
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage subscription plans, pricing, and tenant subscriptions.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Plans" />
          <Tab label="Tenant Subscriptions" />
          <Tab label="Subscription History" />
        </Tabs>
      </Box>

      {/* Plans Tab */}
      {activeTab === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Subscription Plans</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreatePlan}
            >
              Create Plan
            </Button>
          </Box>

          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    height: '100%',
                    borderColor: plan.name.toLowerCase() === 'enterprise' ? 'secondary.main' : 
                               plan.name.toLowerCase() === 'professional' ? 'primary.main' : 
                               'divider'
                  }}
                >
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{plan.name}</Typography>
                        <Chip 
                          label={plan.isActive ? 'Active' : 'Inactive'} 
                          color={plan.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    }
                    subheader={plan.description}
                  />
                  <CardContent>
                    <Typography variant="h4" color="primary.main" gutterBottom>
                      {formatCurrency(plan.price)}<Typography variant="body2" component="span" color="text.secondary">/{plan.billingCycle}</Typography>
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Features
                    </Typography>
                    <List dense>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            {feature.included ? (
                              <CheckCircle fontSize="small" color="success" />
                            ) : (
                              <Cancel fontSize="small" color="disabled" />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={feature.name} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Limits
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Users:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {typeof plan.limits.users === 'number' ? plan.limits.users : plan.limits.users}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Storage:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {typeof plan.limits.storage === 'number' ? `${plan.limits.storage} GB` : plan.limits.storage}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">API Requests:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {typeof plan.limits.apiRequests === 'number' ? `${plan.limits.apiRequests.toLocaleString()}/day` : plan.limits.apiRequests}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEditPlan(plan)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Tenant Subscriptions Tab */}
      {activeTab === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Tenant Subscriptions</Typography>
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
                  <TableCell>Current Plan</TableCell>
                  <TableCell>Users</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Billing</TableCell>
                  <TableCell>Next Billing</TableCell>
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
                        label={tenant.plan.toUpperCase()}
                        color={getPlanColor(tenant.plan)}
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
                      <Typography variant="body2">{formatDate(tenant.lastBillingDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(tenant.nextBillingDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Change Plan">
                          <IconButton 
                            size="small"
                            onClick={() => handleChangeTenantPlan(tenant)}
                          >
                            <CompareArrows />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
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
        </>
      )}

      {/* Subscription History Tab */}
      {activeTab === 2 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Subscription History</Typography>
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
                  <TableCell>Date</TableCell>
                  <TableCell>Tenant</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>From Plan</TableCell>
                  <TableCell>To Plan</TableCell>
                  <TableCell>Performed By</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptionHistory.map((history) => (
                  <TableRow key={history.id} hover>
                    <TableCell>
                      <Typography variant="body2">{format(history.date, 'MMM dd, yyyy')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {history.tenantName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={history.action.replace('_', ' ').toUpperCase()}
                        color={getActionColor(history.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {history.fromPlan ? (
                        <Chip
                          label={history.fromPlan.toUpperCase()}
                          color={getPlanColor(history.fromPlan)}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Typography variant="body2">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={history.toPlan.toUpperCase()}
                        color={getPlanColor(history.toPlan)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{history.performedBy}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{history.notes}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Create/Edit Plan Dialog */}
      <Dialog
        open={planDialogOpen}
        onClose={() => setplanDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPlan ? `Edit Plan: ${selectedPlan.name}` : 'Create New Subscription Plan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plan Name"
                  value={planForm.name}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={planForm.price}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <AttachMoney />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={planForm.description}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Billing Cycle</InputLabel>
                  <Select
                    value={planForm.billingCycle}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, billingCycle: e.target.value }))}
                    label="Billing Cycle"
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="annually">Annually</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={planForm.isActive}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label="Active"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Plan Limits
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="User Limit"
                  type="text"
                  value={planForm.limits.users}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase() === 'unlimited' ? 'Unlimited' : parseInt(e.target.value);
                    setPlanForm(prev => ({
                      ...prev,
                      limits: {
                        ...prev.limits,
                        users: value
                      }
                    }));
                  }}
                  helperText="Enter a number or 'Unlimited'"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Storage (GB)"
                  type="text"
                  value={planForm.limits.storage}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase() === 'unlimited' ? 'Unlimited' : parseInt(e.target.value);
                    setPlanForm(prev => ({
                      ...prev,
                      limits: {
                        ...prev.limits,
                        storage: value
                      }
                    }));
                  }}
                  helperText="Enter a number or 'Unlimited'"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="API Requests/day"
                  type="text"
                  value={planForm.limits.apiRequests}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase() === 'unlimited' ? 'Unlimited' : parseInt(e.target.value);
                    setPlanForm(prev => ({
                      ...prev,
                      limits: {
                        ...prev.limits,
                        apiRequests: value
                      }
                    }));
                  }}
                  helperText="Enter a number or 'Unlimited'"
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {planForm.features.map((feature, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={feature.included}
                          onChange={() => handleFeatureToggle(feature.name)}
                        />
                      }
                      label={feature.name}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setplanDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSavePlan}
            disabled={isLoading || !planForm.name || planForm.price <= 0}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save Plan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Tenant Plan Dialog */}
      <Dialog
        open={changePlanDialogOpen}
        onClose={() => setChangePlanDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Change Subscription Plan
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {selectedTenant && (
              <>
                <Alert severity="info" sx={{ mb: 3 }}>
                  You are changing the subscription plan for <strong>{selectedTenant.name}</strong>. 
                  Current plan: <strong>{selectedTenant.plan.toUpperCase()}</strong>
                </Alert>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>New Plan</InputLabel>
                  <Select
                    value={changePlanForm.newPlanId}
                    onChange={(e) => setChangePlanForm(prev => ({ ...prev, newPlanId: e.target.value }))}
                    label="New Plan"
                    required
                  >
                    {plans.filter(p => p.isActive).map((plan) => (
                      <MenuItem 
                        key={plan.id} 
                        value={plan.id}
                        disabled={plan.name.toLowerCase() === selectedTenant.plan.toLowerCase()}
                      >
                        {plan.name} ({formatCurrency(plan.price)}/{plan.billingCycle})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Effective Date"
                  type="date"
                  value={changePlanForm.effectiveDate}
                  onChange={(e) => setChangePlanForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={changePlanForm.prorated}
                      onChange={(e) => setChangePlanForm(prev => ({ ...prev, prorated: e.target.checked }))}
                    />
                  }
                  label="Prorate charges for current billing period"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={changePlanForm.sendNotification}
                      onChange={(e) => setChangePlanForm(prev => ({ ...prev, sendNotification: e.target.checked }))}
                    />
                  }
                  label="Send notification to tenant admin"
                  sx={{ mb: 3, display: 'block' }}
                />
                
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={changePlanForm.notes}
                  onChange={(e) => setChangePlanForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Reason for plan change or any special instructions"
                />
                
                {changePlanForm.newPlanId && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Plan Change Summary
                    </Typography>
                    
                    <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Current Plan:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedTenant.plan.toUpperCase()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">New Plan:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {plans.find(p => p.id === changePlanForm.newPlanId)?.name.toUpperCase()}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Current Price:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(plans.find(p => p.name.toLowerCase() === selectedTenant.plan.toLowerCase())?.price || 0)}/
                            {plans.find(p => p.name.toLowerCase() === selectedTenant.plan.toLowerCase())?.billingCycle}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">New Price:</Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(plans.find(p => p.id === changePlanForm.newPlanId)?.price || 0)}/
                            {plans.find(p => p.id === changePlanForm.newPlanId)?.billingCycle}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Effective Date:</Typography>
                          <Typography variant="body1">
                            {format(new Date(changePlanForm.effectiveDate), 'MMMM d, yyyy')}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePlanDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitPlanChange}
            disabled={isLoading || !changePlanForm.newPlanId}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Change Plan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPlans;