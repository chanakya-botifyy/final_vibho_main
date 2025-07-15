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
  Paper,
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
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Add,
  CalendarMonth,
  EventAvailable,
  EventBusy,
  Schedule,
  Cancel,
  Visibility,
  Download,
  CheckCircle,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material';
import { format, differenceInDays, addDays } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useLeaveStore } from '../../store/useLeaveStore';

export const EmployeeLeaveManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    requests, 
    balances, 
    submitLeaveRequest, 
    cancelLeaveRequest, 
    fetchLeaveRequests, 
    fetchLeaveBalance,
    isLoading,
    error
  } = useLeaveStore();
  
  const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedLeave, setSelectedLeave] = React.useState<any>(null);
  const [newLeaveRequest, setNewLeaveRequest] = React.useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    contactDetails: '',
    attachments: [] as File[]
  });

  React.useEffect(() => {
    if (user?.id) {
      fetchLeaveRequests(user.id);
      fetchLeaveBalance(user.id);
    }
  }, [user, fetchLeaveRequests, fetchLeaveBalance]);

  // Mock leave balances
  const leaveBalances = {
    annual: { total: 21, used: 5, remaining: 16 },
    sick: { total: 12, used: 2, remaining: 10 },
    casual: { total: 6, used: 1, remaining: 5 },
    maternity: { total: 180, used: 0, remaining: 180 },
    paternity: { total: 15, used: 0, remaining: 15 },
    unpaid: { total: 0, used: 0, remaining: 0 }
  };

  // Mock leave history
  const leaveHistory = [
    {
      id: '1',
      type: 'annual',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      days: 3,
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: new Date('2024-01-05'),
      approvedBy: 'Michael Chen',
      approvedDate: new Date('2024-01-07')
    },
    {
      id: '2',
      type: 'sick',
      startDate: new Date('2024-02-05'),
      endDate: new Date('2024-02-06'),
      days: 2,
      reason: 'Fever and cold',
      status: 'approved',
      appliedDate: new Date('2024-02-05'),
      approvedBy: 'Michael Chen',
      approvedDate: new Date('2024-02-06')
    },
    {
      id: '3',
      type: 'annual',
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-03-14'),
      days: 5,
      reason: 'Personal trip',
      status: 'pending',
      appliedDate: new Date('2024-02-20')
    }
  ];

  // Upcoming holidays
  const upcomingHolidays = [
    { name: 'Memorial Day', date: new Date('2024-05-27') },
    { name: 'Independence Day', date: new Date('2024-07-04') },
    { name: 'Labor Day', date: new Date('2024-09-02') }
  ];

  const handleLeaveSubmit = () => {
    console.log('Submitting leave request:', newLeaveRequest);
    setLeaveDialogOpen(false);
    setNewLeaveRequest({
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
      contactDetails: '',
      attachments: []
    });
  };

  const handleCancelLeave = (leaveId: string) => {
    console.log('Cancelling leave request:', leaveId);
  };

  const handleViewLeave = (leave: any) => {
    setSelectedLeave(leave);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'rejected': return <ErrorIcon />;
      case 'cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'primary';
      case 'sick': return 'error';
      case 'casual': return 'success';
      case 'maternity': return 'secondary';
      case 'paternity': return 'info';
      case 'unpaid': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Leave Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Apply for leave, view your leave history, and check your balances.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Leave Balance Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="Leave Balances" 
              action={
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setLeaveDialogOpen(true)}
                >
                  Apply for Leave
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {Object.entries(leaveBalances).map(([type, balance]) => (
                  <Grid item xs={6} md={4} key={type}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" color={`${getLeaveTypeColor(type)}.main`} gutterBottom>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Leave
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h4" color={`${getLeaveTypeColor(type)}.main`}>
                          {balance.remaining}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          / {balance.total}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(balance.remaining / balance.total) * 100} 
                        color={getLeaveTypeColor(type)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {balance.used} days used
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Holidays */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Upcoming Holidays" />
            <CardContent>
              <List>
                {upcomingHolidays.map((holiday, index) => (
                  <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < upcomingHolidays.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {holiday.name}
                      </Typography>
                      <Chip 
                        label={`${differenceInDays(holiday.date, new Date())} days`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {format(holiday.date, 'EEEE, MMMM d, yyyy')}
                    </Typography>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave History */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Leave History" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Days</TableCell>
                      <TableCell>Applied On</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveHistory.map((leave) => (
                      <TableRow key={leave.id} hover>
                        <TableCell>
                          <Chip
                            label={leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                            color={getLeaveTypeColor(leave.type)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(leave.startDate, 'MMM dd, yyyy')} - {format(leave.endDate, 'MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{leave.days} days</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(leave.appliedDate, 'MMM dd, yyyy')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {leave.reason}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(leave.status)}
                            label={leave.status.toUpperCase()}
                            color={getStatusColor(leave.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => handleViewLeave(leave)}>
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            {leave.status === 'pending' && (
                              <Tooltip title="Cancel Request">
                                <IconButton size="small" color="error" onClick={() => handleCancelLeave(leave.id)}>
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            )}
                            {leave.status === 'approved' && (
                              <Tooltip title="Download Approval">
                                <IconButton size="small">
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            )}
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
      </Grid>

      {/* Leave Application Dialog */}
      <Dialog
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Apply for Leave</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={newLeaveRequest.type}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, type: e.target.value }))}
                    label="Leave Type"
                  >
                    <MenuItem value="annual">Annual Leave</MenuItem>
                    <MenuItem value="sick">Sick Leave</MenuItem>
                    <MenuItem value="casual">Casual Leave</MenuItem>
                    <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Alert severity="info" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  You have {leaveBalances.annual.remaining} annual leave days remaining.
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={newLeaveRequest.startDate}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={newLeaveRequest.endDate}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Leave"
                  multiline
                  rows={3}
                  value={newLeaveRequest.reason}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Details During Leave (Optional)"
                  value={newLeaveRequest.contactDetails}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, contactDetails: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Add />}
                >
                  Attach Documents (Optional)
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewLeaveRequest(prev => ({
                        ...prev,
                        attachments: [...prev.attachments, ...files]
                      }));
                    }}
                  />
                </Button>
                <Box sx={{ mt: 1 }}>
                  {newLeaveRequest.attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => {
                        setNewLeaveRequest(prev => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== index)
                        }));
                      }}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleLeaveSubmit}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Leave Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Leave Request Details</DialogTitle>
        <DialogContent>
          {selectedLeave && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Leave Type</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedLeave.type.charAt(0).toUpperCase() + selectedLeave.type.slice(1)} Leave
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedLeave.status)}
                    label={selectedLeave.status.toUpperCase()}
                    color={getStatusColor(selectedLeave.status)}
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1">
                    {format(selectedLeave.startDate, 'MMM dd, yyyy')} - {format(selectedLeave.endDate, 'MMM dd, yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Total Days</Typography>
                  <Typography variant="body1">{selectedLeave.days} days</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Reason</Typography>
                  <Typography variant="body1">{selectedLeave.reason}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Applied On</Typography>
                  <Typography variant="body1">{format(selectedLeave.appliedDate, 'MMM dd, yyyy')}</Typography>
                </Grid>
                {selectedLeave.status === 'approved' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Approved By</Typography>
                      <Typography variant="body1">{selectedLeave.approvedBy}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Approved On</Typography>
                      <Typography variant="body1">{format(selectedLeave.approvedDate, 'MMM dd, yyyy')}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedLeave && selectedLeave.status === 'pending' && (
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => {
                handleCancelLeave(selectedLeave.id);
                setViewDialogOpen(false);
              }}
            >
              Cancel Request
            </Button>
          )}
          {selectedLeave && selectedLeave.status === 'approved' && (
            <Button variant="outlined" startIcon={<Download />}>
              Download Approval
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};