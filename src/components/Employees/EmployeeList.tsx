import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Fab
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  LocationOn,
  Upload,
  Download,
  PersonAdd
} from '@mui/icons-material';
import { Employee, EmployeeStatus } from '../../types';
import { format } from 'date-fns';
import { EmployeeProfile } from './EmployeeProfile';
import { EmployeeOnboarding } from './EmployeeOnboarding';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';
import { useEmployeeStore } from '../../store/useEmployeeStore';

const getStatusColor = (status: EmployeeStatus) => {
  switch (status) {
    case EmployeeStatus.ACTIVE:
      return 'success';
    case EmployeeStatus.INACTIVE:
      return 'warning';
    case EmployeeStatus.TERMINATED:
      return 'error';
    case EmployeeStatus.ABSCONDED:
      return 'error';
    case EmployeeStatus.ON_LEAVE:
      return 'info';
    default:
      return 'default';
  }
};

export const EmployeeList: React.FC = () => {
  const { 
    employees, 
    fetchEmployees, 
    deleteEmployee,
    isLoading,
    error 
  } = useEmployeeStore();
  const { can } = usePermission();

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);
  const [onboardingDialogOpen, setOnboardingDialogOpen] = React.useState(false);
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = React.useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    department: '',
    status: '',
    location: ''
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: Employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.companyInfo.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.companyInfo.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setProfileDialogOpen(true);
    handleMenuClose();
  };

  const handleBulkUpload = () => {
    setBulkUploadDialogOpen(true);
  };

  const applyFilters = () => {
    setFilterDialogOpen(false);
    // Apply filters logic here
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      location: ''
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your workforce with comprehensive employee profiles and analytics.
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {employees.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {employees.filter(e => e.status === EmployeeStatus.ACTIVE).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Employees
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Onboarding
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card>
        <CardHeader
          title="All Employees"
          action={
            <PermissionGate 
              permission={[PERMISSIONS.EMPLOYEE_CREATE, PERMISSIONS.EMPLOYEE_READ_ALL]}
              fallback={
                <IconButton onClick={() => setFilterDialogOpen(true)}>
                  <FilterList />
                </IconButton>
              }
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <PermissionGate permission={PERMISSIONS.EMPLOYEE_CREATE}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOnboardingDialogOpen(true)}
                  >
                    Add Employee
                  </Button>
                </PermissionGate>
                <PermissionGate permission={PERMISSIONS.EMPLOYEE_CREATE}>
                  <Button
                    variant="outlined"
                    startIcon={<Upload />}
                    onClick={handleBulkUpload}
                  >
                    Bulk Upload
                  </Button>
                </PermissionGate>
                <IconButton onClick={() => setFilterDialogOpen(true)}>
                  <FilterList />
                </IconButton>
              </Box>
            </PermissionGate>
          }
        />
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search employees by name, email, ID, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Active Filters */}
          {(filters.department || filters.status || filters.location) && (
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Active Filters:
              </Typography>
              {filters.department && (
                <Chip
                  label={`Department: ${filters.department}`}
                  onDelete={() => setFilters(prev => ({ ...prev, department: '' }))}
                  size="small"
                />
              )}
              {filters.status && (
                <Chip
                  label={`Status: ${filters.status}`}
                  onDelete={() => setFilters(prev => ({ ...prev, status: '' }))}
                  size="small"
                />
              )}
              {filters.location && (
                <Chip
                  label={`Location: ${filters.location}`}
                  onDelete={() => setFilters(prev => ({ ...prev, location: '' }))}
                  size="small"
                />
              )}
              <Button size="small" onClick={clearFilters}>
                Clear All
              </Button>
            </Box>
          )}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {employee.personalInfo.firstName.charAt(0)}
                          {employee.personalInfo.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                          </Typography>
                          <PermissionGate 
                            permission={[PERMISSIONS.EMPLOYEE_READ_ALL, PERMISSIONS.EMPLOYEE_READ_TEAM]}
                          >
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, employee)}
                              size="small"
                            >
                              <MoreVert />
                            </IconButton>
                          </PermissionGate>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {employee.employeeId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {employee.companyInfo.department}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {employee.companyInfo.designation}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(employee.companyInfo.dateOfJoining, 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status}
                        color={getStatusColor(employee.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, employee)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredEmployees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <PermissionGate permission={PERMISSIONS.EMPLOYEE_CREATE}>
        <Fab
          color="primary"
          aria-label="add employee"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setOnboardingDialogOpen(true)}
        >
          <PersonAdd />
        </Fab>
      </PermissionGate>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <PermissionGate permission={[PERMISSIONS.EMPLOYEE_READ_ALL, PERMISSIONS.EMPLOYEE_READ_TEAM]}>
          <MenuItem onClick={() => handleViewProfile(selectedEmployee!)}>
            <Visibility sx={{ mr: 1 }} />
            View Profile
          </MenuItem>
        </PermissionGate>
        <PermissionGate permission={[PERMISSIONS.EMPLOYEE_UPDATE_ALL, PERMISSIONS.EMPLOYEE_UPDATE_TEAM]}>
          <MenuItem onClick={handleMenuClose}>
            <Edit sx={{ mr: 1 }} />
            Edit Employee
          </MenuItem>
        </PermissionGate>
        <PermissionGate permission={PERMISSIONS.REPORTS_ALL}>
          <MenuItem onClick={handleMenuClose}>
            <Download sx={{ mr: 1 }} />
            Export Data
          </MenuItem>
        </PermissionGate>
        <PermissionGate permission={PERMISSIONS.EMPLOYEE_DELETE}>
          <MenuItem onClick={handleMenuClose}>
            <Delete sx={{ mr: 1 }} />
            Delete Employee
          </MenuItem>
        </PermissionGate>
      </Menu>

      {/* Employee Profile Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Employee Profile</Typography>
            <Button onClick={() => setProfileDialogOpen(false)}>
              Close
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedEmployee && (
            <EmployeeProfile
              employeeId={selectedEmployee.id}
              onClose={() => setProfileDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Employee Onboarding Dialog */}
      <Dialog
        open={onboardingDialogOpen}
        onClose={() => setOnboardingDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Employee Onboarding</Typography>
            <Button onClick={() => setOnboardingDialogOpen(false)}>
              Close
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <EmployeeOnboarding />
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog
        open={bulkUploadDialogOpen}
        onClose={() => setBulkUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Bulk Employee Upload</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload employee data using Excel/CSV file. Download the template first to ensure proper formatting.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button variant="outlined" startIcon={<Download />}>
                Download Template
              </Button>
            </Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<Upload />}
              sx={{ mb: 2 }}
            >
              Choose Excel/CSV File
              <input type="file" hidden accept=".xlsx,.xls,.csv" />
            </Button>
            <Typography variant="caption" color="text.secondary">
              Supported formats: .xlsx, .xls, .csv (Max 10MB)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Upload & Process</Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filter Employees</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Human Resources">Human Resources</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on_leave">On Leave</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                label="Location"
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="New York Office">New York Office</MenuItem>
                <MenuItem value="Los Angeles Office">Los Angeles Office</MenuItem>
                <MenuItem value="Seattle Office">Seattle Office</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>Clear All</Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};