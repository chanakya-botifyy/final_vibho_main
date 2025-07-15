import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  Box,
  Slider,
  Chip,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { PERMISSIONS } from '../../utils/permissions';
import { usePermission } from '../../hooks/usePermission';

interface CareerPath {
  id?: string;
  employeeId: string;
  currentRole: string;
  targetRole: string;
  requiredSkills: string[];
  requiredTraining: string[];
  estimatedTimeframe: number; // in months
  progress: number;
  status: 'active' | 'completed' | 'on_hold';
  createdAt?: Date;
  updatedAt?: Date;
}

interface CareerPathDialogProps {
  open: boolean;
  onClose: () => void;
  careerPath: CareerPath | null;
  onSave: (careerPath: Partial<CareerPath>) => void;
  isUpdateProgress?: boolean;
}

const CareerPathDialog: React.FC<CareerPathDialogProps> = ({
  open,
  onClose,
  careerPath,
  onSave,
  isUpdateProgress = false
}) => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { can } = usePermission();
  
  const [formData, setFormData] = useState<Partial<CareerPath>>({
    employeeId: '',
    currentRole: '',
    targetRole: '',
    requiredSkills: [],
    requiredTraining: [],
    estimatedTimeframe: 12,
    progress: 0,
    status: 'active'
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newTraining, setNewTraining] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with career path data if editing
  useEffect(() => {
    if (careerPath) {
      setFormData({
        ...careerPath
      });
    } else {
      // Reset form for new career path
      setFormData({
        employeeId: user?.role === 'employee' ? user.id : '',
        currentRole: '',
        targetRole: '',
        requiredSkills: [],
        requiredTraining: [],
        estimatedTimeframe: 12,
        progress: 0,
        status: 'active'
      });
    }
    setNewSkill('');
    setNewTraining('');
    setErrors({});
  }, [careerPath, open, user]);
  
  // When employee is selected, auto-fill current role
  useEffect(() => {
    if (formData.employeeId && !careerPath) {
      const employee = employees.find(e => e.id === formData.employeeId);
      if (employee) {
        setFormData(prev => ({
          ...prev,
          currentRole: employee.companyInfo.designation
        }));
      }
    }
  }, [formData.employeeId, employees, careerPath]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };
  
  const handleProgressChange = (_: Event, value: number | number[]) => {
    const progress = Array.isArray(value) ? value[0] : value;
    setFormData(prev => ({ 
      ...prev, 
      progress,
      status: progress >= 100 ? 'completed' : 'active'
    }));
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills?.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...(prev.requiredSkills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills?.filter(s => s !== skill) || []
    }));
  };
  
  const handleAddTraining = () => {
    if (newTraining.trim() && !formData.requiredTraining?.includes(newTraining.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredTraining: [...(prev.requiredTraining || []), newTraining.trim()]
      }));
      setNewTraining('');
    }
  };
  
  const handleRemoveTraining = (training: string) => {
    setFormData(prev => ({
      ...prev,
      requiredTraining: prev.requiredTraining?.filter(t => t !== training) || []
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required';
    }
    
    if (!formData.currentRole) {
      newErrors.currentRole = 'Current role is required';
    }
    
    if (!formData.targetRole) {
      newErrors.targetRole = 'Target role is required';
    }
    
    if (!formData.estimatedTimeframe) {
      newErrors.estimatedTimeframe = 'Timeframe is required';
    }
    
    if (!formData.requiredSkills?.length) {
      newErrors.requiredSkills = 'At least one required skill is needed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const isViewOnly = !isUpdateProgress && careerPath?.status === 'completed';
  
  const isProgressUpdateOnly = isUpdateProgress && careerPath;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isProgressUpdateOnly 
          ? 'Update Career Path Progress' 
          : careerPath 
            ? 'Career Path Details' 
            : 'Create Career Development Path'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isViewOnly && (
            <Alert severity="info" sx={{ mb: 3 }}>
              This career path has been completed and cannot be modified.
            </Alert>
          )}
          
          <Grid container spacing={2}>
            {isProgressUpdateOnly ? (
              // Progress Update Form
              <>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {careerPath.currentRole} → {careerPath.targetRole}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Current Progress: {careerPath.progress}%
                    </Typography>
                    <Slider
                      value={formData.progress}
                      onChange={handleProgressChange}
                      aria-labelledby="progress-slider"
                      valueLabelDisplay="auto"
                      step={5}
                      marks
                      min={0}
                      max={100}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status || 'active'}
                      onChange={handleChange}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="on_hold">On Hold</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            ) : (
              // Full Career Path Form
              <>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }} disabled={isViewOnly || user?.role === 'employee'}>
                    <InputLabel>Employee</InputLabel>
                    <Select
                      name="employeeId"
                      value={formData.employeeId || ''}
                      onChange={handleChange}
                      label="Employee"
                      error={!!errors.employeeId}
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.employeeId && (
                      <Typography variant="caption" color="error">
                        {errors.employeeId}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }} disabled={isViewOnly}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status || 'active'}
                      onChange={handleChange}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="on_hold">On Hold</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Role"
                    name="currentRole"
                    value={formData.currentRole || ''}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    error={!!errors.currentRole}
                    helperText={errors.currentRole}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Target Role"
                    name="targetRole"
                    value={formData.targetRole || ''}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    error={!!errors.targetRole}
                    helperText={errors.targetRole}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Estimated Timeframe (months)"
                    name="estimatedTimeframe"
                    type="number"
                    value={formData.estimatedTimeframe || ''}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    error={!!errors.estimatedTimeframe}
                    helperText={errors.estimatedTimeframe}
                    sx={{ mb: 2 }}
                    InputProps={{ inputProps: { min: 1, max: 60 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Progress: {formData.progress || 0}%
                    </Typography>
                    <Slider
                      value={formData.progress || 0}
                      onChange={handleProgressChange}
                      aria-labelledby="progress-slider"
                      valueLabelDisplay="auto"
                      step={5}
                      marks
                      min={0}
                      max={100}
                      disabled={isViewOnly || !careerPath}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Required Skills */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Required Skills
                  </Typography>
                  {errors.requiredSkills && (
                    <Typography variant="caption" color="error">
                      {errors.requiredSkills}
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      disabled={isViewOnly}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddSkill}
                      disabled={isViewOnly || !newSkill.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {formData.requiredSkills?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={isViewOnly ? undefined : () => handleRemoveSkill(skill)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {formData.requiredSkills?.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No skills added yet
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {/* Required Training */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Required Training
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Training"
                      value={newTraining}
                      onChange={(e) => setNewTraining(e.target.value)}
                      disabled={isViewOnly}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddTraining}
                      disabled={isViewOnly || !newTraining.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {formData.requiredTraining?.map((training, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">• {training}</Typography>
                        {!isViewOnly && (
                          <IconButton size="small" onClick={() => handleRemoveTraining(training)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                    {formData.requiredTraining?.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No training requirements added yet
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {careerPath && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Created: {careerPath.createdAt ? format(new Date(careerPath.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {careerPath.updatedAt ? format(new Date(careerPath.updatedAt), 'MMM dd, yyyy') : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {isViewOnly ? 'Close' : 'Cancel'}
        </Button>
        {!isViewOnly && (
          <Button variant="contained" onClick={handleSubmit}>
            {isProgressUpdateOnly 
              ? 'Update Progress' 
              : careerPath 
                ? 'Update Career Path' 
                : 'Create Career Path'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CareerPathDialog;

export { CareerPathDialog };