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
  Avatar,
  Tabs,
  Tab,
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
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Edit,
  Download,
  Upload,
  Visibility,
  Delete,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Person,
  Business,
  AccountBalance,
  Description,
  School,
  Work,
  Phone,
  Email,
  LocationOn,
  CalendarMonth,
  Badge,
  Security,
  Assignment,
  TrendingUp,
  Star,
  Add
} from '@mui/icons-material';
import { format, differenceInYears, differenceInDays } from 'date-fns';
import { Employee, EmployeeStatus, Document, DocumentType } from '../../types';

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
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface EmployeeProfileProps {
  employeeId: string;
  onClose: () => void;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employeeId, onClose }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = React.useState(false);
  const [performanceDialogOpen, setPerformanceDialogOpen] = React.useState(false);

  // Mock employee data - in real app, fetch from API
  const employee: Employee = {
    id: employeeId,
    employeeId: 'EMP001',
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1-555-0123',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Male',
      maritalStatus: 'Single',
      nationality: 'American',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001'
      },
      emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Sister',
        phone: '+1-555-0124'
      }
    },
    companyInfo: {
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      reportingManager: 'Michael Chen',
      dateOfJoining: new Date('2023-01-15'),
      employmentType: 'Full-time',
      workLocation: 'New York Office',
      shift: 'Day Shift',
      probationPeriod: 6,
      confirmationDate: new Date('2023-07-15')
    },
    bankInfo: {
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      routingNumber: '021000021',
      accountType: 'Checking'
    },
    documents: [
      {
        id: '1',
        name: 'Passport',
        type: DocumentType.PASSPORT,
        url: '/documents/passport.pdf',
        uploadedAt: new Date('2023-01-10'),
        expiryDate: new Date('2028-01-10'),
        verified: true
      },
      {
        id: '2',
        name: 'Driving License',
        type: DocumentType.DRIVING_LICENSE,
        url: '/documents/license.pdf',
        uploadedAt: new Date('2023-01-10'),
        expiryDate: new Date('2027-05-15'),
        verified: true
      },
      {
        id: '3',
        name: 'Degree Certificate',
        type: DocumentType.EDUCATION_CERTIFICATE,
        url: '/documents/degree.pdf',
        uploadedAt: new Date('2023-01-10'),
        verified: true
      }
    ],
    qualifications: [
      {
        id: '1',
        degree: 'Bachelor of Computer Science',
        institution: 'MIT',
        year: 2012,
        grade: 'A',
        documents: []
      },
      {
        id: '2',
        degree: 'Master of Technology',
        institution: 'Stanford University',
        year: 2014,
        grade: 'A+',
        documents: []
      }
    ],
    previousEmployment: [
      {
        id: '1',
        company: 'Google Inc.',
        designation: 'Software Engineer',
        startDate: new Date('2014-06-01'),
        endDate: new Date('2018-12-31'),
        salary: 95000,
        reasonForLeaving: 'Career Growth',
        documents: []
      },
      {
        id: '2',
        company: 'Microsoft Corporation',
        designation: 'Senior Software Engineer',
        startDate: new Date('2019-01-01'),
        endDate: new Date('2022-12-31'),
        salary: 120000,
        reasonForLeaving: 'Better Opportunity',
        documents: []
      }
    ],
    status: EmployeeStatus.ACTIVE,
    onboardingStep: 7,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  };

  // Mock performance data
  const performanceData = {
    currentRating: 4.2,
    goals: [
      { id: '1', title: 'Complete React Migration', progress: 85, dueDate: new Date('2024-03-31') },
      { id: '2', title: 'Mentor Junior Developers', progress: 60, dueDate: new Date('2024-06-30') },
      { id: '3', title: 'Improve Code Quality', progress: 90, dueDate: new Date('2024-04-15') }
    ],
    skills: [
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'AWS', level: 70 }
    ],
    reviews: [
      {
        id: '1',
        period: 'Q4 2023',
        rating: 4.2,
        reviewer: 'Michael Chen',
        date: new Date('2024-01-15'),
        feedback: 'Excellent performance with strong technical skills and leadership qualities.'
      },
      {
        id: '2',
        period: 'Q3 2023',
        rating: 4.0,
        reviewer: 'Michael Chen',
        date: new Date('2023-10-15'),
        feedback: 'Good progress on assigned projects with room for improvement in communication.'
      }
    ]
  };

  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case EmployeeStatus.ACTIVE: return 'success';
      case EmployeeStatus.INACTIVE: return 'warning';
      case EmployeeStatus.TERMINATED: return 'error';
      case EmployeeStatus.ABSCONDED: return 'error';
      case EmployeeStatus.ON_LEAVE: return 'info';
      default: return 'default';
    }
  };

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PASSPORT: return <Person />;
      case DocumentType.DRIVING_LICENSE: return <Security />;
      case DocumentType.EDUCATION_CERTIFICATE: return <School />;
      case DocumentType.EXPERIENCE_LETTER: return <Work />;
      default: return <Description />;
    }
  };

  const calculateAge = (birthDate: Date) => {
    return differenceInYears(new Date(), birthDate);
  };

  const calculateTenure = (joinDate: Date) => {
    const days = differenceInDays(new Date(), joinDate);
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    return `${years}y ${months}m`;
  };

  return (
    <Box>
      {/* Employee Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
            >
              {employee.personalInfo.firstName.charAt(0)}{employee.personalInfo.lastName.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                {employee.personalInfo.firstName} {employee.personalInfo.lastName}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {employee.companyInfo.designation}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip
                  label={employee.status}
                  color={getStatusColor(employee.status)}
                  variant="outlined"
                />
                <Chip
                  label={employee.employeeId}
                  variant="outlined"
                />
                <Chip
                  label={employee.companyInfo.department}
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" />
                  <Typography variant="body2">{employee.personalInfo.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" />
                  <Typography variant="body2">{employee.personalInfo.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" />
                  <Typography variant="body2">{employee.companyInfo.workLocation}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditDialogOpen(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Export Data
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {calculateAge(employee.personalInfo.dateOfBirth)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Years Old
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {calculateTenure(employee.companyInfo.dateOfJoining)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tenure
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {performanceData.currentRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Performance Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {employee.documents.filter(d => d.verified).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verified Documents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Information Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Personal Info" />
            <Tab label="Company Info" />
            <Tab label="Documents" />
            <Tab label="Qualifications" />
            <Tab label="Work History" />
            <Tab label="Performance" />
            <Tab label="Timeline" />
          </Tabs>
        </Box>

        {/* Personal Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Full Name:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Date of Birth:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {format(employee.personalInfo.dateOfBirth, 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Gender:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.gender}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Marital Status:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.maritalStatus}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Nationality:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.nationality}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.phone}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Address:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.address.street}<br />
                    {employee.personalInfo.address.city}, {employee.personalInfo.address.state}<br />
                    {employee.personalInfo.address.country} - {employee.personalInfo.address.zipCode}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.emergencyContact.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Relationship:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.emergencyContact.relationship}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.personalInfo.emergencyContact.phone}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Company Information Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Employment Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Employee ID:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.employeeId}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Department:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.companyInfo.department}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Designation:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.companyInfo.designation}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Reporting Manager:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.companyInfo.reportingManager}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Employment Type:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.companyInfo.employmentType}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Work Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Date of Joining:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {format(employee.companyInfo.dateOfJoining, 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Work Location:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.companyInfo.workLocation}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Shift:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.companyInfo.shift}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Probation Period:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.companyInfo.probationPeriod} months
                  </Typography>
                </Box>
                {employee.companyInfo.confirmationDate && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Confirmation Date:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {format(employee.companyInfo.confirmationDate, 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Banking Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">Bank Name:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.bankInfo.bankName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">Account Number:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.bankInfo.accountNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">Routing Number:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.bankInfo.routingNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">Account Type:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {employee.bankInfo.accountType}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Documents</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDocumentDialogOpen(true)}
            >
              Upload Document
            </Button>
          </Box>
          <Grid container spacing={2}>
            {employee.documents.map((document) => (
              <Grid item xs={12} md={6} lg={4} key={document.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {getDocumentIcon(document.type)}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {document.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {document.type.replace('_', ' ').toUpperCase()}
                        </Typography>
                      </Box>
                      {document.verified ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Warning color="warning" />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded: {format(document.uploadedAt, 'MMM dd, yyyy')}
                      </Typography>
                      {document.expiryDate && (
                        <Typography variant="caption" color="text.secondary">
                          Expires: {format(document.expiryDate, 'MMM dd, yyyy')}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Download />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Qualifications Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Educational Qualifications</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Degree</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employee.qualifications.map((qualification) => (
                  <TableRow key={qualification.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {qualification.degree}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {qualification.institution}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {qualification.year}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={qualification.grade}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
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
        </TabPanel>

        {/* Work History Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>Previous Employment</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Reason for Leaving</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employee.previousEmployment.map((employment) => (
                  <TableRow key={employment.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {employment.company}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {employment.designation}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(employment.startDate, 'MMM yyyy')} - {format(employment.endDate, 'MMM yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${employment.salary.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {employment.reasonForLeaving}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Current Goals" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {performanceData.goals.map((goal) => (
                      <Box key={goal.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {goal.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {goal.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={goal.progress}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Due: {format(goal.dueDate, 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Skills Assessment" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {performanceData.skills.map((skill) => (
                      <Box key={skill.name}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {skill.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {skill.level}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={skill.level}
                          color={skill.level >= 80 ? 'success' : skill.level >= 60 ? 'warning' : 'error'}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Performance Reviews" />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Period</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Reviewer</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Feedback</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {performanceData.reviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {review.period}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Star color="warning" />
                                <Typography variant="body2" fontWeight="medium">
                                  {review.rating}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {review.reviewer}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {format(review.date, 'MMM dd, yyyy')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: 300 }}>
                                {review.feedback}
                              </Typography>
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
        </TabPanel>

        {/* Timeline Tab */}
        <TabPanel value={tabValue} index={6}>
          <Typography variant="h6" gutterBottom>Employee Timeline</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Employee Joined"
                secondary={`${format(employee.companyInfo.dateOfJoining, 'MMM dd, yyyy')} - Joined as ${employee.companyInfo.designation}`}
              />
            </ListItem>
            {employee.companyInfo.confirmationDate && (
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Probation Completed"
                  secondary={`${format(employee.companyInfo.confirmationDate, 'MMM dd, yyyy')} - Successfully completed probation period`}
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemIcon>
                <Assignment color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Performance Review"
                secondary="Jan 15, 2024 - Q4 2023 performance review completed with rating 4.2/5"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUp color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Promotion"
                secondary="Jul 01, 2023 - Promoted to Senior Software Engineer"
              />
            </ListItem>
          </List>
        </TabPanel>
      </Card>

      {/* Edit Employee Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Employee Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  defaultValue={employee.personalInfo.firstName}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  defaultValue={employee.personalInfo.lastName}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={employee.personalInfo.email}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  defaultValue={employee.personalInfo.phone}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    defaultValue={employee.companyInfo.department}
                    label="Department"
                  >
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Human Resources">Human Resources</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  defaultValue={employee.companyInfo.designation}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog
        open={documentDialogOpen}
        onClose={() => setDocumentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Document Name"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Document Type</InputLabel>
              <Select label="Document Type">
                <MenuItem value="passport">Passport</MenuItem>
                <MenuItem value="driving_license">Driving License</MenuItem>
                <MenuItem value="national_id">National ID</MenuItem>
                <MenuItem value="education_certificate">Education Certificate</MenuItem>
                <MenuItem value="experience_letter">Experience Letter</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<Upload />}
            >
              Choose File
              <input type="file" hidden />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};