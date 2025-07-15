import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People,
  PersonAdd,
  TrendingUp,
  TrendingDown,
  AccessTime,
  CalendarMonth,
  AccountBalance,
  Work,
  MoreVert
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    label: string;
  };
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  onClick
}) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8]
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              width: 48,
              height: 48
            }}
          >
            {icon}
          </Avatar>
          <Tooltip title="More options">
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
          {value}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend.value > 0 ? (
              <TrendingUp color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDown color="error" sx={{ mr: 1 }} />
            )}
            <Typography
              variant="body2"
              color={trend.value > 0 ? 'success.main' : 'error.main'}
              fontWeight="medium"
            >
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardCardsProps {
  onCardClick: (cardType: string) => void;
  employeeCount?: number;
  attendanceRate?: number;
  pendingLeaves?: number;
  payrollProcessed?: number;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({ 
  onCardClick, 
  employeeCount = 1247,
  attendanceRate = 94.2,
  pendingLeaves = 47,
  payrollProcessed = 2100000
}) => {
  const cards = [
    {
      title: 'Total Employees',
      value: employeeCount.toLocaleString(),
      subtitle: 'Active workforce',
      icon: <People />,
      color: 'primary' as const,
      trend: { value: 8.2, label: 'from last month' },
      type: 'employees'
    },
    {
      title: 'New Hires',
      value: '23',
      subtitle: 'This month',
      icon: <PersonAdd />,
      color: 'success' as const,
      trend: { value: 12.5, label: 'from last month' },
      type: 'recruitment'
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate.toFixed(1)}%`,
      subtitle: 'This week',
      icon: <AccessTime />,
      color: 'warning' as const,
      trend: { value: -2.1, label: 'from last week' },
      type: 'attendance'
    },
    {
      title: 'Leave Requests',
      value: pendingLeaves.toString(),
      subtitle: 'Pending approval',
      icon: <CalendarMonth />,
      color: 'secondary' as const,
      trend: { value: 15.3, label: 'from last week' },
      type: 'leave'
    },
    {
      title: 'Payroll Processed',
      value: `₹${(payrollProcessed / 1000000).toFixed(1)}M`,
      subtitle: 'This month',
      icon: <AccountBalance />,
      color: 'success' as const,
      trend: { value: 5.7, label: 'from last month' },
      type: 'payroll'
    },
    {
      title: 'Open Positions',
      value: '12',
      subtitle: 'Across departments',
      icon: <Work />,
      color: 'error' as const,
      trend: { value: -8.4, label: 'from last month' },
      type: 'recruitment'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <DashboardCard
            {...card}
            onClick={() => onCardClick(card.type)}
          />
        </Grid>
      ))}
    </Grid>
  );
};