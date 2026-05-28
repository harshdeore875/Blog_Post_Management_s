import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import CreateIcon from '@mui/icons-material/Create';
import PeopleIcon from '@mui/icons-material/People';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { authApi } from '../services/authApi.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRoleHomePath } from '../utils/roleRedirect.js';

function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch {
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleColor = (role) => {
    if (role === 'admin') return '#d32f2f'; // Red
    if (role === 'author') return '#1976d2'; // Blue
    return '#2e7d32'; // Green
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Banner backdrop decoration */}
        <Box sx={{ height: 120, background: `linear-gradient(135deg, ${getRoleColor(user?.role)}88 0%, ${getRoleColor(user?.role)} 100%)` }} />
        
        <CardContent sx={{ px: { xs: 3, md: 5 }, pb: { xs: 4, md: 5 }, position: 'relative' }}>
          {/* Avatar floating above banner */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' }, gap: 2.5, mt: -7, mb: 4 }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                fontSize: '2.5rem', 
                fontWeight: 700, 
                bgcolor: getRoleColor(user?.role),
                border: '4px solid #fff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, pb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {user?.username || 'User Profile'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} sx={{ mt: 0.5 }}>
                <Chip 
                  label={user?.role || 'Guest'} 
                  size="small" 
                  sx={{ 
                    bgcolor: `${getRoleColor(user?.role)}15`, 
                    color: getRoleColor(user?.role), 
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }} 
                />
                {user?.isVerified && (
                  <Chip 
                    icon={<VerifiedIcon style={{ color: '#2e7d32', fontSize: 16 }} />} 
                    label="Verified" 
                    size="small" 
                    variant="outlined"
                    color="success"
                  />
                )}
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            {/* Account Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Account Information
              </Typography>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#f5f5f5', color: 'text.secondary', width: 40, height: 40 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Username</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{user?.username || 'N/A'}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#f5f5f5', color: 'text.secondary', width: 40, height: 40 }}>
                    <EmailIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email Address</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{user?.email || 'N/A'}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: '#f5f5f5', color: 'text.secondary', width: 40, height: 40 }}>
                    <SecurityIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Access Role</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>{user?.role || 'N/A'}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* Quick Actions depending on Role */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Actions
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#fafafa' }}>
                <Stack spacing={2}>
                  {user?.role === 'admin' && (
                    <>
                      <Button 
                        fullWidth 
                        startIcon={<PeopleIcon />} 
                        onClick={() => navigate('/admin/users')}
                      >
                        Manage Platform Users
                      </Button>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<BookIcon />} 
                        onClick={() => navigate('/admin/blogs')}
                      >
                        Manage Platform Blogs
                      </Button>
                    </>
                  )}

                  {user?.role === 'author' && (
                    <>
                      <Button 
                        fullWidth 
                        startIcon={<CreateIcon />} 
                        onClick={() => navigate('/author/blogs/create')}
                      >
                        Write New Blog Post
                      </Button>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<BookIcon />} 
                        onClick={() => navigate('/author/blogs')}
                      >
                        My Blog Posts List
                      </Button>
                    </>
                  )}

                  {user?.role === 'user' && (
                    <Button 
                      fullWidth 
                      startIcon={<BookIcon />} 
                      onClick={() => navigate('/blogs')}
                    >
                      Read Latest Blogs
                    </Button>
                  )}

                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<DashboardIcon />} 
                    onClick={() => navigate(getRoleHomePath(user?.role))}
                    color="inherit"
                  >
                    Go to Role Dashboard
                  </Button>

                  <Divider sx={{ my: 1 }} />

                  <Button 
                    fullWidth 
                    color="error" 
                    variant="outlined" 
                    startIcon={<LogoutIcon />} 
                    onClick={handleLogout}
                  >
                    Sign Out Account
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Profile;
