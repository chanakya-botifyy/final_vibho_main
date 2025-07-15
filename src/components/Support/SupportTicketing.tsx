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
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  InputAdornment,
  Badge
} from '@mui/material';
import {
  Add,
  Search,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Pending,
  Help,
  BugReport,
  Settings,
  Build,
  Assignment,
  Comment,
  AttachFile,
  Send,
  Schedule,
  Person,
  Email,
  Phone,
  ChatBubble,
  WhatsApp,
  QuestionAnswer,
  Refresh,
  FilterList,
  Sort,
  ArrowUpward,
  ArrowDownward,
  Star,
  StarBorder,
  MoreVert,
  Info,
  Warning,
  Error as ErrorIcon,
  Notifications,
  AccountBalance,
  ThumbUp,
  ThumbDown,
  Print
} from '@mui/icons-material';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: 'technical' | 'hr' | 'payroll' | 'general' | 'access' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
  createdBy: {
    id: string;
    name: string;
    email: string;
    department: string;
    avatar?: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdDate: Date;
  updatedDate: Date;
  resolvedDate?: Date;
  dueDate?: Date;
  comments: TicketComment[];
  attachments: TicketAttachment[];
  isStarred: boolean;
  tags: string[];
  satisfaction?: 1 | 2 | 3 | 4 | 5;
}

interface TicketComment {
  id: string;
  text: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
    isAgent: boolean;
  };
  createdDate: Date;
  attachments: TicketAttachment[];
  isInternal: boolean;
}

interface TicketAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadDate: Date;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdDate: Date;
  updatedDate: Date;
  viewCount: number;
  helpfulCount: number;
  unhelpfulCount: number;
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
      id={`support-tabpanel-${index}`}
      aria-labelledby={`support-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const SupportTicketing: React.FC = () => {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [viewTicketDialogOpen, setViewTicketDialogOpen] = useState(false);
  const [knowledgeDialogOpen, setKnowledgeDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'technical' as const,
    priority: 'medium' as const,
    attachments: [] as File[]
  });
  const [newComment, setNewComment] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Mock tickets data
  const tickets: Ticket[] = [
    {
      id: 'TKT-1001',
      subject: 'Unable to access payroll system',
      description: 'I am trying to view my latest payslip but getting an error when accessing the payroll module.',
      category: 'payroll',
      priority: 'high',
      status: 'in_progress',
      createdBy: {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@company.com',
        department: 'Engineering',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      assignedTo: {
        id: '5',
        name: 'Support Team',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      createdDate: new Date('2024-02-19T10:30:00'),
      updatedDate: new Date('2024-02-19T14:45:00'),
      dueDate: new Date('2024-02-21T17:00:00'),
      comments: [
        {
          id: '1',
          text: 'I have tried clearing my browser cache and using a different browser, but still getting the same error.',
          createdBy: {
            id: '1',
            name: 'John Smith',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            isAgent: false
          },
          createdDate: new Date('2024-02-19T11:15:00'),
          attachments: [],
          isInternal: false
        },
        {
          id: '2',
          text: 'Thank you for reporting this issue. We are investigating the problem with the payroll system access. Could you please provide the exact error message you are seeing?',
          createdBy: {
            id: '5',
            name: 'Support Team',
            avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            isAgent: true
          },
          createdDate: new Date('2024-02-19T14:45:00'),
          attachments: [],
          isInternal: false
        }
      ],
      attachments: [
        {
          id: '1',
          name: 'error_screenshot.png',
          size: 250000,
          type: 'image/png',
          url: '/attachments/error_screenshot.png',
          uploadDate: new Date('2024-02-19T10:30:00')
        }
      ],
      isStarred: true,
      tags: ['payroll', 'access', 'error']
    },
    {
      id: 'TKT-1002',
      subject: 'Request for leave policy clarification',
      description: 'I need clarification on the company\'s policy for paternity leave. How many days am I eligible for?',
      category: 'hr',
      priority: 'medium',
      status: 'open',
      createdBy: {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        department: 'Marketing',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      createdDate: new Date('2024-02-20T09:15:00'),
      updatedDate: new Date('2024-02-20T09:15:00'),
      comments: [],
      attachments: [],
      isStarred: false,
      tags: ['leave', 'policy', 'hr']
    },
    {
      id: 'TKT-1003',
      subject: 'VPN connection issues',
      description: 'I am unable to connect to the company VPN when working from home. The connection times out after several attempts.',
      category: 'technical',
      priority: 'high',
      status: 'resolved',
      createdBy: {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Sales',
        avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      assignedTo: {
        id: '6',
        name: 'IT Support',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      createdDate: new Date('2024-02-15T11:20:00'),
      updatedDate: new Date('2024-02-17T16:30:00'),
      resolvedDate: new Date('2024-02-17T16:30:00'),
      comments: [
        {
          id: '3',
          text: 'I have tried restarting my computer and router, but still having the same issue.',
          createdBy: {
            id: '3',
            name: 'Sarah Johnson',
            avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            isAgent: false
          },
          createdDate: new Date('2024-02-15T13:45:00'),
          attachments: [],
          isInternal: false
        },
        {
          id: '4',
          text: 'We have identified an issue with the VPN server. Our team is working on resolving it. We will update you once it\'s fixed.',
          createdBy: {
            id: '6',
            name: 'IT Support',
            avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            isAgent: true
          },
          createdDate: new Date('2024-02-16T10:15:00'),
          attachments: [],
          isInternal: false
        },
        {
          id: '5',
          text: 'The VPN server issue has been resolved. Please try connecting again and let us know if you still experience any problems.',
          createdBy: {
            id: '6',
            name: 'IT Support',
            avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            isAgent: true
          },
          createdDate: new Date('2024-02-17T16:30:00'),
          attachments: [],
          isInternal: false
        }
      ],
      attachments: [
        {
          id: '2',
          name: 'vpn_error_log.txt',
          size: 15000,
          type: 'text/plain',
          url: '/attachments/vpn_error_log.txt',
          uploadDate: new Date('2024-02-15T11:20:00')
        }
      ],
      isStarred: false,
      tags: ['vpn', 'connection', 'remote', 'it'],
      satisfaction: 5
    },
    {
      id: 'TKT-1004',
      subject: 'Request for new laptop',
      description: 'My current laptop is over 3 years old and has been having performance issues. I would like to request a replacement.',
      category: 'general',
      priority: 'medium',
      status: 'closed',
      createdBy: {
        id: '4',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        department: 'Design',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      assignedTo: {
        id: '7',
        name: 'Admin Team',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      },
      createdDate: new Date('2024-01-25T14:10:00'),
      updatedDate: new Date('2024-02-05T11:30:00'),
      resolvedDate: new Date('2024-02-05T11:30:00'),
      comments: [
        {
          id: '6',
          text: 'Your request has been approved. We will order a new laptop for you and notify you when it arrives.',
          createdBy: {
            id: '7',
            name: 'Admin Team',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            isAgent: true
          },
          createdDate: new Date('2024-01-30T09:45:00'),
          attachments: [],
          isInternal: false
        },
        {
          id: '7',
          text: 'Your new laptop has arrived. Please visit the IT department to pick it up and set it up.',
          createdBy: {
            id: '7',
            name: 'Admin Team',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
            isAgent: true
          },
          createdDate: new Date('2024-02-05T11:30:00'),
          attachments: [],
          isInternal: false
        }
      ],
      attachments: [],
      isStarred: false,
      tags: ['hardware', 'laptop', 'request'],
      satisfaction: 4
    }
  ];

  // Mock knowledge base articles
  const knowledgeArticles: KnowledgeArticle[] = [
    {
      id: '1',
      title: 'How to Reset Your Password',
      content: 'This article guides you through the process of resetting your password in the VibhoHCM system.',
      category: 'Account Management',
      tags: ['password', 'reset', 'account', 'login'],
      author: 'IT Support',
      createdDate: new Date('2023-12-01'),
      updatedDate: new Date('2024-01-15'),
      viewCount: 1250,
      helpfulCount: 980,
      unhelpfulCount: 45
    },
    {
      id: '2',
      title: 'Understanding Leave Policies',
      content: 'A comprehensive guide to the company\'s leave policies, including annual leave, sick leave, and special leave types.',
      category: 'HR Policies',
      tags: ['leave', 'policy', 'annual leave', 'sick leave'],
      author: 'HR Department',
      createdDate: new Date('2023-11-15'),
      updatedDate: new Date('2024-01-10'),
      viewCount: 950,
      helpfulCount: 820,
      unhelpfulCount: 30
    },
    {
      id: '3',
      title: 'Expense Claim Submission Guide',
      content: 'Learn how to submit expense claims correctly, including required documentation and approval process.',
      category: 'Finance',
      tags: ['expense', 'claim', 'reimbursement', 'finance'],
      author: 'Finance Department',
      createdDate: new Date('2023-10-20'),
      updatedDate: new Date('2024-01-05'),
      viewCount: 780,
      helpfulCount: 650,
      unhelpfulCount: 25
    },
    {
      id: '4',
      title: 'VPN Connection Troubleshooting',
      content: 'Common issues and solutions for VPN connection problems when working remotely.',
      category: 'IT Support',
      tags: ['vpn', 'remote', 'connection', 'troubleshooting'],
      author: 'IT Support',
      createdDate: new Date('2023-09-10'),
      updatedDate: new Date('2024-02-01'),
      viewCount: 1500,
      helpfulCount: 1350,
      unhelpfulCount: 40
    },
    {
      id: '5',
      title: 'Performance Review Process',
      content: 'A step-by-step guide to the annual performance review process, including preparation tips.',
      category: 'HR Policies',
      tags: ['performance', 'review', 'evaluation', 'feedback'],
      author: 'HR Department',
      createdDate: new Date('2023-08-15'),
      updatedDate: new Date('2023-12-20'),
      viewCount: 850,
      helpfulCount: 720,
      unhelpfulCount: 35
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <BugReport />;
      case 'hr': return <Person />;
      case 'payroll': return <AccountBalance />;
      case 'general': return <Help />;
      case 'access': return <Settings />;
      default: return <Help />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <ErrorIcon color="error" />;
      case 'high': return <Warning color="error" />;
      case 'medium': return <Info color="warning" />;
      case 'low': return <Info color="info" />;
      default: return <Info />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'info';
      case 'on_hold': return 'default';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Pending />;
      case 'in_progress': return <Build />;
      case 'on_hold': return <Schedule />;
      case 'resolved': return <CheckCircle />;
      case 'closed': return <Cancel />;
      default: return <Pending />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const days = differenceInDays(now, date);
    const hours = differenceInHours(now, date);
    const minutes = differenceInMinutes(now, date);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleCreateTicket = () => {
    console.log('Creating ticket:', newTicket);
    setTicketDialogOpen(false);
    setNewTicket({
      subject: '',
      description: '',
      category: 'technical',
      priority: 'medium',
      attachments: []
    });
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setViewTicketDialogOpen(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTicket) return;
    
    console.log('Adding comment to ticket:', selectedTicket.id, newComment);
    setNewComment('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setNewTicket(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const handleViewArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setKnowledgeDialogOpen(true);
  };

  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Support & Ticketing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get help with system issues, HR queries, and access our knowledge base.
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="My Tickets" />
            <Tab label="Knowledge Base" />
            <Tab label="Chat Support" />
            <Tab label="FAQ" />
          </Tabs>
        </Box>

        {/* My Tickets Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1, maxWidth: 600 }}>
              <TextField
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
                size="small"
                fullWidth
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
              <IconButton>
                <FilterList />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setTicketDialogOpen(true)}
            >
              Create Ticket
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {ticket.isStarred && <Star color="warning" fontSize="small" />}
                        <Typography variant="body2" fontWeight="medium">
                          {ticket.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ticket.subject}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getCategoryIcon(ticket.category)}
                        label={ticket.category.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getPriorityIcon(ticket.priority)}
                        label={ticket.priority}
                        color={getPriorityColor(ticket.priority)}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(ticket.status)}
                        label={ticket.status.replace('_', ' ')}
                        color={getStatusColor(ticket.status)}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={format(ticket.createdDate, 'MMM dd, yyyy HH:mm')}>
                        <Typography variant="body2">
                          {formatTimeAgo(ticket.createdDate)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={format(ticket.updatedDate, 'MMM dd, yyyy HH:mm')}>
                        <Typography variant="body2">
                          {formatTimeAgo(ticket.updatedDate)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Ticket">
                          <IconButton size="small" onClick={() => handleViewTicket(ticket)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                          <Tooltip title="Edit Ticket">
                            <IconButton size="small">
                              <Edit />
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
        </TabPanel>

        {/* Knowledge Base Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <TextField
              placeholder="Search knowledge base..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              size="small"
              sx={{ maxWidth: 400 }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Categories" />
                <CardContent>
                  <List>
                    <ListItem button>
                      <ListItemIcon>
                        <Settings />
                      </ListItemIcon>
                      <ListItemText primary="Account Management" />
                      <Chip label="8" size="small" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText primary="HR Policies" />
                      <Chip label="12" size="small" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <AccountBalance />
                      </ListItemIcon>
                      <ListItemText primary="Finance" />
                      <Chip label="6" size="small" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <BugReport />
                      </ListItemIcon>
                      <ListItemText primary="IT Support" />
                      <Chip label="15" size="small" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <Build />
                      </ListItemIcon>
                      <ListItemText primary="System Usage" />
                      <Chip label="10" size="small" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Popular Articles
              </Typography>
              <Grid container spacing={2}>
                {knowledgeArticles.map((article) => (
                  <Grid item xs={12} key={article.id}>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {article.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {article.content.length > 150
                              ? `${article.content.substring(0, 150)}...`
                              : article.content}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {article.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Chip
                            label={article.category}
                            color="primary"
                            size="small"
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {article.viewCount} views
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <ThumbUp fontSize="small" color="success" />
                            <Typography variant="caption">
                              {article.helpfulCount}
                            </Typography>
                            <ThumbDown fontSize="small" color="error" sx={{ ml: 1 }} />
                            <Typography variant="caption">
                              {article.unhelpfulCount}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Last updated: {format(article.updatedDate, 'MMM dd, yyyy')}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewArticle(article)}
                        >
                          Read More
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Chat Support Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Live Chat Support" />
                <CardContent>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ChatBubble sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Chat with Support Team
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Our support team is available to help you with any questions or issues.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ChatBubble />}
                    >
                      Start Chat
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
                      Available Monday-Friday, 9:00 AM - 6:00 PM
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="WhatsApp Support" />
                <CardContent>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <WhatsApp sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Connect via WhatsApp
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Get instant support through our WhatsApp business account.
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<WhatsApp />}
                    >
                      WhatsApp Support
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
                      Available 24/7 with AI assistance and human agents during business hours
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Other Support Channels" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Email sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6" gutterBottom>
                          Email Support
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Send us an email and we'll respond within 24 hours.
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Email />}
                        >
                          support@vibhohcm.com
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Phone sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h6" gutterBottom>
                          Phone Support
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Call our support hotline for immediate assistance.
                        </Typography>
                        <Button
                          variant="outlined"
                          color="success"
                          startIcon={<Phone />}
                        >
                          +1-800-VIBHOHCM
                        </Button>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <QuestionAnswer sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                        <Typography variant="h6" gutterBottom>
                          Community Forum
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Join our community forum to discuss with other users.
                        </Typography>
                        <Button
                          variant="outlined"
                          color="info"
                          startIcon={<QuestionAnswer />}
                        >
                          Visit Forum
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* FAQ Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Account & Access" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="How do I reset my password?"
                        secondary="You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email."
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="What should I do if I'm locked out of my account?"
                        secondary="After multiple failed login attempts, your account may be temporarily locked. Contact your system administrator or the IT helpdesk for assistance."
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="How can I update my profile information?"
                        secondary="Navigate to the 'My Profile' section from the main menu. Click on the 'Edit Profile' button to update your information."
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Leave & Attendance" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="How do I apply for leave?"
                        secondary="Go to the 'Leave Management' section, click on 'Apply for Leave', fill in the required details, and submit your request."
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="How can I check my leave balance?"
                        secondary="Your current leave balance is displayed on your dashboard. For a detailed view, go to the 'Leave Management' section."
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="What should I do if I forget to check in?"
                        secondary="If you forget to check in, you can submit an attendance regularization request from the 'Attendance' section."
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Payroll & Benefits" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="When are payslips available?"
                        secondary="Payslips are typically available on the last day of each month. You can access them from the 'Payroll' section."
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="How do I update my bank account details?"
                        secondary="Go to 'My Profile', then 'Banking Information'. Click on 'Edit' to update your bank account details."
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="How can I view my tax deductions?"
                        secondary="Tax deductions are itemized in your monthly payslip. For annual tax statements, check the 'Tax Documents' section under 'Payroll'."
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Technical Issues" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="What browsers are supported?"
                        secondary="VibhoHCM supports the latest versions of Chrome, Firefox, Safari, and Edge. For optimal performance, we recommend using Chrome."
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="How do I clear my browser cache?"
                        secondary="To clear your browser cache, press Ctrl+Shift+Delete (Windows) or Command+Shift+Delete (Mac), select 'Cached images and files', and click 'Clear data'."
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <QuestionAnswer />
                      </ListItemIcon>
                      <ListItemText
                        primary="The system is running slowly. What should I do?"
                        secondary="Try clearing your browser cache, closing unnecessary tabs, and ensuring you have a stable internet connection. If the issue persists, contact IT support."
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog
        open={ticketDialogOpen}
        onClose={() => setTicketDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Support Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Subject"
              value={newTicket.subject}
              onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value as any }))}
                    label="Category"
                  >
                    <MenuItem value="technical">Technical Issue</MenuItem>
                    <MenuItem value="hr">HR Query</MenuItem>
                    <MenuItem value="payroll">Payroll</MenuItem>
                    <MenuItem value="general">General Inquiry</MenuItem>
                    <MenuItem value="access">Access Request</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={6}
              value={newTicket.description}
              onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide as much detail as possible to help us resolve your issue quickly."
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                id="ticket-attachment"
                hidden
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="ticket-attachment">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AttachFile />}
                >
                  Attach Files
                </Button>
              </label>
              <Box sx={{ mt: 1 }}>
                {newTicket.attachments.map((file, index) => (
                  <Chip
                    key={index}
                    label={`${file.name} (${formatFileSize(file.size)})`}
                    onDelete={() => {
                      setNewTicket(prev => ({
                        ...prev,
                        attachments: prev.attachments.filter((_, i) => i !== index)
                      }));
                    }}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
            <Alert severity="info">
              Our support team will respond to your ticket as soon as possible. You will receive email notifications for any updates.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTicketDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateTicket}
            disabled={!newTicket.subject || !newTicket.description}
          >
            Submit Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog
        open={viewTicketDialogOpen}
        onClose={() => setViewTicketDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTicket && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {selectedTicket.id} - {selectedTicket.subject}
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedTicket.status)}
                  label={selectedTicket.status.replace('_', ' ')}
                  color={getStatusColor(selectedTicket.status)}
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Category:</Typography>
                        <Chip
                          icon={getCategoryIcon(selectedTicket.category)}
                          label={selectedTicket.category.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Priority:</Typography>
                        <Chip
                          icon={getPriorityIcon(selectedTicket.priority)}
                          label={selectedTicket.priority}
                          color={getPriorityColor(selectedTicket.priority)}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Created:</Typography>
                        <Typography variant="body2">
                          {format(selectedTicket.createdDate, 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      </Box>
                      {selectedTicket.resolvedDate && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Resolved:</Typography>
                          <Typography variant="body2">
                            {format(selectedTicket.resolvedDate, 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Created By:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={selectedTicket.createdBy.avatar}
                            sx={{ width: 24, height: 24 }}
                          >
                            {selectedTicket.createdBy.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            {selectedTicket.createdBy.name}
                          </Typography>
                        </Box>
                      </Box>
                      {selectedTicket.assignedTo && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Assigned To:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={selectedTicket.assignedTo.avatar}
                              sx={{ width: 24, height: 24 }}
                            >
                              {selectedTicket.assignedTo.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">
                              {selectedTicket.assignedTo.name}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      {selectedTicket.dueDate && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Due Date:</Typography>
                          <Typography variant="body2">
                            {format(selectedTicket.dueDate, 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        </Box>
                      )}
                      {selectedTicket.tags.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Tags:</Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {selectedTicket.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Typography variant="body2">
                    {selectedTicket.description}
                  </Typography>
                  {selectedTicket.attachments.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" fontWeight="medium" gutterBottom>
                        Attachments:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedTicket.attachments.map((attachment) => (
                          <Chip
                            key={attachment.id}
                            icon={<AttachFile />}
                            label={`${attachment.name} (${formatFileSize(attachment.size)})`}
                            variant="outlined"
                            onClick={() => {}}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>

                <Typography variant="subtitle2" gutterBottom>
                  Conversation
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3, maxHeight: 300, overflow: 'auto' }}>
                  {selectedTicket.comments.length > 0 ? (
                    <List>
                      {selectedTicket.comments.map((comment) => (
                        <ListItem
                          key={comment.id}
                          alignItems="flex-start"
                          sx={{
                            flexDirection: 'column',
                            alignItems: comment.createdBy.isAgent ? 'flex-start' : 'flex-end',
                            mb: 2
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: comment.createdBy.isAgent ? 'row' : 'row-reverse',
                              alignItems: 'flex-start',
                              gap: 1,
                              maxWidth: '80%'
                            }}
                          >
                            <Avatar
                              src={comment.createdBy.avatar}
                              sx={{ width: 32, height: 32 }}
                            >
                              {comment.createdBy.name.charAt(0)}
                            </Avatar>
                            <Paper
                              sx={{
                                p: 1.5,
                                bgcolor: comment.createdBy.isAgent ? 'grey.100' : 'primary.light',
                                color: comment.createdBy.isAgent ? 'text.primary' : 'primary.contrastText',
                                borderRadius: 2
                              }}
                            >
                              <Typography variant="body2">
                                {comment.text}
                              </Typography>
                              {comment.attachments.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  {comment.attachments.map((attachment) => (
                                    <Chip
                                      key={attachment.id}
                                      icon={<AttachFile />}
                                      label={attachment.name}
                                      size="small"
                                      variant="outlined"
                                      sx={{ mr: 0.5, mb: 0.5, bgcolor: 'background.paper' }}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Paper>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: comment.createdBy.isAgent ? 'flex-start' : 'flex-end',
                              width: '100%',
                              mt: 0.5,
                              pl: comment.createdBy.isAgent ? 5 : 0,
                              pr: comment.createdBy.isAgent ? 0 : 5
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              {comment.createdBy.name} • {format(comment.createdDate, 'MMM dd, HH:mm')}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No comments yet.
                    </Typography>
                  )}
                </Paper>

                {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Add a comment..."
                      multiline
                      rows={2}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        endIcon={<Send />}
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        Send
                      </Button>
                    </Box>
                  </Box>
                )}

                {selectedTicket.status === 'resolved' && !selectedTicket.satisfaction && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      How would you rate our support?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <IconButton
                          key={rating}
                          color={rating <= 3 ? 'warning' : 'success'}
                        >
                          <Star />
                        </IconButton>
                      ))}
                    </Box>
                  </Box>
                )}

                {selectedTicket.satisfaction && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Your Rating
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          color={rating <= selectedTicket.satisfaction! ? 'warning' : 'disabled'}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewTicketDialogOpen(false)}>
                Close
              </Button>
              {selectedTicket.status === 'open' || selectedTicket.status === 'in_progress' ? (
                <Button variant="outlined" color="success">
                  Mark as Resolved
                </Button>
              ) : selectedTicket.status === 'resolved' && (
                <Button variant="outlined" color="error">
                  Reopen Ticket
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Knowledge Article Dialog */}
      <Dialog
        open={knowledgeDialogOpen}
        onClose={() => setKnowledgeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedArticle && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedArticle.title}</Typography>
              <Chip
                label={selectedArticle.category}
                color="primary"
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Typography variant="body1" paragraph>
                  {selectedArticle.content}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {selectedArticle.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {format(selectedArticle.updatedDate, 'MMM dd, yyyy')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Was this article helpful?
                    </Typography>
                    <Button
                      startIcon={<ThumbUp />}
                      size="small"
                      variant="outlined"
                      color="success"
                    >
                      Yes
                    </Button>
                    <Button
                      startIcon={<ThumbDown />}
                      size="small"
                      variant="outlined"
                      color="error"
                    >
                      No
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedArticle.viewCount} views • {selectedArticle.helpfulCount} found this helpful
                  </Typography>
                  <Button
                    startIcon={<Email />}
                    size="small"
                  >
                    Email this article
                  </Button>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Related Articles
                </Typography>
                <List dense>
                  {knowledgeArticles
                    .filter(article => article.id !== selectedArticle.id)
                    .slice(0, 3)
                    .map((article) => (
                      <ListItem
                        key={article.id}
                        button
                        onClick={() => {
                          setSelectedArticle(article);
                        }}
                      >
                        <ListItemIcon>
                          <Assignment />
                        </ListItemIcon>
                        <ListItemText
                          primary={article.title}
                          secondary={article.category}
                        />
                      </ListItem>
                    ))}
                </List>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setKnowledgeDialogOpen(false)}>
                Close
              </Button>
              <Button variant="outlined" startIcon={<Print />}>
                Print
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};