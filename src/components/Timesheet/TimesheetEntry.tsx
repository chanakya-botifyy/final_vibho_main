import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Paper
} from '@mui/material';
import { Save, Delete, Edit, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import * as timesheetApi from '../../api/timesheet';

interface TimesheetEntryProps {
  entryId?: string;
  date: Date;
  initialData?: {
    projectId: string;
    taskId: string;
    hours: number;
    description: string;
    billable: boolean;
  };
  onSave?: () => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

const TimesheetEntry: React.FC<TimesheetEntryProps> = ({
  entryId,
  date,
  initialData,
  onSave,
  onCancel,
  readOnly = false
}) => {
  const { 
    projects, 
    tasks, 
    submitEntry, 
    updateEntry, 
    deleteEntry, 
    fetchProjects, 
    fetchTasks,
    isLoading 
  } = useTimesheetStore();
  
  const [formData, setFormData] = useState({
    projectId: initialData?.projectId || '',
    taskId: initialData?.taskId || '',
    hours: initialData?.hours || 0,
    description: initialData?.description || '',
    billable: initialData?.billable ?? true
  });
  
  const [isEditing, setIsEditing] = useState(!entryId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Fetch projects on mount if not already loaded
  useEffect(() => {
    const loadProjects = async () => {
      try {
        if (projects.length === 0) {
          const projectsData = await timesheetApi.getTimesheetProjects();
          // Update store with projects
          // This would be handled by the store's fetchProjects action
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
    
    loadProjects();
  }, [projects.length, fetchProjects]);
  
  // Fetch tasks when project is selected
  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (formData.projectId && !tasks[formData.projectId]) {
          const tasksData = await timesheetApi.getProjectTasks(formData.projectId);
          // Update store with tasks
          // This would be handled by the store's fetchTasks action
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
    
    loadTasks();
  }, [formData.projectId, tasks, fetchTasks]);
  
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
  
  const handleBillableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, billable: e.target.checked }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }
    
    if (!formData.taskId) {
      newErrors.taskId = 'Task is required';
    }
    
    if (!formData.hours) {
      newErrors.hours = 'Hours are required';
    } else if (formData.hours <= 0) {
      newErrors.hours = 'Hours must be greater than 0';
    } else if (formData.hours > 24) {
      newErrors.hours = 'Hours cannot exceed 24';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      if (entryId) {
        await updateEntry(entryId, formData);
      } else {
        await submitEntry({
          employeeId: 'current-user', // This would be the actual user ID in a real app
          date,
          ...formData
        });
      }
      
      setIsEditing(false);
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving timesheet entry:', error);
    }
  };
  
  const handleDelete = async () => {
    if (entryId) {
      try {
        await deleteEntry(entryId);
        if (onSave) onSave(); // Refresh parent component
      } catch (error) {
        console.error('Error deleting timesheet entry:', error);
      }
    } else if (onCancel) {
      onCancel();
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    if (entryId) {
      setIsEditing(false);
      // Reset form data to initial values
      if (initialData) {
        setFormData({
          projectId: initialData.projectId,
          taskId: initialData.taskId,
          hours: initialData.hours,
          description: initialData.description,
          billable: initialData.billable
        });
      }
    } else if (onCancel) {
      onCancel();
    }
  };
  
  // Get available tasks for the selected project
  const availableTasks = formData.projectId ? tasks[formData.projectId] || [] : [];
  
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        {!isEditing ? (
          // View mode
          <>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Project</Typography>
              <Typography variant="body1">
                {projects.find(p => p.id === formData.projectId)?.name || 'Unknown Project'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">Task</Typography>
              <Typography variant="body1">
                {availableTasks.find(t => t.id === formData.taskId)?.name || 'Unknown Task'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">Hours</Typography>
              <Typography variant="body1">{formData.hours}</Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">Billable</Typography>
              <Typography variant="body1">{formData.billable ? 'Yes' : 'No'}</Typography>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {!readOnly && (
                <>
                  <Tooltip title="Edit">
                    <IconButton onClick={handleEdit} size="small">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={handleDelete} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Description</Typography>
              <Typography variant="body1">{formData.description}</Typography>
            </Grid>
          </>
        ) : (
          // Edit mode
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.projectId}>
                <InputLabel>Project</InputLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  label="Project"
                >
                  {projects.map(project => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.projectId && (
                  <Typography variant="caption" color="error">
                    {errors.projectId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.taskId}>
                <InputLabel>Task</InputLabel>
                <Select
                  name="taskId"
                  value={formData.taskId}
                  onChange={handleChange}
                  label="Task"
                  disabled={!formData.projectId || availableTasks.length === 0}
                >
                  {availableTasks.map(task => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.taskId && (
                  <Typography variant="caption" color="error">
                    {errors.taskId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hours"
                name="hours"
                type="number"
                value={formData.hours}
                onChange={handleChange}
                inputProps={{ step: 0.5, min: 0, max: 24 }}
                error={!!errors.hours}
                helperText={errors.hours}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.billable}
                    onChange={handleBillableChange}
                    name="billable"
                  />
                }
                label="Billable"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<Save />}
                disabled={isLoading}
              >
                Save
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default TimesheetEntry;