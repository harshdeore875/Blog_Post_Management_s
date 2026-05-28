import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const unauthorized = (res) => {
  return res.status(401).json({
    success: false,
    message: 'Unauthorized access',
  });
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return unauthorized(res);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return unauthorized(res);
    }

    req.user = user;
    return next();
  } catch (error) {
    return unauthorized(res);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    req.user = user || null;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};
