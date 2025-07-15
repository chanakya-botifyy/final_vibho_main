import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  Link
} from '@mui/material';
import { Business, Email, Lock } from '@mui/icons-material';
import { useAuthStore } from '../../store/useAuthStore';

interface LoginFormProps {
  onToggleForm?: () => void;
  onForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, onForgotPassword }) => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  const demoAccounts = [
    { email: 'admin@vibhohcm.com', role: 'System Administrator', password: 'password123' },
    { email: 'hr@vibhohcm.com', role: 'HR Manager', password: 'password123' },
    { email: 'manager@vibhohcm.com', role: 'Engineering Manager', password: 'password123' },
    { email: 'employee@vibhohcm.com', role: 'Employee', password: 'password123' }
  ];

  const handleDemoLogin = (email: string) => {
    setFormData(prev => ({
      ...prev,
      email,
      password: 'password123'
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 1000, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Login Form */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    m: 1,
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56
                  }}
                >
                  <Business fontSize="large" />
                </Avatar>
                
                <Typography component="h1" variant="h4" gutterBottom>
                  VibhoHCM
                </Typography>
                
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Enterprise Human Resource Management System
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
                  </Button>
                  
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2" onClick={onToggleForm}>
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* Demo Accounts */}
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography variant="h6" gutterBottom>
                  Demo Accounts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try out different user roles with these demo accounts:
                </Typography>
                
                {demoAccounts.map((account, index) => (
                  <Card
                    key={index}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleDemoLogin(account.email)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {account.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Password: {account.password}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" color="text.secondary">
                  <strong>Features Available:</strong>
                  <br />
                  • Multi-tenant architecture
                  <br />
                  • Role-based access control
                  <br />
                  • Real-time notifications
                  <br />
                  • AI-powered analytics
                  <br />
                  • Mobile-responsive design
                  <br />
                  • Dark/Light theme support
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};