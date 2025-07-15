import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Description,
  AccessTime,
  AttachMoney,
  Person,
  Assessment,
  Work,
  School,
  ArrowForward,
  Insights,
  AutoAwesome,
  Analytics
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AIDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const aiFeatures = [
    {
      id: 'resume-parser',
      title: 'AI Resume Parser',
      description: 'Automatically extract skills, experience, and education from resumes',
      icon: <Description sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/ai/resume-parser',
      tags: ['Recruitment', 'Open Source', 'NLP']
    },
    {
      id: 'attendance-analytics',
      title: 'AI Attendance Analytics',
      description: 'Analyze attendance patterns and detect anomalies',
      icon: <AccessTime sx={{ fontSize: 40, color: 'warning.main' }} />,
      path: '/ai/attendance-analytics',
      tags: ['Attendance', 'Anomaly Detection', 'Forecasting']
    },
    {
      id: 'payroll-prediction',
      title: 'AI Payroll Prediction',
      description: 'Forecast future payroll costs and identify optimization opportunities',
      icon: <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />,
      path: '/ai/payroll-prediction',
      tags: ['Payroll', 'Forecasting', 'Cost Optimization']
    },
    {
      id: 'document-processor',
      title: 'AI Document Processor',
      description: 'Automatically categorize, extract information, and analyze documents',
      icon: <Description sx={{ fontSize: 40, color: 'info.main' }} />,
      path: '/ai/document-processor',
      tags: ['Documents', 'NLP', 'Classification']
    },
    {
      id: 'chatbot',
      title: 'AI Assistant',
      description: 'Get help with HR tasks, answer questions, and access information',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      path: '/ai/chatbot',
      tags: ['Support', 'NLP', 'Conversational AI']
    },
    {
      id: 'performance-insights',
      title: 'AI Performance Insights',
      description: 'Generate insights and recommendations to enhance employee performance',
      icon: <Assessment sx={{ fontSize: 40, color: 'error.main' }} />,
      path: '/ai/performance-insights',
      tags: ['Performance', 'Recommendations', 'Career Development']
    },
    {
      id: 'recruitment-assistant',
      title: 'AI Recruitment Assistant',
      description: 'Match candidates to job openings using AI-powered skill analysis',
      icon: <Work sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/ai/recruitment-assistant',
      tags: ['Recruitment', 'Matching', 'Candidate Ranking']
    }
  ];
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Features Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore our AI-powered features built with open-source models to enhance your HR operations.
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.50' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              All AI features use open-source models
            </Typography>
            <Typography variant="body1" paragraph>
              Our AI features are powered by open-source models that run locally, ensuring data privacy and security.
              No data is sent to external services, and all processing happens within your infrastructure.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label="Sentence Transformers" color="primary" variant="outlined" />
              <Chip label="DistilBERT" color="primary" variant="outlined" />
              <Chip label="spaCy NER" color="primary" variant="outlined" />
              <Chip label="Prophet" color="primary" variant="outlined" />
              <Chip label="Hugging Face" color="primary" variant="outlined" />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Insights sx={{ fontSize: 100, color: 'primary.main', opacity: 0.7 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        {aiFeatures.map((feature) => (
          <Grid item xs={12} md={6} lg={4} key={feature.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                avatar={feature.icon}
                title={feature.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {feature.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(feature.path)}
                >
                  Explore Feature
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          How Our AI Features Work
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Analytics sx={{ fontSize: 60, color: 'primary.main' }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Data Processing
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI features process your HR data locally using open-source models. 
                The data is analyzed to extract patterns, insights, and predictions 
                without ever leaving your infrastructure.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <PsychologyIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Machine Learning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We use state-of-the-art open-source machine learning models for natural 
                language processing, time series forecasting, anomaly detection, and more. 
                These models are continuously improved and updated.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <AutoAwesome sx={{ fontSize: 60, color: 'success.main' }} />
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                Actionable Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The AI features generate actionable insights and recommendations that 
                help you make data-driven decisions. From optimizing payroll costs to 
                identifying the best candidates, our AI helps you work smarter.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AIDashboard;