import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { hasPermission } from '../../utils/permissions';
import { PERMISSIONS } from '../../utils/permissions';

interface MainLayoutProps {
  children: React.ReactNode;
  selectedItem: string;
  onItemSelect: (item: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, selectedItem, onItemSelect }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { user } = useAuthStore();

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Check if user has access to the selected item
  React.useEffect(() => {
    if (user && selectedItem) {
      // Map menu items to required permissions
      const itemPermissionMap: Record<string, string> = {
        'dashboard': PERMISSIONS.DASHBOARD_PERSONAL,
        'admin-dashboard': PERMISSIONS.DASHBOARD_GLOBAL,
        'hr-dashboard': PERMISSIONS.DASHBOARD_HR,
        'manager-dashboard': PERMISSIONS.DASHBOARD_TEAM,
        'employee-dashboard': PERMISSIONS.DASHBOARD_PERSONAL,
        'employee-list': PERMISSIONS.EMPLOYEE_READ_ALL,
        'leave': PERMISSIONS.LEAVE_VIEW_ALL,
        'employee-leave': PERMISSIONS.LEAVE_VIEW_SELF,
        // Add more mappings as needed
      };
      
      // If the selected item requires a permission the user doesn't have,
      // redirect to a default page they can access
      const requiredPermission = itemPermissionMap[selectedItem];
      if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
        // Find a default page based on user role
        switch (user.role) {
          case 'admin':
            onItemSelect('admin-dashboard');
            break;
          case 'hr':
            onItemSelect('hr-dashboard');
            break;
          case 'manager':
            onItemSelect('manager-dashboard');
            break;
          case 'employee':
            onItemSelect('employee-dashboard');
            break;
          default:
            onItemSelect('dashboard');
        }
      }
    }
  }, [user, selectedItem, onItemSelect]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header onMenuToggle={handleMenuToggle} sidebarOpen={sidebarOpen} />
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        selectedItem={selectedItem}
        onItemSelect={onItemSelect}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(sidebarOpen && {
            marginLeft: 0,
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          })
        }}
      >
        {children}
      </Box>
    </Box>
  );
};