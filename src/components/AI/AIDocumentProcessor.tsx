import React, { useState } from 'react';
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
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Description,
  CloudUpload,
  Category,
  Folder,
  ContentPaste,
  Search,
  FindInPage,
  Download,
  Visibility,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { aiService, openSourceAI } from '../../utils/ai';

const AIDocumentProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const [extractedEntities, setExtractedEntities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setProcessingResult(null);
      setExtractedEntities([]);
      setError(null);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setDocumentText(text);
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
  
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentText(event.target.value);
    setProcessingResult(null);
    setExtractedEntities([]);
  };
  
  const handleProcessDocument = async () => {
    if (!documentText) {
      setError('Please upload a document or enter text');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Categorize document
      const documentCategory = await aiService.categorizeDocument(documentText);
      
      // Extract entities
      const entities = await openSourceAI.extractEntities(documentText);
      
      // Analyze sentiment
      const sentiment = await openSourceAI.analyzeSentiment(documentText);
      
      // Classify document type
      const documentType = await openSourceAI.classifyDocument(documentText, [
        'Contract',
        'Invoice',
        'Resume',
        'Policy',
        'Report',
        'Letter',
        'Email'
      ]);
      
      setProcessingResult({
        category: documentCategory,
        documentType,
        sentiment
      });
      
      setExtractedEntities(entities);
    } catch (error) {
      console.error('Error processing document:', error);
      setError('Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getEntityColor = (type: string) => {
    switch (type) {
      case 'PERSON': return 'primary';
      case 'DATE': return 'secondary';
      case 'ORGANIZATION': return 'success';
      case 'LOCATION': return 'info';
      case 'MONEY': return 'warning';
      default: return 'default';
    }
  };
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'neutral': return 'info';
      default: return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Document Processor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Automatically categorize, extract information, and analyze documents using AI.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Upload Document" />
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
                  id="document-upload"
                  hidden
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.doc,.docx"
                />
                <label htmlFor="document-upload">
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
              
              <Typography variant="subtitle1" gutterBottom>
                Or paste document text:
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={10}
                placeholder="Paste document text here..."
                value={documentText}
                onChange={handleTextChange}
                sx={{ mb: 2 }}
              />
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                variant="contained"
                fullWidth
                onClick={handleProcessDocument}
                disabled={!documentText || isProcessing}
                startIcon={<Description />}
              >
                Process Document
              </Button>
              
              {isProcessing && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Processing document...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {processingResult && (
            <Card>
              <CardHeader title="Document Analysis Results" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Document Category
                      </Typography>
                      <Chip 
                        icon={<Category />} 
                        label={processingResult.category} 
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Document Type
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          icon={<Folder />} 
                          label={processingResult.documentType.category} 
                          color="secondary"
                          sx={{ mt: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({(processingResult.documentType.confidence * 100).toFixed(1)}% confidence)
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Document Sentiment
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={processingResult.sentiment.sentiment.toUpperCase()} 
                          color={getSentimentColor(processingResult.sentiment.sentiment)}
                          sx={{ mt: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          (Score: {(processingResult.sentiment.score * 100).toFixed(1)}%)
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Extracted Entities
                    </Typography>
                    
                    {extractedEntities.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {extractedEntities.map((entity, index) => (
                          <Chip
                            key={index}
                            label={`${entity.entity} (${entity.type})`}
                            color={getEntityColor(entity.type)}
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No entities extracted
                      </Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" gutterBottom>
                      Recommended Actions
                    </Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Folder color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`File as ${processingResult.category}`}
                          secondary="Based on document content analysis"
                        />
                      </ListItem>
                      
                      {processingResult.documentType.category === 'Contract' && (
                        <ListItem>
                          <ListItemIcon>
                            <FindInPage color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Review legal terms"
                            secondary="Contract detected - legal review recommended"
                          />
                        </ListItem>
                      )}
                      
                      {processingResult.documentType.category === 'Invoice' && (
                        <ListItem>
                          <ListItemIcon>
                            <AttachMoney color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Process for payment"
                            secondary="Invoice detected - forward to finance department"
                          />
                        </ListItem>
                      )}
                      
                      {processingResult.documentType.category === 'Resume' && (
                        <ListItem>
                          <ListItemIcon>
                            <Person color="info" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Forward to HR for review"
                            secondary="Resume detected - candidate evaluation recommended"
                          />
                        </ListItem>
                      )}
                      
                      {processingResult.sentiment.sentiment === 'negative' && (
                        <ListItem>
                          <ListItemIcon>
                            <Warning color="error" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Priority attention required"
                            secondary="Negative sentiment detected - may require urgent response"
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIDocumentProcessor;