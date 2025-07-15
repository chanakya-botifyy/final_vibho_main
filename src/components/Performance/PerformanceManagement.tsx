import React, { useState, useEffect } from 'react';
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
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Star,
  TrendingUp,
  Assessment,
  School,
  Work,
  Person,
  Group,
  Timeline,
  CheckCircle,
  Schedule,
  Warning,
  Download,
  Save,
  Assignment,
  Lightbulb,
  Psychology,
  EmojiEvents,
  BarChart,
  Insights
} from '@mui/icons-material';
import { format, differenceInDays } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';
import { usePerformanceStore } from '../../store/usePerformanceStore';
import { aiService } from '../../utils/ai';
import PerformanceReviewDialog from './PerformanceReviewDialog';
import PerformanceGoalDialog from './PerformanceGoalDialog';
import CareerPathDialog from './CareerPathDialog';
import SkillAssessmentDialog from './SkillAssessmentDialog';
import AIInsightsPanel from './AIInsightsPanel';

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
      id={`performance-tabpanel-${index}`}
      aria-labelledby={`performance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  reviewDate: Date;
  reviewType: 'annual' | 'quarterly' | 'probation' | 'project';
  overallRating: number;
  currentDesignation: string;
  newDesignation?: string;
  currentSalary: number;
  newSalary?: number;
  percentageHike?: number;
  hrComments?: string;
  managerComments?: string;
  employeeComments?: string;
  status: 'draft' | 'in_progress' | 'completed' | 'acknowledged';
  goals: PerformanceGoal[];
  skills: SkillRating[];
  strengths: string[];
  areasOfImprovement: string[];
  trainingRecommendations: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PerformanceGoal {
  id: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'project' | 'learning';
  targetDate: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  rating?: number;
  feedback?: string;
}

interface SkillRating {
  skill: string;
  rating: number;
  category: 'technical' | 'soft' | 'leadership' | 'domain';
  comments?: string;
}

interface CareerPath {
  id: string;
  employeeId: string;
  currentRole: string;
  targetRole: string;
  requiredSkills: string[];
  requiredExperience: number;
  estimatedTimeframe: number; // in months
  trainingRequired: string[];
  status: 'proposed' | 'in_progress' | 'achieved' | 'changed';
}

export const PerformanceManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { 
    reviews, 
    goals, 
    careerPaths, 
    skillAssessments,
    createReview,
    updateReview,
    createGoal,
    updateGoal,
    updateGoalProgress,
    createCareerPath,
    updateCareerPath,
    createSkillAssessment,
    updateSkillAssessment,
    isLoading: storeLoading
  } = usePerformanceStore();
  const { can } = usePermission();
  
  const [tabValue, setTabValue] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [careerDialogOpen, setCareerDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | null>(null);
  const [selectedCareerPath, setSelectedCareerPath] = useState<CareerPath | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillAssessment | null>(null);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isUpdateProgressMode, setIsUpdateProgressMode] = useState(false);

  // Form states
  const [newReview, setNewReview] = useState({
    reviewPeriod: '',
    reviewType: 'annual' as const,
    overallRating: 0,
    currentDesignation: '',
    newDesignation: '',
    currentSalary: '',
    newSalary: '',
    hrComments: '',
    managerComments: '',
    employeeComments: ''
  });
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'professional' as const,
    targetDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'not_started' as const
  });

  // Load AI insights
  useEffect(() => {
    const loadInsights = async () => {
      if (user?.id) {
        setIsLoadingInsights(true);
        try {
          const insights = await aiService.generateInsights('performance', {
            employeeId: user.id,
            reviews: reviews.filter(r => r.employeeId === user.id),
            goals: goals.filter(g => g.employeeId === user.id),
            skills: skillAssessments.filter(s => s.employeeId === user.id)
          });
          setAiInsights(insights);
        } catch (error) {
          console.error('Error loading AI insights:', error);
        } finally {
          setIsLoadingInsights(false);
        }
      }
    };

    loadInsights();
  }, [user?.id, reviews, goals, skillAssessments]);

  const handleCreateReview = () => {
    // Calculate percentage hike
    const currentSalary = parseFloat(newReview.currentSalary);
    const newSalary = parseFloat(newReview.newSalary);
    const percentageHike = currentSalary > 0 ? ((newSalary - currentSalary) / currentSalary) * 100 : 0;

    createReview({
      employeeId: newReview.employeeId,
      employeeName: employees.find(e => e.id === newReview.employeeId)?.personalInfo.firstName + ' ' + 
                    employees.find(e => e.id === newReview.employeeId)?.personalInfo.lastName,
      reviewPeriod: newReview.reviewPeriod,
      reviewType: newReview.reviewType,
      overallRating: newReview.overallRating,
      currentDesignation: newReview.currentDesignation,
      newDesignation: newReview.newDesignation,
      currentSalary: currentSalary,
      newSalary: newSalary,
      percentageHike: percentageHike,
      hrComments: newReview.hrComments,
      managerComments: newReview.managerComments,
      employeeComments: newReview.employeeComments,
      status: 'draft',
      createdBy: user?.name || 'System',
      createdAt: new Date(),
      updatedAt: new Date() 
    });

    setReviewDialogOpen(false);
    resetNewReview();
  };

  const handleCreateGoal = () => {
    const goal: Partial<PerformanceGoal> = {
      employeeId: newGoal.employeeId,
      title: newGoal.title.trim(),
      description: newGoal.description,
      category: newGoal.category,
      startDate: new Date(newGoal.startDate),
      targetDate: new Date(newGoal.targetDate),
      progress: 0,
      status: newGoal.status,
      priority: newGoal.priority,
      metrics: newGoal.metrics,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    createGoal(goal).then(() => setGoalDialogOpen(false));
    resetNewGoal();
  };

  const resetNewReview = () => {
    setNewReview({
      reviewPeriod: '',
      reviewType: 'annual',
      overallRating: 0,
      currentDesignation: '',
      newDesignation: '',
      currentSalary: '',
      newSalary: '',
      hrComments: '',
      managerComments: '',
      employeeComments: ''
    });
    setSelectedEmployee('');
  };

  const resetNewGoal = () => {
    setNewGoal({
      title: '',
      description: '',
      category: 'professional',
      targetDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'not_started'
    });
  };

  const handleSaveReview = (reviewData: Partial<PerformanceReview>) => {
    if (selectedReview) {
      updateReview(selectedReview.id, reviewData).then(() => {
        setReviewDialogOpen(false);
        setSelectedReview(null);
      });
    } else {
      createReview(reviewData as any).then(() => {
        setReviewDialogOpen(false);
      });
    }
  };

  const handleSaveGoal = (goalData: Partial<PerformanceGoal>) => {
    if (isUpdateProgressMode && selectedGoal) {
      updateGoalProgress(
        selectedGoal.id, 
        goalData.progress || 0, 
        goalData.feedback
      ).then(() => {
        setGoalDialogOpen(false);
        setSelectedGoal(null);
        setIsUpdateProgressMode(false);
      });
    } else if (selectedGoal) {
      updateGoal(selectedGoal.id, goalData).then(() => {
        setGoalDialogOpen(false);
        setSelectedGoal(null);
      });
    } else {
      createGoal(goalData as any).then(() => {
        setGoalDialogOpen(false);
      });
    }
  };

  const handleSaveCareerPath = (pathData: Partial<CareerPath>) => {
    if (selectedCareerPath) {
      updateCareerPath(selectedCareerPath.id, pathData).then(() => {
        setCareerDialogOpen(false);
        setSelectedCareerPath(null);
      });
    } else {
      createCareerPath(pathData as any).then(() => {
        setCareerDialogOpen(false);
      });
    }
  };

  const handleSaveSkillAssessment = (assessmentData: Partial<SkillAssessment>) => {
    if (selectedSkill) {
      updateSkillAssessment(selectedSkill.id, assessmentData).then(() => {
        setSkillDialogOpen(false);
        setSelectedSkill(null);
      });
    } else {
      createSkillAssessment(assessmentData as any).then(() => {
        setSkillDialogOpen(false);
      });
    }
  };

  const refreshAIInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const insights = await aiService.generateInsights('performance', {
        employeeId: user?.id,
        reviews: reviews.filter(r => r.employeeId === user?.id),
        goals: goals.filter(g => g.employeeId === user?.id),
        skills: skillAssessments.filter(s => s.employeeId === user?.id)
      });
      setAiInsights(insights);
    } catch (error) {
      console.error('Error refreshing AI insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'draft': return 'info';
      case 'acknowledged': return 'primary';
      case 'not_started': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getReviewTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'primary';
      case 'quarterly': return 'secondary';
      case 'probation': return 'warning';
      case 'project': return 'info';
      default: return 'default';
    }
  };

  const getGoalCategoryColor = (category: string) => {
    switch (category) {
      case 'professional': return 'primary';
      case 'personal': return 'secondary';
      case 'project': return 'success';
      case 'learning': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  // Filter data based on user role
  const filteredReviews = user?.role === 'employee'
    ? reviews.filter(review => review.employeeId === user.id)
    : reviews || [];

  const filteredGoals = user?.role === 'employee'
    ? goals.filter(goal => goal.employeeId === user.id)
    : user?.role === 'manager'
      ? goals.filter(goal => employees.find(e => e.id === goal.employeeId)?.companyInfo.reportingManager === user.name)
      : goals || [];

  const filteredCareerPaths = user?.role === 'employee' 
    ? careerPaths.filter(path => path.employeeId === user.id)
    : careerPaths || []; 

  const filteredSkills = user?.role === 'employee' 
    ? skillAssessments.filter(skill => skill.employeeId === user.id) 
    : skillAssessments || [];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Performance Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track, evaluate, and enhance employee performance with AI-powered analytics.
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <PermissionGate 
              permission={[PERMISSIONS.PERFORMANCE_VIEW_ALL, PERMISSIONS.PERFORMANCE_VIEW_TEAM, PERMISSIONS.PERFORMANCE_VIEW_SELF]}
            >
              <Tab label="Performance Reviews" />
            </PermissionGate>
            <PermissionGate 
              permission={[PERMISSIONS.PERFORMANCE_VIEW_ALL, PERMISSIONS.PERFORMANCE_VIEW_TEAM, PERMISSIONS.PERFORMANCE_VIEW_SELF]}
            >
              <Tab label="My Goals" />
            </PermissionGate>
            <PermissionGate 
              permission={[PERMISSIONS.PERFORMANCE_VIEW_ALL, PERMISSIONS.PERFORMANCE_VIEW_TEAM, PERMISSIONS.PERFORMANCE_VIEW_SELF]}
            >
              <Tab label="Career Development" />
            </PermissionGate>
            <PermissionGate 
              permission={[PERMISSIONS.PERFORMANCE_VIEW_ALL, PERMISSIONS.PERFORMANCE_VIEW_TEAM, PERMISSIONS.PERFORMANCE_VIEW_SELF]}
            >
              <Tab label="Skills Matrix" />
            </PermissionGate>
            <PermissionGate 
              permission={[PERMISSIONS.PERFORMANCE_VIEW_ALL, PERMISSIONS.PERFORMANCE_VIEW_TEAM, PERMISSIONS.PERFORMANCE_VIEW_SELF]}
            >
              <Tab label="AI Insights" />
            </PermissionGate>
          </Tabs>
        </Box>

        {/* Performance Reviews Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Performance Reviews</Typography>
            <PermissionGate permission={PERMISSIONS.PERFORMANCE_CREATE}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setReviewDialogOpen(true)}
              >
                Create Review
              </Button>
            </PermissionGate>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Review Period</TableCell>
                  <TableCell>Review Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Salary Change</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>
                          {review.employeeName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {review.employeeName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{review.reviewPeriod}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(review.reviewDate, 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={review.reviewType.toUpperCase()}
                        color={getReviewTypeColor(review.reviewType)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating
                          value={review.overallRating}
                          precision={0.1}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2">
                          {review.overallRating.toFixed(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {review.percentageHike ? (
                        <Typography
                          variant="body2"
                          color={review.percentageHike > 0 ? 'success.main' : 'error.main'}
                        >
                          {review.percentageHike > 0 ? '+' : ''}{review.percentageHike}%
                        </Typography>
                      ) : (
                        <Typography variant="body2">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={review.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(review.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => { 
                              setSelectedReview(review);
                              setReviewDialogOpen(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <PermissionGate permission={PERMISSIONS.PERFORMANCE_UPDATE_ALL}>
                          <Tooltip title="Edit">
                            <IconButton size="small" disabled={review.status === 'completed'}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </PermissionGate>
                        <Tooltip title="Download PDF">
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

        {/* My Goals Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Performance Goals</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setGoalDialogOpen(true)}
            >
              Add Goal
            </Button>
          </Box>

          <Grid container spacing={3}>
            {filteredGoals.map((goal) => (
              <Grid item xs={12} md={6} lg={4} key={goal.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{goal.title}</Typography>
                        <Chip
                          label={goal.category.toUpperCase()}
                          color={getGoalCategoryColor(goal.category)}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Chip
                        label={goal.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(goal.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {goal.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Progress:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {goal.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={goal.progress}
                        color={
                          goal.progress >= 100 ? 'success' :
                          goal.progress >= 50 ? 'primary' :
                          goal.progress >= 25 ? 'warning' : 'error'
                        }
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      Target Date: {format(goal.targetDate, 'MMM dd, yyyy')}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => { 
                          setIsUpdateProgressMode(true);
                          setSelectedGoal(goal);
                          setGoalDialogOpen(true);
                        }}
                      >
                        Update Progress
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Career Development Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Career Development</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCareerDialogOpen(true)}
            >
              Create Career Path
            </Button>
          </Box>

          <Grid container spacing={3}>
            {filteredCareerPaths.map((path) => (
              <Grid item xs={12} md={6} key={path.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">Career Progression Plan</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {path.currentRole} → {path.targetRole}
                        </Typography>
                      </Box>
                      <Chip
                        label={path.status.toUpperCase()}
                        color={getStatusColor(path.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Progress</Typography>
                        <Typography variant="body2" fontWeight="medium">{path.progress}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={path.progress} 
                        color="primary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Estimated Timeframe: {path.estimatedTimeframe} months
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Required Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {path.requiredSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Required Training
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {path.requiredTraining.map((training, index) => (
                        <Typography key={index} variant="body2">
                          • {training}
                        </Typography>
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedCareerPath(path);
                          setIsUpdateProgressMode(true);
                          setCareerDialogOpen(true);
                        }}
                      >
                        Update Progress
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Skills Matrix Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Skills Assessment</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setSkillDialogOpen(true)}
            >
              Add Skill Assessment
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Technical Skills" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredSkills
                      .filter(skill => skill.category === 'technical')
                      .map((skill) => (
                        <Box key={skill.id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{skill.skillName}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {skill.currentLevel}/5
                              </Typography>
                              {skill.currentLevel < skill.targetLevel && (
                                <TrendingUp color="warning" fontSize="small" />
                              )}
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(skill.currentLevel / 5) * 100} 
                            color="info"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          {skill.currentLevel < skill.targetLevel && (
                            <Typography variant="caption" color="text.secondary">
                              Target: {skill.targetLevel}/5
                            </Typography>
                          )}
                        </Box>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Soft Skills" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredSkills
                      .filter(skill => skill.category === 'soft')
                      .map((skill) => (
                        <Box key={skill.id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{skill.skillName}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {skill.currentLevel}/5
                              </Typography>
                              {skill.currentLevel < skill.targetLevel && (
                                <TrendingUp color="warning" fontSize="small" />
                              )}
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(skill.currentLevel / 5) * 100} 
                            color="success"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          {skill.currentLevel < skill.targetLevel && (
                            <Typography variant="caption" color="text.secondary">
                              Target: {skill.targetLevel}/5
                            </Typography>
                          )}
                        </Box>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Leadership Skills" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredSkills
                      .filter(skill => skill.category === 'leadership')
                      .map((skill) => (
                        <Box key={skill.id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{skill.skillName}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {skill.currentLevel}/5
                              </Typography>
                              {skill.currentLevel < skill.targetLevel && (
                                <TrendingUp color="warning" fontSize="small" />
                              )}
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(skill.currentLevel / 5) * 100} 
                            color="warning"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          {skill.currentLevel < skill.targetLevel && (
                            <Typography variant="caption" color="text.secondary">
                              Target: {skill.targetLevel}/5
                            </Typography>
                          )}
                        </Box>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* AI Insights Tab */}
        <TabPanel value={tabValue} index={4}>
          <AIInsightsPanel 
            insights={aiInsights}
            isLoading={isLoadingInsights}
            onRefresh={refreshAIInsights}
          />
        </TabPanel>
      </Card>

      {/* Performance Review Dialog */}
      <PerformanceReviewDialog
        open={reviewDialogOpen}
        onClose={() => {
          setReviewDialogOpen(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
        onSave={handleSaveReview}
      />

      {/* Performance Goal Dialog */}
      <PerformanceGoalDialog
        open={goalDialogOpen}
        onClose={() => {
          setGoalDialogOpen(false);
          setSelectedGoal(null);
          setIsUpdateProgressMode(false);
        }}
        goal={selectedGoal}
        onSave={handleSaveGoal}
        isUpdateProgress={isUpdateProgressMode}
      />

      {/* Career Path Dialog */}
      <CareerPathDialog
        open={careerDialogOpen}
        onClose={() => {
          setCareerDialogOpen(false);
          setSelectedCareerPath(null);
          setIsUpdateProgressMode(false);
        }}
        careerPath={selectedCareerPath}
        onSave={handleSaveCareerPath}
        isUpdateProgress={isUpdateProgressMode}
      />

      {/* Skill Assessment Dialog */}
      <SkillAssessmentDialog
        open={skillDialogOpen}
        onClose={() => {
          setSkillDialogOpen(false);
          setSelectedSkill(null);
        }}
        assessment={selectedSkill}
        onSave={handleSaveSkillAssessment}
      />
    </Box>
  );
};