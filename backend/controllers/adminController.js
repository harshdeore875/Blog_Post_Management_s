import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';

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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch users');
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User fetched successfully', user);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch user');
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['user', 'author', 'admin'];

    if (!allowedRoles.includes(role)) {
      return sendError(res, 400, 'Invalid user role');
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true,
      },
    ).select('-password');

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User role updated successfully', user);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to update user role');
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User deleted successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to delete user');
  }
};

export const getAllBlogsForAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Blogs fetched successfully', blogs);
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch blogs');
  }
};

export const deleteBlogForAdmin = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return sendError(res, 404, 'Blog not found');
    }

    return sendSuccess(res, 200, 'Blog deleted successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to delete blog');
  }
};
