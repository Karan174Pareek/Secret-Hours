import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', paymentController.createRazorpayOrder);
router.post('/verify', paymentController.verifyRazorpayPayment);
router.post('/send-otp', paymentController.sendCodOtp);
router.post('/confirm-cod', paymentController.confirmCodOrder);

export default router;
