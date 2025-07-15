import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip
} from '@mui/material';
import {
  WhatsApp,
  Send,
  Settings,
  Download as DownloadIcon,
  Refresh,
  CheckCircle,
  Error as ErrorIcon,
  Phone,
  Message,
  Schedule,
  History,
  Visibility,
  Edit,
  Delete,
  Save,
  Cancel,
  Help,
  Info,
} from '@mui/icons-material';
import { Security } from '@mui/icons-material';
import { format } from 'date-fns';

export const WhatsAppPayslipService: React.FC = () => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [whatsappConfig, setWhatsappConfig] = useState({
    apiKey: '••••••••••••••••••••••••••••••',
    phoneNumberId: '107418985641253',
    businessAccountId: '106578992124587',
    accessToken: '••••••••••••••••••••••••••••••',
    webhookVerifyToken: 'vibhohcm-webhook-verify-token',
    status: 'connected'
  });
  const [testMessage, setTestMessage] = useState({
    phoneNumber: '',
    templateName: 'payslip_notification',
    parameters: {
      employeeName: 'John Smith',
      month: 'February 2024',
      amount: '$8,425.00'
    }
  });

  // Mock message templates
  const messageTemplates = [
    {
      id: '1',
      name: 'payslip_notification',
      status: 'approved',
      language: 'en_US',
      category: 'ACCOUNT_UPDATE',
      components: [
        {
          type: 'HEADER',
          format: 'TEXT',
          text: 'Your Payslip is Ready'
        },
        {
          type: 'BODY',
          text: 'Hello {{1}}, your payslip for {{2}} is now available. Your net salary is {{3}}. You can view and download your payslip from the employee portal or reply "PAYSLIP" to receive a PDF copy.'
        },
        {
          type: 'FOOTER',
          text: 'VibhoHCM - Enterprise HRMS'
        },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'QUICK_REPLY',
              text: 'View Payslip'
            },
            {
              type: 'QUICK_REPLY',
              text: 'Download PDF'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'salary_revision',
      status: 'approved',
      language: 'en_US',
      category: 'ACCOUNT_UPDATE',
      components: [
        {
          type: 'HEADER',
          format: 'TEXT',
          text: 'Salary Revision Notification'
        },
        {
          type: 'BODY',
          text: 'Hello {{1}}, we are pleased to inform you that your salary has been revised. Your new monthly salary is {{2}} effective from {{3}}. Please check your employee portal for more details.'
        },
        {
          type: 'FOOTER',
          text: 'VibhoHCM - Enterprise HRMS'
        }
      ]
    }
  ];

  // Mock message logs
  const messageLogs = [
    {
      id: '1',
      phoneNumber: '+1234567890',
      templateName: 'payslip_notification',
      sentAt: new Date('2024-02-28T10:30:00'),
      status: 'delivered',
      deliveredAt: new Date('2024-02-28T10:30:05')
    },
    {
      id: '2',
      phoneNumber: '+1987654321',
      templateName: 'payslip_notification',
      sentAt: new Date('2024-02-28T10:35:00'),
      status: 'delivered',
      deliveredAt: new Date('2024-02-28T10:35:08')
    },
    {
      id: '3',
      phoneNumber: '+1122334455',
      templateName: 'payslip_notification',
      sentAt: new Date('2024-02-28T10:40:00'),
      status: 'failed',
      error: 'Invalid phone number'
    }
  ];

  const handleSaveConfig = () => {
    console.log('Saving WhatsApp configuration:', whatsappConfig);
    setConfigDialogOpen(false);
  };

  const handleSaveTemplate = () => {
    console.log('Saving message template:', selectedTemplate);
    setTemplateDialogOpen(false);
  };

  const handleSendTestMessage = () => {
    console.log('Sending test message:', testMessage);
    setTestDialogOpen(false);
  };

  const handleBulkSendPayslips = () => {
    console.log('Sending bulk payslip notifications');
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          WhatsApp Payslip Service
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure and manage WhatsApp integration for instant payslip delivery.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Connection Status */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WhatsApp sx={{ fontSize: 48, color: '#25D366' }} />
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        WhatsApp Business API
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {' '}
                        <Chip 
                          label={whatsappConfig.status === 'connected' ? 'Connected' : 'Disconnected'} 
                          color={whatsappConfig.status === 'connected' ? 'success' : 'error'}
                          size="small"
                        />
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Settings />}
                      onClick={() => setConfigDialogOpen(true)}
                    >
                      Configure
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                    >
                      Test Connection
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={() => setTestDialogOpen(true)}
                    >
                      Send Test Message
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Message Templates */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Message Templates" 
              action={
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => {
                    setSelectedTemplate(null);
                    setTemplateDialogOpen(true);
                  }}
                >
                  New Template
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Template Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Language</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {messageTemplates.map((template) => (
                      <TableRow key={template.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {template.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{template.category}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{template.language}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={template.status.toUpperCase()}
                            color={template.status === 'approved' ? 'success' : 'warning'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View">
                              <IconButton 
                                size="small"
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  setTemplateDialogOpen(true);
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error">
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Message Logs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Message Logs" 
              action={
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Export Logs
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Template</TableCell>
                      <TableCell>Sent At</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {messageLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {log.phoneNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{log.templateName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(log.sentAt, 'MMM dd, HH:mm:ss')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={log.status === 'delivered' ? <CheckCircle /> : <ErrorIcon />}
                            label={log.status.toUpperCase()}
                            color={log.status === 'delivered' ? 'success' : 'error'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bulk Operations */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Bulk Operations" />
            <CardContent>
              <Alert severity="info" sx={{ mb: 3 }}>
                Send payslip notifications to multiple employees at once. This will use the "payslip_notification" template.
              </Alert>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Send Monthly Payslip Notifications</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Send WhatsApp notifications to all employees informing them that their payslips are ready.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Month</InputLabel>
                        <Select defaultValue={format(new Date(), 'yyyy-MM')} label="Month">
                          <MenuItem value="2024-02">February 2024</MenuItem>
                          <MenuItem value="2024-01">January 2024</MenuItem>
                          <MenuItem value="2023-12">December 2023</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Department</InputLabel>
                        <Select defaultValue="all" label="Department">
                          <MenuItem value="all">All Departments</MenuItem>
                          <MenuItem value="Engineering">Engineering</MenuItem>
                          <MenuItem value="HR">Human Resources</MenuItem>
                          <MenuItem value="Sales">Sales</MenuItem>
                          <MenuItem value="Marketing">Marketing</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Include payslip PDF attachment"
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Send />}
                        sx={{ mt: 2 }}
                        onClick={handleBulkSendPayslips}
                      >
                        Send Notifications
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Scheduled Notifications</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Set up automatic notifications for payslip distribution.
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Schedule color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Monthly Payslip Notification"
                          secondary="Runs on the last day of every month at 10:00 AM"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Schedule color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Payslip Reminder"
                          secondary="Runs 3 days after payslip generation for employees who haven't viewed their payslip"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <Schedule color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Salary Revision Notification"
                          secondary="Runs when salary revisions are processed"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                    </List>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Settings />}
                      sx={{ mt: 2 }}
                    >
                      Configure Schedules
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Chatbot Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Payslip Chatbot Configuration" />
            <CardContent>
              <Alert severity="info" sx={{ mb: 3 }}>
                Configure the WhatsApp chatbot to handle payslip requests and other payroll-related queries.
              </Alert>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Enabled Commands</Typography>
                  <Paper sx={{ p: 2 }}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Message fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="PAYSLIP"
                          secondary="Sends the latest payslip as a PDF attachment"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Message fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="PAYSLIP [MONTH] [YEAR]"
                          secondary="Sends the payslip for a specific month and year"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Message fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="SALARY"
                          secondary="Provides a breakdown of the latest salary"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Message fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="YTD"
                          secondary="Provides year-to-date earnings and tax information"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Message fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="HELP"
                          secondary="Lists all available commands"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Security Settings</Typography>
                  <Paper sx={{ p: 2 }}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <Security fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Phone Number Verification"
                          secondary="Verify that the requesting phone number matches the employee record"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Security fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="OTP Verification"
                          secondary="Send a one-time password for sensitive operations"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Security fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Data Masking"
                          secondary="Mask sensitive information in payslip summaries"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Security fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Session Timeout"
                          secondary="Automatically end the conversation after 30 minutes of inactivity"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Security fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Audit Logging"
                          secondary="Log all payslip requests and access for compliance"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* WhatsApp Configuration Dialog */}
      <Dialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>WhatsApp Business API Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              These settings connect to the Meta WhatsApp Business API. Handle these credentials securely.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="API Key"
                  type="password"
                  value={whatsappConfig.apiKey}
                  onChange={(e) => setWhatsappConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number ID"
                  value={whatsappConfig.phoneNumberId}
                  onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Business Account ID"
                  value={whatsappConfig.businessAccountId}
                  onChange={(e) => setWhatsappConfig(prev => ({ ...prev, businessAccountId: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Access Token"
                  type="password"
                  value={whatsappConfig.accessToken}
                  onChange={(e) => setWhatsappConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Webhook Verify Token"
                  value={whatsappConfig.webhookVerifyToken}
                  onChange={(e) => setWhatsappConfig(prev => ({ ...prev, webhookVerifyToken: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable WhatsApp Integration"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveConfig}>
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate ? 'View Message Template' : 'Create Message Template'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {selectedTemplate ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Template Name</Typography>
                    <Typography variant="body1" gutterBottom>{selectedTemplate.name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Category</Typography>
                    <Typography variant="body1" gutterBottom>{selectedTemplate.category}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Language</Typography>
                    <Typography variant="body1" gutterBottom>{selectedTemplate.language}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={selectedTemplate.status.toUpperCase()}
                      color={selectedTemplate.status === 'approved' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>Template Preview</Typography>
                <Paper sx={{ p: 3, mb: 2, bgcolor: '#f5f5f5' }}>
                  {selectedTemplate.components.map((component: any, index: number) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      {component.type === 'HEADER' && (
                        <Typography variant="h6" gutterBottom>
                          {component.text}
                        </Typography>
                      )}
                      {component.type === 'BODY' && (
                        <Typography variant="body1" gutterBottom>
                          {component.text}
                        </Typography>
                      )}
                      {component.type === 'FOOTER' && (
                        <Typography variant="caption" color="text.secondary">
                          {component.text}
                        </Typography>
                      )}
                      {component.type === 'BUTTONS' && component.buttons && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          {component.buttons.map((button: any, buttonIndex: number) => (
                            <Button key={buttonIndex} variant="outlined" size="small">
                              {button.text}
                            </Button>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Paper>

                <Typography variant="subtitle1" gutterBottom>Variable Parameters</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Info fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="{{1}}"
                      secondary="Employee Name"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Info fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="{{2}}"
                      secondary="Month/Period"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Info fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="{{3}}"
                      secondary="Net Salary Amount"
                    />
                  </ListItem>
                </List>
              </Box>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Create a new message template for WhatsApp Business API. Templates must be approved by Meta before use.
                </Alert>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Template Name"
                      helperText="Use lowercase letters and underscores only"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Category</InputLabel>
                      <Select defaultValue="ACCOUNT_UPDATE" label="Category">
                        <MenuItem value="ACCOUNT_UPDATE">Account Update</MenuItem>
                        <MenuItem value="PAYMENT_UPDATE">Payment Update</MenuItem>
                        <MenuItem value="PERSONAL_FINANCE_UPDATE">Personal Finance Update</MenuItem>
                        <MenuItem value="SHIPPING_UPDATE">Shipping Update</MenuItem>
                        <MenuItem value="RESERVATION_UPDATE">Reservation Update</MenuItem>
                        <MenuItem value="ISSUE_RESOLUTION">Issue Resolution</MenuItem>
                        <MenuItem value="APPOINTMENT_UPDATE">Appointment Update</MenuItem>
                        <MenuItem value="TRANSPORTATION_UPDATE">Transportation Update</MenuItem>
                        <MenuItem value="TICKET_UPDATE">Ticket Update</MenuItem>
                        <MenuItem value="ALERT_UPDATE">Alert Update</MenuItem>
                        <MenuItem value="AUTO_REPLY">Auto Reply</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Language</InputLabel>
                      <Select defaultValue="en_US" label="Language">
                        <MenuItem value="en_US">English (US)</MenuItem>
                        <MenuItem value="en_GB">English (UK)</MenuItem>
                        <MenuItem value="es_ES">Spanish</MenuItem>
                        <MenuItem value="fr_FR">French</MenuItem>
                        <MenuItem value="de_DE">German</MenuItem>
                        <MenuItem value="pt_BR">Portuguese (Brazil)</MenuItem>
                        <MenuItem value="ar_AR">Arabic</MenuItem>
                        <MenuItem value="hi_IN">Hindi</MenuItem>
                        <MenuItem value="id_ID">Indonesian</MenuItem>
                        <MenuItem value="it_IT">Italian</MenuItem>
                        <MenuItem value="ja_JP">Japanese</MenuItem>
                        <MenuItem value="ko_KR">Korean</MenuItem>
                        <MenuItem value="ru_RU">Russian</MenuItem>
                        <MenuItem value="zh_CN">Chinese (Simplified)</MenuItem>
                        <MenuItem value="zh_TW">Chinese (Traditional)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Header Text"
                      placeholder="Your Payslip is Ready"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Body Text"
                      multiline
                      rows={4}
                      placeholder="Hello {{1}}, your payslip for {{2}} is now available. Your net salary is {{3}}."
                      helperText="Use {{1}}, {{2}}, etc. for variables"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Footer Text"
                      placeholder="VibhoHCM - Enterprise HRMS"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Buttons (Optional)</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        label="Button 1 Text"
                        placeholder="View Payslip"
                        size="small"
                      />
                      <TextField
                        label="Button 2 Text"
                        placeholder="Download PDF"
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Variable Parameters</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <TextField
                        label="{{1}} Description"
                        placeholder="Employee Name"
                        size="small"
                      />
                      <TextField
                        label="{{2}} Description"
                        placeholder="Month/Period"
                        size="small"
                      />
                      <TextField
                        label="{{3}} Description"
                        placeholder="Net Salary Amount"
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>
            {selectedTemplate ? 'Close' : 'Cancel'}
          </Button>
          {!selectedTemplate && (
            <Button variant="contained" onClick={handleSaveTemplate}>
              Create Template
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Test Message Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Test Message</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Send a test message to verify your WhatsApp integration. The recipient must have opted in to receive messages.
            </Alert>
            <TextField
              fullWidth
              label="Recipient Phone Number"
              placeholder="+1234567890"
              helperText="Include country code (e.g., +1 for US)"
              value={testMessage.phoneNumber}
              onChange={(e) => setTestMessage(prev => ({ ...prev, phoneNumber: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Template</InputLabel>
              <Select
                value={testMessage.templateName}
                onChange={(e) => setTestMessage(prev => ({ ...prev, templateName: e.target.value }))}
                label="Template"
              >
                {messageTemplates.map((template) => (
                  <MenuItem key={template.id} value={template.name}>
                    {template.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="subtitle2" gutterBottom>Template Parameters</Typography>
            <TextField
              fullWidth
              label="Employee Name"
              value={testMessage.parameters.employeeName}
              onChange={(e) => setTestMessage(prev => ({ 
                ...prev, 
                parameters: { ...prev.parameters, employeeName: e.target.value } 
              }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Month"
              value={testMessage.parameters.month}
              onChange={(e) => setTestMessage(prev => ({ 
                ...prev, 
                parameters: { ...prev.parameters, month: e.target.value } 
              }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Amount"
              value={testMessage.parameters.amount}
              onChange={(e) => setTestMessage(prev => ({ 
                ...prev, 
                parameters: { ...prev.parameters, amount: e.target.value } 
              }))}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSendTestMessage}
            disabled={!testMessage.phoneNumber}
          >
            Send Test Message
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper components
const Add = () => <Add />;
const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ overflowX: 'auto' }}>{children}</Box>
);
const Table = ({ children }: { children: React.ReactNode }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
);
const TableHead = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>;
const TableBody = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;
const TableRow = ({ children, hover }: { children: React.ReactNode; hover?: boolean }) => (
  <tr style={{ backgroundColor: hover ? 'rgba(0, 0, 0, 0.04)' : undefined }}>{children}</tr>
);
const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td style={{ padding: '16px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>{children}</td>
);
const Tooltip = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div title={title}>{children}</div>
);