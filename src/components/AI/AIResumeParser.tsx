import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Chip,
  Divider,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Upload,
  Description,
  CheckCircle,
  School,
  Work,
  Person,
  Star,
  Assignment,
  CloudUpload
} from '@mui/icons-material';
import { aiService, openSourceAI } from '../../utils/ai';

const AIResumeParser: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setAnalysisResult(null);
      setError(null);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      
      if (event.target.files[0].type === 'text/plain' || 
          event.target.files[0].type === 'application/pdf' ||
          event.target.files[0].type === 'application/msword' ||
          event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.readAsText(event.target.files[0]);
      } else {
        setError('Unsupported file type. Please upload a .txt, .pdf, .doc, or .docx file.');
      }
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText) {
      setError('Please upload a resume first');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your self-hosted resume parsing model
      // For demo purposes, we'll use the mock implementation
      const result = await aiService.analyzeResume(resumeText);
      
      // Extract entities using NER
      const entities = await openSourceAI.extractEntities(resumeText);
      
      // Enhance the result with extracted entities
      const enhancedResult = {
        ...result,
        entities
      };
      
      setAnalysisResult(enhancedResult);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Resume Parser
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload a resume to automatically extract skills, experience, and education using our open-source AI models.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Upload Resume" />
            <CardContent>
              <Box 
                sx={{ 
                  border: '2px dashed', 
                  borderColor: 'primary.main', 
                  borderRadius: 2, 
                  p: 3, 
                  textAlign: 'center',
                  mb: 2
                }}
              >
                <input
                  type="file"
                  id="resume-upload"
                  hidden
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.doc,.docx"
                />
                <label htmlFor="resume-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUpload />}
                  >
                    Choose File
                  </Button>
                </label>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {file 
                    ? `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)` 
                    : 'Supported formats: .txt, .pdf, .doc, .docx'}
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                variant="contained"
                fullWidth
                onClick={handleAnalyzeResume}
                disabled={!file || isAnalyzing}
                startIcon={<Description />}
              >
                Analyze Resume
              </Button>
              
              {isAnalyzing && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Analyzing resume...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}
            </CardContent>
          </Card>
          
          {resumeText && (
            <Card sx={{ mt: 3 }}>
              <CardHeader title="Resume Text" />
              <CardContent>
                <Paper 
                  sx={{ 
                    p: 2, 
                    maxHeight: 300, 
                    overflow: 'auto',
                    bgcolor: 'background.default'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {resumeText}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          {analysisResult && (
            <Card>
              <CardHeader 
                title="Analysis Results" 
                subheader={`Match Score: ${analysisResult.score}%`}
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Extracted Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysisResult.skills.map((skill: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        color="primary" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Education
                  </Typography>
                  <List dense>
                    {analysisResult.education.map((edu: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <School />
                        </ListItemIcon>
                        <ListItemText primary={edu} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Experience
                  </Typography>
                  <Typography variant="body1">
                    {analysisResult.experience} years
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendations
                  </Typography>
                  <List dense>
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Star color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Matching Jobs
                  </Typography>
                  <List dense>
                    {analysisResult.matchingJobs.map((job: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Work color="info" />
                        </ListItemIcon>
                        <ListItemText primary={job} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIResumeParser;