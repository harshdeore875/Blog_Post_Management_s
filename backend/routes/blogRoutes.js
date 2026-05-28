import express from 'express';
import {
  createBlog,
  deleteBlog,
  exportBlogsCsv,
  getAllBlogs,
  getSingleBlog,
  incrementBlogViews,
  publishBlog,
  searchBlogs,
  updateBlog,
} from '../controllers/blogController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { createBlogValidation } from '../validations/blogValidation.js';

const router = express.Router();

// Create a new blog post
router.post('/blogs', protect, authorizeRoles('admin', 'author'), createBlogValidation, createBlog);

// Get all blog posts
router.get('/blogs', optionalAuth, getAllBlogs);

// Search blog posts by title, author, or category
router.get('/blogs/search', optionalAuth, searchBlogs);

// Export all or filtered blog posts as a CSV file
router.get('/blogs/export', optionalAuth, exportBlogsCsv);

// Get a single blog post by ID
router.get('/blogs/:id', optionalAuth, getSingleBlog);

// Increment view count and return the blog
router.patch('/blogs/:id/view', optionalAuth, incrementBlogViews);

// Publish a blog post by ID
router.patch('/blogs/:id/publish', protect, authorizeRoles('admin', 'author'), publishBlog);

// Update a blog post by ID
router.put('/blogs/:id', protect, authorizeRoles('admin', 'author'), createBlogValidation, updateBlog);

// Delete a blog post by ID
router.delete('/blogs/:id', protect, authorizeRoles('admin', 'author'), deleteBlog);

export default router;
