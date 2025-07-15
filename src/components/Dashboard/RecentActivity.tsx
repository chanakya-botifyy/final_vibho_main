import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import {
  PersonAdd,
  AccessTime,
  CalendarMonth,
  Receipt,
  Work,
  CheckCircle,
  Cancel,
  Pending,
  MoreVert
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'hire' | 'leave' | 'attendance' | 'expense' | 'recruitment';
  title: string;
  description: string;
  timestamp: Date;
  status: 'approved' | 'pending' | 'rejected';
  user: {
    name: string;
    avatar?: string;
  };
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'hire':
      return <PersonAdd />;
    case 'leave':
      return <CalendarMonth />;
    case 'attendance':
      return <AccessTime />;
    case 'expense':
      return <Receipt />;
    case 'recruitment':
      return <Work />;
    default:
      return <PersonAdd />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'hire':
      return 'success';
    case 'leave':
      return 'warning';
    case 'attendance':
      return 'primary';
    case 'expense':
      return 'info';
    case 'recruitment':
      return 'secondary';
    default:
      return 'primary';
  }
};

const getStatusIcon = (status: Activity['status']) => {
  switch (status) {
    case 'approved':
      return <CheckCircle color="success" />;
    case 'rejected':
      return <Cancel color="error" />;
    case 'pending':
      return <Pending color="warning" />;
    default:
      return <Pending color="warning" />;
  }
};

const getStatusColor = (status: Activity['status']) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'warning';
  }
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'hire',
    title: 'New Employee Onboarded',
    description: 'John Smith joined as Software Engineer',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'approved',
    user: {
      name: 'John Smith',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  },
  {
    id: '2',
    type: 'leave',
    title: 'Leave Request Submitted',
    description: 'Sarah Johnson requested 3 days vacation leave',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'pending',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  },
  {
    id: '3',
    type: 'attendance',
    title: 'Late Check-in Alert',
    description: 'Michael Chen checked in 15 minutes late',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: 'approved',
    user: {
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  },
  {
    id: '4',
    type: 'expense',
    title: 'Expense Claim Submitted',
    description: 'Emily Rodriguez submitted travel expenses of $345',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    status: 'pending',
    user: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  },
  {
    id: '5',
    type: 'recruitment',
    title: 'New Job Application',
    description: 'Alex Thompson applied for Marketing Manager position',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    status: 'pending',
    user: {
      name: 'Alex Thompson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  }
];

export const RecentActivity: React.FC = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Activity"
        subtitle="Latest updates from your organization"
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <List>
          {mockActivities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem 
                alignItems="flex-start" 
                sx={{ 
                  px: 0,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={activity.user.avatar}
                    sx={{ 
                      bgcolor: `${getActivityColor(activity.type)}.main`,
                      width: 40,
                      height: 40
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {activity.title}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(activity.status)}
                        label={activity.status}
                        size="small"
                        color={getStatusColor(activity.status)}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < mockActivities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};