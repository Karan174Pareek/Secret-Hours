import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', requireAdmin, categoryController.createCategory);
router.delete('/:id', requireAdmin, categoryController.deleteCategory);

export default router;
