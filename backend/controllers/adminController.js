import AdminUser from '../models/AdminUser.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'zariya_couture_jwt_secret_dev_32chars';

export const adminController = {
  // Admin Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: true, message: 'Email and password are required.' });
      }

      const admin = await AdminUser.findOne({ email: email.toLowerCase() });
      if (!admin || !admin.verifyPassword(password)) {
        return res.status(401).json({ error: true, message: 'Invalid atelier administrator credentials.' });
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // httpOnly secure cookie
      res.cookie('zariya_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        token,
        admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
      });
    } catch (err) {
      next(err);
    }
  },

  // Get Admin Orders List
  async getOrders(req, res, next) {
    try {
      const { status, paymentMethod } = req.query;
      const filter = {};
      if (status) filter.orderStatus = status;
      if (paymentMethod) filter.paymentMethod = paymentMethod;

      const orders = await Order.find(filter).sort({ createdAt: -1 });
      res.json({ success: true, count: orders.length, orders });
    } catch (err) {
      next(err);
    }
  },

  // Update Order Status
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;

      const validStatuses = [
        'pending_payment',
        'pending_confirmation',
        'confirmed',
        'shipped',
        'delivered',
        'rto',
        'cancelled',
      ];

      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({ error: true, message: 'Invalid order transition status.' });
      }

      const order = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
      if (!order) {
        return res.status(404).json({ error: true, message: 'Order not found' });
      }

      res.json({ success: true, order });
    } catch (err) {
      next(err);
    }
  },

  // Mark Cash Collected for COD
  async markCashCollected(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ error: true, message: 'Order not found' });
      }

      order.cashCollected = true;
      order.cashCollectedAt = new Date();
      order.paymentStatus = 'paid';
      order.orderStatus = 'delivered';
      await order.save();

      res.json({ success: true, message: 'Cash collection confirmed and order marked delivered.', order });
    } catch (err) {
      next(err);
    }
  },

  // Atelier Analytics
  async getAnalytics(req, res, next) {
    try {
      const totalOrders = await Order.countDocuments();
      const paidOrders = await Order.find({ paymentStatus: 'paid' });
      const totalRevenuePaise = paidOrders.reduce((acc, o) => acc + o.grandTotalPaise, 0);

      const prepaidCount = await Order.countDocuments({ paymentMethod: 'razorpay' });
      const codCount = await Order.countDocuments({ paymentMethod: 'cod' });
      const productsCount = await Product.countDocuments({ isActive: true });

      res.json({
        success: true,
        analytics: {
          totalOrders,
          paidOrdersCount: paidOrders.length,
          totalRevenuePaise,
          totalRevenueRupees: totalRevenuePaise / 100,
          prepaidCount,
          codCount,
          productsCount,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default adminController;
