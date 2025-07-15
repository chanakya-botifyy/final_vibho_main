import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { DashboardCards } from './DashboardCards';
import { RecentActivity } from './RecentActivity';
import { AttendanceChart } from './AttendanceChart';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const handleCardClick = (cardType: string) => {
    onNavigate(cardType);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening in your organization today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Dashboard Cards */}
        <Grid item xs={12}>
          <DashboardCards onCardClick={handleCardClick} />
        </Grid>

        {/* Attendance Chart */}
        <Grid item xs={12} md={8}>
          <AttendanceChart />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
};