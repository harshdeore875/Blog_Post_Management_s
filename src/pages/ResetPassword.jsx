import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/common/Button.jsx';
import { authApi } from '../services/authApi.js';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      await authApi.resetPassword(token, { password });
      toast.success('Password reset successful. Please login with your new password.');
      navigate('/login', { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', minHeight: 'calc(100vh - 160px)', placeItems: 'center' }}>
      <Card variant="outlined" sx={{ width: 'min(440px, 100%)' }}>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'grid',
                  width: 56,
                  height: 56,
                  placeItems: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#e3f2fd',
                  margin: '0 auto 16px',
                }}
              >
                <LockIcon sx={{ fontSize: 28, color: '#1976d2' }} />
              </Box>
              <Typography variant="h4">Reset Password</Typography>
              <Typography color="text.secondary">Enter your new password below</Typography>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
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
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" disabled={submitting} fullWidth>
                  Reset Password
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResetPassword;
