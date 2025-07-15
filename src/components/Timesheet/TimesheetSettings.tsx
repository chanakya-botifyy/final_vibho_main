import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Settings,
  Notifications,
  Email,
  Schedule,
  Save,
  AccessTime,
  CalendarMonth,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useAuthStore } from '../../store/useAuthStore';

const TimesheetSettings: React.FC = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Timesheet settings state
  const [settings, setSettings] = useState({
    general: {
      defaultWorkHours: 8,
      workWeekDays: [1, 2, 3, 4, 5], // Monday to Friday
      allowWeekendEntries: false,
      allowFutureEntries: false,
      requireTaskDescription: true,
      autoSubmitTimesheet: false,
      lockPastTimesheets: true,
      timesheetPeriod: 'weekly' as 'weekly' | 'biweekly' | 'monthly'
    },
    approvals: {
      requireManagerApproval: true,
      autoApproveAfterDays: 0,
      allowSelfApproval: false,
      escalateAfterDays: 3,
      notifyOnRejection: true,
      allowResubmission: true
    },
    notifications: {
      reminderDay: 5, // Friday
      reminderTime: '16:00',
      sendEmailReminders: true,
      sendPushNotifications: true,
      notifyManager: true,
      notifyOnApproval: true
    },
    display: {
      defaultView: 'weekly' as 'daily' | 'weekly' | 'monthly',
      showWeekends: false,
      showHolidays: true,
      highlightOvertime: true,
      colorCodeProjects: true
    }
  });

  const handleSettingChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setSaveSuccess(false);
  };

  const handleSaveSettings = () => {
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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timesheet Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure timesheet behavior, approvals, and notifications.
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary" display="inline">
            Saving settings...
          </Typography>
        </Box>
      )}

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="General Settings" 
              avatar={<Settings color="primary" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Default Work Hours"
                    type="number"
                    value={settings.general.defaultWorkHours}
                    onChange={(e) => handleSettingChange('general', 'defaultWorkHours', Number(e.target.value))}
                    InputProps={{ inputProps: { min: 1, max: 24 } }}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Timesheet Period</InputLabel>
                    <Select
                      value={settings.general.timesheetPeriod}
                      onChange={(e) => handleSettingChange('general', 'timesheetPeriod', e.target.value)}
                      label="Timesheet Period"
                    >
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="biweekly">Bi-weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.allowWeekendEntries}
                        onChange={(e) => handleSettingChange('general', 'allowWeekendEntries', e.target.checked)}
                      />
                    }
                    label="Allow Weekend Entries"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.allowFutureEntries}
                        onChange={(e) => handleSettingChange('general', 'allowFutureEntries', e.target.checked)}
                      />
                    }
                    label="Allow Future Entries"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.requireTaskDescription}
                        onChange={(e) => handleSettingChange('general', 'requireTaskDescription', e.target.checked)}
                      />
                    }
                    label="Require Task Description"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.autoSubmitTimesheet}
                        onChange={(e) => handleSettingChange('general', 'autoSubmitTimesheet', e.target.checked)}
                      />
                    }
                    label="Auto-submit Timesheet at Period End"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.lockPastTimesheets}
                        onChange={(e) => handleSettingChange('general', 'lockPastTimesheets', e.target.checked)}
                      />
                    }
                    label="Lock Past Timesheets"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Approval Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Approval Settings" 
              avatar={<CheckCircle color="primary" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.approvals.requireManagerApproval}
                        onChange={(e) => handleSettingChange('approvals', 'requireManagerApproval', e.target.checked)}
                      />
                    }
                    label="Require Manager Approval"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Auto-approve After Days (0 = never)"
                    type="number"
                    value={settings.approvals.autoApproveAfterDays}
                    onChange={(e) => handleSettingChange('approvals', 'autoApproveAfterDays', Number(e.target.value))}
                    InputProps={{ inputProps: { min: 0, max: 30 } }}
                    margin="normal"
                    disabled={!settings.approvals.requireManagerApproval}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Escalate After Days"
                    type="number"
                    value={settings.approvals.escalateAfterDays}
                    onChange={(e) => handleSettingChange('approvals', 'escalateAfterDays', Number(e.target.value))}
                    InputProps={{ inputProps: { min: 0, max: 30 } }}
                    margin="normal"
                    disabled={!settings.approvals.requireManagerApproval}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.approvals.allowSelfApproval}
                        onChange={(e) => handleSettingChange('approvals', 'allowSelfApproval', e.target.checked)}
                      />
                    }
                    label="Allow Self-approval (for managers)"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.approvals.notifyOnRejection}
                        onChange={(e) => handleSettingChange('approvals', 'notifyOnRejection', e.target.checked)}
                      />
                    }
                    label="Notify on Rejection"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.approvals.allowResubmission}
                        onChange={(e) => handleSettingChange('approvals', 'allowResubmission', e.target.checked)}
                      />
                    }
                    label="Allow Resubmission of Rejected Timesheets"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Notification Settings" 
              avatar={<Notifications color="primary" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Reminder Day</InputLabel>
                    <Select
                      value={settings.notifications.reminderDay}
                      onChange={(e) => handleSettingChange('notifications', 'reminderDay', Number(e.target.value))}
                      label="Reminder Day"
                    >
                      <MenuItem value={1}>Monday</MenuItem>
                      <MenuItem value={2}>Tuesday</MenuItem>
                      <MenuItem value={3}>Wednesday</MenuItem>
                      <MenuItem value={4}>Thursday</MenuItem>
                      <MenuItem value={5}>Friday</MenuItem>
                      <MenuItem value={6}>Saturday</MenuItem>
                      <MenuItem value={0}>Sunday</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Reminder Time"
                    type="time"
                    value={settings.notifications.reminderTime}
                    onChange={(e) => handleSettingChange('notifications', 'reminderTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.sendEmailReminders}
                        onChange={(e) => handleSettingChange('notifications', 'sendEmailReminders', e.target.checked)}
                      />
                    }
                    label="Send Email Reminders"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.sendPushNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'sendPushNotifications', e.target.checked)}
                      />
                    }
                    label="Send Push Notifications"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.notifyManager}
                        onChange={(e) => handleSettingChange('notifications', 'notifyManager', e.target.checked)}
                      />
                    }
                    label="Notify Manager on Submission"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.notifyOnApproval}
                        onChange={(e) => handleSettingChange('notifications', 'notifyOnApproval', e.target.checked)}
                      />
                    }
                    label="Notify on Approval"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Display Settings" 
              avatar={<CalendarMonth color="primary" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Default View</InputLabel>
                    <Select
                      value={settings.display.defaultView}
                      onChange={(e) => handleSettingChange('display', 'defaultView', e.target.value)}
                      label="Default View"
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.display.showWeekends}
                        onChange={(e) => handleSettingChange('display', 'showWeekends', e.target.checked)}
                      />
                    }
                    label="Show Weekends"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.display.showHolidays}
                        onChange={(e) => handleSettingChange('display', 'showHolidays', e.target.checked)}
                      />
                    }
                    label="Show Holidays"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.display.highlightOvertime}
                        onChange={(e) => handleSettingChange('display', 'highlightOvertime', e.target.checked)}
                      />
                    }
                    label="Highlight Overtime"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.display.colorCodeProjects}
                        onChange={(e) => handleSettingChange('display', 'colorCodeProjects', e.target.checked)}
                      />
                    }
                    label="Color Code Projects"
                  />
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
          onClick={handleSaveSettings}
          disabled={isLoading}
          size="large"
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default TimesheetSettings;