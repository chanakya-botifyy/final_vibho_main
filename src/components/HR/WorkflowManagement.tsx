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
  Chip,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Paper
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  PlayArrow,
  Pause,
  Settings,
  Assignment,
  Person,
  Group,
  CheckCircle,
  Schedule,
  Warning,
  Email,
  Sms,
  Notifications,
  DragIndicator,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'action';
  approver?: string;
  role?: string;
  condition?: string;
  timeout?: number;
  escalation?: string;
}

interface Workflow {
  id: string;
  name: string;
  type: 'leave' | 'expense' | 'regularization' | 'recruitment' | 'performance';
  description: string;
  steps: WorkflowStep[];
  active: boolean;
  createdBy: string;
  createdDate: Date;
}

// Define Step component for Stepper
const Step: React.FC<{ completed?: boolean, active?: boolean, children: React.ReactNode }> = ({ 
  completed, 
  active, 
  children 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      mb: 2,
      opacity: completed || active ? 1 : 0.5
    }}>
      <Box sx={{ 
        mr: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Box sx={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%', 
          bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.400',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          mb: 1
        }}>
          {completed ? <CheckCircleIcon fontSize="small" /> : null}
        </Box>
        {active && (
          <Box sx={{ 
            height: 24, 
            width: 2, 
            bgcolor: 'primary.main' 
          }} />
        )}
      </Box>
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

// Define StepLabel component for Stepper
const StepLabel: React.FC<{ children: React.ReactNode, icon?: React.ReactNode }> = ({ children, icon }) => {
  return (
    <Box>
      {children}
    </Box>
  );
};

// Define StepContent component for Stepper
const StepContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ mt: 1 }}>
      {children}
    </Box>
  );
};

// Define Stepper component
const Stepper: React.FC<{ activeStep?: number, orientation: 'horizontal' | 'vertical', children: React.ReactNode }> = ({ 
  activeStep = 0, 
  orientation, 
  children 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      gap: 2
    }}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            completed: index < activeStep,
            active: index === activeStep
          });
        }
        return child;
      })}
    </Box>
  );
};

export const WorkflowManagement: React.FC = () => {
  const [workflowDialogOpen, setWorkflowDialogOpen] = React.useState(false);
  const [stepDialogOpen, setStepDialogOpen] = React.useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<Workflow | null>(null);
  const [editingStep, setEditingStep] = React.useState<WorkflowStep | null>(null);

  // Mock workflow data
  const workflows: Workflow[] = [
    {
      id: '1',
      name: 'Leave Request Approval',
      type: 'leave',
      description: 'Standard leave request approval workflow',
      steps: [
        {
          id: '1',
          name: 'Manager Approval',
          type: 'approval',
          approver: 'Direct Manager',
          timeout: 24,
          escalation: 'Department Head'
        },
        {
          id: '2',
          name: 'HR Review',
          type: 'approval',
          role: 'HR',
          condition: 'days > 5',
          timeout: 48
        },
        {
          id: '3',
          name: 'Employee Notification',
          type: 'notification',
          timeout: 1
        }
      ],
      active: true,
      createdBy: 'HR Admin',
      createdDate: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Expense Claim Processing',
      type: 'expense',
      description: 'Expense claim approval and reimbursement workflow',
      steps: [
        {
          id: '1',
          name: 'Manager Approval',
          type: 'approval',
          approver: 'Direct Manager',
          timeout: 48
        },
        {
          id: '2',
          name: 'Finance Review',
          type: 'approval',
          role: 'Finance',
          condition: 'amount > 1000',
          timeout: 72
        },
        {
          id: '3',
          name: 'Payment Processing',
          type: 'action',
          timeout: 24
        }
      ],
      active: true,
      createdBy: 'Finance Admin',
      createdDate: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Performance Review Cycle',
      type: 'performance',
      description: 'Annual performance review workflow',
      steps: [
        {
          id: '1',
          name: 'Self Assessment',
          type: 'action',
          timeout: 168
        },
        {
          id: '2',
          name: 'Manager Review',
          type: 'approval',
          approver: 'Direct Manager',
          timeout: 168
        },
        {
          id: '3',
          name: 'HR Calibration',
          type: 'approval',
          role: 'HR',
          timeout: 72
        },
        {
          id: '4',
          name: 'Final Rating',
          type: 'action',
          timeout: 24
        }
      ],
      active: true,
      createdBy: 'HR Admin',
      createdDate: new Date('2024-02-01')
    }
  ];

  const notificationSettings = [
    {
      id: '1',
      name: 'Email Notifications',
      type: 'email',
      enabled: true,
      template: 'Standard email template with company branding'
    },
    {
      id: '2',
      name: 'SMS Notifications',
      type: 'sms',
      enabled: true,
      template: 'Short SMS notification for urgent approvals'
    },
    {
      id: '3',
      name: 'WhatsApp Notifications',
      type: 'whatsapp',
      enabled: true,
      template: 'WhatsApp message with action buttons'
    },
    {
      id: '4',
      name: 'Push Notifications',
      type: 'push',
      enabled: true,
      template: 'Mobile app push notification'
    }
  ];

  const handleCreateWorkflow = () => {
    setSelectedWorkflow(null);
    setWorkflowDialogOpen(true);
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setWorkflowDialogOpen(true);
  };

  const handleAddStep = () => {
    setEditingStep(null);
    setStepDialogOpen(true);
  };

  const handleEditStep = (step: WorkflowStep) => {
    setEditingStep(step);
    setStepDialogOpen(true);
  };

  const getWorkflowTypeColor = (type: string) => {
    switch (type) {
      case 'leave': return 'primary';
      case 'expense': return 'success';
      case 'regularization': return 'warning';
      case 'recruitment': return 'info';
      case 'performance': return 'secondary';
      default: return 'default';
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle />;
      case 'notification': return <Notifications />;
      case 'action': return <PlayArrow />;
      default: return <Assignment />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Workflow Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure approval workflows, notifications, and automated processes.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Workflows List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Approval Workflows"
              action={
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateWorkflow}
                >
                  Create Workflow
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Steps</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workflows.map((workflow) => (
                      <TableRow key={workflow.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {workflow.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {workflow.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={workflow.type.toUpperCase()}
                            color={getWorkflowTypeColor(workflow.type)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {workflow.steps.length} steps
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={workflow.active ? 'Active' : 'Inactive'}
                            color={workflow.active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {workflow.createdDate.toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleEditWorkflow(workflow)}>
                              <Edit />
                            </IconButton>
                            <IconButton size="small">
                              <Settings />
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
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Notification Settings" />
            <CardContent>
              <List>
                {notificationSettings.map((setting, index) => (
                  <React.Fragment key={setting.id}>
                    <ListItem>
                      <ListItemIcon>
                        {setting.type === 'email' && <Email />}
                        {setting.type === 'sms' && <Sms />}
                        {setting.type === 'whatsapp' && <Notifications />}
                        {setting.type === 'push' && <Notifications />}
                      </ListItemIcon>
                      <ListItemText
                        primary={setting.name}
                        secondary={setting.template}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={setting.enabled}
                          onChange={() => {}}
                          color="primary"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notificationSettings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Workflow Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Workflow Performance" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">
                      156
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Workflows
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      2.3h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Processing Time
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Approvals
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      98.5%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Workflow Dialog */}
      <Dialog
        open={workflowDialogOpen}
        onClose={() => setWorkflowDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Workflow Name"
                  defaultValue={selectedWorkflow?.name || ''}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Workflow Type</InputLabel>
                  <Select
                    defaultValue={selectedWorkflow?.type || ''}
                    label="Workflow Type"
                  >
                    <MenuItem value="leave">Leave Request</MenuItem>
                    <MenuItem value="expense">Expense Claim</MenuItem>
                    <MenuItem value="regularization">Attendance Regularization</MenuItem>
                    <MenuItem value="recruitment">Recruitment</MenuItem>
                    <MenuItem value="performance">Performance Review</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  defaultValue={selectedWorkflow?.description || ''}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            {selectedWorkflow && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Workflow Steps</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddStep}
                  >
                    Add Step
                  </Button>
                </Box>
                <Button 
                  variant="outlined" 
                  startIcon={<Timeline />} 
                  sx={{ mb: 2 }}
                  onClick={() => window.location.href = '#/workflow-diagram'}
                >
                  View Complete Workflow Diagram
                </Button>
                <Stepper orientation="vertical">
                  {selectedWorkflow.steps.map((step, index) => (
                    <Step key={step.id} active={true}>
                      <StepLabel icon={getStepTypeIcon(step.type)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {step.name}
                          </Typography>
                          <Chip
                            label={step.type}
                            size="small"
                            variant="outlined"
                          />
                          <IconButton size="small" onClick={() => handleEditStep(step)}>
                            <Edit />
                          </IconButton>
                        </Box>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          {step.approver && `Approver: ${step.approver}`}
                          {step.role && `Role: ${step.role}`}
                          {step.condition && ` | Condition: ${step.condition}`}
                          {step.timeout && ` | Timeout: ${step.timeout}h`}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkflowDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Workflow</Button>
        </DialogActions>
      </Dialog>

      {/* Step Dialog */}
      <Dialog
        open={stepDialogOpen}
        onClose={() => setStepDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingStep ? 'Edit Step' : 'Add New Step'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Step Name"
              defaultValue={editingStep?.name || ''}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Step Type</InputLabel>
              <Select
                defaultValue={editingStep?.type || 'approval'}
                label="Step Type"
              >
                <MenuItem value="approval">Approval</MenuItem>
                <MenuItem value="notification">Notification</MenuItem>
                <MenuItem value="action">Action</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Approver/Role"
              defaultValue={editingStep?.approver || editingStep?.role || ''}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Condition (Optional)"
              defaultValue={editingStep?.condition || ''}
              placeholder="e.g., amount > 1000, days > 5"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Timeout (Hours)"
              type="number"
              defaultValue={editingStep?.timeout || 24}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Escalation (Optional)"
              defaultValue={editingStep?.escalation || ''}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStepDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Step</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};