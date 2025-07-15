import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Badge
} from '@mui/material';
import {
  PersonAdd,
  Edit,
  Delete,
  Lock,
  LockOpen,
  Key,
  Visibility,
  Group,
  Security,
  Shield,
  AdminPanelSettings,
  Person,
  Business,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Email,
  Phone,
  LocationOn,
  Schedule,
  History
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin: Date;
  createdDate: Date;
  permissions: string[];
  avatar?: string;
  phone?: string;
  location?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  active: boolean;
  systemRole: boolean;
}

interface Permission {
  id: string;
  name: string;
  module: string;
  description: string;
  category: string;
}

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
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const UserManagement: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [userDialogOpen, setUserDialogOpen] = React.useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [newUser, setNewUser] = React.useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    location: '',
    sendWelcomeEmail: true
  });
  const [newRole, setNewRole] = React.useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // Mock users data
  const users: User[] = [
    {
      id: '1',
      name: 'System Administrator',
      email: 'admin@vibhohcm.com',
      role: 'Super Admin',
      department: 'IT',
      status: 'active',
      lastLogin: new Date('2024-02-20T10:30:00'),
      createdDate: new Date('2024-01-01'),
      permissions: ['*'],
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      phone: '+1-555-0100',
      location: 'New York Office'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'hr@vibhohcm.com',
      role: 'HR Manager',
      department: 'Human Resources',
      status: 'active',
      lastLogin: new Date('2024-02-20T09:15:00'),
      createdDate: new Date('2024-01-15'),
      permissions: ['employee:*', 'leave:*', 'payroll:view'],
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      phone: '+1-555-0101',
      location: 'Los Angeles Office'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'manager@vibhohcm.com',
      role: 'Department Manager',
      department: 'Engineering',
      status: 'active',
      lastLogin: new Date('2024-02-19T16:45:00'),
      createdDate: new Date('2024-01-20'),
      permissions: ['employee:view', 'leave:approve', 'attendance:view'],
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      phone: '+1-555-0102',
      location: 'Seattle Office'
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'employee@vibhohcm.com',
      role: 'Employee',
      department: 'Marketing',
      status: 'active',
      lastLogin: new Date('2024-02-20T08:30:00'),
      createdDate: new Date('2024-02-01'),
      permissions: ['profile:view', 'attendance:own', 'leave:request'],
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      phone: '+1-555-0103',
      location: 'Remote'
    }
  ];

  // Mock roles data
  const roles: Role[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['*'],
      userCount: 2,
      active: true,
      systemRole: true
    },
    {
      id: '2',
      name: 'HR Manager',
      description: 'Human resources management and employee lifecycle',
      permissions: ['employee:*', 'leave:*', 'payroll:view', 'reports:hr'],
      userCount: 5,
      active: true,
      systemRole: false
    },
    {
      id: '3',
      name: 'Department Manager',
      description: 'Team management and approval authority',
      permissions: ['employee:view', 'leave:approve', 'attendance:view', 'reports:team'],
      userCount: 15,
      active: true,
      systemRole: false
    },
    {
      id: '4',
      name: 'Employee',
      description: 'Basic employee access to personal data',
      permissions: ['profile:view', 'attendance:own', 'leave:request', 'payroll:own'],
      userCount: 1225,
      active: true,
      systemRole: true
    }
  ];

  // Mock permissions data
  const permissions: Permission[] = [
    { id: 'employee:create', name: 'Create Employees', module: 'Employee Management', description: 'Add new employees to the system', category: 'Employee' },
    { id: 'employee:view', name: 'View Employees', module: 'Employee Management', description: 'View employee profiles and data', category: 'Employee' },
    { id: 'employee:edit', name: 'Edit Employees', module: 'Employee Management', description: 'Modify employee information', category: 'Employee' },
    { id: 'employee:delete', name: 'Delete Employees', module: 'Employee Management', description: 'Remove employees from system', category: 'Employee' },
    { id: 'attendance:view', name: 'View Attendance', module: 'Attendance', description: 'View attendance records', category: 'Attendance' },
    { id: 'attendance:approve', name: 'Approve Regularization', module: 'Attendance', description: 'Approve attendance regularization requests', category: 'Attendance' },
    { id: 'leave:view', name: 'View Leave Requests', module: 'Leave Management', description: 'View leave requests and balances', category: 'Leave' },
    { id: 'leave:approve', name: 'Approve Leave', module: 'Leave Management', description: 'Approve or reject leave requests', category: 'Leave' },
    { id: 'payroll:process', name: 'Process Payroll', module: 'Payroll', description: 'Generate and process payroll', category: 'Payroll' },
    { id: 'payroll:view', name: 'View Payroll', module: 'Payroll', description: 'View payroll data and reports', category: 'Payroll' },
    { id: 'reports:all', name: 'All Reports', module: 'Reports', description: 'Access to all system reports', category: 'Reports' },
    { id: 'reports:team', name: 'Team Reports', module: 'Reports', description: 'Access to team-specific reports', category: 'Reports' },
    { id: 'settings:manage', name: 'Manage Settings', module: 'System', description: 'Configure system settings', category: 'System' },
    { id: 'users:manage', name: 'Manage Users', module: 'User Management', description: 'Create and manage user accounts', category: 'System' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'locked': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'inactive': return <Warning />;
      case 'locked': return <ErrorIcon />;
      default: return <CheckCircle />;
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'Super Admin': return <AdminPanelSettings />;
      case 'HR Manager': return <Group />;
      case 'Department Manager': return <Business />;
      case 'Employee': return <Person />;
      default: return <Person />;
    }
  };

  const handleCreateUser = () => {
    console.log('Creating user:', newUser);
    setUserDialogOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: '',
      department: '',
      phone: '',
      location: '',
      sendWelcomeEmail: true
    });
  };

  const handleCreateRole = () => {
    console.log('Creating role:', newRole);
    setRoleDialogOpen(false);
    setNewRole({
      name: '',
      description: '',
      permissions: []
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone || '',
      location: user.location || '',
      sendWelcomeEmail: false
    });
    setUserDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
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

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, roles, and permissions across the organization.
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Users" />
            <Tab label="Roles" />
            <Tab label="Permissions" />
            <Tab label="Access Logs" />
          </Tabs>
        </Box>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">User Accounts</Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => {
                setSelectedUser(null);
                setNewUser({
                  name: '',
                  email: '',
                  role: '',
                  department: '',
                  phone: '',
                  location: '',
                  sendWelcomeEmail: true
                });
                setUserDialogOpen(true);
              }}
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
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRoleIcon(user.role)}
                        <Typography variant="body2">{user.role}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.department}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(user.lastLogin, 'MMM dd, yyyy HH:mm')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {differenceInDays(new Date(), user.lastLogin)} days ago
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(user.status)}
                        label={user.status.toUpperCase()}
                        color={getStatusColor(user.status)}
                        size="small"
                        variant="outlined"
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
                          <IconButton size="small" onClick={() => handleEditUser(user)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Password">
                          <IconButton size="small">
                            <Key />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={user.status === 'active' ? 'Lock User' : 'Unlock User'}>
                          <IconButton size="small" color={user.status === 'active' ? 'error' : 'success'}>
                            {user.status === 'active' ? <Lock /> : <LockOpen />}
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

        {/* Roles Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Role Management</Typography>
            <Button
              variant="contained"
              startIcon={<Shield />}
              onClick={() => {
                setSelectedRole(null);
                setNewRole({
                  name: '',
                  description: '',
                  permissions: []
                });
                setRoleDialogOpen(true);
              }}
            >
              Create New Role
            </Button>
          </Box>

          <Grid container spacing={3}>
            {roles.map((role) => (
              <Grid item xs={12} md={6} lg={4} key={role.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRoleIcon(role.name)}
                        <Typography variant="h6">{role.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!role.systemRole && (
                          <>
                            <IconButton size="small" onClick={() => handleEditRole(role)}>
                              <Edit />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </>
                        )}
                        {role.systemRole && (
                          <Chip label="System" size="small" color="info" />
                        )}
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
                      {role.permissions.length} permissions assigned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Permissions Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">System Permissions</Typography>
            <Button
              variant="outlined"
              startIcon={<Security />}
              onClick={() => setPermissionDialogOpen(true)}
            >
              Permission Matrix
            </Button>
          </Box>

          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
            <Card key={category} variant="outlined" sx={{ mb: 2 }}>
              <CardHeader title={category} />
              <CardContent>
                <Grid container spacing={2}>
                  {categoryPermissions.map((permission) => (
                    <Grid item xs={12} md={6} key={permission.id}>
                      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {permission.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {permission.module}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {permission.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </TabPanel>

        {/* Access Logs Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            User Access Logs
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Showing recent user access activities and security events.
          </Alert>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    timestamp: new Date('2024-02-20T10:30:00'),
                    user: 'admin@vibhohcm.com',
                    action: 'Login',
                    ip: '192.168.1.100',
                    device: 'Chrome on Windows',
                    status: 'success'
                  },
                  {
                    timestamp: new Date('2024-02-20T09:15:00'),
                    user: 'hr@vibhohcm.com',
                    action: 'Password Reset',
                    ip: '192.168.1.101',
                    device: 'Safari on macOS',
                    status: 'success'
                  },
                  {
                    timestamp: new Date('2024-02-20T08:45:00'),
                    user: 'unknown@example.com',
                    action: 'Failed Login',
                    ip: '203.0.113.1',
                    device: 'Chrome on Android',
                    status: 'failed'
                  }
                ].map((log, index) => (
                  <TableRow key={index} hover>
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
                      <Typography variant="body2" fontFamily="monospace">
                        {log.ip}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.device}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.status}
                        color={log.status === 'success' ? 'success' : 'error'}
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
      </Card>

      {/* User Creation/Edit Dialog */}
      <Dialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    label="Role"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={newUser.department}
                    onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                    label="Department"
                  >
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Human Resources">Human Resources</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Operations">Operations</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Work Location</InputLabel>
                  <Select
                    value={newUser.location}
                    onChange={(e) => setNewUser(prev => ({ ...prev, location: e.target.value }))}
                    label="Work Location"
                  >
                    <MenuItem value="New York Office">New York Office</MenuItem>
                    <MenuItem value="Los Angeles Office">Los Angeles Office</MenuItem>
                    <MenuItem value="Seattle Office">Seattle Office</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newUser.sendWelcomeEmail}
                      onChange={(e) => setNewUser(prev => ({ ...prev, sendWelcomeEmail: e.target.checked }))}
                    />
                  }
                  label="Send welcome email with login credentials"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateUser}>
            {selectedUser ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

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
            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {category}
                </Typography>
                <Grid container spacing={1}>
                  {categoryPermissions.map((permission) => (
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
                              {permission.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRole}>
            {selectedRole ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permission Matrix Dialog */}
      <Dialog
        open={permissionDialogOpen}
        onClose={() => setPermissionDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Permission Matrix</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Permission</TableCell>
                  {roles.map((role) => (
                    <TableCell key={role.id} align="center">
                      {role.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {permission.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {permission.module}
                      </Typography>
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.id} align="center">
                        {role.permissions.includes('*') || role.permissions.includes(permission.id) ? (
                          <CheckCircle color="success" />
                        ) : (
                          <ErrorIcon color="disabled" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};