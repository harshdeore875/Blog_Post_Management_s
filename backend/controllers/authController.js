import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});

const getRoleHomePath = (role) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'author') return '/author/dashboard';
  return '/blogs';
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const sanitizeUser = (user) => {
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

export const register = async (req, res) => {
  try {
    const { username, email, password, profileImage, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendError(res, 400, 'User already exists with this email');
    }

    const user = await User.create({
      username,
      email,
      password,
      profileImage,
      role: role || 'user',
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: sanitizeUser(user),
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to register user');
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user._id);

    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user),
        redirectTo: getRoleHomePath(user.role),
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to login');
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', getClearCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to logout');
  }
};

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: req.user,
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch profile');
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, 'Email is required');
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If email exists, password reset link will be sent',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    console.log(`Password reset link: ${resetUrl}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
      data: {
        resetLink: resetUrl,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to process forgot password');
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return sendError(res, 400, 'New password is required');
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return sendError(res, 400, 'Invalid or expired reset token');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to reset password');
  }
};
