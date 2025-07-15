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
  FormControlLabel,
  ListItemSecondaryAction,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Description,
  Folder,
  Upload,
  Download,
  Visibility,
  Delete,
  Edit,
  Add,
  Search,
  FilterList,
  Share,
  Lock,
  LockOpen,
  Star,
  StarBorder,
  CloudUpload,
  History,
  Person,
  Business,
  School,
  Work,
  Receipt,
  Assignment,
  FileCopy,
  PictureAsPdf,
  Image,
  AttachFile,
  Schedule,
  CheckCircle,
  Warning,
  Error as ErrorIcon
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'xls' | 'ppt' | 'txt' | 'zip' | 'other';
  category: 'personal' | 'company' | 'contract' | 'policy' | 'certificate' | 'financial' | 'other';
  size: number;
  uploadedBy: string;
  uploadedDate: Date;
  lastModified: Date;
  version: number;
  status: 'active' | 'archived' | 'pending_approval' | 'expired';
  expiryDate?: Date;
  tags: string[];
  description?: string;
  path: string;
  isStarred: boolean;
  isShared: boolean;
  permissions: {
    view: string[];
    edit: string[];
    delete: string[];
  };
  metadata?: Record<string, any>;
}

interface Folder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  createdBy: string;
  createdDate: Date;
  documents: Document[];
  subfolders: Folder[];
  isShared: boolean;
  permissions: {
    view: string[];
    edit: string[];
    delete: string[];
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
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const DocumentManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDocument, setNewDocument] = useState({
    name: '',
    category: 'personal' as const,
    tags: '',
    description: '',
    expiryDate: ''
  });
  const [newFolder, setNewFolder] = useState({
    name: '',
    parentId: ''
  });

  // Mock documents data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Employee Handbook 2024.pdf',
      type: 'pdf',
      category: 'company',
      size: 2.5 * 1024 * 1024,
      uploadedBy: 'HR Department',
      uploadedDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-15'),
      version: 1,
      status: 'active',
      tags: ['policy', 'handbook', 'company'],
      description: 'Official employee handbook with company policies and procedures',
      path: '/documents/company/Employee Handbook 2024.pdf',
      isStarred: true,
      isShared: true,
      permissions: {
        view: ['all'],
        edit: ['hr', 'admin'],
        delete: ['admin']
      }
    },
    {
      id: '2',
      name: 'Employment Contract - John Smith.pdf',
      type: 'pdf',
      category: 'contract',
      size: 1.2 * 1024 * 1024,
      uploadedBy: 'HR Department',
      uploadedDate: new Date('2023-01-10'),
      lastModified: new Date('2023-01-10'),
      version: 1,
      status: 'active',
      tags: ['contract', 'employment', 'legal'],
      description: 'Signed employment contract',
      path: '/documents/contracts/Employment Contract - John Smith.pdf',
      isStarred: false,
      isShared: false,
      permissions: {
        view: ['hr', 'admin', 'user:1'],
        edit: ['hr', 'admin'],
        delete: ['admin']
      }
    },
    {
      id: '3',
      name: 'Performance Review Q4 2023.docx',
      type: 'doc',
      category: 'personal',
      size: 0.8 * 1024 * 1024,
      uploadedBy: 'Michael Chen',
      uploadedDate: new Date('2024-01-20'),
      lastModified: new Date('2024-01-25'),
      version: 2,
      status: 'active',
      tags: ['performance', 'review', 'q4'],
      description: 'Quarterly performance review document',
      path: '/documents/personal/Performance Review Q4 2023.docx',
      isStarred: true,
      isShared: true,
      permissions: {
        view: ['hr', 'manager:3', 'user:1'],
        edit: ['hr', 'manager:3'],
        delete: ['hr', 'admin']
      }
    },
    {
      id: '4',
      name: 'Passport Copy.jpg',
      type: 'image',
      category: 'personal',
      size: 1.5 * 1024 * 1024,
      uploadedBy: 'John Smith',
      uploadedDate: new Date('2023-05-15'),
      lastModified: new Date('2023-05-15'),
      version: 1,
      status: 'active',
      expiryDate: new Date('2028-05-14'),
      tags: ['identification', 'personal', 'travel'],
      path: '/documents/personal/Passport Copy.jpg',
      isStarred: false,
      isShared: false,
      permissions: {
        view: ['hr', 'user:1'],
        edit: ['user:1'],
        delete: ['user:1', 'admin']
      }
    },
    {
      id: '5',
      name: 'Health Insurance Policy.pdf',
      type: 'pdf',
      category: 'policy',
      size: 3.2 * 1024 * 1024,
      uploadedBy: 'HR Department',
      uploadedDate: new Date('2023-12-01'),
      lastModified: new Date('2023-12-01'),
      version: 1,
      status: 'active',
      expiryDate: new Date('2024-11-30'),
      tags: ['insurance', 'health', 'benefits'],
      description: 'Company health insurance policy document',
      path: '/documents/policies/Health Insurance Policy.pdf',
      isStarred: false,
      isShared: true,
      permissions: {
        view: ['all'],
        edit: ['hr', 'admin'],
        delete: ['admin']
      }
    },
    {
      id: '6',
      name: 'Salary Certificate.pdf',
      type: 'pdf',
      category: 'financial',
      size: 0.5 * 1024 * 1024,
      uploadedBy: 'HR Department',
      uploadedDate: new Date('2024-01-05'),
      lastModified: new Date('2024-01-05'),
      version: 1,
      status: 'active',
      tags: ['salary', 'certificate', 'financial'],
      path: '/documents/financial/Salary Certificate.pdf',
      isStarred: true,
      isShared: false,
      permissions: {
        view: ['hr', 'user:1'],
        edit: ['hr'],
        delete: ['hr', 'admin']
      }
    }
  ];

  // Mock folders data
  const folders: Folder[] = [
    {
      id: '1',
      name: 'Personal Documents',
      path: '/documents/personal',
      createdBy: 'John Smith',
      createdDate: new Date('2023-01-01'),
      documents: documents.filter(doc => doc.category === 'personal'),
      subfolders: [],
      isShared: false,
      permissions: {
        view: ['user:1', 'hr'],
        edit: ['user:1'],
        delete: ['user:1', 'admin']
      }
    },
    {
      id: '2',
      name: 'Company Policies',
      path: '/documents/policies',
      createdBy: 'HR Department',
      createdDate: new Date('2023-01-01'),
      documents: documents.filter(doc => doc.category === 'policy' || doc.category === 'company'),
      subfolders: [],
      isShared: true,
      permissions: {
        view: ['all'],
        edit: ['hr', 'admin'],
        delete: ['admin']
      }
    },
    {
      id: '3',
      name: 'Contracts',
      path: '/documents/contracts',
      createdBy: 'HR Department',
      createdDate: new Date('2023-01-01'),
      documents: documents.filter(doc => doc.category === 'contract'),
      subfolders: [],
      isShared: false,
      permissions: {
        view: ['hr', 'admin', 'user:1'],
        edit: ['hr', 'admin'],
        delete: ['admin']
      }
    }
  ];

  // Document templates
  const documentTemplates = [
    {
      id: '1',
      name: 'Leave Application Form',
      type: 'doc',
      category: 'template',
      size: 0.5 * 1024 * 1024,
      description: 'Standard template for leave applications'
    },
    {
      id: '2',
      name: 'Expense Claim Form',
      type: 'xls',
      category: 'template',
      size: 0.6 * 1024 * 1024,
      description: 'Template for submitting expense claims'
    },
    {
      id: '3',
      name: 'Performance Review Template',
      type: 'doc',
      category: 'template',
      size: 0.7 * 1024 * 1024,
      description: 'Standard performance review form'
    },
    {
      id: '4',
      name: 'Employee Onboarding Checklist',
      type: 'pdf',
      category: 'template',
      size: 0.4 * 1024 * 1024,
      description: 'Checklist for new employee onboarding'
    }
  ];

  // Document version history
  const documentHistory = [
    {
      version: 3,
      modifiedBy: 'Sarah Johnson',
      modifiedDate: new Date('2024-01-25'),
      changes: 'Updated performance metrics section'
    },
    {
      version: 2,
      modifiedBy: 'John Smith',
      modifiedDate: new Date('2024-01-20'),
      changes: 'Added Q4 achievements'
    },
    {
      version: 1,
      modifiedBy: 'Michael Chen',
      modifiedDate: new Date('2024-01-15'),
      changes: 'Initial document creation'
    }
  ];

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf color="error" />;
      case 'doc': return <Description color="primary" />;
      case 'xls': return <Description color="success" />;
      case 'ppt': return <Description color="warning" />;
      case 'image': return <Image color="info" />;
      case 'zip': return <Folder color="action" />;
      default: return <AttachFile />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return <Person />;
      case 'company': return <Business />;
      case 'contract': return <Assignment />;
      case 'policy': return <Description />;
      case 'certificate': return <School />;
      case 'financial': return <Receipt />;
      default: return <Folder />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'archived': return 'default';
      case 'pending_approval': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'archived': return <History />;
      case 'pending_approval': return <Schedule />;
      case 'expired': return <ErrorIcon />;
      default: return <CheckCircle />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setNewDocument(prev => ({
        ...prev,
        name: event.target.files![0].name
      }));
    }
  };

  const handleUploadDocument = () => {
    console.log('Uploading document:', newDocument, selectedFile);
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setNewDocument({
      name: '',
      category: 'personal',
      tags: '',
      description: '',
      expiryDate: ''
    });
  };

  const handleCreateFolder = () => {
    console.log('Creating folder:', newFolder);
    setFolderDialogOpen(false);
    setNewFolder({
      name: '',
      parentId: ''
    });
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const handleShareDocument = (document: Document) => {
    setSelectedDocument(document);
    setShareDialogOpen(true);
  };

  const handleViewHistory = (document: Document) => {
    setSelectedDocument(document);
    setHistoryDialogOpen(true);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Document Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Secure document storage with AI-powered categorization and search.
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All Documents" />
            <Tab label="My Documents" />
            <Tab label="Shared with Me" />
            <Tab label="Templates" />
          </Tabs>
        </Box>

        {/* All Documents Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1, maxWidth: 600 }}>
              <TextField
                placeholder="Search documents..."
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
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="company">Company</MenuItem>
                  <MenuItem value="contract">Contracts</MenuItem>
                  <MenuItem value="policy">Policies</MenuItem>
                  <MenuItem value="certificate">Certificates</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Folder />}
                onClick={() => setFolderDialogOpen(true)}
              >
                New Folder
              </Button>
              <Button
                variant="contained"
                startIcon={<Upload />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload Document
              </Button>
            </Box>
          </Box>

          {/* Folders */}
          <Typography variant="h6" gutterBottom>
            Folders
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {folders.map((folder) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Folder color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {folder.name}
                    </Typography>
                    {folder.isShared && (
                      <Chip
                        label="Shared"
                        size="small"
                        color="info"
                        sx={{ ml: 'auto' }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {folder.documents.length} documents
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {format(folder.createdDate, 'MMM dd, yyyy')}
                  </Typography>
                  <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton size="small">
                      <Share />
                    </IconButton>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Documents */}
          <Typography variant="h6" gutterBottom>
            Documents
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {getDocumentTypeIcon(document.type)}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {document.name}
                          </Typography>
                          {document.tags.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                              {document.tags.slice(0, 2).map((tag, index) => (
                                <Chip
                                  key={index}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              ))}
                              {document.tags.length > 2 && (
                                <Chip
                                  label={`+${document.tags.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getCategoryIcon(document.category)}
                        label={document.category.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatFileSize(document.size)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(document.uploadedDate, 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        by {document.uploadedBy}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(document.status)}
                        label={document.status.replace('_', ' ')}
                        color={getStatusColor(document.status)}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View">
                          <IconButton size="small" onClick={() => handleViewDocument(document)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton size="small">
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                          <IconButton size="small" onClick={() => handleShareDocument(document)}>
                            <Share />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={document.isStarred ? 'Unstar' : 'Star'}>
                          <IconButton size="small">
                            {document.isStarred ? <Star color="warning" /> : <StarBorder />}
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

        {/* My Documents Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">My Documents</Typography>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload Document
            </Button>
          </Box>

          <Grid container spacing={2}>
            {documents
              .filter(doc => doc.permissions.view.includes('user:1') || doc.permissions.view.includes('all'))
              .map((document) => (
                <Grid item xs={12} sm={6} md={4} key={document.id}>
                  <Paper
                    sx={{
                      p: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton size="small">
                        {document.isStarred ? <Star color="warning" /> : <StarBorder />}
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                      {getDocumentTypeIcon(document.type)}
                      <Typography variant="body1" fontWeight="medium" sx={{ ml: 1, mr: 4 }} noWrap>
                        {document.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        icon={getCategoryIcon(document.category)}
                        label={document.category.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    
                    {document.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {document.description.length > 60
                          ? `${document.description.substring(0, 60)}...`
                          : document.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {document.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      ))}
                      {document.tags.length > 3 && (
                        <Chip
                          label={`+${document.tags.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(document.size)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(document.uploadedDate, 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <IconButton size="small" onClick={() => handleViewDocument(document)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <Download fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleShareDocument(document)}>
                        <Share fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleViewHistory(document)}>
                        <History fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </TabPanel>

        {/* Shared with Me Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Documents Shared with Me
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Shared By</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Shared Date</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents
                  .filter(doc => doc.isShared)
                  .map((document) => (
                    <TableRow key={document.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {getDocumentTypeIcon(document.type)}
                          <Typography variant="body2" fontWeight="medium">
                            {document.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{document.uploadedBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getCategoryIcon(document.category)}
                          label={document.category.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(document.uploadedDate, 'MMM dd, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={document.permissions.edit.includes('user:1') ? <Edit /> : <Visibility />}
                          label={document.permissions.edit.includes('user:1') ? 'Can Edit' : 'View Only'}
                          color={document.permissions.edit.includes('user:1') ? 'primary' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => handleViewDocument(document)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton size="small">
                              <Download />
                            </IconButton>
                          </Tooltip>
                          {document.permissions.edit.includes('user:1') && (
                            <Tooltip title="Edit">
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

        {/* Templates Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Document Templates
          </Typography>
          <Grid container spacing={2}>
            {documentTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={3} key={template.id}>
                <Paper
                  sx={{
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getDocumentTypeIcon(template.type)}
                    <Typography variant="body1" fontWeight="medium" sx={{ ml: 1 }} noWrap>
                      {template.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {template.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(template.size)}
                    </Typography>
                    <Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Download />}
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>

      {/* Upload Document Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                    id="document-upload"
                    hidden
                    onChange={handleFileChange}
                  />
                  <label htmlFor="document-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUpload />}
                    >
                      Choose File
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {selectedFile
                      ? `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`
                      : 'Supported formats: PDF, DOCX, XLSX, JPG, PNG (Max 10MB)'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Document Name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newDocument.category}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, category: e.target.value as any }))}
                    label="Category"
                  >
                    <MenuItem value="personal">Personal</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="policy">Policy</MenuItem>
                    <MenuItem value="certificate">Certificate</MenuItem>
                    <MenuItem value="financial">Financial</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={2}
                  value={newDocument.description}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  value={newDocument.tags}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, tags: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (if applicable)"
                  type="date"
                  value={newDocument.expiryDate}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, expiryDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Chip label="AI Processing" color="primary" />}
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Document will be processed by AI for automatic categorization, text extraction, and metadata generation
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start' }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUploadDocument}
            disabled={!selectedFile}
          >
            Upload Document
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Folder Name"
              value={newFolder.name}
              onChange={(e) => setNewFolder(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Parent Folder (Optional)</InputLabel>
              <Select
                value={newFolder.parentId}
                onChange={(e) => setNewFolder(prev => ({ ...prev, parentId: e.target.value }))}
                label="Parent Folder (Optional)"
              >
                <MenuItem value="">Root</MenuItem>
                {folders.map((folder) => (
                  <MenuItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateFolder}
            disabled={!newFolder.name}
          >
            Create Folder
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDocument && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getDocumentTypeIcon(selectedDocument.type)}
                {selectedDocument.name}
                <IconButton
                  size="small"
                  sx={{ ml: 'auto' }}
                  onClick={() => setViewDialogOpen(false)}
                >
                  <Cancel />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Document preview is not available in this demo. In a real application, the document would be displayed here.
                </Alert>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Document Details</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Type:</Typography>
                        <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                          {selectedDocument.type}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Category:</Typography>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {selectedDocument.category.replace('_', ' ')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Size:</Typography>
                        <Typography variant="body2">
                          {formatFileSize(selectedDocument.size)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Version:</Typography>
                        <Typography variant="body2">
                          v{selectedDocument.version}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Status:</Typography>
                        <Chip
                          icon={getStatusIcon(selectedDocument.status)}
                          label={selectedDocument.status.replace('_', ' ')}
                          color={getStatusColor(selectedDocument.status)}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                      {selectedDocument.expiryDate && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Expires:</Typography>
                          <Typography variant="body2">
                            {format(selectedDocument.expiryDate, 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Activity</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Uploaded By:</Typography>
                        <Typography variant="body2">
                          {selectedDocument.uploadedBy}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Upload Date:</Typography>
                        <Typography variant="body2">
                          {format(selectedDocument.uploadedDate, 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Last Modified:</Typography>
                        <Typography variant="body2">
                          {format(selectedDocument.lastModified, 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Shared:</Typography>
                        <Typography variant="body2">
                          {selectedDocument.isShared ? 'Yes' : 'No'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Path:</Typography>
                        <Typography variant="body2" fontFamily="monospace">
                          {selectedDocument.path}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" gutterBottom>Description</Typography>
                    <Typography variant="body2" paragraph>
                      {selectedDocument.description || 'No description provided.'}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>Tags</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedDocument.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button startIcon={<Download />}>
                Download
              </Button>
              <Button startIcon={<Share />} onClick={() => {
                setViewDialogOpen(false);
                handleShareDocument(selectedDocument);
              }}>
                Share
              </Button>
              <Button startIcon={<History />} onClick={() => {
                setViewDialogOpen(false);
                handleViewHistory(selectedDocument);
              }}>
                Version History
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Share Document Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedDocument && (
          <>
            <DialogTitle>Share Document</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {selectedDocument.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Share this document with other users or departments
                </Typography>
                
                <TextField
                  fullWidth
                  label="Email or Username"
                  placeholder="Enter email addresses or usernames"
                  sx={{ mb: 2, mt: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Permission Level</InputLabel>
                  <Select defaultValue="view" label="Permission Level">
                    <MenuItem value="view">View Only</MenuItem>
                    <MenuItem value="edit">Can Edit</MenuItem>
                    <MenuItem value="full">Full Access</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControlLabel
                  control={<Chip label="Currently Shared" color="info" />}
                  label={
                    <Typography variant="body2" color="text.secondary">
                      This document is already shared with 3 users
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', mb: 2 }}
                />
                
                <Typography variant="subtitle2" gutterBottom>
                  Current Access
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32 }}>HR</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="HR Department"
                      secondary="Can Edit"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32 }}>MC</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary="Michael Chen"
                      secondary="View Only"
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton edge="end" size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <FormControlLabel
                  control={<Chip label="Link Sharing" color="primary" />}
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Create a shareable link that can be sent to others
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    value="https://vibhohcm.com/documents/share/abc123"
                    InputProps={{
                      readOnly: true
                    }}
                    size="small"
                  />
                  <Button variant="outlined">
                    Copy
                  </Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained">
                Share Document
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Version History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDocument && (
          <>
            <DialogTitle>Version History</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {selectedDocument.name}
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Version</TableCell>
                        <TableCell>Modified By</TableCell>
                        <TableCell>Modified Date</TableCell>
                        <TableCell>Changes</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documentHistory.map((version) => (
                        <TableRow key={version.version} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              v{version.version}
                            </Typography>
                            {version.version === selectedDocument.version && (
                              <Chip
                                label="Current"
                                size="small"
                                color="primary"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{version.modifiedBy}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {format(version.modifiedDate, 'MMM dd, yyyy HH:mm')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{version.changes}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="View This Version">
                                <IconButton size="small">
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download This Version">
                                <IconButton size="small">
                                  <Download />
                                </IconButton>
                              </Tooltip>
                              {version.version !== selectedDocument.version && (
                                <Tooltip title="Restore This Version">
                                  <IconButton size="small">
                                    <History />
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
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setHistoryDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

function Pending(props: any) {
  return <Schedule {...props} />;
}