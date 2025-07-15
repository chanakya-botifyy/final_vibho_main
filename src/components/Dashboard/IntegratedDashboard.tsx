import React from 'react';
import { Grid, Box, Typography, Card, CardContent, CardHeader, Alert } from '@mui/material';
import { DashboardCards } from './DashboardCards';
import { RecentActivity } from './RecentActivity';
import { AttendanceChart } from './AttendanceChart';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useLeaveStore } from '../../store/useLeaveStore';
import { usePayrollStore } from '../../store/usePayrollStore';
import { useAuthStore } from '../../store/useAuthStore';

interface IntegratedDashboardProps {
  onNavigate: (section: string) => void;
}

export const IntegratedDashboard: React.FC<IntegratedDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const { currentSession, getAttendanceStats } = useAttendanceStore();
  const { getLeaveStats } = useLeaveStore();
  const { getPayrollStats } = usePayrollStore();
  
  // State for async statistics
  const [attendanceStats, setAttendanceStats] = React.useState<any>(null);
  const [leaveStats, setLeaveStats] = React.useState<any>(null);
  const [payrollStats, setPayrollStats] = React.useState<any>(null);

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  
  // Load statistics asynchronously
  React.useEffect(() => {
    const loadStats = async () => {
      if (user) {
        try {
          const attendanceData = await getAttendanceStats(user.id);
          setAttendanceStats(attendanceData);
          
          const leaveData = await getLeaveStats(user.id);
          setLeaveStats(leaveData);
        } catch (error) {
          console.error('Error loading user stats:', error);
        }
      }
      
      try {
        const payrollData = await getPayrollStats();
        setPayrollStats(payrollData);
      } catch (error) {
        console.error('Error loading payroll stats:', error);
      }
    };
    
    loadStats();
  }, [user, getAttendanceStats, getLeaveStats, getPayrollStats]);

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
          Welcome back, {user?.name}! Here's what's happening in your organization today.
        </Typography>
      </Box>

      {/* Current Session Alert */}
      {currentSession.isCheckedIn && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You're currently checked in since {currentSession.checkInTime?.toLocaleTimeString()}
          {currentSession.isOnBreak && ' (On Break)'}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Dashboard Cards with Real Data */}
        <Grid item xs={12}>
          <DashboardCards 
            onCardClick={handleCardClick}
            employeeCount={employees.length}
            attendanceRate={attendanceStats?.attendanceRate || 0}
            pendingLeaves={leaveStats?.pendingRequests || 0}
            payrollProcessed={payrollStats?.totalNetPay || 0}
          />
        </Grid>

        {/* Attendance Chart */}
        <Grid item xs={12} md={8}>
          <AttendanceChart />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <RecentActivity />
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="My Quick Stats" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Attendance Rate</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {(attendanceStats?.attendanceRate || 0).toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Leave Balance</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {leaveStats?.balance?.annual.remaining || 0} days
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Pending Requests</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {leaveStats?.pendingRequests || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">This Month Hours</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {(attendanceStats?.totalHours || 0).toFixed(1)}h
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Department Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Department Overview" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['Engineering', 'HR', 'Sales', 'Marketing'].map((dept) => {
                  const deptEmployees = employees.filter(e => e.companyInfo.department === dept);
                  return (
                    <Box key={dept} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{dept}</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {deptEmployees.length} employees
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="System Health" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Employee Data</Typography>
                  <Typography variant="body2" fontWeight="medium" color="success.main">
                    ✓ Synced
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Attendance System</Typography>
                  <Typography variant="body2" fontWeight="medium" color="success.main">
                    ✓ Online
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Payroll Engine</Typography>
                  <Typography variant="body2" fontWeight="medium" color="success.main">
                    ✓ Ready
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Leave Management</Typography>
                  <Typography variant="body2" fontWeight="medium" color="success.main">
                    ✓ Active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};