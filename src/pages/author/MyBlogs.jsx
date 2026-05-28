import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { authorApi } from '../../services/authorApi.js';
import { blogApi } from '../../services/blogApi.js';

function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, blogId: null });
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await authorApi.getBlogs();
      setBlogs(data || []);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchBlogs();
    };

    window.addEventListener('focus', handleFocus);
    const intervalId = window.setInterval(fetchBlogs, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.clearInterval(intervalId);
    };
  }, []);

  const handlePublish = async (blogId) => {
    try {
      await blogApi.publishBlog(blogId);
      setBlogs((current) =>
        current.map((blog) => (blog._id === blogId ? { ...blog, status: 'Published' } : blog)),
      );
      toast.success('Blog published successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish blog');
    }
  };

  const handleDelete = async () => {
    try {
      await blogApi.deleteBlog(deleteConfirm.blogId);
      setBlogs((current) => current.filter((blog) => blog._id !== deleteConfirm.blogId));
      toast.success('Blog deleted successfully');
      setDeleteConfirm({ open: false, blogId: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    }
  };

  if (loading) return <LoadingSpinner label="Loading your blogs" />;

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">My Blogs</Typography>
        <Button variant="contained" onClick={() => navigate('/author/blogs/create')}>
          Create New Blog
        </Button>
      </Box>

      {blogs.length === 0 ? (
        <EmptyState
          title="No blogs yet"
          message="Create your first blog post to get started. Click the 'Create New Blog' button to begin writing."
        />
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Views
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog._id} hover>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        backgroundColor: blog.status === 'Published' ? '#dff9e8' : '#fff0d9',
                        color: blog.status === 'Published' ? '#1f9d55' : '#d07a22',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                      }}
                    >
                      {blog.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{blog.views ?? 0}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/author/blogs/edit/${blog._id}`)}
                        title="Edit blog"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {blog.status === 'Draft' && (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handlePublish(blog._id)}
                          title="Publish blog"
                        >
                          <PublishIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteConfirm({ open: true, blogId: blog._id })}
                        title="Delete blog"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirm({ open: false, blogId: null })}
      />
    </>
  );
}

export default MyBlogs;
