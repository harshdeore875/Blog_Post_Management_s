import express from 'express';
import {
  createAuthorBlog,
  deleteAuthorBlog,
  getAuthorBlogs,
  getAuthorDashboard,
  updateAuthorBlog,
} from '../controllers/authorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { createBlogValidation } from '../validations/blogValidation.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('author'));

router.get('/dashboard', getAuthorDashboard);
router.post('/blogs', createBlogValidation, createAuthorBlog);
router.get('/blogs', getAuthorBlogs);
router.put('/blogs/:id', createBlogValidation, updateAuthorBlog);
router.delete('/blogs/:id', deleteAuthorBlog);

export default router;
