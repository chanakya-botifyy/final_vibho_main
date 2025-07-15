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
  Rating,
  Box,
  Divider,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { PERMISSIONS } from '../../utils/permissions';
import { usePermission } from '../../hooks/usePermission';

interface PerformanceReview {
  id?: string;
  employeeId: string;
  employeeName?: string;
  reviewPeriod: string;
  appraisalDate: Date;
  currentDesignation: string;
  newDesignation: string;
  currentSalary: number;
  newSalary: number;
  percentageHike: number;
  rating: number;
  hrComments: string;
  managerComments: string;
  employeeComments: string;
  status: 'draft' | 'in_progress' | 'completed';
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PerformanceReviewDialogProps {
  open: boolean;
  onClose: () => void;
  review: PerformanceReview | null;
  onSave: (review: Partial<PerformanceReview>) => void;
}

const PerformanceReviewDialog: React.FC<PerformanceReviewDialogProps> = ({
  open,
  onClose,
  review,
  onSave
}) => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const { can } = usePermission();
  
  const [formData, setFormData] = useState<Partial<PerformanceReview>>({
    employeeId: '',
    reviewPeriod: 'Q1 2024',
    appraisalDate: new Date(),
    currentDesignation: '',
    newDesignation: '',
    currentSalary: 0,
    newSalary: 0,
    percentageHike: 0,
    rating: 3,
    hrComments: '',
    managerComments: '',
    employeeComments: '',
    status: 'draft'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with review data if editing
  useEffect(() => {
    if (review) {
      setFormData({
        ...review,
        appraisalDate: review.appraisalDate instanceof Date 
          ? review.appraisalDate 
          : new Date(review.appraisalDate)
      });
    } else {
      // Reset form for new review
      setFormData({
        employeeId: '',
        reviewPeriod: 'Q1 2024',
        appraisalDate: new Date(),
        currentDesignation: '',
        newDesignation: '',
        currentSalary: 0,
        newSalary: 0,
        percentageHike: 0,
        rating: 3,
        hrComments: '',
        managerComments: '',
        employeeComments: '',
        status: 'draft'
      });
    }
    setErrors({});
  }, [review, open]);
  
  // Calculate percentage hike when salary changes
  useEffect(() => {
    if (formData.currentSalary && formData.newSalary) {
      const currentSalary = Number(formData.currentSalary);
      const newSalary = Number(formData.newSalary);
      
      if (currentSalary > 0 && newSalary > 0) {
        const percentageHike = ((newSalary - currentSalary) / currentSalary) * 100;
        setFormData(prev => ({
          ...prev,
          percentageHike: parseFloat(percentageHike.toFixed(2))
        }));
      }
    }
  }, [formData.currentSalary, formData.newSalary]);
  
  // When employee is selected, auto-fill current designation
  useEffect(() => {
    if (formData.employeeId) {
      const employee = employees.find(e => e.id === formData.employeeId);
      if (employee) {
        setFormData(prev => ({
          ...prev,
          currentDesignation: employee.companyInfo.designation,
          employeeName: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`
        }));
      }
    }
  }, [formData.employeeId, employees]);
  
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
  
  const handleRatingChange = (_: React.SyntheticEvent, value: number | null) => {
    setFormData(prev => ({ ...prev, rating: value || 0 }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required';
    }
    
    if (!formData.reviewPeriod) {
      newErrors.reviewPeriod = 'Review period is required';
    }
    
    if (!formData.appraisalDate) {
      newErrors.appraisalDate = 'Appraisal date is required';
    }
    
    if (!formData.currentDesignation) {
      newErrors.currentDesignation = 'Current designation is required';
    }
    
    if (formData.status === 'completed' && !formData.rating) {
      newErrors.rating = 'Rating is required for completed reviews';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  const isViewOnly = review?.status === 'completed' || 
                     (user?.role !== 'admin' && user?.role !== 'hr' && 
                      !(user?.role === 'manager' && can(PERMISSIONS.PERFORMANCE_UPDATE_TEAM)));
  
  const reviewPeriods = [
    'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023',
    'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024',
    'Annual 2023', 'Annual 2024'
  ];
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {review ? 'Performance Review Details' : 'Create Performance Review'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {isViewOnly && review?.status === 'completed' && (
            <Alert severity="info" sx={{ mb: 3 }}>
              This performance review has been completed and cannot be modified.
            </Alert>
          )}
          
          <Grid container spacing={2}>
            {/* Basic Review Information */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }} disabled={isViewOnly}>
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
                <InputLabel>Review Period</InputLabel>
                <Select
                  name="reviewPeriod"
                  value={formData.reviewPeriod || ''}
                  onChange={handleChange}
                  label="Review Period"
                  error={!!errors.reviewPeriod}
                >
                  {reviewPeriods.map((period) => (
                    <MenuItem key={period} value={period}>
                      {period}
                    </MenuItem>
                  ))}
                </Select>
                {errors.reviewPeriod && (
                  <Typography variant="caption" color="error">
                    {errors.reviewPeriod}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Appraisal Date"
                name="appraisalDate"
                type="date"
                value={formData.appraisalDate ? format(new Date(formData.appraisalDate), 'yyyy-MM-dd') : ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                disabled={isViewOnly}
                error={!!errors.appraisalDate}
                helperText={errors.appraisalDate}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Rating:
                </Typography>
                <Rating
                  name="rating"
                  value={formData.rating || 0}
                  precision={0.5}
                  onChange={handleRatingChange}
                  disabled={isViewOnly}
                />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {formData.rating ? formData.rating.toFixed(1) : '0.0'}/5
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Designation and Salary Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Designation"
                name="currentDesignation"
                value={formData.currentDesignation || ''}
                onChange={handleChange}
                disabled={isViewOnly}
                error={!!errors.currentDesignation}
                helperText={errors.currentDesignation}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Designation"
                name="newDesignation"
                value={formData.newDesignation || ''}
                onChange={handleChange}
                disabled={isViewOnly}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Current Salary"
                name="currentSalary"
                type="number"
                value={formData.currentSalary || ''}
                onChange={handleChange}
                disabled={isViewOnly}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="New Salary"
                name="newSalary"
                type="number"
                value={formData.newSalary || ''}
                onChange={handleChange}
                disabled={isViewOnly}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Percentage Hike"
                value={formData.percentageHike ? `${formData.percentageHike}%` : '0%'}
                disabled
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            {/* Comments Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Feedback & Comments
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="HR Comments"
                name="hrComments"
                multiline
                rows={3}
                value={formData.hrComments || ''}
                onChange={handleChange}
                disabled={isViewOnly || !(user?.role === 'admin' || user?.role === 'hr')}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Manager Comments"
                name="managerComments"
                multiline
                rows={3}
                value={formData.managerComments || ''}
                onChange={handleChange}
                disabled={isViewOnly || !(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager')}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employee Comments"
                name="employeeComments"
                multiline
                rows={3}
                value={formData.employeeComments || ''}
                onChange={handleChange}
                disabled={isViewOnly || (user?.role !== 'employee' && user?.id !== formData.employeeId)}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {review && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Created by: {review.createdBy} on {format(new Date(review.createdAt || new Date()), 'MMM dd, yyyy')}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {format(new Date(review.updatedAt || new Date()), 'MMM dd, yyyy')}
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
            {review ? 'Update Review' : 'Create Review'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PerformanceReviewDialog;

export { PerformanceReviewDialog };