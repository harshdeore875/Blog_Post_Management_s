import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ArticleIcon from '@mui/icons-material/Article';
import DraftsIcon from '@mui/icons-material/Drafts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi.js';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAuthors: 0,
    totalReaders: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [users, blogs] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getBlogs(),
        ]);

        const totalUsers = users.length;
        const totalAuthors = users.filter((u) => u.role === 'author').length;
        const totalReaders = users.filter((u) => u.role === 'user').length;
        const totalBlogs = blogs.length;
        const publishedBlogs = blogs.filter((b) => b.status === 'Published').length;
        const draftBlogs = blogs.filter((b) => b.status === 'Draft').length;

        setStats({
          totalUsers,
          totalAuthors,
          totalReaders,
          totalBlogs,
          publishedBlogs,
          draftBlogs,
        });
      } catch (error) {
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary" variant="body1">
          System overview and management controls
        </Typography>
      </Box>

      {/* Main Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#e3f2fd', borderColor: '#bbdefb' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Users
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {stats.totalUsers}
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#f3e5f5', borderColor: '#e1bee7' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Platform Authors
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {stats.totalAuthors}
                </Typography>
              </Box>
              <SupervisorAccountIcon sx={{ fontSize: 40, color: '#8e24aa' }} />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#e8f5e9', borderColor: '#c8e6c9' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Published Blogs
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {stats.publishedBlogs}
                </Typography>
              </Box>
              <ArticleIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: '#fff3e0', borderColor: '#ffe0b2' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Pending Drafts
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {stats.draftBlogs}
                </Typography>
              </Box>
              <DraftsIcon sx={{ fontSize: 40, color: '#e65100' }} />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Interactive Management Sections */}
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        Management Panels
      </Typography>

      <Grid container spacing={3}>
        {/* Manage Users Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardActionArea onClick={() => navigate('/admin/users')} sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        display: 'grid', 
                        placeItems: 'center', 
                        bgcolor: '#f5f5f5' 
                      }}
                    >
                      <PeopleIcon color="primary" sx={{ fontSize: 32 }} />
                    </Paper>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        User Management
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        View registered users list, delete accounts, or update permissions & roles.
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main', fontWeight: 600, mt: 1 }}>
                    <Typography variant="subtitle2">Manage Users</Typography>
                    <ArrowForwardIcon fontSize="small" />
                  </Stack>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Manage Blogs Card */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardActionArea onClick={() => navigate('/admin/blogs')} sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        display: 'grid', 
                        placeItems: 'center', 
                        bgcolor: '#f5f5f5' 
                      }}
                    >
                      <ArticleIcon color="secondary" sx={{ fontSize: 32 }} />
                    </Paper>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Blog Management
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Audit, publish pending drafts, delete posts, and track blog stats.
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'secondary.main', fontWeight: 600, mt: 1 }}>
                    <Typography variant="subtitle2">Manage Blogs</Typography>
                    <ArrowForwardIcon fontSize="small" />
                  </Stack>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
