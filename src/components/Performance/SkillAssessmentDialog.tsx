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
  Rating,
  Divider,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { PERMISSIONS } from '../../utils/permissions';
import { usePermission } from '../../hooks/usePermission';

interface SkillAssessment {
  id?: string;
  employeeId: string;
  skillName: string;
  category: 'technical' | 'soft' | 'leadership';
  currentLevel: number; // 1-5
  targetLevel: number; // 1-5
  lastAssessedDate?: Date;
  assessedBy?: string;
  comments?: string;
}

interface SkillAssessmentDialogProps {
  open: boolean;
  onClose: () => void;
  assessment: SkillAssessment | null;
  onSave: (assessment: Partial<SkillAssessment>) => void;
}

const SkillAssessmentDialog: React.FC<SkillAssessmentDialogProps> = ({
  open,
  onClose,
  assessment,
  onSave
}) => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { can } = usePermission();
  
  const [formData, setFormData] = useState<Partial<SkillAssessment>>({
    employeeId: '',
    skillName: '',
    category: 'technical',
    currentLevel: 1,
    targetLevel: 3,
    comments: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with assessment data if editing
  useEffect(() => {
    if (assessment) {
      setFormData({
        ...assessment
      });
    } else {
      // Reset form for new assessment
      setFormData({
        employeeId: user?.role === 'employee' ? user.id : '',
        skillName: '',
        category: 'technical',
        currentLevel: 1,
        targetLevel: 3,
        comments: ''
      });
    }
    setErrors({});
  }, [assessment, open, user]);
  
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
  
  const handleCurrentLevelChange = (_: React.SyntheticEvent, value: number | null) => {
    setFormData(prev => ({ ...prev, currentLevel: value || 1 }));
  };
  
  const handleTargetLevelChange = (_: React.SyntheticEvent, value: number | null) => {
    setFormData(prev => ({ ...prev, targetLevel: value || 1 }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required';
    }
    
    if (!formData.skillName) {
      newErrors.skillName = 'Skill name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Add assessor information
      const assessmentData = {
        ...formData,
        assessedBy: user?.name || 'System',
        lastAssessedDate: new Date()
      };
      
      onSave(assessmentData);
    }
  };
  
  const isViewOnly = user?.role === 'employee' && !can(PERMISSIONS.PERFORMANCE_UPDATE_SELF);
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {assessment ? 'Edit Skill Assessment' : 'New Skill Assessment'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isViewOnly && (
            <Alert severity="info" sx={{ mb: 3 }}>
              You can view but not modify this skill assessment.
            </Alert>
          )}
          
          <Grid container spacing={2}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }} disabled={isViewOnly || user?.role === 'employee' || !!assessment}>
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
              <FormControl fullWidth sx={{ mb: 2 }} disabled={isViewOnly || !!assessment}>
                <InputLabel>Skill Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category || 'technical'}
                  onChange={handleChange}
                  label="Skill Category"
                  error={!!errors.category}
                >
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="soft">Soft Skills</MenuItem>
                  <MenuItem value="leadership">Leadership</MenuItem>
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skill Name"
                name="skillName"
                value={formData.skillName || ''}
                onChange={handleChange}
                disabled={isViewOnly || !!assessment}
                error={!!errors.skillName}
                helperText={errors.skillName}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Skill Levels */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Current Proficiency Level
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    name="currentLevel"
                    value={formData.currentLevel || 1}
                    onChange={handleCurrentLevelChange}
                    max={5}
                    disabled={isViewOnly}
                  />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {formData.currentLevel}/5
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  1 = Beginner, 3 = Proficient, 5 = Expert
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Target Proficiency Level
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    name="targetLevel"
                    value={formData.targetLevel || 3}
                    onChange={handleTargetLevelChange}
                    max={5}
                    disabled={isViewOnly}
                  />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {formData.targetLevel}/5
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comments"
                name="comments"
                multiline
                rows={3}
                value={formData.comments || ''}
                onChange={handleChange}
                disabled={isViewOnly}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {assessment && assessment.lastAssessedDate && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last assessed by: {assessment.assessedBy} on {format(new Date(assessment.lastAssessedDate), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
              </Grid>
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
            {assessment ? 'Update Assessment' : 'Save Assessment'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SkillAssessmentDialog;

export { SkillAssessmentDialog };