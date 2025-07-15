import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  IconButton,
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Receipt,
  AttachMoney,
  CheckCircle,
  Cancel,
  Pending,
  Visibility,
  Edit,
  Delete,
  Download,
  Upload,
  Description,
  LocalOffer,
  CalendarToday,
  Business,
  Person,
  Schedule,
  CreditCard,
  AccountBalance,
  Flight,
  Hotel,
  DirectionsCar,
  Restaurant,
  LocalHospital,
  Phone,
  School
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';

interface Claim {
  id: string;
  type: 'travel' | 'accommodation' | 'meals' | 'medical' | 'communication' | 'training' | 'other';
  amount: number;
  currency: string;
  description: string;
  date: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submittedDate?: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  paidDate?: Date;
  receipts: Receipt[];
  category?: string;
  project?: string;
  department?: string;
  notes?: string;
}

interface Receipt {
  id: string;
  name: string;
  url: string;
  uploadDate: Date;
  size: number;
  type: string;
  ocrProcessed: boolean;
  ocrData?: {
    vendor: string;
    date: string;
    amount: number;
    taxAmount?: number;
    items?: string[];
  };
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
      id={`claims-tabpanel-${index}`}
      aria-labelledby={`claims-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ClaimsManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { can } = usePermission();
  const [tabValue, setTabValue] = useState(0);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [viewClaimDialogOpen, setViewClaimDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [newClaim, setNewClaim] = useState({
    type: 'travel' as const,
    amount: '',
    currency: 'USD',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    project: '',
    notes: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mock claims data
  const claims: Claim[] = [
    {
      id: '1',
      type: 'travel',
      amount: 450,
      currency: 'USD',
      description: 'Flight to New York for client meeting',
      date: new Date('2024-02-15'),
      status: 'approved',
      submittedDate: new Date('2024-02-16'),
      approvedBy: 'Michael Chen',
      approvedDate: new Date('2024-02-17'),
      paidDate: new Date('2024-02-20'),
      receipts: [
        {
          id: '1',
          name: 'flight_receipt.pdf',
          url: '/receipts/flight_receipt.pdf',
          uploadDate: new Date('2024-02-16'),
          size: 1024 * 1024 * 1.5,
          type: 'application/pdf',
          ocrProcessed: true,
          ocrData: {
            vendor: 'Delta Airlines',
            date: '2024-02-15',
            amount: 450,
            items: ['Flight DL123 - SFO to JFK']
          }
        }
      ],
      category: 'Client Meetings',
      project: 'Project Alpha',
      department: 'Sales'
    },
    {
      id: '2',
      type: 'accommodation',
      amount: 350,
      currency: 'USD',
      description: 'Hotel stay in New York',
      date: new Date('2024-02-15'),
      status: 'approved',
      submittedDate: new Date('2024-02-16'),
      approvedBy: 'Michael Chen',
      approvedDate: new Date('2024-02-17'),
      paidDate: new Date('2024-02-20'),
      receipts: [
        {
          id: '2',
          name: 'hotel_receipt.pdf',
          url: '/receipts/hotel_receipt.pdf',
          uploadDate: new Date('2024-02-16'),
          size: 1024 * 1024 * 0.8,
          type: 'application/pdf',
          ocrProcessed: true,
          ocrData: {
            vendor: 'Marriott Hotels',
            date: '2024-02-15',
            amount: 350,
            taxAmount: 32.5
          }
        }
      ],
      category: 'Client Meetings',
      project: 'Project Alpha',
      department: 'Sales'
    },
    {
      id: '3',
      type: 'meals',
      amount: 85,
      currency: 'USD',
      description: 'Dinner with client',
      date: new Date('2024-02-15'),
      status: 'pending',
      submittedDate: new Date('2024-02-16'),
      receipts: [
        {
          id: '3',
          name: 'dinner_receipt.jpg',
          url: '/receipts/dinner_receipt.jpg',
          uploadDate: new Date('2024-02-16'),
          size: 1024 * 1024 * 0.5,
          type: 'image/jpeg',
          ocrProcessed: true,
          ocrData: {
            vendor: 'The Capital Grille',
            date: '2024-02-15',
            amount: 85,
            taxAmount: 7.5,
            items: ['Steak', 'Salad', 'Beverage']
          }
        }
      ],
      category: 'Client Meetings',
      project: 'Project Alpha',
      department: 'Sales'
    },
    {
      id: '4',
      type: 'training',
      amount: 1200,
      currency: 'USD',
      description: 'React Advanced Course',
      date: new Date('2024-01-20'),
      status: 'paid',
      submittedDate: new Date('2024-01-21'),
      approvedBy: 'Michael Chen',
      approvedDate: new Date('2024-01-22'),
      paidDate: new Date('2024-01-25'),
      receipts: [
        {
          id: '4',
          name: 'training_receipt.pdf',
          url: '/receipts/training_receipt.pdf',
          uploadDate: new Date('2024-01-21'),
          size: 1024 * 1024 * 0.7,
          type: 'application/pdf',
          ocrProcessed: true,
          ocrData: {
            vendor: 'Frontend Masters',
            date: '2024-01-20',
            amount: 1200
          }
        }
      ],
      category: 'Professional Development',
      department: 'Engineering'
    }
  ];

  // Mock claim policy
  const claimPolicies = {
    travel: {
      maxAmount: 500,
      requiresApproval: true,
      requiresReceipt: true,
      notes: 'Economy class for flights, standard room for hotels'
    },
    accommodation: {
      maxAmount: 400,
      requiresApproval: true,
      requiresReceipt: true,
      notes: 'Standard room only, no upgrades'
    },
    meals: {
      maxAmount: 100,
      requiresApproval: true,
      requiresReceipt: true,
      notes: 'No alcohol expenses'
    },
    medical: {
      maxAmount: 1000,
      requiresApproval: true,
      requiresReceipt: true,
      notes: 'Only for expenses not covered by insurance'
    },
    communication: {
      maxAmount: 100,
      requiresApproval: false,
      requiresReceipt: true,
      notes: 'Monthly limit'
    },
    training: {
      maxAmount: 2000,
      requiresApproval: true,
      requiresReceipt: true,
      notes: 'Must be relevant to current role'
    }
  };

  const getClaimTypeIcon = (type: string) => {
    switch (type) {
      case 'travel': return <Flight />;
      case 'accommodation': return <Hotel />;
      case 'meals': return <Restaurant />;
      case 'medical': return <LocalHospital />;
      case 'communication': return <Phone />;
      case 'training': return <School />;
      default: return <Receipt />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'submitted': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'paid': return 'primary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit />;
      case 'submitted': return <Pending />;
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      case 'paid': return <AttachMoney />;
      default: return <Pending />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmitClaim = () => {
    console.log('Submitting claim:', newClaim);
    setClaimDialogOpen(false);
    setNewClaim({
      type: 'travel',
      amount: '',
      currency: 'USD',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: '',
      project: '',
      notes: ''
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setViewClaimDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Claims & Expenses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage expense claims with OCR-powered receipt processing and automated approvals.
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <PermissionGate permission={PERMISSIONS.CLAIMS_VIEW_SELF}>
              <Tab label="My Claims" />
            </PermissionGate>
            <PermissionGate permission={[PERMISSIONS.CLAIMS_APPROVE, PERMISSIONS.CLAIMS_VIEW_ALL, PERMISSIONS.CLAIMS_VIEW_TEAM]}>
              <Tab label="Pending Approvals" />
            </PermissionGate>
            <PermissionGate permission={[PERMISSIONS.CLAIMS_VIEW_ALL, PERMISSIONS.CLAIMS_VIEW_TEAM, PERMISSIONS.CLAIMS_VIEW_SELF]}>
              <Tab label="Claim Policies" />
            </PermissionGate>
            <PermissionGate permission={[PERMISSIONS.REPORTS_ALL, PERMISSIONS.REPORTS_HR, PERMISSIONS.REPORTS_TEAM, PERMISSIONS.REPORTS_SELF]}>
              <Tab label="Reports" />
            </PermissionGate>
          </Tabs>
        </Box>

        {/* My Claims Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">My Expense Claims</Typography>
            <PermissionGate permission={PERMISSIONS.CLAIMS_SUBMIT}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setClaimDialogOpen(true)}
              >
                New Claim
              </Button>
            </PermissionGate>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getClaimTypeIcon(claim.type)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {claim.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{claim.description}</Typography>
                      {claim.project && (
                        <Typography variant="caption" color="text.secondary">
                          {claim.project}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(claim.date, 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(claim.amount, claim.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(claim.status)}
                        label={claim.status.toUpperCase()}
                        color={getStatusColor(claim.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {claim.submittedDate ? format(claim.submittedDate, 'MMM dd, yyyy') : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <PermissionGate permission={PERMISSIONS.CLAIMS_APPROVE}>
                          <Button size="small" variant="contained" color="success">
                            Approve
                          </Button>
                          <Button size="small" variant="outlined" color="error">
                            Reject
                          </Button>
                        </PermissionGate>
                        <PermissionGate permission={PERMISSIONS.CLAIMS_SUBMIT}>
                          {claim.status === 'draft' && (
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <Edit />
                              </IconButton>
                            </Tooltip>
                          )}
                          {claim.status === 'approved' || claim.status === 'paid' ? (
                            <Tooltip title="Download Receipt">
                              <IconButton size="small">
                                <Download />
                              </IconButton>
                            </Tooltip>
                          ) : claim.status === 'draft' && (
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error">
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          )}
                        </PermissionGate>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Pending Approvals Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Pending Approvals
          </Typography>
          <PermissionGate permission={PERMISSIONS.CLAIMS_APPROVE}>
            <Alert severity="info" sx={{ mb: 3 }}>
              You have 2 claims pending your approval. Please review and take action.
            </Alert>
          </PermissionGate>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>JS</Avatar>
                      <Typography variant="body2">John Smith</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Restaurant />
                      <Typography variant="body2">Meals</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">Client dinner at The Capital Grille</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Project Beta
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date('2024-02-18'), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(120)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date('2024-02-19'), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="success">
                        Approve
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Reject
                      </Button>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>BD</Avatar>
                      <Typography variant="body2">Bob Davis</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School />
                      <Typography variant="body2">Training</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">AWS Certification Course</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Professional Development
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date('2024-02-15'), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(800)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date('2024-02-16'), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="success">
                        Approve
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Reject
                      </Button>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Claim Policies Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Expense Claim Policies
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            These policies define the limits and requirements for different types of expense claims.
          </Alert>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Expense Type</TableCell>
                  <TableCell>Maximum Amount</TableCell>
                  <TableCell>Requires Approval</TableCell>
                  <TableCell>Requires Receipt</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(claimPolicies).map(([type, policy]) => (
                  <TableRow key={type} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getClaimTypeIcon(type)}
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(policy.maxAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={policy.requiresApproval ? 'Yes' : 'No'}
                        color={policy.requiresApproval ? 'warning' : 'success'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={policy.requiresReceipt ? 'Yes' : 'No'}
                        color={policy.requiresReceipt ? 'info' : 'success'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{policy.notes}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Expense Reports
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Expense Summary" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Total Claims (YTD):</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(2085)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Pending Reimbursement:</Typography>
                      <Typography variant="body2" fontWeight="medium" color="warning.main">
                        {formatCurrency(85)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Reimbursed (YTD):</Typography>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        {formatCurrency(2000)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Rejected Claims:</Typography>
                      <Typography variant="body2" fontWeight="medium" color="error.main">
                        {formatCurrency(150)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Expense by Category" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Travel</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(450)} (22%)
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={22} color="primary" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Accommodation</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(350)} (17%)
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={17} color="secondary" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Meals</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(85)} (4%)
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={4} color="success" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Training</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(1200)} (57%)
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={57} color="warning" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <Button variant="outlined" startIcon={<Download />}>
                  Download Monthly Report
                </Button>
                <Button variant="outlined" startIcon={<Download />}>
                  Download YTD Summary
                </Button>
                <Button variant="outlined" startIcon={<Download />}>
                  Export to Excel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* New Claim Dialog */}
      <Dialog
        open={claimDialogOpen}
        onClose={() => setClaimDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submit New Expense Claim</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Expense Type</InputLabel>
                  <Select
                    value={newClaim.type}
                    onChange={(e) => setNewClaim(prev => ({ ...prev, type: e.target.value as any }))}
                    label="Expense Type"
                  >
                    <MenuItem value="travel">Travel</MenuItem>
                    <MenuItem value="accommodation">Accommodation</MenuItem>
                    <MenuItem value="meals">Meals</MenuItem>
                    <MenuItem value="medical">Medical</MenuItem>
                    <MenuItem value="communication">Communication</MenuItem>
                    <MenuItem value="training">Training</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={newClaim.date}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={newClaim.amount}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, amount: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={newClaim.currency}
                    onChange={(e) => setNewClaim(prev => ({ ...prev, currency: e.target.value }))}
                    label="Currency"
                  >
                    <MenuItem value="USD">USD - US Dollar</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="GBP">GBP - British Pound</MenuItem>
                    <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                    <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                    <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={newClaim.description}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newClaim.category}
                    onChange={(e) => setNewClaim(prev => ({ ...prev, category: e.target.value }))}
                    label="Category"
                  >
                    <MenuItem value="Client Meetings">Client Meetings</MenuItem>
                    <MenuItem value="Conference">Conference</MenuItem>
                    <MenuItem value="Professional Development">Professional Development</MenuItem>
                    <MenuItem value="Team Building">Team Building</MenuItem>
                    <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Project (Optional)</InputLabel>
                  <Select
                    value={newClaim.project}
                    onChange={(e) => setNewClaim(prev => ({ ...prev, project: e.target.value }))}
                    label="Project (Optional)"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Project Alpha">Project Alpha</MenuItem>
                    <MenuItem value="Project Beta">Project Beta</MenuItem>
                    <MenuItem value="Project Gamma">Project Gamma</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes (Optional)"
                  multiline
                  rows={2}
                  value={newClaim.notes}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, notes: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Upload Receipt
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    mb: 2
                  }}
                >
                  <input
                    type="file"
                    id="receipt-upload"
                    hidden
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="receipt-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<Upload />}
                    >
                      Choose File
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {selectedFile
                      ? `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`
                      : 'Supported formats: JPG, PNG, PDF (Max 5MB)'}
                  </Typography>
                  {selectedFile && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>OCR Results:</strong> Our AI has detected the following information:
                      </Typography>
                      <Typography variant="body2">
                        Vendor: Starbucks<br />
                        Date: {format(new Date(), 'MMM dd, yyyy')}<br />
                        Amount: $12.50
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClaimDialogOpen(false)}>Cancel</Button>
          <Button variant="outlined">Save as Draft</Button>
          <Button
            variant="contained"
            onClick={handleSubmitClaim}
            disabled={!newClaim.amount || !newClaim.description || !selectedFile}
          >
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Claim Dialog */}
      <Dialog
        open={viewClaimDialogOpen}
        onClose={() => setViewClaimDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedClaim && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getClaimTypeIcon(selectedClaim.type)}
                Expense Claim Details
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Claim Information</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Type:</Typography>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {selectedClaim.type}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Description:</Typography>
                        <Typography variant="body2">{selectedClaim.description}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Date:</Typography>
                        <Typography variant="body2">
                          {format(selectedClaim.date, 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Amount:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(selectedClaim.amount, selectedClaim.currency)}
                        </Typography>
                      </Box>
                      {selectedClaim.category && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Category:</Typography>
                          <Typography variant="body2">{selectedClaim.category}</Typography>
                        </Box>
                      )}
                      {selectedClaim.project && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Project:</Typography>
                          <Typography variant="body2">{selectedClaim.project}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Status Information</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Status:</Typography>
                        <Chip
                          icon={getStatusIcon(selectedClaim.status)}
                          label={selectedClaim.status.toUpperCase()}
                          color={getStatusColor(selectedClaim.status)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Submitted:</Typography>
                        <Typography variant="body2">
                          {selectedClaim.submittedDate
                            ? format(selectedClaim.submittedDate, 'MMM dd, yyyy')
                            : '-'}
                        </Typography>
                      </Box>
                      {selectedClaim.approvedBy && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Approved By:</Typography>
                          <Typography variant="body2">{selectedClaim.approvedBy}</Typography>
                        </Box>
                      )}
                      {selectedClaim.approvedDate && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Approved Date:</Typography>
                          <Typography variant="body2">
                            {format(selectedClaim.approvedDate, 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      )}
                      {selectedClaim.paidDate && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Paid Date:</Typography>
                          <Typography variant="body2">
                            {format(selectedClaim.paidDate, 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>Receipts</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>File Name</TableCell>
                            <TableCell>Upload Date</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>OCR Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedClaim.receipts.map((receipt) => (
                            <TableRow key={receipt.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Description fontSize="small" />
                                  <Typography variant="body2">{receipt.name}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {format(receipt.uploadDate, 'MMM dd, yyyy')}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{formatFileSize(receipt.size)}</Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={receipt.ocrProcessed ? 'Processed' : 'Pending'}
                                  color={receipt.ocrProcessed ? 'success' : 'warning'}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <Tooltip title="View Receipt">
                                    <IconButton size="small">
                                      <Visibility />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Download">
                                    <IconButton size="small">
                                      <Download />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewClaimDialogOpen(false)}>Close</Button>
              {selectedClaim.status === 'approved' && (
                <Button variant="contained" startIcon={<Download />}>
                  Download Approval
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};