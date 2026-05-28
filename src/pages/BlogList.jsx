import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import {
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BlogTable from '../components/blog/BlogTable.jsx';
import PaginationComponent from '../components/blog/PaginationComponent.jsx';
import Button from '../components/common/Button.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { blogApi } from '../services/blogApi.js';
import styles from './BlogList.module.css';

const pageSize = 5;

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { role, user } = useAuth();
  const canManageBlogs = role === 'admin' || role === 'author';
  const canEditBlog = (blog) => role === 'admin' || (role === 'author' && blog.author === user?.username);
  const canDeleteBlog = canEditBlog;

  useEffect(() => {
    blogApi
      .getBlogs()
      .then((data) => {
        setBlogs(data);
      })
      .catch(() => {
        toast.error('Unable to fetch blogs. Please check the backend server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => ['All', ...new Set(blogs.map((blog) => blog.category))], [blogs]);
  const statuses = useMemo(() => ['All', ...new Set(blogs.map((blog) => blog.status))], [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = [blog.title, blog.author, blog.category]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'All' || blog.category === category;
      const matchesStatus = status === 'All' || blog.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, category, searchTerm, status]);

  const paginatedBlogs = filteredBlogs.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(filteredBlogs.length / pageSize);
  const startRecord = filteredBlogs.length ? (page - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(page * pageSize, filteredBlogs.length);

  const handleDelete = async () => {
    await blogApi.deleteBlog(selectedBlog.id);
    setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog.id !== selectedBlog.id));
    setSelectedBlog(null);
    toast.success('Blog deleted successfully');
  };

  const handlePublish = async (blog) => {
    try {
      const updatedBlog = await blogApi.publishBlog(blog.id);
      setBlogs((currentBlogs) =>
        currentBlogs.map((item) => (item.id === blog.id ? updatedBlog : item)),
      );
      toast.success('Blog published successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish blog');
    }
  };

  const handleExport = () => {
    blogApi
      .exportBlogs(category === 'All' ? {} : { category })
      .then((csvBlob) => {
        const url = URL.createObjectURL(csvBlob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'blogs.csv';
        anchor.click();
        URL.revokeObjectURL(url);
        toast.info('CSV export started');
      })
      .catch(() => toast.error('Unable to export CSV'));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <section className={styles.page}>
      <Paper variant="outlined" className={styles.headerCard}>
        <div>
          <Typography variant="h5" className={styles.title}>
            Blog Post Manager
          </Typography>
          <Typography color="text.secondary">Manage and organize your blog posts</Typography>
        </div>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="inherit" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export CSV
          </Button>
          {canManageBlogs ? (
            <Button component={Link} to="/blog/add" startIcon={<AddIcon />}>
              Add Post
            </Button>
          ) : null}
        </Stack>
      </Paper>

      <Paper variant="outlined" className={styles.filterCard}>
        <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Search posts..." />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <FormControl size="small" className={styles.filterSelect}>
            <Select
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
            >
              {categories.map((item) => (
                <MenuItem key={item} value={item}>
                  {item === 'All' ? 'All Categories' : item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" className={styles.filterSelect}>
            <Select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              {statuses.map((item) => (
                <MenuItem key={item} value={item}>
                  {item === 'All' ? 'All Status' : item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {!loading && filteredBlogs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <BlogTable
            blogs={paginatedBlogs}
            loading={loading}
            onDelete={setSelectedBlog}
            onPublish={handlePublish}
            canEditBlog={canEditBlog}
            canDeleteBlog={canDeleteBlog}
          />
          <PaginationComponent
            count={pageCount}
            page={page}
            onChange={setPage}
            total={filteredBlogs.length}
            start={startRecord}
            end={endRecord}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(selectedBlog)}
        title="Delete blog post?"
        message={`This will remove "${selectedBlog?.title}" from the list.`}
        onClose={() => setSelectedBlog(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}

export default BlogList;
