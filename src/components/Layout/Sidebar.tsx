import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Avatar,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Dashboard,
  People,
  WhatsApp,
  AccessTime,
  CalendarMonth,
  Receipt,
  Description,
  Work,
  AccountBalance,
  Settings,
  Domain,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  PersonAdd,
  Analytics,
  Assignment,
  MonetizationOn,
  AttachMoney,
  Payments,
  Inventory,
  Support,
  Notifications,
  Business,
  Group,
  Person,
  Assessment,
  SupervisorAccount,
  Subscriptions,
  CompareArrows,
  Timeline
} from '@mui/icons-material';
import Psychology from '../Psychology';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { hasPermission } from '../../utils/permissions';
import { PERMISSIONS } from '../../utils/permissions';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  selectedItem: string;
  onItemSelect: (item: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
  permissions?: string[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
    permissions: [PERMISSIONS.DASHBOARD_GLOBAL, PERMISSIONS.DASHBOARD_HR, PERMISSIONS.DASHBOARD_TEAM, PERMISSIONS.DASHBOARD_PERSONAL]
  },
  {
    id: 'super-admin-dashboard',
    label: 'Super Admin',
    icon: <SupervisorAccount />,
    roles: [UserRole.SUPER_ADMIN], 
    permissions: [PERMISSIONS.SUPER_ADMIN_ACCESS]
  },
  {
    id: 'subscription-plans',
    label: 'Subscription Plans',
    icon: <Subscriptions />,
    roles: [UserRole.SUPER_ADMIN], 
    permissions: [PERMISSIONS.SUBSCRIPTION_MANAGE]
  },
  {
    id: 'tenant-management',
    label: 'Tenant Management',
    icon: <Domain />,
    roles: [UserRole.SUPER_ADMIN],
    permissions: [PERMISSIONS.TENANT_MANAGE]
  },
  {
    id: 'workflow-diagram',
    label: 'Workflow Diagram',
    icon: <Timeline />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
    permissions: [PERMISSIONS.DASHBOARD_GLOBAL, PERMISSIONS.DASHBOARD_HR, PERMISSIONS.DASHBOARD_TEAM, PERMISSIONS.DASHBOARD_PERSONAL]
  },
  {
    id: 'employees',
    label: 'Employee Management',
    icon: <People />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
    permissions: [PERMISSIONS.EMPLOYEE_READ_ALL, PERMISSIONS.EMPLOYEE_READ_TEAM],
    children: [
      {
        id: 'employee-list',
        label: 'Employee Directory',
        icon: <Group />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
        permissions: [PERMISSIONS.EMPLOYEE_READ_ALL, PERMISSIONS.EMPLOYEE_READ_TEAM]
      },
      {
        id: 'employee-onboarding',
        label: 'Onboarding',
        icon: <PersonAdd />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.EMPLOYEE_CREATE]
      },
      {
        id: 'employee-analytics',
        label: 'Analytics',
        icon: <Analytics />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
        permissions: [PERMISSIONS.REPORTS_ALL, PERMISSIONS.REPORTS_HR, PERMISSIONS.REPORTS_TEAM]
      }
    ]
  },
  {
    id: 'hr-management',
    label: 'HR Management',
    icon: <Business />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR], 
    permissions: [PERMISSIONS.DASHBOARD_HR],
    children: [
      {
        id: 'hr-dashboard',
        label: 'HR Dashboard',
        icon: <Dashboard />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.DASHBOARD_HR]
      },
      {
        id: 'master-data',
        label: 'Master Data',
        icon: <Settings />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.SYSTEM_CONFIGURE]
      },
      {
        id: 'workflow-management',
        label: 'Workflows',
        icon: <Assignment />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.SYSTEM_CONFIGURE]
      }
    ]
  },
  {
    id: 'employee-self-service',
    label: 'Self Service',
    icon: <Person />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE], 
    permissions: [PERMISSIONS.EMPLOYEE_READ_SELF],
    children: [
      {
        id: 'employee-dashboard',
        label: 'My Dashboard',
        icon: <Dashboard />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.DASHBOARD_PERSONAL]
      },
      {
        id: 'employee-profile',
        label: 'My Profile',
        icon: <Person />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.EMPLOYEE_READ_SELF]
      },
      {
        id: 'employee-attendance',
        label: 'My Attendance',
        icon: <AccessTime />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.ATTENDANCE_VIEW_SELF]
      },
      {
        id: 'employee-leave',
        label: 'My Leave',
        icon: <CalendarMonth />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.LEAVE_VIEW_SELF]
      },
      {
        id: 'employee-payroll',
        label: 'My Payroll',
        icon: <AccountBalance />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.PAYROLL_VIEW_SELF]
      },
      {
        id: 'employee-documents',
        label: 'My Documents',
        icon: <Description />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.EMPLOYEE_READ_SELF]
      }
    ]
  },
  {
    id: 'admin-management',
    label: 'System Administration',
    icon: <Settings />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN], 
    permissions: [PERMISSIONS.SYSTEM_CONFIGURE],
    children: [
      {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        icon: <Dashboard />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
        permissions: [PERMISSIONS.DASHBOARD_GLOBAL]
      },
      {
        id: 'user-management',
        label: 'User Management',
        icon: <Group />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
        permissions: [PERMISSIONS.SYSTEM_MANAGE_USERS]
      },
      {
        id: 'system-configuration',
        label: 'System Configuration',
        icon: <Settings />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
        permissions: [PERMISSIONS.SYSTEM_CONFIGURE]
      }
    ]
  },
  {
    id: 'team-management',
    label: 'Team Management',
    icon: <Group />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER], 
    permissions: [PERMISSIONS.DASHBOARD_TEAM],
    children: [
      {
        id: 'manager-dashboard',
        label: 'Manager Dashboard',
        icon: <Dashboard />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
        permissions: [PERMISSIONS.DASHBOARD_TEAM]
      },
      {
        id: 'team-calendar',
        label: 'Team Calendar',
        icon: <CalendarMonth />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER],
        permissions: [PERMISSIONS.LEAVE_VIEW_TEAM]
      }
    ]
  },
  {
    id: 'attendance',
    label: 'Attendance & Time',
    icon: <AccessTime />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
    permissions: [PERMISSIONS.ATTENDANCE_VIEW_ALL, PERMISSIONS.ATTENDANCE_VIEW_TEAM, PERMISSIONS.ATTENDANCE_VIEW_SELF]
  },
  {
    id: 'leave',
    label: 'Leave Management',
    icon: <CalendarMonth />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE], 
    permissions: [PERMISSIONS.LEAVE_VIEW_ALL, PERMISSIONS.LEAVE_VIEW_TEAM, PERMISSIONS.LEAVE_VIEW_SELF] 
  },
  {
    id: 'timesheet',
    label: 'Timesheet',
    icon: <AccessTime />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE], 
    permissions: [PERMISSIONS.TIMESHEET_VIEW_ALL, PERMISSIONS.TIMESHEET_VIEW_TEAM, PERMISSIONS.TIMESHEET_VIEW_SELF, PERMISSIONS.TIMESHEET_SUBMIT, PERMISSIONS.TIMESHEET_APPROVE]
    ,
    children: [
      {
        id: 'timesheet',
        label: 'My Timesheet',
        icon: <AccessTime />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.TIMESHEET_VIEW_SELF, PERMISSIONS.TIMESHEET_SUBMIT]
      },
      {
        id: 'timesheet-projects',
        label: 'Projects & Tasks',
        icon: <Work />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.TIMESHEET_VIEW_ALL]
      },
      {
        id: 'timesheet-settings',
        label: 'Timesheet Settings',
        icon: <Settings />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.SYSTEM_CONFIGURE]
      },
      {
        id: 'timesheet-analytics',
        label: 'Timesheet Analytics',
        icon: <Analytics />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
        permissions: [PERMISSIONS.REPORTS_ALL, PERMISSIONS.REPORTS_HR, PERMISSIONS.REPORTS_TEAM]
      }
    ]
  },
  {
    id: 'ai-features',
    label: 'AI Features',
    icon: <Psychology />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE], 
    permissions: [PERMISSIONS.DASHBOARD_GLOBAL, PERMISSIONS.DASHBOARD_HR, PERMISSIONS.DASHBOARD_TEAM, PERMISSIONS.DASHBOARD_PERSONAL],
    children: [
      {
        id: 'ai-dashboard',
        label: 'AI Dashboard',
        icon: <Dashboard />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.DASHBOARD_GLOBAL, PERMISSIONS.DASHBOARD_HR, PERMISSIONS.DASHBOARD_TEAM, PERMISSIONS.DASHBOARD_PERSONAL]
      },
      {
        id: 'ai-resume-parser',
        label: 'Resume Parser',
        icon: <Description />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.RECRUITMENT_MANAGE]
      },
      {
        id: 'ai-attendance-analytics',
        label: 'Attendance Analytics',
        icon: <AccessTime />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
        permissions: [PERMISSIONS.ATTENDANCE_VIEW_ALL, PERMISSIONS.ATTENDANCE_VIEW_TEAM]
      },
      {
        id: 'ai-payroll-prediction',
        label: 'Payroll Prediction',
        icon: <MonetizationOn />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.PAYROLL_PROCESS, PERMISSIONS.PAYROLL_VIEW_ALL]
      },
      {
        id: 'ai-document-processor',
        label: 'Document Processor',
        icon: <Description />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.EMPLOYEE_READ_ALL]
      },
      {
        id: 'ai-chatbot',
        label: 'AI Assistant',
        icon: <Psychology />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.DASHBOARD_GLOBAL, PERMISSIONS.DASHBOARD_HR, PERMISSIONS.DASHBOARD_TEAM, PERMISSIONS.DASHBOARD_PERSONAL]
      },
      {
        id: 'ai-performance-insights',
        label: 'Performance Insights',
        icon: <Assessment />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
        permissions: [PERMISSIONS.PERFORMANCE_VIEW_ALL, PERMISSIONS.PERFORMANCE_VIEW_TEAM]
      },
      {
        id: 'ai-recruitment-assistant',
        label: 'Recruitment Assistant',
        icon: <Work />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.RECRUITMENT_MANAGE]
      },
      {
        id: 'ai-feature-config',
        label: 'Feature Configuration',
        icon: <Settings />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
        permissions: [PERMISSIONS.SYSTEM_CONFIGURE]
      },
      {
        id: 'ai-model-management',
        label: 'Model Management',
        icon: <Storage />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
        permissions: [PERMISSIONS.SYSTEM_CONFIGURE]
      },
      {
        id: 'ai-usage-analytics',
        label: 'Usage Analytics',
        icon: <Analytics />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.REPORTS_ALL, PERMISSIONS.REPORTS_HR]
      }
    ]
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: <MonetizationOn />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
    permissions: [PERMISSIONS.PAYROLL_PROCESS, PERMISSIONS.PAYROLL_VIEW_ALL],
    children: [
      {
        id: 'payroll',
        label: 'Global Payroll',
        icon: <AccountBalance />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.PAYROLL_PROCESS, PERMISSIONS.PAYROLL_VIEW_ALL]
      },
      {
        id: 'payroll-admin',
        label: 'Payroll Admin',
        icon: <Payments />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.PAYROLL_PROCESS]
      },
      {
        id: 'payroll-whatsapp',
        label: 'WhatsApp Service',
        icon: <WhatsApp />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
        permissions: [PERMISSIONS.PAYROLL_PROCESS]
      }
    ]
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: <Work />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR],
    permissions: [PERMISSIONS.RECRUITMENT_MANAGE]
  },
  {
    id: 'assets',
    label: 'Asset Management',
    icon: <Inventory />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
    permissions: [PERMISSIONS.ASSET_MANAGE, PERMISSIONS.ASSET_VIEW_ALL, PERMISSIONS.ASSET_VIEW_TEAM]
  },
  {
    id: 'performance',
    label: 'Performance Management',
    icon: <Assessment />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE], 
    permissions: [PERMISSIONS.PERFORMANCE_VIEW_ALL, PERMISSIONS.PERFORMANCE_VIEW_TEAM, PERMISSIONS.PERFORMANCE_VIEW_SELF],
    children: [
      {
        id: 'performance-management',
        label: 'Performance Management',
        icon: <Assessment />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.PERFORMANCE_VIEW_ALL, PERMISSIONS.PERFORMANCE_VIEW_TEAM, PERMISSIONS.PERFORMANCE_VIEW_SELF]
      }
    ]
  },
  {
    id: 'claims',
    label: 'Claims & Expenses',
    icon: <Receipt />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE], 
    permissions: [PERMISSIONS.CLAIMS_VIEW_ALL, PERMISSIONS.CLAIMS_VIEW_TEAM, PERMISSIONS.CLAIMS_VIEW_SELF],
    children: [
      {
        id: 'claims-management',
        label: 'Claims Management',
        icon: <Receipt />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.CLAIMS_VIEW_ALL, PERMISSIONS.CLAIMS_VIEW_TEAM, PERMISSIONS.CLAIMS_VIEW_SELF]
      }
    ]
  },
  {
    id: 'documents',
    label: 'Document Management',
    icon: <Description />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE], 
    permissions: [PERMISSIONS.EMPLOYEE_READ_ALL, PERMISSIONS.EMPLOYEE_READ_TEAM, PERMISSIONS.EMPLOYEE_READ_SELF],
    children: [
      {
        id: 'documents-management',
        label: 'Document Management',
        icon: <Description />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.EMPLOYEE_READ_ALL, PERMISSIONS.EMPLOYEE_READ_TEAM, PERMISSIONS.EMPLOYEE_READ_SELF]
      }
    ]
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: <Assignment />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER], 
    permissions: [PERMISSIONS.REPORTS_ALL, PERMISSIONS.REPORTS_HR, PERMISSIONS.REPORTS_TEAM],
    children: [
      {
        id: 'reports-analytics',
        label: 'Reports & Analytics',
        icon: <Assignment />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER],
        permissions: [PERMISSIONS.REPORTS_ALL, PERMISSIONS.REPORTS_HR, PERMISSIONS.REPORTS_TEAM]
      }
    ]
  },
  {
    id: 'support',
    label: 'Support & Ticketing',
    icon: <Support />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE], 
    permissions: [PERMISSIONS.SUPPORT_MANAGE_ALL, PERMISSIONS.SUPPORT_MANAGE_TEAM, PERMISSIONS.SUPPORT_CREATE],
    children: [
      {
        id: 'support-ticketing',
        label: 'Support & Ticketing',
        icon: <Support />,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR, UserRole.MANAGER, UserRole.EMPLOYEE],
        permissions: [PERMISSIONS.SUPPORT_MANAGE_ALL, PERMISSIONS.SUPPORT_MANAGE_TEAM, PERMISSIONS.SUPPORT_CREATE]
      }
    ]
  },
  {
    id: 'settings',
    label: 'Configuration',
    icon: <Settings />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    permissions: [PERMISSIONS.SYSTEM_CONFIGURE]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, selectedItem, onItemSelect }) => {
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const hasAccess = (roles: UserRole[]) => {
    return user && roles.includes(user.role);
  };
  // Check if user has permission to access a menu item
  const hasMenuPermission = (item: MenuItem) => {
    if (!user) return false;
    
    // If the item has specific permissions, check those
    if (item.permissions) {
      return item.permissions.some(permission => 
        hasPermission(user.role, permission)
      );
    }
    
    // Otherwise, fall back to role-based check
    return hasAccess(item.roles);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!hasMenuPermission(item)) return null;

    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedItem === item.id}
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.id);
              } else {
                onItemSelect(item.id);
              }
            }}
            sx={{ pl: 2 + level * 2 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: 'primary.main',
            mr: 2
          }}
        >
          <Business />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" noWrap>
            VibhoHCM
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Enterprise HRMS
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <ChevronLeft />
        </IconButton>
      </Box>
      
      <Divider />
      
      {user && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              src={user.avatar}
              sx={{ width: 32, height: 32, mr: 2 }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.designation}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      
      <Divider />
      
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map(item => renderMenuItem(item))}
      </List>
    </Drawer>
  );
};