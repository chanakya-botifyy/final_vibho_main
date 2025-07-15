import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  MoreVert,
  TrendingUp
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '@mui/material/styles';

const weeklyData = [
  { name: 'Mon', attendance: 92, onTime: 85, late: 7, absent: 8 },
  { name: 'Tue', attendance: 94, onTime: 88, late: 6, absent: 6 },
  { name: 'Wed', attendance: 91, onTime: 84, late: 7, absent: 9 },
  { name: 'Thu', attendance: 96, onTime: 90, late: 6, absent: 4 },
  { name: 'Fri', attendance: 89, onTime: 82, late: 7, absent: 11 },
  { name: 'Sat', attendance: 87, onTime: 80, late: 7, absent: 13 },
  { name: 'Sun', attendance: 85, onTime: 78, late: 7, absent: 15 }
];

const monthlyData = [
  { name: 'Week 1', attendance: 93, onTime: 87, late: 6, absent: 7 },
  { name: 'Week 2', attendance: 95, onTime: 89, late: 6, absent: 5 },
  { name: 'Week 3', attendance: 91, onTime: 85, late: 6, absent: 9 },
  { name: 'Week 4', attendance: 94, onTime: 88, late: 6, absent: 6 }
];

export const AttendanceChart: React.FC = () => {
  const theme = useTheme();
  const [period, setPeriod] = React.useState<'week' | 'month'>('week');

  const data = period === 'week' ? weeklyData : monthlyData;

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: 'week' | 'month'
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Attendance Analytics"
        subtitle="Real-time attendance tracking and trends"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ToggleButtonGroup
              value={period}
              exclusive
              onChange={handlePeriodChange}
              size="small"
            >
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
            </ToggleButtonGroup>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h4" component="div" fontWeight="bold">
              94.2%
            </Typography>
            <TrendingUp color="success" />
            <Typography variant="body2" color="success.main" fontWeight="medium">
              +2.1%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Average attendance rate this {period}
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="attendance" 
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              name="Total Attendance"
            />
            <Line 
              type="monotone" 
              dataKey="onTime" 
              stroke={theme.palette.success.main}
              strokeWidth={2}
              name="On Time"
            />
            <Line 
              type="monotone" 
              dataKey="late" 
              stroke={theme.palette.warning.main}
              strokeWidth={2}
              name="Late"
            />
            <Line 
              type="monotone" 
              dataKey="absent" 
              stroke={theme.palette.error.main}
              strokeWidth={2}
              name="Absent"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};