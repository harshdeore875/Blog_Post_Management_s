import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BlogForm from '../components/blog/BlogForm.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { blogApi } from '../services/blogApi.js';
import { getRoleHomePath } from '../utils/roleRedirect.js';

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.getBlogById(id).then((data) => {
      setBlog(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (values) => {
    await blogApi.updateBlog(id, values);
    toast.success('Blog updated successfully');
    navigate(role === 'author' ? '/author/blogs' : getRoleHomePath(role));
  };

  if (loading) return <LoadingSpinner />;
  if (!blog) return <Typography>Blog not found.</Typography>;

  return (
    <BlogForm
      initialValues={blog}
      submitLabel="Update Post"
      formTitle="Edit Post"
      formSubtitle="Update the post details and publishing status"
      onSubmit={handleSubmit}
      onCancel={() => navigate(getRoleHomePath(role))}
    />
  );
}

export default EditBlog;
