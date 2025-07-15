import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  Button,
  Grid,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Lightbulb,
  Psychology as PsychologyIcon,
  Analytics,
  School,
  Star,
  Timeline,
  Refresh
} from '@mui/icons-material';

interface AIInsight {
  type: 'prediction' | 'anomaly' | 'recommendation' | 'trend';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

interface AIInsightsPanelProps {
  insights: AIInsight[];
  isLoading: boolean;
  onRefresh: () => void;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  isLoading,
  onRefresh
}) => {
  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp />;
      case 'anomaly': return <Warning />;
      case 'recommendation': return <Lightbulb />;
      case 'trend': return <Analytics />;
      default: return <Lightbulb />;
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
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'info';
    if (confidence >= 0.4) return 'warning';
    return 'error';
  };
  
  // Group insights by type
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) {
      acc[insight.type] = [];
    }
    acc[insight.type].push(insight);
    return acc;
  }, {} as Record<string, AIInsight[]>);
  
  // Sort insights by priority within each type
  Object.keys(groupedInsights).forEach(type => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    groupedInsights[type].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  });
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">AI-Powered Performance Insights</Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={isLoading}
        >
          Refresh Insights
        </Button>
      </Box>
      
      {isLoading ? (
        <Box sx={{ width: '100%', mt: 2, mb: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Analyzing performance data...
          </Typography>
          <LinearProgress />
        </Box>
      ) : insights.length === 0 ? (
        <Alert severity="info">
          No AI insights available yet. Complete more performance activities to generate insights.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Performance Predictions */}
          {groupedInsights['prediction'] && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TrendingUp color="primary" />
                    <Typography variant="h6">Performance Predictions</Typography>
                  </Box>
                  
                  {groupedInsights['prediction'].map((insight, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }} variant="outlined">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {insight.title}
                        </Typography>
                        <Chip
                          label={`${Math.round(insight.confidence * 100)}% confidence`}
                          size="small"
                          color={getConfidenceColor(insight.confidence)}
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
          )}
          
          {/* Skill Recommendations */}
          {groupedInsights['recommendation'] && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Lightbulb color="success" />
                    <Typography variant="h6">Skill Recommendations</Typography>
                  </Box>
                  
                  {groupedInsights['recommendation'].map((insight, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }} variant="outlined">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {insight.title}
                        </Typography>
                        <Chip
                          label={insight.priority}
                          size="small"
                          color={getPriorityColor(insight.priority)}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {insight.description}
                      </Typography>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Performance Trends */}
          {groupedInsights['trend'] && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Analytics color="info" />
                    <Typography variant="h6">Performance Trends</Typography>
                  </Box>
                  
                  {groupedInsights['trend'].map((insight, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }} variant="outlined">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {insight.title}
                        </Typography>
                        {insight.metadata?.trend && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {insight.metadata.trend === 'positive' ? (
                              <TrendingUp color="success" fontSize="small" />
                            ) : (
                              <TrendingDown color="error" fontSize="small" />
                            )}
                            <Typography variant="body2" color={insight.metadata.trend === 'positive' ? 'success.main' : 'error.main'}>
                              {insight.metadata.trend === 'positive' ? 'Positive' : 'Negative'}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {insight.description}
                      </Typography>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Anomalies & Alerts */}
          {groupedInsights['anomaly'] && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Warning color="error" />
                    <Typography variant="h6">Anomalies & Alerts</Typography>
                  </Box>
                  
                  {groupedInsights['anomaly'].map((insight, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }} variant="outlined">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {insight.title}
                        </Typography>
                        <Chip
                          label={insight.priority}
                          size="small"
                          color={getPriorityColor(insight.priority)}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {insight.description}
                      </Typography>
                      {insight.actionable && (
                        <Button size="small" sx={{ mt: 1 }}>
                          Take Action
                        </Button>
                      )}
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* If no insights of any type */}
          {Object.keys(groupedInsights).length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">
                No AI insights available yet. Complete more performance activities to generate insights.
              </Alert>
            </Grid>
          )}
        </Grid>
      )}
      
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          <strong>About AI Insights:</strong> These insights are generated using machine learning models that analyze performance data, goals, skills, and career paths. The confidence score indicates the model's certainty in its predictions. Insights are updated regularly as new data becomes available.
        </Typography>
      </Box>
    </Box>
  );
};

export default AIInsightsPanel;

export { AIInsightsPanel };