import { Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { authorApi } from '../../services/authorApi.js';

function AuthorDashboard() {
  const [stats, setStats] = useState({ totalBlogs: 0, totalViews: 0, latestPosts: [] });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await authorApi.getDashboard();
        setStats(data);
      } catch {
        setStats({ totalBlogs: 0, totalViews: 0, latestPosts: [] });
      }
    };

    fetchDashboard();

    const handleFocus = () => {
      fetchDashboard();
    };

    window.addEventListener('focus', handleFocus);
    const intervalId = window.setInterval(fetchDashboard, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Author Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography color="text.secondary">Total Blogs</Typography>
            <Typography variant="h3">{stats.totalBlogs}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography color="text.secondary">Total Views</Typography>
            <Typography variant="h3">{stats.totalViews}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography color="text.secondary">Latest Posts</Typography>
            <Typography variant="h3">{stats.latestPosts.length}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default AuthorDashboard;
