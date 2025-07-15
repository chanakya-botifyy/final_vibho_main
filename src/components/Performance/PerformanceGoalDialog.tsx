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
  Divider,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { PERMISSIONS } from '../../utils/permissions';
import { usePermission } from '../../hooks/usePermission';

interface PerformanceGoal {
  id?: string;
  employeeId: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'project' | 'learning';
  startDate: Date;
  targetDate: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  metrics: string;
  feedback?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PerformanceGoalDialogProps {
  open: boolean;
  onClose: () => void;
  goal: PerformanceGoal | null;
  onSave: (goal: Partial<PerformanceGoal>) => void;
  isUpdateProgress?: boolean;
}

const PerformanceGoalDialog: React.FC<PerformanceGoalDialogProps> = ({
  open,
  onClose,
  goal,
  onSave,
  isUpdateProgress = false
}) => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { can } = usePermission();
  
  const [formData, setFormData] = useState<Partial<PerformanceGoal>>({
    employeeId: '',
    title: '',
    description: '',
    category: 'professional',
    startDate: new Date(),
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    progress: 0,
    status: 'not_started',
    priority: 'medium',
    metrics: '',
    feedback: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with goal data if editing
  useEffect(() => {
    if (goal) {
      setFormData({
        ...goal,
        startDate: goal.startDate instanceof Date 
          ? goal.startDate 
          : new Date(goal.startDate),
        targetDate: goal.targetDate instanceof Date 
          ? goal.targetDate 
          : new Date(goal.targetDate)
      });
    } else {
      // Reset form for new goal
      setFormData({
        employeeId: user?.role === 'employee' ? user.id : '',
        title: '',
        description: '',
        category: 'professional',
        startDate: new Date(),
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        progress: 0,
        status: 'not_started',
        priority: 'medium',
        metrics: '',
        feedback: ''
      });
    }
    setErrors({});
  }, [goal, open, user]);
  
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
      status: progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started'
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required';
    }
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    }
    
    if (formData.startDate && formData.targetDate && 
        new Date(formData.startDate) > new Date(formData.targetDate)) {
      newErrors.targetDate = 'Target date must be after start date';
    }
    
    if (!formData.metrics) {
      newErrors.metrics = 'Success metrics are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const isViewOnly = !isUpdateProgress && goal?.status === 'completed';
  
  const isProgressUpdateOnly = isUpdateProgress && goal;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isProgressUpdateOnly 
          ? 'Update Goal Progress' 
          : goal 
            ? 'Performance Goal Details' 
            : 'Create Performance Goal'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isViewOnly && (
            <Alert severity="info" sx={{ mb: 3 }}>
              This goal has been completed and cannot be modified.
            </Alert>
          )}
          
          <Grid container spacing={2}>
            {isProgressUpdateOnly ? (
              // Progress Update Form
              <>
                <Grid item xs={12}>
                  <Typography variant="h6">{goal.title}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {goal.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Current Progress: {goal.progress}%
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
                  <TextField
                    fullWidth
                    label="Feedback / Comments"
                    name="feedback"
                    multiline
                    rows={3}
                    value={formData.feedback || ''}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </>
            ) : (
              // Full Goal Form
              <>
                {/* Basic Goal Information */}
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
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category || 'professional'}
                      onChange={handleChange}
                      label="Category"
                    >
                      <MenuItem value="professional">Professional</MenuItem>
                      <MenuItem value="personal">Personal</MenuItem>
                      <MenuItem value="project">Project</MenuItem>
                      <MenuItem value="learning">Learning & Development</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Goal Title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    error={!!errors.title}
                    helperText={errors.title}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={3}
                    value={formData.description || ''}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate ? format(new Date(formData.startDate), 'yyyy-MM-dd') : ''}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={isViewOnly}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Target Date"
                    name="targetDate"
                    type="date"
                    value={formData.targetDate ? format(new Date(formData.targetDate), 'yyyy-MM-dd') : ''}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={isViewOnly}
                    error={!!errors.targetDate}
                    helperText={errors.targetDate}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }} disabled={isViewOnly}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={formData.priority || 'medium'}
                      onChange={handleChange}
                      label="Priority"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }} disabled={isViewOnly}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status || 'not_started'}
                      onChange={handleChange}
                      label="Status"
                    >
                      <MenuItem value="not_started">Not Started</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Success Metrics"
                    name="metrics"
                    multiline
                    rows={2}
                    placeholder="Define how success will be measured for this goal"
                    value={formData.metrics || ''}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    error={!!errors.metrics}
                    helperText={errors.metrics}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                {!goal && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      Progress tracking will be enabled after the goal is created.
                    </Alert>
                  </Grid>
                )}
                
                {goal && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Progress Tracking
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Current Progress: {formData.progress}%
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
                          disabled={isViewOnly}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Feedback / Comments"
                        name="feedback"
                        multiline
                        rows={3}
                        value={formData.feedback || ''}
                        onChange={handleChange}
                        disabled={isViewOnly}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </>
                )}
                
                {goal && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Created: {goal.createdAt ? format(new Date(goal.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {goal.updatedAt ? format(new Date(goal.updatedAt), 'MMM dd, yyyy') : 'N/A'}
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
              : goal 
                ? 'Update Goal' 
                : 'Create Goal'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PerformanceGoalDialog;

export { PerformanceGoalDialog };