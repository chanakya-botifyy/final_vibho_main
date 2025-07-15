import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Badge
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  PlayArrow,
  Stop,
  Edit,
  CheckCircle,
  Cancel,
  Schedule,
  TrendingUp,
  Warning,
  Home,
  Business,
  MyLocation,
  History,
  Analytics,
  CalendarMonth,
  Timer,
  Pause,
  FastForward,
  Refresh,
  Download,
  Upload,
  Notifications,
  Person,
  Group
} from '@mui/icons-material';
import { format, differenceInHours, differenceInMinutes, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO } from 'date-fns';

export const AttendanceTracker: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTracking, setIsTracking] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartTracking = () => {
    setIsTracking(true);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Attendance Tracker
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Time Tracking" />
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color="primary">
                  {format(currentTime, 'HH:mm:ss')}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {format(currentTime, 'EEEE, MMMM d, yyyy')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                {!isTracking ? (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayArrow />}
                    onClick={handleStartTracking}
                    size="large"
                  >
                    Clock In
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Stop />}
                    onClick={handleStopTracking}
                    size="large"
                  >
                    Clock Out
                  </Button>
                )}
              </Box>
              
              {isTracking && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Chip
                    icon={<AccessTime />}
                    label="Currently Tracking"
                    color="success"
                    variant="outlined"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Today's Summary" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText
                    primary="Hours Worked"
                    secondary="8h 30m"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary="Office"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle />
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary="On Time"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};