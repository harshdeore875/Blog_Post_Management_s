import Blog from '../models/blogModel.js';

const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const getAuthorFilter = (req) => ({
  author: req.user.username,
});

export const createAuthorBlog = async (req, res) => {
  try {
    
    const blog = await Blog.create({
      ...req.body,
      author: req.user.username,
    });

    return sendSuccess(res, 201, 'Blog created successfully', blog);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to create blog');
  }
};

export const getAuthorBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(getAuthorFilter(req)).sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Author blogs fetched successfully', blogs);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch author blogs');
  }
};

export const updateAuthorBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        ...getAuthorFilter(req),
      },
      {
        ...req.body,
        author: req.user.username,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!blog) {
      return sendError(res, 404, 'Blog not found or access denied');
    }

    return sendSuccess(res, 200, 'Blog updated successfully', blog);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to update blog');
  }
};

export const deleteAuthorBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      ...getAuthorFilter(req),
    });

    if (!blog) {
      return sendError(res, 404, 'Blog not found or access denied');
    }

    return sendSuccess(res, 200, 'Blog deleted successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to delete blog');
  }
};

export const getAuthorDashboard = async (req, res) => {
  try {
    const authorFilter = getAuthorFilter(req);
    const [totalBlogs, latestPosts, authorBlogs] = await Promise.all([
      Blog.countDocuments(authorFilter),
      Blog.find(authorFilter).sort({ createdAt: -1 }).limit(5),
      Blog.find(authorFilter).select('views'),
    ]);

    const totalViews = authorBlogs.reduce((total, blog) => total + (blog.views || 0), 0);

    return sendSuccess(res, 200, 'Author dashboard fetched successfully', {
      totalBlogs,
      totalViews,
      latestPosts,
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch author dashboard');
  }
};
