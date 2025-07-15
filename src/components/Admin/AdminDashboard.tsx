import React from 'react';
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
  Tab,
  Tabs,
  Badge,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Dashboard,
  People,
  Settings,
  Security,
  Analytics,
  Notifications,
  Business,
  AccountBalance,
  Assignment,
  Work,
  Inventory,
  CalendarMonth,
  Receipt,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Upload,
  Refresh,
  Email,
  Sms,
  Phone,
  Schedule,
  Group,
  PersonAdd,
  Build,
  Support,
  History,
  Lock,
  Key,
  Shield
} from '@mui/icons-material';
import { format, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useLeaveStore } from '../../store/useLeaveStore';
import { usePayrollStore } from '../../store/usePayrollStore';

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface SystemMetrics {
  totalEmployees: number;
  activeEmployees: number;
  employeesOnLeave: number;
  totalClients: number;
  activeProjects: number;
  pendingApprovals: number;
  systemHealth: number;
  storageUsed: number;
  monthlyActiveUsers: number;
  systemUptime: number;
}

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  active: boolean;
  createdDate: Date;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { can } = usePermission();
  const { getAttendanceStats } = useAttendanceStore();
  const { requests: leaveRequests } = useLeaveStore();
  const { getPayrollStats } = usePayrollStore();
  
  const [tabValue, setTabValue] = React.useState(0);
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [userDialogOpen, setUserDialogOpen] = React.useState(false);
  const [systemConfigDialogOpen, setSystemConfigDialogOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(null);
  const [newRole, setNewRole] = React.useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // Mock system metrics
  const systemMetrics: SystemMetrics = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    employeesOnLeave: leaveRequests.filter(r => r.status === 'approved').length,
    totalClients: 45,
    activeProjects: 128,
    pendingApprovals: 23,
    systemHealth: 98.5,
    storageUsed: 67.3,
    monthlyActiveUsers: 1198,
    systemUptime: 99.9
  };

  // Mock audit logs
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: new Date('2024-02-20T10:30:00'),
      user: 'admin@vibhohcm.com',
      action: 'Employee Created',
      module: 'Employee Management',
      details: 'Created employee John Smith (EMP001)',
      ipAddress: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      timestamp: new Date('2024-02-20T09:15:00'),
      user: 'hr@vibhohcm.com',
      action: 'Payroll Processed',
      module: 'Payroll',
      details: 'Processed February 2024 payroll for 1,247 employees',
      ipAddress: '192.168.1.101',
      status: 'success'
    },
    {
      id: '3',
      timestamp: new Date('2024-02-20T08:45:00'),
      user: 'manager@vibhohcm.com',
      action: 'Leave Approved',
      module: 'Leave Management',
      details: 'Approved annual leave for Sarah Johnson',
      ipAddress: '192.168.1.102',
      status: 'success'
    },
    {
      id: '4',
      timestamp: new Date('2024-02-19T16:20:00'),
      user: 'system',
      action: 'Backup Failed',
      module: 'System',
      details: 'Daily backup process failed - storage full',
      ipAddress: 'localhost',
      status: 'failed'
    }
  ];

  // Mock user roles
  const userRoles: UserRole[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['*'],
      userCount: 2,
      active: true,
      createdDate: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'HR Manager',
      description: 'Human resources management and employee lifecycle',
      permissions: ['employee:*', 'leave:*', 'payroll:view', 'reports:hr'],
      userCount: 5,
      active: true,
      createdDate: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Department Manager',
      description: 'Team management and approval authority',
      permissions: ['employee:view', 'leave:approve', 'attendance:view', 'reports:team'],
      userCount: 15,
      active: true,
      createdDate: new Date('2024-01-01')
    },
    {
      id: '4',
      name: 'Employee',
      description: 'Basic employee access to personal data',
      permissions: ['profile:view', 'attendance:own', 'leave:request', 'payroll:own'],
      userCount: 1225,
      active: true,
      createdDate: new Date('2024-01-01')
    }
  ];

  // Available permissions
  const availablePermissions = [
    { id: 'employee:create', name: 'Create Employees', module: 'Employee Management' },
    { id: 'employee:view', name: 'View Employees', module: 'Employee Management' },
    { id: 'employee:edit', name: 'Edit Employees', module: 'Employee Management' },
    { id: 'employee:delete', name: 'Delete Employees', module: 'Employee Management' },
    { id: 'attendance:view', name: 'View Attendance', module: 'Attendance' },
    { id: 'attendance:approve', name: 'Approve Regularization', module: 'Attendance' },
    { id: 'leave:view', name: 'View Leave Requests', module: 'Leave Management' },
    { id: 'leave:approve', name: 'Approve Leave', module: 'Leave Management' },
    { id: 'payroll:process', name: 'Process Payroll', module: 'Payroll' },
    { id: 'payroll:view', name: 'View Payroll', module: 'Payroll' },
    { id: 'reports:all', name: 'All Reports', module: 'Reports' },
    { id: 'reports:team', name: 'Team Reports', module: 'Reports' },
    { id: 'settings:manage', name: 'Manage Settings', module: 'System' },
    { id: 'users:manage', name: 'Manage Users', module: 'User Management' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'failed': return <ErrorIcon />;
      case 'warning': return <Warning />;
      default: return <CheckCircle />;
    }
  };

  const handleCreateRole = () => {
    console.log('Creating role:', newRole);
    setRoleDialogOpen(false);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setRoleDialogOpen(true);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          System Administration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete system control and organizational management dashboard.
        </Typography>
      </Box>

      {/* System Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {systemMetrics.totalEmployees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Employees
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                <Typography variant="caption" color="success.main">
                  {systemMetrics.activeEmployees} Active
                </Typography>
                <Typography variant="caption" color="warning.main">
                  {systemMetrics.employeesOnLeave} On Leave
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Business sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {systemMetrics.totalClients}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Clients
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {systemMetrics.activeProjects} Active Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {systemMetrics.pendingApprovals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Approvals
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Across all modules
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Analytics sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                {systemMetrics.systemHealth}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System Health
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {systemMetrics.systemUptime}% Uptime
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <PermissionGate permission={PERMISSIONS.DASHBOARD_GLOBAL}>
              <Tab label="System Overview" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.SYSTEM_MANAGE_USERS}>
              <Tab label="User Management" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.SYSTEM_MANAGE_ROLES}>
              <Tab label="Role & Permissions" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.SYSTEM_CONFIGURE}>
              <Tab label="System Configuration" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.SYSTEM_CONFIGURE}>
              <Tab label="Audit Logs" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.REPORTS_ALL}>
              <Tab label="Reports & Analytics" />
            </PermissionGate>
          </Tabs>
        </Box>

        {/* System Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="System Performance" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">CPU Usage</Typography>
                        <Typography variant="body2" fontWeight="medium">45%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={45} color="success" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Memory Usage</Typography>
                        <Typography variant="body2" fontWeight="medium">62%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={62} color="warning" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Storage Used</Typography>
                        <Typography variant="body2" fontWeight="medium">{systemMetrics.storageUsed}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={systemMetrics.storageUsed} color="info" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Database Performance</Typography>
                        <Typography variant="body2" fontWeight="medium">92%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={92} color="success" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Recent System Activities" />
                <CardContent>
                  <List>
                    {auditLogs.slice(0, 5).map((log, index) => (
                      <React.Fragment key={log.id}>
                        <ListItem>
                          <ListItemIcon>
                            {getStatusIcon(log.status)}
                          </ListItemIcon>
                          <ListItemText
                            primary={log.action}
                            secondary={`${log.user} • ${format(log.timestamp, 'MMM dd, HH:mm')}`}
                          />
                          <ListItemSecondaryAction>
                            <Chip
                              label={log.status}
                              color={getStatusColor(log.status)}
                              size="small"
                              variant="outlined"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < 4 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardHeader title="Quick Actions" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<PersonAdd />}
                        onClick={() => setUserDialogOpen(true)}
                      >
                        Add New User
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Upload />}
                      >
                        Bulk Import
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Download />}
                      >
                        System Backup
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Settings />}
                        onClick={() => setSystemConfigDialogOpen(true)}
                      >
                        System Settings
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* User Management Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">User Management</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setUserDialogOpen(true)}
            >
              Add New User
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.slice(0, 10).map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {employee.personalInfo.firstName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.personalInfo.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label="Employee" size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{employee.companyInfo.department}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status}
                        color={employee.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Password">
                          <IconButton size="small">
                            <Key />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Deactivate">
                          <IconButton size="small" color="error">
                            <Lock />
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

        {/* Role & Permissions Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Role & Permission Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedRole(null);
                setNewRole({ name: '', description: '', permissions: [] });
                setRoleDialogOpen(true);
              }}
            >
              Create New Role
            </Button>
          </Box>
          <Grid container spacing={3}>
            {userRoles.map((role) => (
              <Grid item xs={12} md={6} lg={4} key={role.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{role.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleEditRole(role)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {role.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="body2">
                        <strong>{role.userCount}</strong> users
                      </Typography>
                      <Chip
                        label={role.active ? 'Active' : 'Inactive'}
                        color={role.active ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Created: {format(role.createdDate, 'MMM dd, yyyy')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* System Configuration Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            System Configuration
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="General Settings" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="SMS Notifications"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Auto Backup"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Maintenance Mode"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Audit Logging"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Security Settings" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Two-Factor Authentication"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Password Complexity"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Session Timeout"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="IP Whitelisting"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Login Attempt Limits"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardHeader title="Integration Settings" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Email sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">Email Service</Typography>
                        <Chip label="Connected" color="success" size="small" sx={{ mt: 1 }} />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Sms sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">SMS Gateway</Typography>
                        <Chip label="Connected" color="success" size="small" sx={{ mt: 1 }} />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Phone sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">WhatsApp API</Typography>
                        <Chip label="Connected" color="success" size="small" sx={{ mt: 1 }} />
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <AccountBalance sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">Payment Gateway</Typography>
                        <Chip label="Disconnected" color="error" size="small" sx={{ mt: 1 }} />
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Audit Logs Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">System Audit Logs</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<Download />}>
                Export Logs
              </Button>
              <Button variant="outlined" startIcon={<Refresh />}>
                Refresh
              </Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {log.user}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.action}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={log.module} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                        {log.details}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {log.ipAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(log.status)}
                        label={log.status}
                        color={getStatusColor(log.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Reports & Analytics Tab */}
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>
            System Reports & Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Quick Reports" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Employee Master Report
                    </Button>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Attendance Summary
                    </Button>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Leave Balance Report
                    </Button>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      Payroll Summary
                    </Button>
                    <Button variant="outlined" startIcon={<Download />} fullWidth>
                      System Usage Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Analytics Dashboard" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Monthly Active Users</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {systemMetrics.monthlyActiveUsers}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Average Session Duration</Typography>
                      <Typography variant="body2" fontWeight="medium">2h 45m</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Most Used Module</Typography>
                      <Typography variant="body2" fontWeight="medium">Attendance</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Peak Usage Time</Typography>
                      <Typography variant="body2" fontWeight="medium">9:00 AM - 11:00 AM</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">System Errors (24h)</Typography>
                      <Typography variant="body2" fontWeight="medium" color="error.main">3</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Role Creation/Edit Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedRole ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Role Name"
              value={newRole.name}
              onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={newRole.description}
              onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 3 }}
            />
            <Typography variant="h6" gutterBottom>
              Permissions
            </Typography>
            <Grid container spacing={1}>
              {availablePermissions.map((permission) => (
                <Grid item xs={12} md={6} key={permission.id}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newRole.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">{permission.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {permission.module}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRole}>
            {selectedRole ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Creation Dialog */}
      <Dialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select label="Role">
                {userRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select label="Department">
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Human Resources">Human Resources</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send welcome email with login credentials"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create User</Button>
        </DialogActions>
      </Dialog>

      {/* System Configuration Dialog */}
      <Dialog
        open={systemConfigDialogOpen}
        onClose={() => setSystemConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>System Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Changes to system configuration may affect all users. Please proceed with caution.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  defaultValue="VibhoHCM Solutions"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="System Timezone"
                  defaultValue="UTC+05:30"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Default Currency"
                  defaultValue="INR"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date Format"
                  defaultValue="DD/MM/YYYY"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Support Email"
                  defaultValue="support@vibhohcm.com"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSystemConfigDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Configuration</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};