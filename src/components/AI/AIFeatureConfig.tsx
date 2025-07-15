import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Psychology,
  Settings,
  Storage,
  CloudUpload,
  CloudDownload,
  CheckCircle,
  Error as ErrorIcon,
  Refresh,
  Save,
  Info
} from '@mui/icons-material';
import { useAuthStore } from '../../store/useAuthStore';

const AIFeatureConfig: React.FC = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // AI Configuration state
  const [config, setConfig] = useState({
    enabled: true,
    models: {
      textEmbedding: 'sentence-transformers/all-MiniLM-L6-v2',
      textClassification: 'distilbert-base-uncased-finetuned-sst-2-english',
      imageRecognition: 'google/vit-base-patch16-224',
      timeSeries: 'prophet',
      nlpProcessor: 'huggingface/tokenizers'
    },
    features: {
      resumeParser: true,
      attendanceAnalytics: true,
      payrollPrediction: true,
      documentProcessor: true,
      chatbot: true,
      performanceInsights: true,
      recruitmentAssistant: true
    },
    security: {
      dataEncryption: true,
      userDataConsent: true,
      localProcessingOnly: true,
      auditLogging: true
    },
    performance: {
      cacheResults: true,
      batchProcessing: false,
      lowResourceMode: false
    }
  });

  // Model status (simulated)
  const [modelStatus, setModelStatus] = useState({
    textEmbedding: { status: 'ready', lastUpdated: '2024-05-15' },
    textClassification: { status: 'ready', lastUpdated: '2024-05-10' },
    imageRecognition: { status: 'ready', lastUpdated: '2024-05-12' },
    timeSeries: { status: 'ready', lastUpdated: '2024-05-08' },
    nlpProcessor: { status: 'ready', lastUpdated: '2024-05-14' }
  });

  // Usage statistics (simulated)
  const [usageStats, setUsageStats] = useState({
    totalRequests: 12458,
    requestsToday: 342,
    averageResponseTime: 245, // ms
    successRate: 99.7, // percentage
    topFeature: 'chatbot',
    storageUsed: 1.2 // GB
  });

  const handleConfigChange = (section: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setSaveSuccess(false);
  };

  const handleModelChange = (model: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      models: {
        ...prev.models,
        [model]: value
      }
    }));
    setSaveSuccess(false);
  };

  const handleSaveConfig = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleRefreshModels = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Update model status with new dates
      const today = new Date().toISOString().split('T')[0];
      setModelStatus({
        textEmbedding: { status: 'ready', lastUpdated: today },
        textClassification: { status: 'ready', lastUpdated: today },
        imageRecognition: { status: 'ready', lastUpdated: today },
        timeSeries: { status: 'ready', lastUpdated: today },
        nlpProcessor: { status: 'ready', lastUpdated: today }
      });
    }, 2000);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Features Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure and manage AI features and models for your organization.
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary" display="inline">
            Processing...
          </Typography>
        </Box>
      )}

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuration saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Global Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Global AI Settings" 
              avatar={<Settings color="primary" />}
            />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.enabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                }
                label="Enable AI Features"
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                Globally enable or disable all AI features across the platform.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Feature Configuration
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.features.resumeParser}
                        onChange={(e) => handleConfigChange('features', 'resumeParser', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Resume Parser"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.features.attendanceAnalytics}
                        onChange={(e) => handleConfigChange('features', 'attendanceAnalytics', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Attendance Analytics"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.features.payrollPrediction}
                        onChange={(e) => handleConfigChange('features', 'payrollPrediction', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Payroll Prediction"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.features.documentProcessor}
                        onChange={(e) => handleConfigChange('features', 'documentProcessor', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Document Processor"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.features.chatbot}
                        onChange={(e) => handleConfigChange('features', 'chatbot', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="AI Assistant"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.features.performanceInsights}
                        onChange={(e) => handleConfigChange('features', 'performanceInsights', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Performance Insights"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.features.recruitmentAssistant}
                        onChange={(e) => handleConfigChange('features', 'recruitmentAssistant', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Recruitment Assistant"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Security & Privacy" 
              avatar={<Storage color="primary" />}
            />
            <CardContent>
              <Alert severity="info" sx={{ mb: 3 }}>
                All AI processing is done locally on your servers. No data is sent to external services.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.security.dataEncryption}
                        onChange={(e) => handleConfigChange('security', 'dataEncryption', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Data Encryption"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Encrypt all data processed by AI models
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.security.userDataConsent}
                        onChange={(e) => handleConfigChange('security', 'userDataConsent', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="User Data Consent"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Require user consent before processing personal data
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.security.localProcessingOnly}
                        onChange={(e) => handleConfigChange('security', 'localProcessingOnly', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Local Processing Only"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Process all data locally without external API calls
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.security.auditLogging}
                        onChange={(e) => handleConfigChange('security', 'auditLogging', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Audit Logging"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Log all AI operations for audit and compliance
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Performance Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.performance.cacheResults}
                        onChange={(e) => handleConfigChange('performance', 'cacheResults', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Cache Results"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Cache AI results to improve performance
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.performance.batchProcessing}
                        onChange={(e) => handleConfigChange('performance', 'batchProcessing', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Batch Processing"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Process multiple requests in batches for efficiency
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.performance.lowResourceMode}
                        onChange={(e) => handleConfigChange('performance', 'lowResourceMode', e.target.checked)}
                        disabled={!config.enabled}
                      />
                    }
                    label="Low Resource Mode"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Use smaller models to reduce resource consumption
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="AI Model Configuration" 
              avatar={<Psychology color="primary" />}
              action={
                <Button 
                  startIcon={<Refresh />} 
                  variant="outlined" 
                  onClick={handleRefreshModels}
                  disabled={isLoading || !config.enabled}
                >
                  Refresh Models
                </Button>
              }
            />
            <CardContent>
              <Alert severity="info" sx={{ mb: 3 }}>
                All models are open-source and run locally on your infrastructure. No data is sent to external services.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Text Embedding Model
                    </Typography>
                    <TextField
                      fullWidth
                      label="Model Name"
                      value={config.models.textEmbedding}
                      onChange={(e) => handleModelChange('textEmbedding', e.target.value)}
                      disabled={!config.enabled}
                      margin="normal"
                      size="small"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Chip 
                        label={modelStatus.textEmbedding.status} 
                        color={modelStatus.textEmbedding.status === 'ready' ? 'success' : 'warning'} 
                        size="small" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {modelStatus.textEmbedding.lastUpdated}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6} lg={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Text Classification Model
                    </Typography>
                    <TextField
                      fullWidth
                      label="Model Name"
                      value={config.models.textClassification}
                      onChange={(e) => handleModelChange('textClassification', e.target.value)}
                      disabled={!config.enabled}
                      margin="normal"
                      size="small"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Chip 
                        label={modelStatus.textClassification.status} 
                        color={modelStatus.textClassification.status === 'ready' ? 'success' : 'warning'} 
                        size="small" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {modelStatus.textClassification.lastUpdated}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6} lg={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Image Recognition Model
                    </Typography>
                    <TextField
                      fullWidth
                      label="Model Name"
                      value={config.models.imageRecognition}
                      onChange={(e) => handleModelChange('imageRecognition', e.target.value)}
                      disabled={!config.enabled}
                      margin="normal"
                      size="small"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Chip 
                        label={modelStatus.imageRecognition.status} 
                        color={modelStatus.imageRecognition.status === 'ready' ? 'success' : 'warning'} 
                        size="small" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {modelStatus.imageRecognition.lastUpdated}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6} lg={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Time Series Model
                    </Typography>
                    <TextField
                      fullWidth
                      label="Model Name"
                      value={config.models.timeSeries}
                      onChange={(e) => handleModelChange('timeSeries', e.target.value)}
                      disabled={!config.enabled}
                      margin="normal"
                      size="small"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Chip 
                        label={modelStatus.timeSeries.status} 
                        color={modelStatus.timeSeries.status === 'ready' ? 'success' : 'warning'} 
                        size="small" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {modelStatus.timeSeries.lastUpdated}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6} lg={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      NLP Processor Model
                    </Typography>
                    <TextField
                      fullWidth
                      label="Model Name"
                      value={config.models.nlpProcessor}
                      onChange={(e) => handleModelChange('nlpProcessor', e.target.value)}
                      disabled={!config.enabled}
                      margin="normal"
                      size="small"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Chip 
                        label={modelStatus.nlpProcessor.status} 
                        color={modelStatus.nlpProcessor.status === 'ready' ? 'success' : 'warning'} 
                        size="small" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {modelStatus.nlpProcessor.lastUpdated}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6} lg={4}>
                  <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Upload Custom Model
                    </Typography>
                    <Button 
                      variant="outlined" 
                      component="label" 
                      disabled={!config.enabled}
                      sx={{ mt: 1 }}
                    >
                      Select Model File
                      <input type="file" hidden />
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Usage Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="AI Usage Statistics" 
              avatar={<Info color="primary" />}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" color="primary.main" align="center">
                      {usageStats.totalRequests.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Total AI Requests
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                      {usageStats.requestsToday.toLocaleString()} today
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" color="success.main" align="center">
                      {usageStats.averageResponseTime} ms
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Average Response Time
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                      {usageStats.successRate}% success rate
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" color="info.main" align="center">
                      {usageStats.storageUsed} GB
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Storage Used
                    </Typography>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                      Most used: {usageStats.topFeature}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveConfig}
          disabled={isLoading}
          size="large"
        >
          Save Configuration
        </Button>
      </Box>
    </Box>
  );
};

export default AIFeatureConfig;