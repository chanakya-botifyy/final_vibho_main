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
  LinearProgress,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Paper,
  Tab,
  Tabs,
  Badge
} from '@mui/material';
import {
  Add,
  Work,
  Person,
  Schedule,
  TrendingUp,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Pending,
  Star,
  Download,
  Email,
  Phone,
  LocationOn,
  School,
  Business
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  experience: string;
  salary: { min: number; max: number; currency: string };
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'active' | 'closed' | 'on_hold';
  postedDate: Date;
  closingDate: Date;
  applicationsCount: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  currentSalary?: number;
  expectedSalary?: number;
  skills: string[];
  education: string;
  source: string;
  aiScore: number;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: Date;
  jobId: string;
  jobTitle: string;
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
      id={`recruitment-tabpanel-${index}`}
      aria-labelledby={`recruitment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const RecruitmentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = React.useState(0);
  const [jobDialogOpen, setJobDialogOpen] = React.useState(false);
  const [candidateDialogOpen, setCandidateDialogOpen] = React.useState(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [newJob, setNewJob] = React.useState({
    title: '',
    department: '',
    location: '',
    type: 'full_time' as const,
    experience: '',
    minSalary: '',
    maxSalary: '',
    description: '',
    requirements: '',
    benefits: ''
  });

  // Mock job postings
  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'full_time',
      experience: '5-8 years',
      salary: { min: 120000, max: 160000, currency: 'USD' },
      description: 'We are looking for a senior software engineer to join our team...',
      requirements: ['React', 'Node.js', 'TypeScript', 'AWS'],
      benefits: ['Health Insurance', 'Remote Work', '401k'],
      status: 'active',
      postedDate: new Date('2024-01-15'),
      closingDate: new Date('2024-03-15'),
      applicationsCount: 45
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'full_time',
      experience: '3-5 years',
      salary: { min: 100000, max: 140000, currency: 'USD' },
      description: 'Join our product team to drive innovation...',
      requirements: ['Product Strategy', 'Analytics', 'Agile'],
      benefits: ['Stock Options', 'Flexible Hours', 'Learning Budget'],
      status: 'active',
      postedDate: new Date('2024-01-20'),
      closingDate: new Date('2024-03-20'),
      applicationsCount: 32
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'full_time',
      experience: '2-4 years',
      salary: { min: 80000, max: 110000, currency: 'USD' },
      description: 'Create amazing user experiences...',
      requirements: ['Figma', 'User Research', 'Prototyping'],
      benefits: ['Remote Work', 'Design Tools', 'Conference Budget'],
      status: 'on_hold',
      postedDate: new Date('2024-01-10'),
      closingDate: new Date('2024-03-10'),
      applicationsCount: 28
    }
  ];

  // Mock candidates
  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1-555-0123',
      location: 'New York, NY',
      experience: 6,
      currentSalary: 130000,
      expectedSalary: 150000,
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Python'],
      education: 'MS Computer Science',
      source: 'LinkedIn',
      aiScore: 92,
      status: 'interview',
      appliedDate: new Date('2024-01-25'),
      jobId: '1',
      jobTitle: 'Senior Software Engineer'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1-555-0124',
      location: 'San Francisco, CA',
      experience: 4,
      currentSalary: 95000,
      expectedSalary: 120000,
      skills: ['Product Strategy', 'Analytics', 'Agile', 'SQL'],
      education: 'MBA',
      source: 'Indeed',
      aiScore: 88,
      status: 'screening',
      appliedDate: new Date('2024-01-28'),
      jobId: '2',
      jobTitle: 'Product Manager'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1-555-0125',
      location: 'Austin, TX',
      experience: 3,
      currentSalary: 75000,
      expectedSalary: 95000,
      skills: ['Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite'],
      education: 'BFA Design',
      source: 'Company Website',
      aiScore: 85,
      status: 'offer',
      appliedDate: new Date('2024-01-30'),
      jobId: '3',
      jobTitle: 'UX Designer'
    }
  ];

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'primary';
      case 'part_time': return 'secondary';
      case 'contract': return 'warning';
      case 'internship': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'closed': return 'error';
      case 'on_hold': return 'warning';
      case 'hired': return 'success';
      case 'offer': return 'info';
      case 'interview': return 'warning';
      case 'screening': return 'secondary';
      case 'applied': return 'default';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    if (score >= 70) return 'info';
    return 'error';
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency} ${(min / 1000).toFixed(0)}K - ${(max / 1000).toFixed(0)}K`;
  };

  const handleCreateJob = () => {
    console.log('Creating job:', newJob);
    setJobDialogOpen(false);
    setNewJob({
      title: '',
      department: '',
      location: '',
      type: 'full_time',
      experience: '',
      minSalary: '',
      maxSalary: '',
      description: '',
      requirements: '',
      benefits: ''
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recruitment Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered recruitment with intelligent candidate matching and automated screening.
        </Typography>
      </Box>

      {/* Recruitment Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Work sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {jobPostings.filter(job => job.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Job Postings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {candidates.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Candidates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {candidates.filter(c => c.status === 'interview').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interviews Scheduled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                87%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hiring Success Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Job Postings" />
            <Tab label="Candidates" />
            <Tab label="Interview Pipeline" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Job Postings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Job Postings</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setJobDialogOpen(true)}
            >
              Create Job Posting
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Salary Range</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobPostings.map((job) => (
                  <TableRow key={job.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {job.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Posted {differenceInDays(new Date(), job.postedDate)} days ago
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{job.department}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{job.location}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.type.replace('_', ' ').toUpperCase()}
                        color={getJobTypeColor(job.type)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={job.applicationsCount} color="primary">
                        <Person />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={job.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(job.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error">
                            <Delete />
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

        {/* Candidates Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Candidate Pipeline</Typography>
            <Button variant="outlined" startIcon={<Download />}>
              Export Candidates
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Job Applied</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell>AI Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{candidate.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {candidate.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Email fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {candidate.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {candidate.location}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {candidate.jobTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Applied {differenceInDays(new Date(), candidate.appliedDate)} days ago
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {candidate.experience} years
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {candidate.education}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                        {candidate.skills.slice(0, 3).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {candidate.skills.length > 3 && (
                          <Chip
                            label={`+${candidate.skills.length - 3}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star color={getAIScoreColor(candidate.aiScore)} />
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={`${getAIScoreColor(candidate.aiScore)}.main`}
                        >
                          {candidate.aiScore}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={candidate.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(candidate.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Profile">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setCandidateDialogOpen(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Schedule Interview">
                          <IconButton size="small">
                            <Schedule />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send Email">
                          <IconButton size="small">
                            <Email />
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

        {/* Interview Pipeline Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Interview Pipeline
          </Typography>
          <Grid container spacing={3}>
            {['screening', 'interview', 'offer'].map((stage) => (
              <Grid item xs={12} md={4} key={stage}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                    {stage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {candidates.filter(c => c.status === stage).length} candidates
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    {candidates
                      .filter(c => c.status === stage)
                      .map((candidate) => (
                        <Card key={candidate.id} variant="outlined">
                          <CardContent sx={{ p: 2 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {candidate.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {candidate.jobTitle}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Star color={getAIScoreColor(candidate.aiScore)} fontSize="small" />
                              <Typography variant="caption">
                                {candidate.aiScore}% match
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Recruitment Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Hiring Funnel" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { stage: 'Applications', count: 105, percentage: 100 },
                      { stage: 'Screening', count: 45, percentage: 43 },
                      { stage: 'Interviews', count: 18, percentage: 17 },
                      { stage: 'Offers', count: 8, percentage: 8 },
                      { stage: 'Hired', count: 6, percentage: 6 }
                    ].map((item) => (
                      <Box key={item.stage}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{item.stage}</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {item.count} ({item.percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Source Performance" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { source: 'LinkedIn', applications: 45, hired: 3 },
                      { source: 'Indeed', applications: 32, hired: 2 },
                      { source: 'Company Website', applications: 18, hired: 1 },
                      { source: 'Referrals', applications: 10, hired: 2 }
                    ].map((item) => (
                      <Box key={item.source} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">{item.source}</Typography>
                        <Typography variant="body2">
                          {item.applications} apps, {item.hired} hired
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Create Job Dialog */}
      <Dialog
        open={jobDialogOpen}
        onClose={() => setJobDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Job Posting</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={newJob.title}
                  onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={newJob.department}
                    onChange={(e) => setNewJob(prev => ({ ...prev, department: e.target.value }))}
                    label="Department"
                  >
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Product">Product</MenuItem>
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Sales">Sales</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newJob.location}
                  onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    value={newJob.type}
                    onChange={(e) => setNewJob(prev => ({ ...prev, type: e.target.value as any }))}
                    label="Employment Type"
                  >
                    <MenuItem value="full_time">Full Time</MenuItem>
                    <MenuItem value="part_time">Part Time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Experience Required"
                  value={newJob.experience}
                  onChange={(e) => setNewJob(prev => ({ ...prev, experience: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Min Salary"
                  type="number"
                  value={newJob.minSalary}
                  onChange={(e) => setNewJob(prev => ({ ...prev, minSalary: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Max Salary"
                  type="number"
                  value={newJob.maxSalary}
                  onChange={(e) => setNewJob(prev => ({ ...prev, maxSalary: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Description"
                  multiline
                  rows={4}
                  value={newJob.description}
                  onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Requirements (comma separated)"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob(prev => ({ ...prev, requirements: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Benefits (comma separated)"
                  value={newJob.benefits}
                  onChange={(e) => setNewJob(prev => ({ ...prev, benefits: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJobDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateJob}>
            Create Job Posting
          </Button>
        </DialogActions>
      </Dialog>

      {/* Candidate Details Dialog */}
      <Dialog
        open={candidateDialogOpen}
        onClose={() => setCandidateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCandidate && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 56, height: 56 }}>
                  {selectedCandidate.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedCandidate.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Applied for {selectedCandidate.jobTitle}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Chip
                    icon={<Star />}
                    label={`${selectedCandidate.aiScore}% Match`}
                    color={getAIScoreColor(selectedCandidate.aiScore)}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email fontSize="small" />
                      <Typography variant="body2">{selectedCandidate.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" />
                      <Typography variant="body2">{selectedCandidate.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn fontSize="small" />
                      <Typography variant="body2">{selectedCandidate.location}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Professional Details</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Experience:</strong> {selectedCandidate.experience} years
                    </Typography>
                    <Typography variant="body2">
                      <strong>Education:</strong> {selectedCandidate.education}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Current Salary:</strong> ${selectedCandidate.currentSalary?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Expected Salary:</strong> ${selectedCandidate.expectedSalary?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Source:</strong> {selectedCandidate.source}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Skills</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedCandidate.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Application Status</Typography>
                  <Chip
                    label={selectedCandidate.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(selectedCandidate.status)}
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Applied on {format(selectedCandidate.appliedDate, 'MMM dd, yyyy')}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCandidateDialogOpen(false)}>Close</Button>
              <Button variant="outlined" startIcon={<Schedule />}>
                Schedule Interview
              </Button>
              <Button variant="contained" startIcon={<CheckCircle />}>
                Move to Next Stage
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};