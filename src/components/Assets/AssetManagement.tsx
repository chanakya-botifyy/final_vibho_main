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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Paper,
  Tab,
  Tabs,
  Badge,
  QRCodeCanvas
} from '@mui/material';
import {
  Add,
  Inventory,
  QrCode,
  Assignment,
  Build,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Schedule,
  Person,
  Business,
  Download
} from '@mui/icons-material';
import { format, addDays, differenceInDays } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { usePermission } from '../../contexts/PermissionContext';
import { PERMISSIONS } from '../../utils/permissions';
import PermissionGate from '../common/PermissionGate';

interface Asset {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  qrCode: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedDate?: Date;
  location: string;
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  status: 'available' | 'assigned' | 'in_repair' | 'disposed';
  purchaseDate: Date;
  purchasePrice: number;
  warranty: Date;
  vendor: string;
  description: string;
  maintenanceHistory: MaintenanceRecord[];
}

interface MaintenanceRecord {
  id: string;
  date: Date;
  description: string;
  cost: number;
  vendor: string;
  nextMaintenanceDate?: Date;
  type: 'preventive' | 'corrective' | 'emergency';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`asset-tabpanel-${index}`}
      aria-labelledby={`asset-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AssetManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { can } = usePermission();
  const [tabValue, setTabValue] = React.useState(0);
  const [assetDialogOpen, setAssetDialogOpen] = React.useState(false);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = React.useState(false);
  const [qrDialogOpen, setQrDialogOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const [newAsset, setNewAsset] = React.useState({
    name: '',
    category: '',
    serialNumber: '',
    location: '',
    condition: 'new' as const,
    purchasePrice: '',
    vendor: '',
    description: '',
    warrantyMonths: '12'
  });
  const [newMaintenance, setNewMaintenance] = React.useState({
    description: '',
    cost: '',
    vendor: '',
    type: 'preventive' as const,
    nextMaintenanceMonths: '6'
  });

  // Mock assets data
  const assets: Asset[] = [
    {
      id: '1',
      name: 'MacBook Pro 16"',
      category: 'Computer Equipment',
      serialNumber: 'MBP2023001',
      qrCode: 'QR001',
      assignedTo: user?.id,
      assignedToName: user?.name,
      assignedDate: new Date('2024-01-15'),
      location: 'New York Office',
      condition: 'good',
      status: 'assigned',
      purchaseDate: new Date('2024-01-10'),
      purchasePrice: 2499,
      warranty: new Date('2025-01-10'),
      vendor: 'Apple Inc.',
      description: 'MacBook Pro with M3 chip, 32GB RAM, 1TB SSD',
      maintenanceHistory: [
        {
          id: '1',
          date: new Date('2024-01-20'),
          description: 'Initial setup and software installation',
          cost: 0,
          vendor: 'IT Department',
          type: 'preventive'
        }
      ]
    },
    {
      id: '2',
      name: 'Dell Monitor 27"',
      category: 'Computer Equipment',
      serialNumber: 'DM2024001',
      qrCode: 'QR002',
      assignedTo: user?.id,
      assignedToName: user?.name,
      assignedDate: new Date('2024-01-15'),
      location: 'New York Office',
      condition: 'new',
      status: 'assigned',
      purchaseDate: new Date('2024-01-12'),
      purchasePrice: 399,
      warranty: new Date('2027-01-12'),
      vendor: 'Dell Technologies',
      description: '27" 4K UltraSharp Monitor',
      maintenanceHistory: []
    },
    {
      id: '3',
      name: 'Office Chair - Ergonomic',
      category: 'Office Furniture',
      serialNumber: 'OC2024001',
      qrCode: 'QR003',
      location: 'Storage Room A',
      condition: 'good',
      status: 'available',
      purchaseDate: new Date('2024-01-05'),
      purchasePrice: 299,
      warranty: new Date('2026-01-05'),
      vendor: 'Herman Miller',
      description: 'Ergonomic office chair with lumbar support',
      maintenanceHistory: []
    },
    {
      id: '4',
      name: 'iPhone 15 Pro',
      category: 'Mobile Devices',
      serialNumber: 'IP2024001',
      qrCode: 'QR004',
      assignedTo: '2',
      assignedToName: 'Sarah Johnson',
      assignedDate: new Date('2024-02-01'),
      location: 'Los Angeles Office',
      condition: 'new',
      status: 'assigned',
      purchaseDate: new Date('2024-01-28'),
      purchasePrice: 999,
      warranty: new Date('2025-01-28'),
      vendor: 'Apple Inc.',
      description: 'iPhone 15 Pro 256GB Space Black',
      maintenanceHistory: []
    },
    {
      id: '5',
      name: 'Printer - HP LaserJet',
      category: 'Office Equipment',
      serialNumber: 'HP2024001',
      qrCode: 'QR005',
      location: 'Seattle Office',
      condition: 'fair',
      status: 'in_repair',
      purchaseDate: new Date('2023-06-15'),
      purchasePrice: 599,
      warranty: new Date('2024-06-15'),
      vendor: 'HP Inc.',
      description: 'HP LaserJet Pro MFP M428fdw',
      maintenanceHistory: [
        {
          id: '2',
          date: new Date('2024-02-10'),
          description: 'Paper jam repair and cleaning',
          cost: 150,
          vendor: 'HP Service Center',
          type: 'corrective',
          nextMaintenanceDate: new Date('2024-08-10')
        }
      ]
    }
  ];

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'success';
      case 'good': return 'info';
      case 'fair': return 'warning';
      case 'poor': return 'error';
      case 'damaged': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'assigned': return 'primary';
      case 'in_repair': return 'warning';
      case 'disposed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle />;
      case 'assigned': return <Person />;
      case 'in_repair': return <Build />;
      case 'disposed': return <ErrorIcon />;
      default: return <Inventory />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleCreateAsset = () => {
    const warrantyDate = addDays(new Date(), parseInt(newAsset.warrantyMonths) * 30);
    console.log('Creating asset:', { ...newAsset, warranty: warrantyDate });
    setAssetDialogOpen(false);
    setNewAsset({
      name: '',
      category: '',
      serialNumber: '',
      location: '',
      condition: 'new',
      purchasePrice: '',
      vendor: '',
      description: '',
      warrantyMonths: '12'
    });
  };

  const handleAddMaintenance = () => {
    if (!selectedAsset) return;
    
    const nextMaintenanceDate = addDays(new Date(), parseInt(newMaintenance.nextMaintenanceMonths) * 30);
    console.log('Adding maintenance:', { ...newMaintenance, nextMaintenanceDate });
    setMaintenanceDialogOpen(false);
    setNewMaintenance({
      description: '',
      cost: '',
      vendor: '',
      type: 'preventive',
      nextMaintenanceMonths: '6'
    });
  };

  const assetCategories = [
    'Computer Equipment',
    'Mobile Devices',
    'Office Furniture',
    'Office Equipment',
    'Vehicles',
    'Software Licenses',
    'Safety Equipment',
    'Tools & Machinery'
  ];

  const myAssets = assets.filter(asset => asset.assignedTo === user?.id);
  const availableAssets = assets.filter(asset => asset.status === 'available');
  const assetsNeedingMaintenance = assets.filter(asset => 
    asset.maintenanceHistory.some(m => 
      m.nextMaintenanceDate && differenceInDays(m.nextMaintenanceDate, new Date()) <= 30
    )
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Asset Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage company assets with QR code integration and maintenance scheduling.
        </Typography>
      </Box>

      {/* Asset Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Inventory sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" gutterBottom>
                {assets.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" gutterBottom>
                {assets.filter(a => a.status === 'assigned').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assigned Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" gutterBottom>
                {availableAssets.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Build sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" gutterBottom>
                {assets.filter(a => a.status === 'in_repair').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Under Maintenance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <PermissionGate permission={[PERMISSIONS.ASSET_VIEW_ALL, PERMISSIONS.ASSET_VIEW_TEAM]}>
              <Tab label="All Assets" />
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.ASSET_VIEW_SELF}>
              <Tab label="My Assets" />
            </PermissionGate>
            <PermissionGate permission={[PERMISSIONS.ASSET_MANAGE, PERMISSIONS.ASSET_VIEW_ALL]}>
              <Tab label="Maintenance" />
            </PermissionGate>
            <PermissionGate permission={[PERMISSIONS.REPORTS_ALL, PERMISSIONS.REPORTS_HR]}>
              <Tab label="Reports" />
            </PermissionGate>
          </Tabs>
        </Box>

        {/* All Assets Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Asset Inventory</Typography>
            <PermissionGate permission={PERMISSIONS.ASSET_MANAGE}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAssetDialogOpen(true)}
              >
                Add Asset
              </Button>
            </PermissionGate>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Inventory />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {asset.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {asset.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{asset.category}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {asset.serialNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {asset.assignedToName ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {asset.assignedToName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Since {asset.assignedDate && format(asset.assignedDate, 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{asset.location}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={asset.condition.toUpperCase()}
                        color={getConditionColor(asset.condition)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(asset.status)}
                        label={asset.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(asset.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <PermissionGate permission={[PERMISSIONS.ASSET_VIEW_ALL, PERMISSIONS.ASSET_VIEW_TEAM, PERMISSIONS.ASSET_VIEW_SELF]}>
                            <IconButton
                              size="small"
                              onClick={() => setSelectedAsset(asset)}
                            >
                              <Visibility />
                            </IconButton>
                          </PermissionGate>
                        </Tooltip>
                        <Tooltip title="QR Code">
                          <PermissionGate permission={[PERMISSIONS.ASSET_VIEW_ALL, PERMISSIONS.ASSET_VIEW_TEAM, PERMISSIONS.ASSET_VIEW_SELF]}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedAsset(asset);
                                setQrDialogOpen(true);
                              }}
                            >
                              <QrCode />
                            </IconButton>
                          </PermissionGate>
                        </Tooltip>
                        <PermissionGate permission={PERMISSIONS.ASSET_MANAGE}>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </PermissionGate>
                        <PermissionGate permission={PERMISSIONS.ASSET_MANAGE}>
                          <Tooltip title="Maintenance">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedAsset(asset);
                                setMaintenanceDialogOpen(true);
                              }}
                            >
                              <Build />
                            </IconButton>
                          </Tooltip>
                        </PermissionGate>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* My Assets Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Assets Assigned to Me
          </Typography>
          <Grid container spacing={3}>
            {myAssets.map((asset) => (
              <Grid item xs={12} md={6} lg={4} key={asset.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Inventory />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{asset.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {asset.category}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => {
                          setSelectedAsset(asset);
                          setQrDialogOpen(true);
                        }}
                      >
                        <QrCode />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Serial:</Typography>
                        <Typography variant="body2" fontFamily="monospace">
                          {asset.serialNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Location:</Typography>
                        <Typography variant="body2">{asset.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Condition:</Typography>
                        <Chip
                          label={asset.condition}
                          color={getConditionColor(asset.condition)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Warranty:</Typography>
                        <Typography variant="body2">
                          {format(asset.warranty, 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary">
                      {asset.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Maintenance Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Maintenance Schedule
          </Typography>
          
          {assetsNeedingMaintenance.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {assetsNeedingMaintenance.length} asset(s) require maintenance within 30 days
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Upcoming Maintenance" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {assets
                      .filter(asset => 
                        asset.maintenanceHistory.some(m => 
                          m.nextMaintenanceDate && differenceInDays(m.nextMaintenanceDate, new Date()) <= 30
                        )
                      )
                      .map((asset) => (
                        <Paper key={asset.id} sx={{ p: 2 }} variant="outlined">
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {asset.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {asset.serialNumber}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" color="warning.main">
                                Due in {differenceInDays(
                                  asset.maintenanceHistory.find(m => m.nextMaintenanceDate)?.nextMaintenanceDate || new Date(),
                                  new Date()
                                )} days
                              </Typography>
                              <Button size="small" variant="outlined">
                                Schedule
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Recent Maintenance" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {assets
                      .flatMap(asset => 
                        asset.maintenanceHistory.map(maintenance => ({
                          ...maintenance,
                          assetName: asset.name,
                          assetSerial: asset.serialNumber
                        }))
                      )
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .slice(0, 5)
                      .map((maintenance, index) => (
                        <Paper key={index} sx={{ p: 2 }} variant="outlined">
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {maintenance.assetName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {maintenance.assetSerial}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {maintenance.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {format(maintenance.date, 'MMM dd, yyyy')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatCurrency(maintenance.cost)}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Asset Reports & Analytics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Asset Distribution by Category" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {assetCategories.map((category) => {
                      const count = assets.filter(a => a.category === category).length;
                      const percentage = (count / assets.length) * 100;
                      return (
                        <Box key={category}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{category}</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {count} ({percentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1 }}>
                            <Box
                              sx={{
                                width: `${percentage}%`,
                                height: 8,
                                bgcolor: 'primary.main',
                                borderRadius: 1
                              }}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Asset Value Summary" />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main">
                        {formatCurrency(assets.reduce((sum, asset) => sum + asset.purchasePrice, 0))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Asset Value
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Assigned Assets:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(
                          assets
                            .filter(a => a.status === 'assigned')
                            .reduce((sum, asset) => sum + asset.purchasePrice, 0)
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Available Assets:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(
                          assets
                            .filter(a => a.status === 'available')
                            .reduce((sum, asset) => sum + asset.purchasePrice, 0)
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Under Repair:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(
                          assets
                            .filter(a => a.status === 'in_repair')
                            .reduce((sum, asset) => sum + asset.purchasePrice, 0)
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Add Asset Dialog */}
      <Dialog
        open={assetDialogOpen}
        onClose={() => setAssetDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Asset</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Asset Name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, category: e.target.value }))}
                    label="Category"
                  >
                    {assetCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  value={newAsset.serialNumber}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, serialNumber: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newAsset.location}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, location: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={newAsset.condition}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, condition: e.target.value as any }))}
                    label="Condition"
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="fair">Fair</MenuItem>
                    <MenuItem value="poor">Poor</MenuItem>
                    <MenuItem value="damaged">Damaged</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Purchase Price"
                  type="number"
                  value={newAsset.purchasePrice}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, purchasePrice: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vendor"
                  value={newAsset.vendor}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, vendor: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Warranty (Months)"
                  type="number"
                  value={newAsset.warrantyMonths}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, warrantyMonths: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newAsset.description}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssetDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAsset}>
            Add Asset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Dialog */}
      <Dialog
        open={maintenanceDialogOpen}
        onClose={() => setMaintenanceDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Maintenance Record</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Maintenance Description"
              multiline
              rows={3}
              value={newMaintenance.description}
              onChange={(e) => setNewMaintenance(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cost"
                  type="number"
                  value={newMaintenance.cost}
                  onChange={(e) => setNewMaintenance(prev => ({ ...prev, cost: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Vendor"
                  value={newMaintenance.vendor}
                  onChange={(e) => setNewMaintenance(prev => ({ ...prev, vendor: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Maintenance Type</InputLabel>
                  <Select
                    value={newMaintenance.type}
                    onChange={(e) => setNewMaintenance(prev => ({ ...prev, type: e.target.value as any }))}
                    label="Maintenance Type"
                  >
                    <MenuItem value="preventive">Preventive</MenuItem>
                    <MenuItem value="corrective">Corrective</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Next Maintenance (Months)"
                  type="number"
                  value={newMaintenance.nextMaintenanceMonths}
                  onChange={(e) => setNewMaintenance(prev => ({ ...prev, nextMaintenanceMonths: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMaintenance}>
            Add Maintenance
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAsset && (
          <>
            <DialogTitle>
              QR Code - {selectedAsset.name}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', pt: 2 }}>
                <Box sx={{ display: 'inline-block', p: 2, bgcolor: 'white', borderRadius: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <canvas
                      ref={(canvas) => {
                        if (canvas) {
                          const ctx = canvas.getContext('2d');
                          if (ctx) {
                            // Simple QR code placeholder - in real app, use a QR library
                            canvas.width = 200;
                            canvas.height = 200;
                            ctx.fillStyle = '#000';
                            ctx.fillRect(0, 0, 200, 200);
                            ctx.fillStyle = '#fff';
                            ctx.font = '12px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText(selectedAsset.qrCode, 100, 100);
                          }
                        }
                      }}
                    />
                  </div>
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {selectedAsset.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Serial: {selectedAsset.serialNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  QR Code: {selectedAsset.qrCode}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<Download />}>
                Download QR Code
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};