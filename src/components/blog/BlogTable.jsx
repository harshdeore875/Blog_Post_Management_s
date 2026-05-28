import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PublishIcon from '@mui/icons-material/Publish';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlogTable.module.css';

function BlogTable({ blogs, loading, onDelete, onPublish, canDeleteBlog, canEditBlog }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [activeBlog, setActiveBlog] = useState(null);

  const openMenu = (event, blog) => {
    setMenuAnchor(event.currentTarget);
    setActiveBlog(blog);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setActiveBlog(null);
  };

  const runAction = (action) => {
    action(activeBlog);
    closeMenu();
  };

  if (loading) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={56} />
        ))}
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined" className={styles.tableWrap}>
      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id} hover>
              <TableCell className={styles.idCell}>{blog.displayId}</TableCell>
              <TableCell>{blog.title}</TableCell>
              <TableCell>{blog.author}</TableCell>
              <TableCell>{blog.category}</TableCell>
              <TableCell>
                <Chip
                  label={blog.status}
                  size="small"
                  className={blog.status === 'Published' ? styles.published : styles.draft}
                />
              </TableCell>
              <TableCell>{blog.createdDate}</TableCell>
              <TableCell align="center">
                <IconButton onClick={(event) => openMenu(event, blog)} aria-label="Open actions">
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={() => runAction((blog) => navigate(`/blog/view/${blog.id}`))}>
          <VisibilityIcon fontSize="small" className={styles.menuIcon} />
          View
        </MenuItem>
        {activeBlog && canEditBlog?.(activeBlog) ? (
          <MenuItem onClick={() => runAction((blog) => navigate(`/blog/edit/${blog.id}`))}>
            <EditIcon fontSize="small" className={styles.menuIcon} />
            Edit
          </MenuItem>
        ) : null}
        {activeBlog?.status === 'Draft' && canEditBlog?.(activeBlog) ? (
          <MenuItem onClick={() => runAction(onPublish)}>
            <PublishIcon fontSize="small" className={styles.menuIcon} />
            Publish
          </MenuItem>
        ) : null}
        {activeBlog && canDeleteBlog?.(activeBlog) ? (
          <MenuItem onClick={() => runAction(onDelete)}>Delete</MenuItem>
        ) : null}
      </Menu>
    </TableContainer>
  );
}

export default BlogTable;
