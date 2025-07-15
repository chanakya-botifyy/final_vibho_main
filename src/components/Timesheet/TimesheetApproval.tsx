import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  Collapse,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  ExpandMore,
  ExpandLess,
  Download,
  Send
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import * as timesheetApi from '../../api/timesheet';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';

const TimesheetApproval: React.FC = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { 
    submissions, 
    approveTimesheet, 
    rejectTimesheet,
    isLoading,
    error
  } = useTimesheetStore();
  
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  
  // Filter submissions that need approval (for managers)
  const pendingSubmissions = submissions.filter(submission => 
    submission.status === 'submitted'
  );
  
  const handleApprove = async () => {
    if (selectedSubmission) {
      try {
        await timesheetApi.approveTimesheet(selectedSubmission, comments);
        
        // Refresh submissions after approval
        // This would be handled by the store
        
        setApproveDialogOpen(false);
        setSelectedSubmission(null);
        setComments('');
      } catch (error) {
        console.error('Error approving timesheet:', error);
      }
    }
  };
  
  const handleReject = async () => {
    if (selectedSubmission && rejectionReason) {
      try {
        await timesheetApi.rejectTimesheet(selectedSubmission, rejectionReason);
        
        // Refresh submissions after rejection
        // This would be handled by the store
        
        setRejectDialogOpen(false);
        setSelectedSubmission(null);
        setRejectionReason('');
      } catch (error) {
        console.error('Error rejecting timesheet:', error);
      }
    }
  };
  
  const toggleExpand = (submissionId: string) => {
    setExpandedSubmission(expandedSubmission === submissionId ? null : submissionId);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      default: return null;
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timesheet Approval
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve team timesheets.
        </Typography>
      </Box>
      
      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Pending Approvals */}
      <Typography variant="h6" gutterBottom>
        Pending Approvals ({pendingSubmissions.length})
      </Typography>
      
      {pendingSubmissions.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          No timesheets pending approval.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Week</TableCell>
                <TableCell>Total Hours</TableCell>
                <TableCell>Submitted On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingSubmissions.map((submission) => {
                const employee = employees.find(e => e.id === submission.employeeId);
                const employeeName = employee 
                  ? `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`
                  : submission.employeeName || 'Unknown Employee';
                
                return (
                  <React.Fragment key={submission.id}>
                    <TableRow hover>
                      <TableCell>{employeeName}</TableCell>
                      <TableCell>
                        {format(new Date(submission.weekStartDate), 'MMM d')} - {format(new Date(submission.weekEndDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>{submission.totalHours} hours</TableCell>
                      <TableCell>
                        {submission.submittedAt ? format(new Date(submission.submittedAt), 'MMM d, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status.toUpperCase()}
                          color={getStatusColor(submission.status)}
                          size="small"
                          icon={getStatusIcon(submission.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => toggleExpand(submission.id)}
                            >
                              {expandedSubmission === submission.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Approve">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => {
                                setSelectedSubmission(submission.id);
                                setApproveDialogOpen(true);
                              }}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => {
                                setSelectedSubmission(submission.id);
                                setRejectDialogOpen(true);
                              }}
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Details */}
                    <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                        <Collapse in={expandedSubmission === submission.id} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 3, bgcolor: 'background.default' }}>
                            <Typography variant="h6" gutterBottom>
                              Timesheet Details
                            </Typography>
                            
                            {submission.comments && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Comments:</Typography>
                                <Typography variant="body2">{submission.comments}</Typography>
                              </Box>
                            )}
                            
                            <TableContainer component={Paper} variant="outlined">
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Project</TableCell>
                                    <TableCell>Task</TableCell>
                                    <TableCell>Hours</TableCell>
                                    <TableCell>Billable</TableCell>
                                    <TableCell>Description</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {submission.entries.map((entry) => (
                                    <TableRow key={entry.id}>
                                      <TableCell>{format(new Date(entry.date), 'EEE, MMM d')}</TableCell>
                                      <TableCell>{entry.projectName}</TableCell>
                                      <TableCell>{entry.taskName}</TableCell>
                                      <TableCell>{entry.hours}</TableCell>
                                      <TableCell>{entry.billable ? 'Yes' : 'No'}</TableCell>
                                      <TableCell>{entry.description}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Recent Approvals */}
      <Typography variant="h6" gutterBottom>
        Recent Approvals
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Week</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approved/Rejected By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions
              .filter(s => s.status === 'approved' || s.status === 'rejected')
              .slice(0, 5) // Show only the 5 most recent
              .map((submission) => {
                const employee = employees.find(e => e.id === submission.employeeId);
                const employeeName = employee 
                  ? `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`
                  : submission.employeeName || 'Unknown Employee';
                
                return (
                  <TableRow key={submission.id} hover>
                    <TableCell>{employeeName}</TableCell>
                    <TableCell>
                      {format(new Date(submission.weekStartDate), 'MMM d')} - {format(new Date(submission.weekEndDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{submission.totalHours} hours</TableCell>
                    <TableCell>
                      <Chip
                        label={submission.status.toUpperCase()}
                        color={getStatusColor(submission.status)}
                        size="small"
                        icon={getStatusIcon(submission.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {submission.status === 'approved' 
                        ? submission.approvedBy 
                        : submission.rejectedBy}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={() => toggleExpand(submission.id)}
                        >
                          {expandedSubmission === submission.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Timesheet</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              You are about to approve this timesheet. This action cannot be undone.
            </Alert>
            
            <TextField
              fullWidth
              label="Comments (Optional)"
              multiline
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={handleApprove}
            disabled={isLoading}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Timesheet</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              You are about to reject this timesheet. Please provide a reason for rejection.
            </Alert>
            
            <TextField
              fullWidth
              label="Reason for Rejection"
              multiline
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              error={!rejectionReason.trim()}
              helperText={!rejectionReason.trim() ? 'Reason is required' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleReject}
            disabled={isLoading || !rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimesheetApproval;