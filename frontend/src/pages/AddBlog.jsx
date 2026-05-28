import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BlogForm from '../components/blog/BlogForm.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { blogApi } from '../services/blogApi.js';
import { getRoleHomePath } from '../utils/roleRedirect.js';

function AddBlog() {
  const navigate = useNavigate();
  const { role, user } = useAuth();

  const handleSubmit = async (values) => {
    try {
      await blogApi.createBlog(values);
      toast.success('Blog created successfully');
      navigate(role === 'author' ? '/author/blogs' : getRoleHomePath(role));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blog');
    }
  };

  const initialValues = {
    author: user?.username || '',
    email: user?.email || '',
    status: 'Draft',
  };

  return (
    <BlogForm
      initialValues={initialValues}
      submitLabel="Save Post"
      onSubmit={handleSubmit}
      onCancel={() => navigate(role === 'author' ? '/author/blogs' : getRoleHomePath(role))}
    />
  );
}

export default AddBlog;
