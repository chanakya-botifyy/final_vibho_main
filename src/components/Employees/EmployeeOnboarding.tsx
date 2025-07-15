import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Avatar,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio
} from '@mui/material';
import {
  Person,
  Business,
  AccountBalance,
  Description,
  School,
  Work,
  CheckCircle,
  Upload,
  Delete,
  Add,
  Save,
  NavigateNext,
  NavigateBefore,
  Email,
  Phone,
  LocationOn,
  CalendarMonth
} from '@mui/icons-material';
import { format } from 'date-fns';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  required: boolean;
}

interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
    };
  };
  companyInfo: {
    employeeId: string;
    department: string;
    designation: string;
    reportingManager: string;
    dateOfJoining: string;
    employmentType: string;
    workLocation: string;
    shift: string;
    probationPeriod: number;
  };
  bankInfo: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: string;
    ifscCode: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    file?: File;
    required: boolean;
    uploaded: boolean;
  }>;
  qualifications: Array<{
    id: string;
    degree: string;
    institution: string;
    year: number;
    grade: string;
    documents: File[];
  }>;
  previousEmployment: Array<{
    id: string;
    company: string;
    designation: string;
    startDate: string;
    endDate: string;
    salary: number;
    reasonForLeaving: string;
    documents: File[];
  }>;
  additionalInfo: {
    skills: string[];
    languages: string[];
    hobbies: string[];
    medicalConditions: string;
    dietaryRestrictions: string;
    tshirtSize: string;
  };
}

export const EmployeeOnboarding: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [documentDialogOpen, setDocumentDialogOpen] = React.useState(false);
  const [qualificationDialogOpen, setQualificationDialogOpen] = React.useState(false);
  const [employmentDialogOpen, setEmploymentDialogOpen] = React.useState(false);

  const [onboardingData, setOnboardingData] = React.useState<OnboardingData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
        email: ''
      }
    },
    companyInfo: {
      employeeId: 'EMP' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      department: '',
      designation: '',
      reportingManager: '',
      dateOfJoining: format(new Date(), 'yyyy-MM-dd'),
      employmentType: '',
      workLocation: '',
      shift: '',
      probationPeriod: 6
    },
    bankInfo: {
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      accountType: '',
      ifscCode: ''
    },
    documents: [
      { id: '1', name: 'Passport', type: 'passport', required: true, uploaded: false },
      { id: '2', name: 'Driving License', type: 'driving_license', required: false, uploaded: false },
      { id: '3', name: 'National ID', type: 'national_id', required: true, uploaded: false },
      { id: '4', name: 'Address Proof', type: 'address_proof', required: true, uploaded: false },
      { id: '5', name: 'Photo', type: 'photo', required: true, uploaded: false }
    ],
    qualifications: [],
    previousEmployment: [],
    additionalInfo: {
      skills: [],
      languages: [],
      hobbies: [],
      medicalConditions: '',
      dietaryRestrictions: '',
      tshirtSize: ''
    }
  });

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 0,
      title: 'Personal Information',
      description: 'Basic personal details and contact information',
      icon: <Person />,
      completed: false,
      required: true
    },
    {
      id: 1,
      title: 'Company Information',
      description: 'Employment details and work information',
      icon: <Business />,
      completed: false,
      required: true
    },
    {
      id: 2,
      title: 'Banking Information',
      description: 'Bank account details for salary processing',
      icon: <AccountBalance />,
      completed: false,
      required: true
    },
    {
      id: 3,
      title: 'Document Upload',
      description: 'Upload required identity and address documents',
      icon: <Description />,
      completed: false,
      required: true
    },
    {
      id: 4,
      title: 'Educational Qualifications',
      description: 'Academic background and certifications',
      icon: <School />,
      completed: false,
      required: false
    },
    {
      id: 5,
      title: 'Previous Employment',
      description: 'Work history and experience details',
      icon: <Work />,
      completed: false,
      required: false
    },
    {
      id: 6,
      title: 'Additional Information',
      description: 'Skills, preferences, and other details',
      icon: <CheckCircle />,
      completed: false,
      required: false
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const updatePersonalInfo = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateCompanyInfo = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: value
      }
    }));
  };

  const updateBankInfo = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      bankInfo: {
        ...prev.bankInfo,
        [field]: value
      }
    }));
  };

  const addQualification = (qualification: any) => {
    setOnboardingData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { ...qualification, id: Date.now().toString() }]
    }));
  };

  const addEmployment = (employment: any) => {
    setOnboardingData(prev => ({
      ...prev,
      previousEmployment: [...prev.previousEmployment, { ...employment, id: Date.now().toString() }]
    }));
  };

  const handleDocumentUpload = (documentId: string, file: File) => {
    setOnboardingData(prev => ({
      ...prev,
      documents: prev.documents.map(doc =>
        doc.id === documentId ? { ...doc, file, uploaded: true } : doc
      )
    }));
  };

  const renderPersonalInfoStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Personal Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="First Name"
            value={onboardingData.personalInfo.firstName}
            onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={onboardingData.personalInfo.lastName}
            onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={onboardingData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={onboardingData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={onboardingData.personalInfo.dateOfBirth}
            onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={onboardingData.personalInfo.gender}
              onChange={(e) => updatePersonalInfo('gender', e.target.value)}
              label="Gender"
              required
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Marital Status</InputLabel>
            <Select
              value={onboardingData.personalInfo.maritalStatus}
              onChange={(e) => updatePersonalInfo('maritalStatus', e.target.value)}
              label="Marital Status"
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nationality"
            value={onboardingData.personalInfo.nationality}
            onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>Address Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            value={onboardingData.personalInfo.address.street}
            onChange={(e) => updatePersonalInfo('address', { ...onboardingData.personalInfo.address, street: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="City"
            value={onboardingData.personalInfo.address.city}
            onChange={(e) => updatePersonalInfo('address', { ...onboardingData.personalInfo.address, city: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State/Province"
            value={onboardingData.personalInfo.address.state}
            onChange={(e) => updatePersonalInfo('address', { ...onboardingData.personalInfo.address, state: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Country"
            value={onboardingData.personalInfo.address.country}
            onChange={(e) => updatePersonalInfo('address', { ...onboardingData.personalInfo.address, country: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ZIP/Postal Code"
            value={onboardingData.personalInfo.address.zipCode}
            onChange={(e) => updatePersonalInfo('address', { ...onboardingData.personalInfo.address, zipCode: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Name"
            value={onboardingData.personalInfo.emergencyContact.name}
            onChange={(e) => updatePersonalInfo('emergencyContact', { ...onboardingData.personalInfo.emergencyContact, name: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Relationship"
            value={onboardingData.personalInfo.emergencyContact.relationship}
            onChange={(e) => updatePersonalInfo('emergencyContact', { ...onboardingData.personalInfo.emergencyContact, relationship: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone Number"
            value={onboardingData.personalInfo.emergencyContact.phone}
            onChange={(e) => updatePersonalInfo('emergencyContact', { ...onboardingData.personalInfo.emergencyContact, phone: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={onboardingData.personalInfo.emergencyContact.email}
            onChange={(e) => updatePersonalInfo('emergencyContact', { ...onboardingData.personalInfo.emergencyContact, email: e.target.value })}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderCompanyInfoStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Company Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Employee ID"
            value={onboardingData.companyInfo.employeeId}
            disabled
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={onboardingData.companyInfo.department}
              onChange={(e) => updateCompanyInfo('department', e.target.value)}
              label="Department"
              required
            >
              <MenuItem value="Engineering">Engineering</MenuItem>
              <MenuItem value="Human Resources">Human Resources</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Operations">Operations</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Designation"
            value={onboardingData.companyInfo.designation}
            onChange={(e) => updateCompanyInfo('designation', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Reporting Manager</InputLabel>
            <Select
              value={onboardingData.companyInfo.reportingManager}
              onChange={(e) => updateCompanyInfo('reportingManager', e.target.value)}
              label="Reporting Manager"
              required
            >
              <MenuItem value="Michael Chen">Michael Chen</MenuItem>
              <MenuItem value="Sarah Johnson">Sarah Johnson</MenuItem>
              <MenuItem value="David Wilson">David Wilson</MenuItem>
              <MenuItem value="Emily Rodriguez">Emily Rodriguez</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date of Joining"
            type="date"
            value={onboardingData.companyInfo.dateOfJoining}
            onChange={(e) => updateCompanyInfo('dateOfJoining', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Employment Type</InputLabel>
            <Select
              value={onboardingData.companyInfo.employmentType}
              onChange={(e) => updateCompanyInfo('employmentType', e.target.value)}
              label="Employment Type"
              required
            >
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Intern">Intern</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Work Location</InputLabel>
            <Select
              value={onboardingData.companyInfo.workLocation}
              onChange={(e) => updateCompanyInfo('workLocation', e.target.value)}
              label="Work Location"
              required
            >
              <MenuItem value="New York Office">New York Office</MenuItem>
              <MenuItem value="San Francisco Office">San Francisco Office</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Shift</InputLabel>
            <Select
              value={onboardingData.companyInfo.shift}
              onChange={(e) => updateCompanyInfo('shift', e.target.value)}
              label="Shift"
              required
            >
              <MenuItem value="Day Shift">Day Shift (9 AM - 6 PM)</MenuItem>
              <MenuItem value="Evening Shift">Evening Shift (2 PM - 11 PM)</MenuItem>
              <MenuItem value="Night Shift">Night Shift (10 PM - 7 AM)</MenuItem>
              <MenuItem value="Flexible">Flexible</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Probation Period (Months)</InputLabel>
            <Select
              value={onboardingData.companyInfo.probationPeriod}
              onChange={(e) => updateCompanyInfo('probationPeriod', e.target.value)}
              label="Probation Period (Months)"
              required
            >
              <MenuItem value={3}>3 Months</MenuItem>
              <MenuItem value={6}>6 Months</MenuItem>
              <MenuItem value={12}>12 Months</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderBankInfoStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Banking Information</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        This information will be used for salary processing. Please ensure all details are accurate.
      </Alert>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bank Name"
            value={onboardingData.bankInfo.bankName}
            onChange={(e) => updateBankInfo('bankName', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Account Number"
            value={onboardingData.bankInfo.accountNumber}
            onChange={(e) => updateBankInfo('accountNumber', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Routing Number"
            value={onboardingData.bankInfo.routingNumber}
            onChange={(e) => updateBankInfo('routingNumber', e.target.value)}
            required
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Account Type</InputLabel>
            <Select
              value={onboardingData.bankInfo.accountType}
              onChange={(e) => updateBankInfo('accountType', e.target.value)}
              label="Account Type"
              required
            >
              <MenuItem value="Checking">Checking</MenuItem>
              <MenuItem value="Savings">Savings</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="IFSC Code (if applicable)"
            value={onboardingData.bankInfo.ifscCode}
            onChange={(e) => updateBankInfo('ifscCode', e.target.value)}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderDocumentsStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Document Upload</Typography>
      <Alert severity="warning" sx={{ mb: 3 }}>
        Please upload clear, readable copies of all required documents. Accepted formats: PDF, JPG, PNG (Max 5MB each)
      </Alert>
      <Grid container spacing={2}>
        {onboardingData.documents.map((document) => (
          <Grid item xs={12} md={6} key={document.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description />
                  <Typography variant="body2" fontWeight="medium">
                    {document.name}
                  </Typography>
                  {document.required && (
                    <Chip label="Required" color="error" size="small" />
                  )}
                </Box>
                {document.uploaded && (
                  <CheckCircle color="success" />
                )}
              </Box>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<Upload />}
                color={document.uploaded ? 'success' : 'primary'}
              >
                {document.uploaded ? 'Replace File' : 'Upload File'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleDocumentUpload(document.id, file);
                    }
                  }}
                />
              </Button>
              {document.file && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {document.file.name} ({(document.file.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderQualificationsStep = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Educational Qualifications</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setQualificationDialogOpen(true)}
        >
          Add Qualification
        </Button>
      </Box>
      {onboardingData.qualifications.length === 0 ? (
        <Alert severity="info">
          No qualifications added yet. Click "Add Qualification" to get started.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {onboardingData.qualifications.map((qualification) => (
            <Grid item xs={12} key={qualification.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {qualification.degree}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {qualification.institution} • {qualification.year} • Grade: {qualification.grade}
                    </Typography>
                  </Box>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderEmploymentStep = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Previous Employment</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setEmploymentDialogOpen(true)}
        >
          Add Employment
        </Button>
      </Box>
      {onboardingData.previousEmployment.length === 0 ? (
        <Alert severity="info">
          No previous employment added yet. Click "Add Employment" to get started.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {onboardingData.previousEmployment.map((employment) => (
            <Grid item xs={12} key={employment.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {employment.designation} at {employment.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {employment.startDate} to {employment.endDate} • ${employment.salary.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reason for leaving: {employment.reasonForLeaving}
                    </Typography>
                  </Box>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderAdditionalInfoStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Additional Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Skills (comma separated)"
            value={onboardingData.additionalInfo.skills.join(', ')}
            onChange={(e) => setOnboardingData(prev => ({
              ...prev,
              additionalInfo: {
                ...prev.additionalInfo,
                skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              }
            }))}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Languages (comma separated)"
            value={onboardingData.additionalInfo.languages.join(', ')}
            onChange={(e) => setOnboardingData(prev => ({
              ...prev,
              additionalInfo: {
                ...prev.additionalInfo,
                languages: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              }
            }))}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Hobbies & Interests"
            value={onboardingData.additionalInfo.hobbies.join(', ')}
            onChange={(e) => setOnboardingData(prev => ({
              ...prev,
              additionalInfo: {
                ...prev.additionalInfo,
                hobbies: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              }
            }))}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>T-Shirt Size</InputLabel>
            <Select
              value={onboardingData.additionalInfo.tshirtSize}
              onChange={(e) => setOnboardingData(prev => ({
                ...prev,
                additionalInfo: {
                  ...prev.additionalInfo,
                  tshirtSize: e.target.value
                }
              }))}
              label="T-Shirt Size"
            >
              <MenuItem value="XS">XS</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medical Conditions (if any)"
            value={onboardingData.additionalInfo.medicalConditions}
            onChange={(e) => setOnboardingData(prev => ({
              ...prev,
              additionalInfo: {
                ...prev.additionalInfo,
                medicalConditions: e.target.value
              }
            }))}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dietary Restrictions (if any)"
            value={onboardingData.additionalInfo.dietaryRestrictions}
            onChange={(e) => setOnboardingData(prev => ({
              ...prev,
              additionalInfo: {
                ...prev.additionalInfo,
                dietaryRestrictions: e.target.value
              }
            }))}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: return renderPersonalInfoStep();
      case 1: return renderCompanyInfoStep();
      case 2: return renderBankInfoStep();
      case 3: return renderDocumentsStep();
      case 4: return renderQualificationsStep();
      case 5: return renderEmploymentStep();
      case 6: return renderAdditionalInfoStep();
      default: return null;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Onboarding
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete the 7-step onboarding process to set up your employee profile.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Progress Stepper */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Onboarding Progress" />
            <CardContent>
              <Stepper activeStep={activeStep} orientation="vertical">
                {onboardingSteps.map((step) => (
                  <Step key={step.id} completed={step.completed}>
                    <StepLabel
                      onClick={() => handleStepClick(step.id)}
                      sx={{ cursor: 'pointer' }}
                      icon={step.icon}
                    >
                      <Typography variant="body2" fontWeight="medium">
                        {step.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        {/* Step Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={onboardingSteps[activeStep].title}
              subtitle={onboardingSteps[activeStep].description}
            />
            <CardContent>
              {renderStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<NavigateBefore />}
                >
                  Back
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                  >
                    Save Draft
                  </Button>
                  {activeStep === onboardingSteps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                    >
                      Complete Onboarding
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<NavigateNext />}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Qualification Dialog */}
      <Dialog
        open={qualificationDialogOpen}
        onClose={() => setQualificationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Educational Qualification</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Degree/Certification"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Institution/University"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Year of Completion"
                  type="number"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Grade/CGPA"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQualificationDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Add Qualification</Button>
        </DialogActions>
      </Dialog>

      {/* Add Employment Dialog */}
      <Dialog
        open={employmentDialogOpen}
        onClose={() => setEmploymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Previous Employment</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Company Name"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Designation"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Last Drawn Salary"
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Reason for Leaving"
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmploymentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Add Employment</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};