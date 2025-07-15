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
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Business,
  School,
  Work,
  AccountBalance,
  Security,
  Language,
  Cake,
  Wc,
  Home,
  ContactPhone,
  ContactMail,
  PhotoCamera,
  Key,
  Lock,
  Visibility,
  VisibilityOff,
  CloudUpload
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const EmployeeProfileManagement: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [tabValue, setTabValue] = React.useState(0);
  const [editMode, setEditMode] = React.useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = React.useState({
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1-555-0123',
      dateOfBirth: '1990-05-15',
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
      employeeId: 'EMP001',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      reportingManager: 'Michael Chen',
      dateOfJoining: '2023-01-15',
      employmentType: 'Full-time',
      workLocation: 'New York Office',
      shift: 'Day Shift'
    },
    bankInfo: {
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      routingNumber: '021000021',
      accountType: 'Checking'
    },
    qualifications: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'MIT',
        year: 2012,
        grade: 'A'
      },
      {
        degree: 'Master of Technology',
        institution: 'Stanford University',
        year: 2014,
        grade: 'A+'
      }
    ],
    workExperience: [
      {
        company: 'Google Inc.',
        designation: 'Software Engineer',
        startDate: '2014-06-01',
        endDate: '2018-12-31',
        description: 'Worked on various projects including Google Maps and Google Drive.'
      },
      {
        company: 'Microsoft Corporation',
        designation: 'Senior Software Engineer',
        startDate: '2019-01-01',
        endDate: '2022-12-31',
        description: 'Led a team of 5 developers working on Microsoft Office 365.'
      }
    ]
  });

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    setEditMode(false);
  };

  const handleChangePassword = () => {
    console.log('Changing password:', passwordData);
    setPasswordDialogOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleUploadPhoto = () => {
    console.log('Uploading photo');
    setPhotoDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your personal and professional information.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      sx={{ bgcolor: 'background.paper' }}
                      size="small"
                      onClick={() => setPhotoDialogOpen(true)}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={user?.avatar}
                    sx={{ width: 100, height: 100 }}
                  >
                    {profileData.personalInfo.firstName.charAt(0)}{profileData.personalInfo.lastName.charAt(0)}
                  </Avatar>
                </Badge>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {profileData.companyInfo.designation}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Chip
                      label={profileData.companyInfo.employeeId}
                      variant="outlined"
                    />
                    <Chip
                      label={profileData.companyInfo.department}
                      variant="outlined"
                    />
                    <Chip
                      label={profileData.companyInfo.employmentType}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email fontSize="small" />
                      <Typography variant="body2">{profileData.personalInfo.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" />
                      <Typography variant="body2">{profileData.personalInfo.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" />
                      <Typography variant="body2">{profileData.companyInfo.workLocation}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<Key />}
                    onClick={() => setPasswordDialogOpen(true)}
                    sx={{ mb: 1 }}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={editMode ? <Save /> : <Edit />}
                    onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  >
                    {editMode ? 'Save Profile' : 'Edit Profile'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Tabs */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="Personal Information" />
                <Tab label="Company Information" />
                <Tab label="Bank Details" />
                <Tab label="Qualifications" />
                <Tab label="Work Experience" />
              </Tabs>
            </Box>

            {/* Personal Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                {!editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Basic Information</Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={profileData.personalInfo.firstName}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              firstName: e.target.value
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={profileData.personalInfo.lastName}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              lastName: e.target.value
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          value={profileData.personalInfo.email}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              email: e.target.value
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={profileData.personalInfo.phone}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              phone: e.target.value
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          type="date"
                          value={profileData.personalInfo.dateOfBirth}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              dateOfBirth: e.target.value
                            }
                          })}
                          disabled={!editMode}
                          InputLabelProps={{ shrink: true }}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={profileData.personalInfo.gender}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              personalInfo: {
                                ...profileData.personalInfo,
                                gender: e.target.value
                              }
                            })}
                            label="Gender"
                            disabled={!editMode}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                            <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Marital Status</InputLabel>
                          <Select
                            value={profileData.personalInfo.maritalStatus}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              personalInfo: {
                                ...profileData.personalInfo,
                                maritalStatus: e.target.value
                              }
                            })}
                            label="Marital Status"
                            disabled={!editMode}
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
                          value={profileData.personalInfo.nationality}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              nationality: e.target.value
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Address Information</Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Street Address"
                          value={profileData.personalInfo.address.street}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              address: {
                                ...profileData.personalInfo.address,
                                street: e.target.value
                              }
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="City"
                          value={profileData.personalInfo.address.city}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              address: {
                                ...profileData.personalInfo.address,
                                city: e.target.value
                              }
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="State/Province"
                          value={profileData.personalInfo.address.state}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              address: {
                                ...profileData.personalInfo.address,
                                state: e.target.value
                              }
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={profileData.personalInfo.address.country}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              address: {
                                ...profileData.personalInfo.address,
                                country: e.target.value
                              }
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="ZIP/Postal Code"
                          value={profileData.personalInfo.address.zipCode}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              address: {
                                ...profileData.personalInfo.address,
                                zipCode: e.target.value
                              }
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Emergency Contact</Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Contact Name"
                          value={profileData.personalInfo.emergencyContact.name}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              emergencyContact: {
                                ...profileData.personalInfo.emergencyContact,
                                name: e.target.value
                              }
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Relationship"
                          value={profileData.personalInfo.emergencyContact.relationship}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              emergencyContact: {
                                ...profileData.personalInfo.emergencyContact,
                                relationship: e.target.value
                              }
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={profileData.personalInfo.emergencyContact.phone}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            personalInfo: {
                              ...profileData.personalInfo,
                              emergencyContact: {
                                ...profileData.personalInfo.emergencyContact,
                                phone: e.target.value
                              }
                            }
                          })}
                          disabled={!editMode}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Company Information Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>Company Information</Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                This information is managed by HR and cannot be edited directly. Please contact HR for any updates.
              </Alert>

              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Employee ID</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profileData.companyInfo.employeeId}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Department</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profileData.companyInfo.department}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Designation</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profileData.companyInfo.designation}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Reporting Manager</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profileData.companyInfo.reportingManager}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Date of Joining</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {format(new Date(profileData.companyInfo.dateOfJoining), 'MMMM d, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Employment Type</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profileData.companyInfo.employmentType}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Work Location</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profileData.companyInfo.workLocation}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">Shift</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {profileData.companyInfo.shift}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* Bank Details Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Bank Details</Typography>
                {!editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                Your bank details are used for salary processing. Please ensure the information is accurate.
              </Alert>

              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={profileData.bankInfo.bankName}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        bankInfo: {
                          ...profileData.bankInfo,
                          bankName: e.target.value
                        }
                      })}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={profileData.bankInfo.accountNumber}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        bankInfo: {
                          ...profileData.bankInfo,
                          accountNumber: e.target.value
                        }
                      })}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Routing Number"
                      value={profileData.bankInfo.routingNumber}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        bankInfo: {
                          ...profileData.bankInfo,
                          routingNumber: e.target.value
                        }
                      })}
                      disabled={!editMode}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Account Type</InputLabel>
                      <Select
                        value={profileData.bankInfo.accountType}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          bankInfo: {
                            ...profileData.bankInfo,
                            accountType: e.target.value
                          }
                        })}
                        label="Account Type"
                        disabled={!editMode}
                      >
                        <MenuItem value="Checking">Checking</MenuItem>
                        <MenuItem value="Savings">Savings</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            {/* Qualifications Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Educational Qualifications</Typography>
                {!editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              {profileData.qualifications.map((qualification, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Degree/Certification"
                        value={qualification.degree}
                        onChange={(e) => {
                          const updatedQualifications = [...profileData.qualifications];
                          updatedQualifications[index].degree = e.target.value;
                          setProfileData({
                            ...profileData,
                            qualifications: updatedQualifications
                          });
                        }}
                        disabled={!editMode}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Institution"
                        value={qualification.institution}
                        onChange={(e) => {
                          const updatedQualifications = [...profileData.qualifications];
                          updatedQualifications[index].institution = e.target.value;
                          setProfileData({
                            ...profileData,
                            qualifications: updatedQualifications
                          });
                        }}
                        disabled={!editMode}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Year of Completion"
                        type="number"
                        value={qualification.year}
                        onChange={(e) => {
                          const updatedQualifications = [...profileData.qualifications];
                          updatedQualifications[index].year = parseInt(e.target.value);
                          setProfileData({
                            ...profileData,
                            qualifications: updatedQualifications
                          });
                        }}
                        disabled={!editMode}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Grade/CGPA"
                        value={qualification.grade}
                        onChange={(e) => {
                          const updatedQualifications = [...profileData.qualifications];
                          updatedQualifications[index].grade = e.target.value;
                          setProfileData({
                            ...profileData,
                            qualifications: updatedQualifications
                          });
                        }}
                        disabled={!editMode}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              {editMode && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setProfileData({
                      ...profileData,
                      qualifications: [
                        ...profileData.qualifications,
                        {
                          degree: '',
                          institution: '',
                          year: new Date().getFullYear(),
                          grade: ''
                        }
                      ]
                    });
                  }}
                >
                  Add Qualification
                </Button>
              )}
            </TabPanel>

            {/* Work Experience Tab */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Work Experience</Typography>
                {!editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              {profileData.workExperience.map((experience, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        value={experience.company}
                        onChange={(e) => {
                          const updatedExperience = [...profileData.workExperience];
                          updatedExperience[index].company = e.target.value;
                          setProfileData({
                            ...profileData,
                            workExperience: updatedExperience
                          });
                        }}
                        disabled={!editMode}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Designation"
                        value={experience.designation}
                        onChange={(e) => {
                          const updatedExperience = [...profileData.workExperience];
                          updatedExperience[index].designation = e.target.value;
                          setProfileData({
                            ...profileData,
                            workExperience: updatedExperience
                          });
                        }}
                        disabled={!editMode}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={experience.startDate}
                        onChange={(e) => {
                          const updatedExperience = [...profileData.workExperience];
                          updatedExperience[index].startDate = e.target.value;
                          setProfileData({
                            ...profileData,
                            workExperience: updatedExperience
                          });
                        }}
                        disabled={!editMode}
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={experience.endDate}
                        onChange={(e) => {
                          const updatedExperience = [...profileData.workExperience];
                          updatedExperience[index].endDate = e.target.value;
                          setProfileData({
                            ...profileData,
                            workExperience: updatedExperience
                          });
                        }}
                        disabled={!editMode}
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={2}
                        value={experience.description}
                        onChange={(e) => {
                          const updatedExperience = [...profileData.workExperience];
                          updatedExperience[index].description = e.target.value;
                          setProfileData({
                            ...profileData,
                            workExperience: updatedExperience
                          });
                        }}
                        disabled={!editMode}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              {editMode && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setProfileData({
                      ...profileData,
                      workExperience: [
                        ...profileData.workExperience,
                        {
                          company: '',
                          designation: '',
                          startDate: format(new Date(), 'yyyy-MM-dd'),
                          endDate: format(new Date(), 'yyyy-MM-dd'),
                          description: ''
                        }
                      ]
                    });
                  }}
                >
                  Add Work Experience
                </Button>
              )}
            </TabPanel>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              For security reasons, please enter your current password before setting a new one.
            </Alert>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
              helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'Passwords do not match' : ''}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleChangePassword}
            disabled={
              !passwordData.currentPassword || 
              !passwordData.newPassword || 
              !passwordData.confirmPassword ||
              passwordData.newPassword !== passwordData.confirmPassword
            }
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Photo Dialog */}
      <Dialog
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Profile Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, textAlign: 'center' }}>
            <Avatar
              src={user?.avatar}
              sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
            >
              {profileData.personalInfo.firstName.charAt(0)}{profileData.personalInfo.lastName.charAt(0)}
            </Avatar>
            <input
              type="file"
              id="photo-upload"
              hidden
              accept="image/*"
            />
            <label htmlFor="photo-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUpload />}
              >
                Choose Photo
              </Button>
            </label>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUploadPhoto}>
            Upload Photo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function Add() {
  return <Add />;
}