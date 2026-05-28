import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { authApi } from '../services/authApi.js';
import { getRoleHomePath } from '../utils/roleRedirect.js';

const initialForm = {
  username: '',
  email: '',
  password: '',
  role: 'user',
};

function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const { isAuthenticated, role, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getRoleHomePath(role), { replace: true });
    }
  }, [isAuthenticated, navigate, role]);

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'register') {
        await authApi.register({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        toast.success('Account created. Please login.');
        setMode('login');
        setForm((currentForm) => ({ ...currentForm, username: '', password: '', role: 'user' }));
        return;
      }

      const data = await authApi.login({
        email: form.email,
        password: form.password,
      });

      setUser(data.user);
      toast.success('Login successful');
      navigate(data.redirectTo || getRoleHomePath(data.user.role), { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await authApi.forgotPassword({ email: forgotEmail });
      toast.success('Password reset link sent to your email');
      setForgotMode(false);
      setForgotEmail('');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to send reset link');
    } finally {
      setSubmitting(false);
    }
  };

  if (forgotMode) {
    return (
      <Box sx={{ display: 'grid', minHeight: 'calc(100vh - 160px)', placeItems: 'center' }}>
        <Card variant="outlined" sx={{ width: 'min(440px, 100%)' }}>
          <CardContent>
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">Forgot Password</Typography>
                <Typography color="text.secondary">
                  Enter your email to receive a password reset link
                </Typography>
              </Box>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Box component="form" onSubmit={handleForgotPassword}>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    fullWidth
                  />
                  <Button type="submit" disabled={submitting} fullWidth>
                    Send Reset Link
                  </Button>
                  <Box sx={{ textAlign: 'center' }}>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={(e) => {
                        e.preventDefault();
                        setForgotMode(false);
                      }}
                    >
                      Back to Login
                    </Link>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', minHeight: 'calc(100vh - 160px)', placeItems: 'center' }}>
      <Card variant="outlined" sx={{ width: 'min(440px, 100%)' }}>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4">Blog Manager</Typography>
              <Typography color="text.secondary">Login to continue to your workspace</Typography>
            </Box>

            <Tabs value={mode} onChange={(_, value) => setMode(value)} variant="fullWidth">
              <Tab value="login" label="Login" icon={<LoginIcon />} iconPosition="start" />
              <Tab value="register" label="Register" icon={<PersonAddAltIcon />} iconPosition="start" />
            </Tabs>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {mode === 'register' ? (
                  <>
                    <TextField
                      label="Username"
                      name="username"
                      value={form.username}
                      onChange={updateField}
                      required
                      fullWidth
                    />
                    <FormControl fullWidth>
                      <FormLabel>Register as</FormLabel>
                      <RadioGroup
                        row
                        name="role"
                        value={form.role}
                        onChange={updateField}
                      >
                        <FormControlLabel value="author" control={<Radio />} label="Author" />
                        <FormControlLabel value="user" control={<Radio />} label="Reader" />
                      </RadioGroup>
                    </FormControl>
                  </>
                ) : null}
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={updateField}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {mode === 'login' && (
                          <Link
                            component="button"
                            variant="caption"
                            onClick={(e) => {
                              e.preventDefault();
                              setForgotMode(true);
                            }}
                            sx={{ mr: 1, textDecoration: 'none', fontWeight: 600 }}
                            tabIndex={-1}
                          >
                            Forgot?
                          </Link>
                        )}
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" disabled={submitting} fullWidth>
                  {mode === 'login' ? 'Login' : 'Create Account'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
