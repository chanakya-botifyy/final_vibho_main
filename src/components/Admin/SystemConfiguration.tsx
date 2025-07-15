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
  Divider,
  Alert,
  Chip,
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Settings,
  Business,
  Security,
  Notifications,
  Storage,
  Schedule,
  Language,
  Palette,
  Add,
  Edit,
  Delete,
  Save,
  Refresh,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  CalendarMonth,
  Email,
  Sms,
  Phone,
  Cloud
} from '@mui/icons-material';

interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'national' | 'regional' | 'company';
  optional: boolean;
  description?: string;
}

interface ClientProject {
  id: string;
  clientName: string;
  projectName: string;
  clientManager: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'on_hold';
  budget?: number;
}

export const SystemConfiguration: React.FC = () => {
  const [holidayDialogOpen, setHolidayDialogOpen] = React.useState(false);
  const [clientDialogOpen, setClientDialogOpen] = React.useState(false);
  const [selectedHoliday, setSelectedHoliday] = React.useState<Holiday | null>(null);
  const [newHoliday, setNewHoliday] = React.useState({
    name: '',
    date: '',
    type: 'national' as const,
    optional: false,
    description: ''
  });

  // Mock holidays data
  const holidays: Holiday[] = [
    {
      id: '1',
      name: 'New Year\'s Day',
      date: new Date('2024-01-01'),
      type: 'national',
      optional: false,
      description: 'National holiday celebrating the new year'
    },
    {
      id: '2',
      name: 'Independence Day',
      date: new Date('2024-08-15'),
      type: 'national',
      optional: false,
      description: 'National independence day celebration'
    },
    {
      id: '3',
      name: 'Company Foundation Day',
      date: new Date('2024-03-15'),
      type: 'company',
      optional: true,
      description: 'Annual company foundation celebration'
    }
  ];

  // Mock clients and projects
  const clientProjects: ClientProject[] = [
    {
      id: '1',
      clientName: 'TechCorp Solutions',
      projectName: 'Digital Transformation',
      clientManager: 'John Smith',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-31'),
      status: 'active',
      budget: 500000
    },
    {
      id: '2',
      clientName: 'Global Industries',
      projectName: 'ERP Implementation',
      clientManager: 'Sarah Johnson',
      startDate: new Date('2024-02-01'),
      status: 'active',
      budget: 750000
    }
  ];

  const handleAddHoliday = () => {
    console.log('Adding holiday:', newHoliday);
    setHolidayDialogOpen(false);
    setNewHoliday({
      name: '',
      date: '',
      type: 'national',
      optional: false,
      description: ''
    });
  };

  const getHolidayTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'primary';
      case 'regional': return 'secondary';
      case 'company': return 'info';
      default: return 'default';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'on_hold': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          System Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure organizational settings, policies, and system parameters.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Company Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Company Settings"
              avatar={<Business />}
              action={
                <Button startIcon={<Save />} variant="outlined" size="small">
                  Save
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  defaultValue="VibhoHCM Solutions"
                />
                <TextField
                  fullWidth
                  label="Company Address"
                  multiline
                  rows={2}
                  defaultValue="123 Business Street, Tech City, TC 12345"
                />
                <TextField
                  fullWidth
                  label="Contact Email"
                  defaultValue="contact@vibhohcm.com"
                />
                <TextField
                  fullWidth
                  label="Contact Phone"
                  defaultValue="+1-555-0123"
                />
                <FormControl fullWidth>
                  <InputLabel>Default Currency</InputLabel>
                  <Select defaultValue="USD" label="Default Currency">
                    <MenuItem value="USD">USD - US Dollar</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="GBP">GBP - British Pound</MenuItem>
                    <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select defaultValue="UTC-5" label="Timezone">
                    <MenuItem value="UTC-5">UTC-5 (Eastern Time)</MenuItem>
                    <MenuItem value="UTC-8">UTC-8 (Pacific Time)</MenuItem>
                    <MenuItem value="UTC+0">UTC+0 (GMT)</MenuItem>
                    <MenuItem value="UTC+5:30">UTC+5:30 (IST)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="System Preferences"
              avatar={<Settings />}
              action={
                <Button startIcon={<Save />} variant="outlined" size="small">
                  Save
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select defaultValue="MM/DD/YYYY" label="Date Format">
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Time Format</InputLabel>
                  <Select defaultValue="12" label="Time Format">
                    <MenuItem value="12">12 Hour (AM/PM)</MenuItem>
                    <MenuItem value="24">24 Hour</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Week Start Day</InputLabel>
                  <Select defaultValue="monday" label="Week Start Day">
                    <MenuItem value="sunday">Sunday</MenuItem>
                    <MenuItem value="monday">Monday</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable Email Notifications"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable SMS Notifications"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Maintenance Mode"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto Backup"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Holiday Management */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Holiday Management"
              avatar={<CalendarMonth />}
              action={
                <Button
                  startIcon={<Add />}
                  variant="contained"
                  onClick={() => setHolidayDialogOpen(true)}
                >
                  Add Holiday
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Holiday Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Optional</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holidays.map((holiday) => (
                      <TableRow key={holiday.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {holiday.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {holiday.date.toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={holiday.type.toUpperCase()}
                            color={getHolidayTypeColor(holiday.type)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={holiday.optional ? 'Optional' : 'Mandatory'}
                            color={holiday.optional ? 'warning' : 'success'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {holiday.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <Edit />
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
            </CardContent>
          </Card>
        </Grid>

        {/* Client & Project Management */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Client & Project Management"
              avatar={<Business />}
              action={
                <Button
                  startIcon={<Add />}
                  variant="contained"
                  onClick={() => setClientDialogOpen(true)}
                >
                  Add Client/Project
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Client Name</TableCell>
                      <TableCell>Project Name</TableCell>
                      <TableCell>Client Manager</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>Budget</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clientProjects.map((project) => (
                      <TableRow key={project.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {project.clientName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {project.projectName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {project.clientManager}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {project.startDate.toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={project.status.replace('_', ' ').toUpperCase()}
                            color={getProjectStatusColor(project.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <Edit />
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
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Security Settings"
              avatar={<Security />}
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Enhanced security for admin accounts"
                  />
                  <ListItemSecondaryAction>
                    <Switch defaultChecked />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Password Complexity"
                    secondary="Enforce strong password requirements"
                  />
                  <ListItemSecondaryAction>
                    <Switch defaultChecked />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Session Timeout"
                    secondary="Auto logout after 30 minutes of inactivity"
                  />
                  <ListItemSecondaryAction>
                    <Switch defaultChecked />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ErrorIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="IP Whitelisting"
                    secondary="Restrict access to specific IP addresses"
                  />
                  <ListItemSecondaryAction>
                    <Switch />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Integration Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Integration Status"
              avatar={<Cloud />}
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Service (SendGrid)"
                    secondary="Connected and operational"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Connected" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Sms color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="SMS Gateway (Twilio)"
                    secondary="Connected with 1,250 credits remaining"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Connected" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="WhatsApp Business API"
                    secondary="Connected and verified"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Connected" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Storage color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cloud Storage (AWS S3)"
                    secondary="67.3% of 1TB used"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Connected" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Holiday Dialog */}
      <Dialog
        open={holidayDialogOpen}
        onClose={() => setHolidayDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Holiday</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Holiday Name"
              value={newHoliday.name}
              onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Holiday Type</InputLabel>
              <Select
                value={newHoliday.type}
                onChange={(e) => setNewHoliday(prev => ({ ...prev, type: e.target.value as any }))}
                label="Holiday Type"
              >
                <MenuItem value="national">National</MenuItem>
                <MenuItem value="regional">Regional</MenuItem>
                <MenuItem value="company">Company</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={newHoliday.optional}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, optional: e.target.checked }))}
                />
              }
              label="Optional Holiday"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={newHoliday.description}
              onChange={(e) => setNewHoliday(prev => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHolidayDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddHoliday}>
            Add Holiday
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Client/Project Dialog */}
      <Dialog
        open={clientDialogOpen}
        onClose={() => setClientDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Client & Project</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Client Name"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Client Manager</InputLabel>
                  <Select label="Client Manager">
                    <MenuItem value="john.smith">John Smith</MenuItem>
                    <MenuItem value="sarah.johnson">Sarah Johnson</MenuItem>
                    <MenuItem value="michael.chen">Michael Chen</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date (Optional)"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Budget (Optional)"
                  type="number"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Description"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClientDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Add Client & Project</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};