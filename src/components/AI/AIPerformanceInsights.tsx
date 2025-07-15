import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Divider,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Assessment,
  School,
  Work,
  Person,
  Lightbulb,
  Warning,
  Psychology,
  Timeline,
  EmojiEvents
} from '@mui/icons-material';
import { format } from 'date-fns';
import { aiService, openSourceAI, AIInsight } from '../../utils/ai';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { usePerformanceStore } from '../../store/usePerformanceStore';

const AIPerformanceInsights: React.FC = () => {
  const { employees } = useEmployeeStore();
  const { 
    reviews, 
    goals, 
    skillAssessments,
    careerPaths
  } = usePerformanceStore();
  
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [careerRecommendations, setCareerRecommendations] = useState<string[]>([]);
  const [skillGaps, setSkillGaps] = useState<{skill: string, currentLevel: number, requiredLevel: number}[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleAnalyzePerformance = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Get employee data
      const employee = employees.find(e => e.id === selectedEmployee);
      
      // Get performance data for the employee
      const employeeReviews = reviews.filter(r => r.employeeId === selectedEmployee);
      const employeeGoals = goals.filter(g => g.employeeId === selectedEmployee);
      const employeeSkills = skillAssessments.filter(s => s.employeeId === selectedEmployee);
      const employeeCareerPaths = careerPaths.filter(c => c.employeeId === selectedEmployee);
      
      // Generate insights
      const generatedInsights = await aiService.generateInsights('performance', {
        employeeId: selectedEmployee,
        reviews: employeeReviews,
        goals: employeeGoals,
        skills: employeeSkills
      });
      
      // Generate career recommendations
      const recommendations = [
        "Consider pursuing a certification in Project Management to enhance leadership skills",
        "Develop expertise in data analysis to complement technical skills",
        "Focus on improving communication skills through public speaking opportunities",
        "Explore mentorship opportunities to develop leadership capabilities",
        "Consider cross-functional projects to broaden organizational knowledge"
      ];
      
      // Generate skill gaps
      const gaps = [
        { skill: "Leadership", currentLevel: 3, requiredLevel: 4 },
        { skill: "Data Analysis", currentLevel: 2, requiredLevel: 4 },
        { skill: "Public Speaking", currentLevel: 2, requiredLevel: 3 },
        { skill: "Project Management", currentLevel: 3, requiredLevel: 4 }
      ];
      
      setInsights(generatedInsights);
      setCareerRecommendations(recommendations);
      setSkillGaps(gaps);
    } catch (error) {
      console.error('Error analyzing performance:', error);
      setError('Failed to analyze performance. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp />;
      case 'anomaly': return <Warning />;
      case 'recommendation': return <Lightbulb />;
      case 'trend': return <Timeline />;
      default: return <Assessment />;
    }
  };
  
  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'primary';
      case 'anomaly': return 'error';
      case 'recommendation': return 'success';
      case 'trend': return 'info';
      default: return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Performance Insights
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate AI-powered insights and recommendations to enhance employee performance and career development.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Performance Analysis Parameters" />
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Employee</InputLabel>
                    <Select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value as string)}
                      label="Employee"
                    >
                      <MenuItem value="">Select Employee</MenuItem>
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleAnalyzePerformance}
                    disabled={isAnalyzing || !selectedEmployee}
                    startIcon={<Assessment />}
                  >
                    Generate Insights
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        
        {isAnalyzing && (
          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Analyzing performance data...
              </Typography>
              <LinearProgress />
            </Box>
          </Grid>
        )}
        
        {insights.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Performance Insights
              </Typography>
            </Grid>
            
            {/* Group insights by type */}
            {['prediction', 'trend', 'recommendation', 'anomaly'].map(type => {
              const typeInsights = insights.filter(insight => insight.type === type);
              if (typeInsights.length === 0) return null;
              
              return (
                <Grid item xs={12} md={6} key={type}>
                  <Card>
                    <CardHeader 
                      title={`${type.charAt(0).toUpperCase() + type.slice(1)}s`}
                      avatar={getInsightTypeIcon(type)}
                    />
                    <CardContent>
                      {typeInsights.map((insight, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 2 }} variant="outlined">
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {insight.title}
                            </Typography>
                            <Chip
                              label={`${Math.round(insight.confidence * 100)}% confidence`}
                              size="small"
                              color={getInsightTypeColor(insight.type)}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {insight.description}
                          </Typography>
                          {insight.actionable && (
                            <Chip
                              label="Actionable"
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </Paper>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Career Development Recommendations"
                  avatar={<School color="primary" />}
                />
                <CardContent>
                  <List>
                    {careerRecommendations.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Lightbulb color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Skill Gap Analysis"
                  avatar={<Work color="secondary" />}
                />
                <CardContent>
                  <List>
                    {skillGaps.map((gap, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Star color="info" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={gap.skill} 
                          secondary={`Current Level: ${gap.currentLevel}/5 • Required Level: ${gap.requiredLevel}/5`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Recommended Training
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <School color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Leadership Development Program" 
                        secondary="To improve leadership skills"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <School color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Data Analysis Certification" 
                        secondary="To enhance analytical capabilities"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <School color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Public Speaking Workshop" 
                        secondary="To develop communication skills"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Performance Prediction"
                  avatar={<TrendingUp color="success" />}
                />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="primary.main">
                          4.5/5.0
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Predicted Next Review Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                          <TrendingUp color="success" fontSize="small" />
                          <Typography variant="caption" color="success.main">
                            +0.3 from last review
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="success.main">
                          92%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Probability of Goal Completion
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h5" color="info.main">
                          18 months
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Time to Promotion
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Performance Improvement Plan
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <EmojiEvents color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Focus on developing leadership skills through team projects" 
                        secondary="High impact area for career growth"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmojiEvents color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Improve technical expertise in data analysis" 
                        secondary="Will address key skill gap"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmojiEvents color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Seek opportunities for cross-functional collaboration" 
                        secondary="Will broaden organizational knowledge"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default AIPerformanceInsights;