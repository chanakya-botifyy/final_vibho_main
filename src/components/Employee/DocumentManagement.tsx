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
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Description,
  Upload,
  Download,
  Visibility,
  Delete,
  Add,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  FileCopy,
  Assignment,
  School,
  Work,
  Person,
  Badge,
  Receipt,
  AttachFile,
  CloudUpload,
  Search,
  FilterList,
  Schedule
} from '@mui/icons-material';
import { format, differenceInDays, addDays } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

interface Document {
  id: string;
  name: string;
  type: 'identification' | 'certificate' | 'education' | 'employment' | 'financial' | 'other';
  uploadDate: Date;
  expiryDate?: Date;
  fileSize: number;
  fileType: string;
  status: 'active' | 'expired' | 'expiring_soon';
  verified: boolean;
  uploadedBy: 'employee' | 'hr';
  description?: string;
  tags?: string[];
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

export const EmployeeDocumentManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = React.useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const [newDocument, setNewDocument] = React.useState({
    name: '',
    type: '',
    expiryDate: '',
    description: '',
    tags: '',
    file: null as File | null
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');

  // Mock documents
  const documents: Document[] = [
    {
      id: '1',
      name: 'Passport',
      type: 'identification',
      uploadDate: new Date('2023-05-15'),
      expiryDate: new Date('2033-05-14'),
      fileSize: 2.4,
      fileType: 'pdf',
      status: 'active',
      verified: true,
      uploadedBy: 'employee',
      description: 'International passport for identification and travel',
      tags: ['identity', 'travel']
    },
    {
      id: '2',
      name: 'Driver\'s License',
      type: 'identification',
      uploadDate: new Date('2023-06-10'),
      expiryDate: new Date('2027-06-09'),
      fileSize: 1.8,
      fileType: 'pdf',
      status: 'active',
      verified: true,
      uploadedBy: 'employee',
      tags: ['identity', 'driving']
    },
    {
      id: '3',
      name: 'Bachelor\'s Degree Certificate',
      type: 'education',
      uploadDate: new Date('2023-07-05'),
      fileSize: 3.2,
      fileType: 'pdf',
      status: 'active',
      verified: true,
      uploadedBy: 'employee',
      description: 'Bachelor of Computer Science from MIT',
      tags: ['education', 'degree']
    },
    {
      id: '4',
      name: 'Previous Employment Certificate',
      type: 'employment',
      uploadDate: new Date('2023-08-20'),
      fileSize: 1.5,
      fileType: 'pdf',
      status: 'active',
      verified: true,
      uploadedBy: 'employee',
      description: 'Experience certificate from previous employer',
      tags: ['employment', 'experience']
    },
    {
      id: '5',
      name: 'Health Insurance Card',
      type: 'financial',
      uploadDate: new Date('2023-09-15'),
      expiryDate: new Date('2024-03-15'),
      fileSize: 0.8,
      fileType: 'jpg',
      status: 'expiring_soon',
      verified: true,
      uploadedBy: 'hr',
      tags: ['insurance', 'health']
    },
    {
      id: '6',
      name: 'Tax Form 2023',
      type: 'financial',
      uploadDate: new Date('2024-01-10'),
      fileSize: 2.1,
      fileType: 'pdf',
      status: 'active',
      verified: false,
      uploadedBy: 'hr',
      description: 'Annual tax form for the year 2023',
      tags: ['tax', 'finance']
    }
  ];

  // Company documents shared with the employee
  const companyDocuments = [
    {
      id: '1',
      name: 'Employee Handbook',
      type: 'policy',
      uploadDate: new Date('2023-01-15'),
      fileSize: 4.5,
      fileType: 'pdf',
      description: 'Company policies and procedures for all employees',
      tags: ['policy', 'handbook']
    },
    {
      id: '2',
      name: 'Code of Conduct',
      type: 'policy',
      uploadDate: new Date('2023-01-15'),
      fileSize: 2.2,
      fileType: 'pdf',
      description: 'Guidelines for professional behavior and ethics',
      tags: ['policy', 'conduct']
    },
    {
      id: '3',
      name: 'Health Insurance Policy',
      type: 'benefits',
      uploadDate: new Date('2023-02-10'),
      fileSize: 3.1,
      fileType: 'pdf',
      description: 'Details of company health insurance coverage',
      tags: ['benefits', 'insurance']
    },
    {
      id: '4',
      name: 'Annual Performance Review Template',
      type: 'form',
      uploadDate: new Date('2023-11-05'),
      fileSize: 1.3,
      fileType: 'docx',
      description: 'Template for annual performance evaluations',
      tags: ['form', 'performance']
    }
  ];

  // Document templates
  const documentTemplates = [
    {
      id: '1',
      name: 'Leave Application Form',
      type: 'form',
      fileSize: 0.5,
      fileType: 'docx',
      description: 'Standard template for leave applications'
    },
    {
      id: '2',
      name: 'Expense Claim Form',
      type: 'form',
      fileSize: 0.6,
      fileType: 'xlsx',
      description: 'Template for submitting expense claims'
    },
    {
      id: '3',
      name: 'Certificate of Employment Request',
      type: 'form',
      fileSize: 0.4,
      fileType: 'docx',
      description: 'Request form for employment verification'
    }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewDocument(prev => ({
        ...prev,
        file: event.target.files![0]
      }));
    }
  };

  const handleUploadDocument = () => {
    console.log('Uploading document:', newDocument);
    setUploadDialogOpen(false);
    setNewDocument({
      name: '',
      type: '',
      expiryDate: '',
      description: '',
      tags: '',
      file: null
    });
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'identification': return <Person />;
      case 'certificate': return <Badge />;
      case 'education': return <School />;
      case 'employment': return <Work />;
      case 'financial': return <Receipt />;
      case 'policy': return <Assignment />;
      case 'benefits': return <CheckCircle />;
      case 'form': return <FileCopy />;
      default: return <Description />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'error';
      case 'expiring_soon': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'expired': return <ErrorIcon />;
      case 'expiring_soon': return <Warning />;
      default: return <CheckCircle />;
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Document Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload, view, and manage your personal and company documents.
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="My Documents" />
            <Tab label="Company Documents" />
            <Tab label="Document Templates" />
          </Tabs>
        </Box>

        {/* My Documents Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search documents..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Filter by Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="identification">Identification</MenuItem>
                  <MenuItem value="certificate">Certificates</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="employment">Employment</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload Document
            </Button>
          </Box>

          <Grid container spacing={2}>
            {filteredDocuments.map((document) => (
              <Grid item xs={12} md={6} lg={4} key={document.id}>
                <Paper 
                  sx={{ 
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getDocumentTypeIcon(document.type)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {document.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {document.type.charAt(0).toUpperCase() + document.type.slice(1).replace('_', ' ')}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={getStatusIcon(document.status)}
                      label={document.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(document.status)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Uploaded:</Typography>
                      <Typography variant="body2">
                        {format(document.uploadDate, 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    {document.expiryDate && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Expires:</Typography>
                        <Typography 
                          variant="body2"
                          color={
                            document.status === 'expired' ? 'error.main' : 
                            document.status === 'expiring_soon' ? 'warning.main' : 
                            'text.primary'
                          }
                        >
                          {format(document.expiryDate, 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">File:</Typography>
                      <Typography variant="body2">
                        {document.fileType.toUpperCase()} ({formatFileSize(document.fileSize)})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Verified:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {document.verified ? (
                          <CheckCircle fontSize="small" color="success" />
                        ) : (
                          <Pending fontSize="small" color="warning" />
                        )}
                        <Typography variant="body2">
                          {document.verified ? 'Yes' : 'Pending'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {document.tags && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {document.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="View Document">
                      <IconButton size="small" onClick={() => handleViewDocument(document)}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton size="small">
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Company Documents Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Documents
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Important documents shared by the company for your reference.
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Uploaded On</TableCell>
                  <TableCell>File Size</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companyDocuments.map((document) => (
                  <TableRow key={document.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getDocumentTypeIcon(document.type)}
                        <Typography variant="body2" fontWeight="medium">
                          {document.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {document.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(document.uploadDate, 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatFileSize(document.fileSize)} ({document.fileType.toUpperCase()})
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Document">
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
        </TabPanel>

        {/* Document Templates Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Document Templates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Standard templates for various forms and requests.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {documentTemplates.map((template) => (
              <Grid item xs={12} md={4} key={template.id}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <FileCopy />
                    </Avatar>
                    <Typography variant="h6">
                      {template.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {template.description}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    {template.fileType.toUpperCase()} • {formatFileSize(template.fileSize)}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      size="small"
                    >
                      Download
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<FileCopy />}
                      size="small"
                    >
                      Use Template
                    </Button>
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
        <DialogTitle>Upload New Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
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
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={newDocument.type}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                    label="Document Type"
                  >
                    <MenuItem value="identification">Identification</MenuItem>
                    <MenuItem value="certificate">Certificate</MenuItem>
                    <MenuItem value="education">Education</MenuItem>
                    <MenuItem value="employment">Employment</MenuItem>
                    <MenuItem value="financial">Financial</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  value={newDocument.tags}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., identity, official, important"
                  sx={{ mb: 2 }}
                />
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
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    border: '2px dashed', 
                    borderColor: 'primary.main', 
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
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {newDocument.file 
                      ? `Selected: ${newDocument.file.name} (${(newDocument.file.size / (1024 * 1024)).toFixed(2)} MB)` 
                      : 'Supported formats: PDF, JPG, PNG, DOCX (Max 10MB)'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleUploadDocument}
            disabled={!newDocument.file || !newDocument.name || !newDocument.type}
          >
            Upload Document
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
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedDocument && getDocumentTypeIcon(selectedDocument.type)}
            {selectedDocument?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Document preview is not available in this demo. In a real application, the document would be displayed here.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">Document Type</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedDocument.type.charAt(0).toUpperCase() + selectedDocument.type.slice(1).replace('_', ' ')}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">Upload Date</Typography>
                  <Typography variant="body1" gutterBottom>
                    {format(selectedDocument.uploadDate, 'MMMM d, yyyy')}
                  </Typography>
                  
                  {selectedDocument.expiryDate && (
                    <>
                      <Typography variant="body2" color="text.secondary">Expiry Date</Typography>
                      <Typography 
                        variant="body1" 
                        gutterBottom
                        color={
                          selectedDocument.status === 'expired' ? 'error.main' : 
                          selectedDocument.status === 'expiring_soon' ? 'warning.main' : 
                          'text.primary'
                        }
                      >
                        {format(selectedDocument.expiryDate, 'MMMM d, yyyy')}
                      </Typography>
                    </>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">File Type</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedDocument.fileType.toUpperCase()}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">File Size</Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatFileSize(selectedDocument.fileSize)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedDocument.status)}
                    label={selectedDocument.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(selectedDocument.status)}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  
                  {selectedDocument.description && (
                    <>
                      <Typography variant="body2" color="text.secondary">Description</Typography>
                      <Typography variant="body1" paragraph>
                        {selectedDocument.description}
                      </Typography>
                    </>
                  )}
                  
                  {selectedDocument.tags && (
                    <>
                      <Typography variant="body2" color="text.secondary">Tags</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {selectedDocument.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<Download />}>
            Download
          </Button>
          {selectedDocument?.uploadedBy === 'employee' && (
            <Button variant="outlined" color="error" startIcon={<Delete />}>
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function Pending(props: any) {
  return <Schedule {...props} />;
}