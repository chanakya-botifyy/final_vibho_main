import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  Add,
  Send,
  CalendarMonth,
  Download,
  Info
} from '@mui/icons-material';
import { format, addDays, isSameDay } from 'date-fns';
import { useTimesheetStore } from '../../store/useTimesheetStore';
import { useAuthStore } from '../../store/useAuthStore';
import * as timesheetApi from '../../api/timesheet';
import TimesheetEntry from './TimesheetEntry';

const WeeklyTimesheet: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    entries, 
    currentWeek, 
    setCurrentWeek, 
    nextWeek, 
    previousWeek, 
    fetchEntries,
    submitForApproval,
    isLoading,
    error
  } = useTimesheetStore();
  
  const [showAddEntry, setShowAddEntry] = useState<Date | null>(null);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [comments, setComments] = useState('');
  
  // Fetch entries for the current week on mount
  useEffect(() => {
    if (user?.id) {
      fetchEntries(currentWeek.startDate, currentWeek.endDate, user.id);
    }
  }, [currentWeek, fetchEntries, user?.id]);
  
  // Generate array of days for the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(currentWeek.startDate, i)
  );
  
  // Get entries for a specific day
  const getEntriesForDay = (date: Date) => {
    return entries.filter(entry => isSameDay(new Date(entry.date), date));
  };
  
  // Calculate total hours for the week
  const totalWeekHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  
  // Calculate total hours for each day
  const dailyHours = weekDays.map(day => 
    getEntriesForDay(day).reduce((sum, entry) => sum + entry.hours, 0)
  );
  
  const handleAddEntry = (date: Date) => {
    setShowAddEntry(date);
  };
  
  const handleCancelAdd = () => {
    setShowAddEntry(null);
  };
  
  const handleSubmitTimesheet = async () => {
    if (user?.id) {
      try {
        await timesheetApi.submitTimesheetForApproval({
          weekStartDate: format(currentWeek.startDate, 'yyyy-MM-dd'),
          comments
        });
        
        // Refresh entries after submission
        await fetchEntries(currentWeek.startDate, currentWeek.endDate, user.id);
        
        setSubmitDialogOpen(false);
        setComments('');
      } catch (error) {
        console.error('Error submitting timesheet:', error);
      }
    }
  };
  
  // Check if all weekdays have entries
  const hasEntriesForAllWeekdays = weekDays
    .filter(day => day.getDay() !== 0 && day.getDay() !== 6) // Exclude weekends
    .every(day => getEntriesForDay(day).length > 0);
  
  // Check if any entries are in draft status
  const hasDraftEntries = entries.some(entry => entry.status === 'draft');
  
  // Determine if timesheet can be submitted
  const canSubmitTimesheet = hasEntriesForAllWeekdays && hasDraftEntries;
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Weekly Timesheet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage your time spent on projects and tasks.
        </Typography>
      </Box>
      
      {/* Week Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<NavigateBefore />}
          onClick={previousWeek}
        >
          Previous Week
        </Button>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">
            {format(currentWeek.startDate, 'MMM d')} - {format(currentWeek.endDate, 'MMM d, yyyy')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Hours: {totalWeekHours}
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          endIcon={<NavigateNext />}
          onClick={nextWeek}
        >
          Next Week
        </Button>
      </Box>
      
      {/* Submit Timesheet Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => setSubmitDialogOpen(true)}
          disabled={!canSubmitTimesheet}
        >
          Submit Timesheet
        </Button>
      </Box>
      
      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Timesheet Grid */}
      <Grid container spacing={3}>
        {weekDays.map((day, index) => {
          const dayEntries = getEntriesForDay(day);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const isToday = isSameDay(day, new Date());
          
          return (
            <Grid item xs={12} key={index}>
              <Paper 
                sx={{ 
                  p: 2, 
                  bgcolor: isWeekend ? 'action.hover' : (isToday ? 'primary.50' : 'background.paper'),
                  borderLeft: isToday ? '4px solid' : 'none',
                  borderColor: 'primary.main'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {format(day, 'EEEE, MMMM d')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1">
                      Total: {dailyHours[index]} hours
                    </Typography>
                    
                    {!isWeekend && (
                      <Tooltip title="Add Time Entry">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleAddEntry(day)}
                          disabled={showAddEntry !== null}
                        >
                          <Add />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {isWeekend ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    Weekend
                  </Typography>
                ) : dayEntries.length === 0 && showAddEntry !== day ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      No time entries for this day
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => handleAddEntry(day)}
                      size="small"
                    >
                      Add Time Entry
                    </Button>
                  </Box>
                ) : (
                  <>
                    {/* Existing entries */}
                    {dayEntries.map(entry => (
                      <TimesheetEntry
                        key={entry.id}
                        entryId={entry.id}
                        date={day}
                        initialData={{
                          projectId: entry.projectId,
                          taskId: entry.taskId,
                          hours: entry.hours,
                          description: entry.description,
                          billable: entry.billable
                        }}
                        onSave={() => fetchEntries(currentWeek.startDate, currentWeek.endDate, user?.id)}
                        readOnly={entry.status !== 'draft'}
                      />
                    ))}
                    
                    {/* New entry form */}
                    {showAddEntry && isSameDay(showAddEntry, day) && (
                      <TimesheetEntry
                        date={day}
                        onSave={() => {
                          fetchEntries(currentWeek.startDate, currentWeek.endDate, user?.id);
                          setShowAddEntry(null);
                        }}
                        onCancel={handleCancelAdd}
                      />
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Submit Timesheet Dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Timesheet for Approval</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              You are about to submit your timesheet for the week of {format(currentWeek.startDate, 'MMM d')} - {format(currentWeek.endDate, 'MMM d, yyyy')} with a total of {totalWeekHours} hours.
            </Alert>
            
            <TextField
              fullWidth
              label="Comments (Optional)"
              multiline
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitTimesheet}
            disabled={isLoading}
          >
            Submit Timesheet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WeeklyTimesheet;