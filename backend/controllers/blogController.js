import Blog from '../models/blogModel.js';
import { generateBlogsCsv } from '../utils/csvExport.js';

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

const isAdmin = (user) => user?.role === 'admin';

const isAuthorOwner = (user, blog) => {
  return user?.role === 'author' && blog.author === user.username;
};

const getVisibilityFilter = (user) => {
  if (user?.role === 'admin') {
    return {};
  }

  if (user?.role === 'author') {
    return {
      $or: [
        { status: 'Published' },
        { author: user.username, status: 'Draft' },
      ],
    };
  }

  return { status: 'Published' };
};

export const createBlog = async (req, res) => {
  try {
    const blogPayload = {
      ...req.body,
      author: req.user.role === 'author' ? req.user.username : req.body.author,
    };

    const blog = await Blog.create(blogPayload);

    return sendSuccess(res, 201, 'Blog created successfully', blog);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to create blog');
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;
    const filter = getVisibilityFilter(req.user);

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
      Blog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    return sendSuccess(res, 200, 'Blogs fetched successfully', {
      blogs,
      pagination: {
        totalBlogs,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      sorting: {
        sort: req.query.sort === 'oldest' ? 'oldest' : 'latest',
      },
      filtering: {
        category: req.query.category || null,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch blogs');
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const searchQuery = req.query.query?.trim();
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    if (!searchQuery) {
      return sendError(res, 400, 'Search query is required');
    }

    const searchFilter = {
      $and: [
        getVisibilityFilter(req.user),
        {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { author: { $regex: searchQuery, $options: 'i' } },
            { category: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      ],
    };

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(searchFilter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(searchFilter),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    return sendSuccess(res, 200, 'Search results fetched successfully', {
      blogs,
      search: {
        query: searchQuery,
        fields: ['title', 'author', 'category'],
      },
      pagination: {
        totalBlogs,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to search blogs');
  }
};

export const exportBlogsCsv = async (req, res) => {
  try {
    const filter = getVisibilityFilter(req.user);

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    const csv = generateBlogsCsv(blogs);

    res.header('Content-Type', 'text/csv');
    res.attachment('blogs.csv');

    return res.status(200).send(csv);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to export blogs');
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return sendError(res, 404, 'Blog not found');
    }

    const canViewDraft = isAdmin(req.user) || isAuthorOwner(req.user, blog);

    if (blog.status === 'Draft' && !canViewDraft) {
      return sendError(res, 404, 'Blog not found');
    }

    return sendSuccess(res, 200, 'Blog fetched successfully', blog);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch blog');
  }
};

export const incrementBlogViews = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return sendError(res, 404, 'Blog not found');
    }

    const canViewDraft = isAdmin(req.user) || isAuthorOwner(req.user, blog);

    if (blog.status === 'Draft') {
      if (!canViewDraft) {
        return sendError(res, 404, 'Blog not found');
      }

      // Drafts are viewable only by owner/admin; we don't count them as public views.
      return sendSuccess(res, 200, 'Blog fetched successfully', blog);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true, runValidators: true },
    );

    return sendSuccess(res, 200, 'Blog fetched successfully', updatedBlog);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to update blog views');
  }
};

export const updateBlog = async (req, res) => {
  try {
    const existingBlog = await Blog.findById(req.params.id);

    if (!existingBlog) {
      return sendError(res, 404, 'Blog not found');
    }

    if (!isAdmin(req.user) && !isAuthorOwner(req.user, existingBlog)) {
      return sendError(res, 403, 'Access denied');
    }

    const updatePayload = {
      ...req.body,
      author: req.user.role === 'author' ? req.user.username : req.body.author,
    };

    const blog = await Blog.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, 200, 'Blog updated successfully', blog);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to update blog');
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const existingBlog = await Blog.findById(req.params.id);

    if (!existingBlog) {
      return sendError(res, 404, 'Blog not found');
    }

    if (!isAdmin(req.user) && !isAuthorOwner(req.user, existingBlog)) {
      return sendError(res, 403, 'Access denied');
    }

    await Blog.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 200, 'Blog deleted successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to delete blog');
  }
};

export const publishBlog = async (req, res) => {
  try {
    const existingBlog = await Blog.findById(req.params.id);

    if (!existingBlog) {
      return sendError(res, 404, 'Blog not found');
    }

    if (!isAdmin(req.user) && !isAuthorOwner(req.user, existingBlog)) {
      return sendError(res, 403, 'Access denied');
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: 'Published' },
      { new: true, runValidators: true },
    );

    return sendSuccess(res, 200, 'Blog published successfully', blog);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to publish blog');
  }
};
