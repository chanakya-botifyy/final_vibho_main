import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Alert,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  CloudDownload,
  CloudUpload,
  Delete,
  Refresh,
  Info,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Add,
  Save,
  Cancel,
  Psychology,
  Storage
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

interface AIModel {
  id: string;
  name: string;
  type: 'text-embedding' | 'text-classification' | 'image-recognition' | 'time-series' | 'nlp-processor';
  source: string;
  version: string;
  size: number; // in MB
  status: 'ready' | 'downloading' | 'training' | 'error';
  lastUpdated: Date;
  accuracy?: number;
  description?: string;
}

const AIModelManagement: React.FC = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null);
  
  const [newModel, setNewModel] = useState({
    name: '',
    type: 'text-embedding' as const,
    source: '',
    version: '',
    description: ''
  });
  
  // Mock models data
  useEffect(() => {
    const mockModels: AIModel[] = [
      {
        id: '1',
        name: 'Sentence Transformers',
        type: 'text-embedding',
        source: 'huggingface',
        version: 'all-MiniLM-L6-v2',
        size: 85.4,
        status: 'ready',
        lastUpdated: new Date('2024-05-15'),
        accuracy: 0.92,
        description: 'Sentence embeddings model for semantic search and similarity'
      },
      {
        id: '2',
        name: 'DistilBERT',
        type: 'text-classification',
        source: 'huggingface',
        version: 'distilbert-base-uncased-finetuned-sst-2-english',
        size: 267.8,
        status: 'ready',
        lastUpdated: new Date('2024-05-10'),
        accuracy: 0.91,
        description: 'Distilled BERT model for text classification tasks'
      },
      {
        id: '3',
        name: 'Vision Transformer',
        type: 'image-recognition',
        source: 'huggingface',
        version: 'vit-base-patch16-224',
        size: 346.2,
        status: 'ready',
        lastUpdated: new Date('2024-05-12'),
        accuracy: 0.89,
        description: 'Vision Transformer model for image recognition'
      },
      {
        id: '4',
        name: 'Prophet',
        type: 'time-series',
        source: 'facebook',
        version: '1.1.2',
        size: 12.5,
        status: 'ready',
        lastUpdated: new Date('2024-05-08'),
        accuracy: 0.87,
        description: 'Time series forecasting model for payroll prediction'
      },
      {
        id: '5',
        name: 'Tokenizers',
        type: 'nlp-processor',
        source: 'huggingface',
        version: '0.13.3',
        size: 45.7,
        status: 'ready',
        lastUpdated: new Date('2024-05-14'),
        accuracy: 0.95,
        description: 'Fast tokenizers for NLP processing'
      }
    ];
    
    setModels(mockModels);
  }, []);
  
  const handleAddModel = () => {
    setSelectedModel(null);
    setNewModel({
      name: '',
      type: 'text-embedding',
      source: '',
      version: '',
      description: ''
    });
    setModelDialogOpen(true);
  };
  
  const handleSaveModel = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedModel) {
        // Update existing model
        setModels(prev => prev.map(model => 
          model.id === selectedModel.id 
            ? { 
                ...model, 
                name: newModel.name || model.name,
                source: newModel.source || model.source,
                version: newModel.version || model.version,
                description: newModel.description || model.description,
                lastUpdated: new Date()
              } 
            : model
        ));
      } else {
        // Add new model
        const newModelData: AIModel = {
          id: `model-${Date.now()}`,
          name: newModel.name,
          type: newModel.type,
          source: newModel.source,
          version: newModel.version,
          size: Math.random() * 200 + 50, // Random size between 50-250 MB
          status: 'downloading',
          lastUpdated: new Date(),
          description: newModel.description
        };
        
        setModels(prev => [...prev, newModelData]);
        
        // Simulate download progress
        setDownloadingModel(newModelData.id);
        setDownloadDialogOpen(true);
        setDownloadProgress(0);
        
        const interval = setInterval(() => {
          setDownloadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setDownloadDialogOpen(false);
              setDownloadingModel(null);
              
              // Update model status to ready
              setModels(prev => prev.map(model => 
                model.id === newModelData.id 
                  ? { ...model, status: 'ready', accuracy: Math.random() * 0.15 + 0.8 } // Random accuracy between 0.8-0.95
                  : model
              ));
              
              return 0;
            }
            return prev + 10;
          });
        }, 500);
      }
      
      setIsLoading(false);
      setModelDialogOpen(false);
    }, 1000);
  };
  
  const handleDeleteModel = (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setModels(prev => prev.filter(model => model.id !== modelId));
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDownloadModel = (model: AIModel) => {
    setDownloadingModel(model.id);
    setDownloadDialogOpen(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadDialogOpen(false);
          setDownloadingModel(null);
          
          // Update model status to ready
          setModels(prev => prev.map(m => 
            m.id === model.id 
              ? { ...m, status: 'ready', lastUpdated: new Date() }
              : m
          ));
          
          return 0;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1000).toFixed(2)} KB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
  };
  
  const getModelTypeLabel = (type: string) => {
    switch (type) {
      case 'text-embedding': return 'Text Embedding';
      case 'text-classification': return 'Text Classification';
      case 'image-recognition': return 'Image Recognition';
      case 'time-series': return 'Time Series';
      case 'nlp-processor': return 'NLP Processor';
      default: return type;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'downloading': return 'info';
      case 'training': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Model Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage AI models used by the system for various features.
        </Typography>
      </Box>
      
      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Available Models</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddModel}
          >
            Add Model
          </Button>
        </Box>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        All models are open-source and run locally on your infrastructure. No data is sent to external services.
      </Alert>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Accuracy</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {model.name}
                  </Typography>
                  {model.description && (
                    <Typography variant="caption" color="text.secondary">
                      {model.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getModelTypeLabel(model.type)} 
                    size="small" 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>{model.source}</TableCell>
                <TableCell>{model.version}</TableCell>
                <TableCell>{formatFileSize(model.size)}</TableCell>
                <TableCell>
                  {model.accuracy ? `${(model.accuracy * 100).toFixed(1)}%` : 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={model.status.toUpperCase()} 
                    color={getStatusColor(model.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(model.lastUpdated), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Update Model">
                      <IconButton 
                        size="small"
                        onClick={() => handleDownloadModel(model)}
                        disabled={model.status === 'downloading' || model.status === 'training'}
                      >
                        <CloudDownload />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Model">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteModel(model.id)}
                        disabled={model.status === 'downloading' || model.status === 'training'}
                      >
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
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Model Storage
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary.main">
                  {models.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Models
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="success.main">
                  {formatFileSize(models.reduce((total, model) => total + model.size, 0))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Storage Used
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="info.main">
                  {models.filter(m => m.status === 'ready').length} / {models.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Models Ready
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      
      {/* Add/Edit Model Dialog */}
      <Dialog
        open={modelDialogOpen}
        onClose={() => setModelDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedModel ? 'Edit Model' : 'Add New Model'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Model Name"
                value={newModel.name}
                onChange={(e) => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Model Type</InputLabel>
                <Select
                  value={newModel.type}
                  onChange={(e) => setNewModel(prev => ({ ...prev, type: e.target.value as any }))}
                  label="Model Type"
                >
                  <MenuItem value="text-embedding">Text Embedding</MenuItem>
                  <MenuItem value="text-classification">Text Classification</MenuItem>
                  <MenuItem value="image-recognition">Image Recognition</MenuItem>
                  <MenuItem value="time-series">Time Series</MenuItem>
                  <MenuItem value="nlp-processor">NLP Processor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Source"
                value={newModel.source}
                onChange={(e) => setNewModel(prev => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., huggingface, tensorflow, pytorch"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Version"
                value={newModel.version}
                onChange={(e) => setNewModel(prev => ({ ...prev, version: e.target.value }))}
                placeholder="e.g., 1.0.0, v2, latest"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newModel.description}
                onChange={(e) => setNewModel(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setModelDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveModel}
            startIcon={<Save />}
            disabled={isLoading || !newModel.name || !newModel.source || !newModel.version}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save Model'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Download Progress Dialog */}
      <Dialog
        open={downloadDialogOpen}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Downloading Model
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Downloading model files... Please wait.
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={downloadProgress} 
              sx={{ my: 2 }}
            />
            <Typography variant="body2" color="text.secondary" align="center">
              {downloadProgress}% Complete
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AIModelManagement;