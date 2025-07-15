import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
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
  IconButton,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Business,
  Group,
  CalendarMonth,
  Receipt,
  LocationOn,
  Schedule,
  Settings,
  Save,
  Cancel
} from '@mui/icons-material';

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
      id={`master-data-tabpanel-${index}`}
      aria-labelledby={`master-data-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const MasterDataManagement: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const [currentDataType, setCurrentDataType] = React.useState('');

  // Mock master data
  const departments = [
    { id: '1', name: 'Engineering', code: 'ENG', manager: 'Michael Chen', employees: 450, active: true },
    { id: '2', name: 'Human Resources', code: 'HR', manager: 'Sarah Johnson', employees: 25, active: true },
    { id: '3', name: 'Sales', code: 'SAL', manager: 'David Wilson', employees: 180, active: true },
    { id: '4', name: 'Marketing', code: 'MKT', manager: 'Emily Rodriguez', employees: 65, active: true },
    { id: '5', name: 'Finance', code: 'FIN', manager: 'Robert Brown', employees: 35, active: true }
  ];

  const designations = [
    { id: '1', title: 'Software Engineer', level: 'L3', department: 'Engineering', minSalary: 70000, maxSalary: 120000, active: true },
    { id: '2', title: 'Senior Software Engineer', level: 'L4', department: 'Engineering', minSalary: 100000, maxSalary: 160000, active: true },
    { id: '3', title: 'HR Manager', level: 'M1', department: 'Human Resources', minSalary: 80000, maxSalary: 130000, active: true },
    { id: '4', title: 'Sales Representative', level: 'L2', department: 'Sales', minSalary: 45000, maxSalary: 80000, active: true },
    { id: '5', title: 'Marketing Specialist', level: 'L3', department: 'Marketing', minSalary: 55000, maxSalary: 90000, active: true }
  ];

  const leaveTypes = [
    { id: '1', name: 'Annual Leave', code: 'AL', days: 21, carryForward: true, encashable: true, active: true },
    { id: '2', name: 'Sick Leave', code: 'SL', days: 12, carryForward: false, encashable: false, active: true },
    { id: '3', name: 'Maternity Leave', code: 'ML', days: 180, carryForward: false, encashable: false, active: true },
    { id: '4', name: 'Paternity Leave', code: 'PL', days: 15, carryForward: false, encashable: false, active: true },
    { id: '5', name: 'Emergency Leave', code: 'EL', days: 5, carryForward: false, encashable: false, active: true }
  ];

  const claimTypes = [
    { id: '1', name: 'Travel Expenses', code: 'TRV', maxAmount: 5000, requiresReceipt: true, active: true },
    { id: '2', name: 'Meal Allowance', code: 'MEL', maxAmount: 1000, requiresReceipt: false, active: true },
    { id: '3', name: 'Accommodation', code: 'ACC', maxAmount: 8000, requiresReceipt: true, active: true },
    { id: '4', name: 'Medical Expenses', code: 'MED', maxAmount: 10000, requiresReceipt: true, active: true },
    { id: '5', name: 'Communication', code: 'COM', maxAmount: 2000, requiresReceipt: true, active: true }
  ];

  const locations = [
    { id: '1', name: 'New York Office', code: 'NYC', address: '123 Broadway, New York, NY 10001', capacity: 500, active: true },
    { id: '2', name: 'San Francisco Office', code: 'SFO', address: '456 Market St, San Francisco, CA 94102', capacity: 300, active: true },
    { id: '3', name: 'Remote', code: 'RMT', address: 'Work from Home', capacity: 1000, active: true },
    { id: '4', name: 'Seattle Office', code: 'SEA', address: '789 Pine St, Seattle, WA 98101', capacity: 200, active: true }
  ];

  const shifts = [
    { id: '1', name: 'Day Shift', code: 'DAY', startTime: '09:00', endTime: '18:00', breakTime: 60, active: true },
    { id: '2', name: 'Evening Shift', code: 'EVE', startTime: '14:00', endTime: '23:00', breakTime: 60, active: true },
    { id: '3', name: 'Night Shift', code: 'NGT', startTime: '22:00', endTime: '07:00', breakTime: 60, active: true },
    { id: '4', name: 'Flexible', code: 'FLX', startTime: 'Flexible', endTime: 'Flexible', breakTime: 60, active: true }
  ];

  const handleAdd = (dataType: string) => {
    setCurrentDataType(dataType);
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: any, dataType: string) => {
    setCurrentDataType(dataType);
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSave = () => {
    console.log('Saving:', currentDataType, editingItem);
    setDialogOpen(false);
    setEditingItem(null);
    setCurrentDataType('');
  };

  const renderDepartmentsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Departments</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleAdd('department')}
        >
          Add Department
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Employees</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {dept.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={dept.code} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{dept.manager}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{dept.employees}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={dept.active ? 'Active' : 'Inactive'}
                    color={dept.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEdit(dept, 'department')}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderDesignationsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Designations</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleAdd('designation')}
        >
          Add Designation
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Salary Range</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {designations.map((designation) => (
              <TableRow key={designation.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {designation.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={designation.level} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{designation.department}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    ${designation.minSalary.toLocaleString()} - ${designation.maxSalary.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={designation.active ? 'Active' : 'Inactive'}
                    color={designation.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEdit(designation, 'designation')}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderLeaveTypesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Leave Types</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleAdd('leaveType')}
        >
          Add Leave Type
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Annual Days</TableCell>
              <TableCell>Carry Forward</TableCell>
              <TableCell>Encashable</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveTypes.map((leaveType) => (
              <TableRow key={leaveType.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {leaveType.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={leaveType.code} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{leaveType.days}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={leaveType.carryForward ? 'Yes' : 'No'}
                    color={leaveType.carryForward ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={leaveType.encashable ? 'Yes' : 'No'}
                    color={leaveType.encashable ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={leaveType.active ? 'Active' : 'Inactive'}
                    color={leaveType.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEdit(leaveType, 'leaveType')}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderClaimTypesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Claim Types</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleAdd('claimType')}
        >
          Add Claim Type
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Max Amount</TableCell>
              <TableCell>Requires Receipt</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claimTypes.map((claimType) => (
              <TableRow key={claimType.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {claimType.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={claimType.code} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">${claimType.maxAmount.toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={claimType.requiresReceipt ? 'Yes' : 'No'}
                    color={claimType.requiresReceipt ? 'warning' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={claimType.active ? 'Active' : 'Inactive'}
                    color={claimType.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEdit(claimType, 'claimType')}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderLocationsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Work Locations</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleAdd('location')}
        >
          Add Location
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {location.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={location.code} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{location.address}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{location.capacity}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={location.active ? 'Active' : 'Inactive'}
                    color={location.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEdit(location, 'location')}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderShiftsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Work Shifts</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleAdd('shift')}
        >
          Add Shift
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Break (mins)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {shift.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={shift.code} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{shift.startTime}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{shift.endTime}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{shift.breakTime}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={shift.active ? 'Active' : 'Inactive'}
                    color={shift.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={() => handleEdit(shift, 'shift')}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Master Data Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure organizational structure, policies, and system settings.
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Departments" icon={<Business />} />
            <Tab label="Designations" icon={<Group />} />
            <Tab label="Leave Types" icon={<CalendarMonth />} />
            <Tab label="Claim Types" icon={<Receipt />} />
            <Tab label="Locations" icon={<LocationOn />} />
            <Tab label="Shifts" icon={<Schedule />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderDepartmentsTab()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderDesignationsTab()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderLeaveTypesTab()}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {renderClaimTypesTab()}
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          {renderLocationsTab()}
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          {renderShiftsTab()}
        </TabPanel>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Edit' : 'Add'} {currentDataType}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Configure {currentDataType} settings. Changes will affect all related processes.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  defaultValue={editingItem?.name || ''}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Code"
                  defaultValue={editingItem?.code || ''}
                  sx={{ mb: 2 }}
                />
              </Grid>
              {currentDataType === 'department' && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Manager</InputLabel>
                      <Select defaultValue={editingItem?.manager || ''} label="Manager">
                        <MenuItem value="Michael Chen">Michael Chen</MenuItem>
                        <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
                        <MenuItem value="David Wilson">David Wilson</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Budget"
                      type="number"
                      defaultValue={editingItem?.budget || ''}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </>
              )}
              {currentDataType === 'designation' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Level"
                      defaultValue={editingItem?.level || ''}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Department</InputLabel>
                      <Select defaultValue={editingItem?.department || ''} label="Department">
                        <MenuItem value="Engineering">Engineering</MenuItem>
                        <MenuItem value="Human Resources">Human Resources</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Min Salary"
                      type="number"
                      defaultValue={editingItem?.minSalary || ''}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Salary"
                      type="number"
                      defaultValue={editingItem?.maxSalary || ''}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked={editingItem?.active !== false} />}
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};