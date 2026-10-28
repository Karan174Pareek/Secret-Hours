import express from 'express';
import adminController from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminController.login);
router.get('/orders', requireAdmin, adminController.getOrders);
router.patch('/orders/:id/status', requireAdmin, adminController.updateOrderStatus);
router.post('/orders/:id/collect-cash', requireAdmin, adminController.markCashCollected);
router.get('/analytics', requireAdmin, adminController.getAnalytics);

export default router;
