import { AppBar, Box, Chip, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { authApi } from '../../services/authApi.js';
import { toast } from 'react-toastify';
import styles from './Navbar.module.css';

const menus = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Blogs', path: '/admin/blogs' },
    { label: 'Profile', path: '/profile' },
  ],
  author: [
    { label: 'Dashboard', path: '/author/dashboard' },
    { label: 'My Blogs', path: '/author/blogs' },
    { label: 'Create Blog', path: '/author/blogs/create' },
    { label: 'Profile', path: '/profile' },
  ],
  user: [
    { label: 'Blogs', path: '/blogs' },
    { label: 'Profile', path: '/profile' },
  ],
};

function Navbar() {
  const { isAuthenticated, role, user, setUser } = useAuth();
  const navigate = useNavigate();
  const navItems = menus[role] || menus.user;

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar position="fixed" color="inherit" elevation={0} className={styles.navbar}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.leftCluster} onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          <Box className={styles.logoMark}>B</Box>
          <Typography variant="h6" className={styles.logoText}>
            Blog Manager
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} className={styles.menu}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? styles.activeMenuLink : styles.menuLink)}
            >
              {item.label}
            </NavLink>
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={user?.role || 'guest'} size="small" className={styles.roleChip} color="primary" variant="outlined" />
          <IconButton onClick={handleLogout} color="error" title="Logout" size="small">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
