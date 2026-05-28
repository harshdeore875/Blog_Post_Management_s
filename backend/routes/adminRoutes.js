import express from 'express';
import {
  changeUserRole,
  deleteBlogForAdmin,
  deleteUser,
  getAllBlogsForAdmin,
  getAllUsers,
  getSingleUser,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getSingleUser);
router.put('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);

router.get('/blogs', getAllBlogsForAdmin);
router.delete('/blogs/:id', deleteBlogForAdmin);

export default router;
