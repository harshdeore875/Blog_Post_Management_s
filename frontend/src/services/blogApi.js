import axiosInstance from './axiosInstance.js';

const formatDate = (date) => {
  if (!date) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

const normalizeBlog = (blog, index = 0) => ({
  ...blog,
  id: blog._id,
  displayId: index + 1,
  status: blog.status || 'Draft',
  tags: Array.isArray(blog.tags) ? blog.tags : [],
  createdDate: formatDate(blog.createdAt),
});

const normalizeBlogs = (blogs) => blogs.map((blog, index) => normalizeBlog(blog, index));

export const blogApi = {
  axiosInstance,

  getBlogs: async (params = {}) => {
    const response = await axiosInstance.get('/blogs', {
      params: {
        sort: 'oldest',
        limit: 100,
        ...params,
      },
    });
    const payload = response.data.data;
    const blogs = Array.isArray(payload) ? payload : payload.blogs;

    return normalizeBlogs(blogs || []);
  },

  getBlogById: async (id) => {
    const response = await axiosInstance.get(`/blogs/${id}`);

    return normalizeBlog(response.data.data);
  },

  viewBlogById: async (id) => {
    const response = await axiosInstance.patch(`/blogs/${id}/view`);

    return normalizeBlog(response.data.data);
  },

  createBlog: async (payload) => {
    const response = await axiosInstance.post('/blogs', payload);

    return normalizeBlog(response.data.data);
  },

  updateBlog: async (id, payload) => {
    const response = await axiosInstance.put(`/blogs/${id}`, payload);

    return normalizeBlog(response.data.data);
  },

  publishBlog: async (id) => {
    const response = await axiosInstance.patch(`/blogs/${id}/publish`);

    return normalizeBlog(response.data.data);
  },

  deleteBlog: async (id) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);

    return response.data;
  },

  exportBlogs: async (params = {}) => {
    const response = await axiosInstance.get('/blogs/export', {
      params,
      responseType: 'blob',
    });

    return response.data;
  },
};
