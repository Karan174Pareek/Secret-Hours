import express from 'express';
import pincodeController from '../controllers/pincodeController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/check/:pincode', pincodeController.checkPincode);
router.get('/', requireAdmin, pincodeController.getAllPincodes);
router.post('/toggle/:pincode', requireAdmin, pincodeController.toggleCod);

export default router;
