import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const drawerWidth = 280;

const navItems = [
  { label: 'Blog List', path: '/', icon: <ListAltIcon /> },
  { label: 'Add Blog', path: '/blog/add', icon: <AddIcon /> },
];

function SidebarContent({ onClose }) {
  const location = useLocation();

  return (
    <>
      <Toolbar />
      <List className={styles.navList}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            onClick={onClose}
            className={location.pathname === item.path ? styles.activeLink : styles.navLink}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
}

function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
        PaperProps={{ sx: { width: drawerWidth } }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' } }}
        PaperProps={{ sx: { width: drawerWidth, borderRight: '1px solid #e5e9f0' } }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}

export default Sidebar;
