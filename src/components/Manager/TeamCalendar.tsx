import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
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
  Paper,
  Divider
} from '@mui/material';
import {
  CalendarMonth,
  Event,
  Schedule,
  Person,
  Group,
  Add,
  Visibility,
  Edit,
  Delete,
  AccessTime,
  LocationOn,
  VideoCall,
  Phone
} from '@mui/icons-material';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'leave' | 'holiday' | 'deadline' | 'review';
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  attendees: string[];
  location?: string;
  description?: string;
  isAllDay: boolean;
  color: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'available' | 'busy' | 'on_leave' | 'offline';
}

export const TeamCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [eventDialogOpen, setEventDialogOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = React.useState({
    title: '',
    type: 'meeting' as const,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    attendees: [] as string[],
    location: '',
    description: '',
    isAllDay: false
  });

  // Mock team members
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'available'
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'busy'
    },
    {
      id: '3',
      name: 'Carol Davis',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      status: 'on_leave'
    }
  ];

  // Mock calendar events
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Standup',
      type: 'meeting',
      startDate: new Date(),
      startTime: '09:00',
      endTime: '09:30',
      attendees: ['1', '2', '3'],
      location: 'Conference Room A',
      description: 'Daily team standup meeting',
      isAllDay: false,
      color: '#1976d2'
    },
    {
      id: '2',
      title: 'Carol Davis - Annual Leave',
      type: 'leave',
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      attendees: ['3'],
      description: 'Annual leave for family vacation',
      isAllDay: true,
      color: '#ff9800'
    },
    {
      id: '3',
      title: 'Performance Review - Alice',
      type: 'review',
      startDate: addDays(new Date(), 3),
      startTime: '14:00',
      endTime: '15:00',
      attendees: ['1'],
      location: 'Manager Office',
      description: 'Q4 2023 performance review',
      isAllDay: false,
      color: '#4caf50'
    },
    {
      id: '4',
      title: 'Project Alpha Deadline',
      type: 'deadline',
      startDate: addDays(new Date(), 5),
      attendees: ['1', '2'],
      description: 'Final deliverables due',
      isAllDay: true,
      color: '#f44336'
    }
  ];

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'leave': return 'warning';
      case 'holiday': return 'info';
      case 'deadline': return 'error';
      case 'review': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'on_leave': return 'error';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.startDate, date) || 
      (event.endDate && date >= event.startDate && date <= event.endDate)
    );
  };

  const handleCreateEvent = () => {
    console.log('Creating event:', newEvent);
    setEventDialogOpen(false);
    setNewEvent({
      title: '',
      type: 'meeting',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      attendees: [],
      location: '',
      description: '',
      isAllDay: false
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Team Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage team schedules, meetings, and important events.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar View */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={`Week of ${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`}
              action={
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setEventDialogOpen(true)}
                >
                  Schedule Event
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={1}>
                {weekDays.map((day) => (
                  <Grid item xs key={day.toISOString()}>
                    <Paper
                      sx={{
                        p: 1,
                        minHeight: 120,
                        bgcolor: isToday(day) ? 'primary.50' : 'background.paper',
                        border: isToday(day) ? '2px solid' : '1px solid',
                        borderColor: isToday(day) ? 'primary.main' : 'divider'
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={isToday(day) ? 'bold' : 'normal'}
                        color={isToday(day) ? 'primary.main' : 'text.primary'}
                        gutterBottom
                      >
                        {format(day, 'EEE dd')}
                      </Typography>
                      
                      {getEventsForDate(day).map((event) => (
                        <Chip
                          key={event.id}
                          label={event.title}
                          size="small"
                          color={getEventTypeColor(event.type)}
                          variant="outlined"
                          sx={{
                            mb: 0.5,
                            fontSize: '0.7rem',
                            height: 20,
                            display: 'block',
                            '& .MuiChip-label': {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }
                          }}
                          onClick={() => setSelectedEvent(event)}
                        />
                      ))}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Availability & Events */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Team Availability */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Team Availability" />
                <CardContent>
                  <List>
                    {teamMembers.map((member) => (
                      <ListItem key={member.id}>
                        <ListItemIcon>
                          <Avatar src={member.avatar} sx={{ width: 32, height: 32 }}>
                            {member.name.charAt(0)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={member.name}
                          secondary={member.status.replace('_', ' ').toUpperCase()}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            label={member.status.replace('_', ' ')}
                            color={getStatusColor(member.status)}
                            size="small"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Today's Events */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Today's Events" />
                <CardContent>
                  <List>
                    {getEventsForDate(new Date()).map((event) => (
                      <ListItem key={event.id}>
                        <ListItemIcon>
                          <Event color={getEventTypeColor(event.type)} />
                        </ListItemIcon>
                        <ListItemText
                          primary={event.title}
                          secondary={
                            event.isAllDay 
                              ? 'All Day' 
                              : `${event.startTime} - ${event.endTime}`
                          }
                        />
                      </ListItem>
                    ))}
                    {getEventsForDate(new Date()).length === 0 && (
                      <ListItem>
                        <ListItemText
                          primary="No events today"
                          secondary="Your schedule is clear"
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Quick Actions" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="outlined" startIcon={<Schedule />} fullWidth>
                      Schedule 1:1 Meeting
                    </Button>
                    <Button variant="outlined" startIcon={<Group />} fullWidth>
                      Team Meeting
                    </Button>
                    <Button variant="outlined" startIcon={<CalendarMonth />} fullWidth>
                      Block Calendar Time
                    </Button>
                    <Button variant="outlined" startIcon={<Event />} fullWidth>
                      View Leave Calendar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Create Event Dialog */}
      <Dialog
        open={eventDialogOpen}
        onClose={() => setEventDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Schedule New Event</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                    label="Event Type"
                  >
                    <MenuItem value="meeting">Meeting</MenuItem>
                    <MenuItem value="review">Performance Review</MenuItem>
                    <MenuItem value="deadline">Deadline</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Attendees</InputLabel>
                  <Select
                    multiple
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, attendees: e.target.value as string[] }))}
                    label="Attendees"
                  >
                    {teamMembers.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateEvent}>
            Schedule Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Type:</strong> {selectedEvent.type.replace('_', ' ').toUpperCase()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Date:</strong> {format(selectedEvent.startDate, 'MMM dd, yyyy')}
                </Typography>
                {!selectedEvent.isAllDay && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}
                  </Typography>
                )}
                {selectedEvent.location && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Location:</strong> {selectedEvent.location}
                  </Typography>
                )}
                <Typography variant="body2" gutterBottom>
                  <strong>Attendees:</strong> {selectedEvent.attendees.length} people
                </Typography>
                {selectedEvent.description && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Description:</strong> {selectedEvent.description}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
              <Button variant="outlined" startIcon={<Edit />}>
                Edit Event
              </Button>
              <Button variant="outlined" startIcon={<VideoCall />}>
                Join Meeting
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};