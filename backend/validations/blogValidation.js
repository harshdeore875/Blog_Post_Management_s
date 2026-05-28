import { body } from 'express-validator';
import validateRequest from './validateRequest.js';

export const createBlogValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters'),

  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address'),

  body('status')
    .optional()
    .isIn(['Published', 'Draft'])
    .withMessage('Status must be Published or Draft'),

  validateRequest,
];
