import express from 'express';
import orderController from '../controllers/orderController.js';

const router = express.Router();

router.get('/track/:orderNumber', orderController.trackOrder);
router.get('/:id/invoice', orderController.downloadInvoice);
router.post('/calculate-taxes', orderController.calculateCartTaxes);

export default router;
