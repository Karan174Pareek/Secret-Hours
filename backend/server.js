import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { brandConfig } from './config/brandConfig.js';
import { gstConfig } from './config/gstConfig.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import pincodeRoutes from './routes/pincodeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

dotenv.config();

// Connect MongoDB
connectDB().catch((err) => console.error('[MongoDB Startup Error]:', err.message));

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://checkout.razorpay.com"],
        connectSrc: ["'self'", "https://api.razorpay.com", "https://lumberjack.razorpay.com"],
        frameSrc: ["'self'", "https://api.razorpay.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.razorpay.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS allow-list
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Razorpay-Signature'],
  })
);

// Raw body preservation for Razorpay webhook signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    label: brandConfig.name,
    gstin: brandConfig.gstin,
    sellerStateCode: brandConfig.stateCode,
    timestamp: new Date().toISOString(),
  });
});

// Brand Public Config Endpoint
app.get('/api/brand', (req, res) => {
  res.json({
    name: brandConfig.name,
    tagline: brandConfig.tagline,
    state: brandConfig.state,
    stateCode: brandConfig.stateCode,
    contact: brandConfig.contact,
    prepaidIncentive: brandConfig.prepaidIncentive,
    codPolicy: brandConfig.codPolicy,
  });
});

// Modular Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pincodes', pincodeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal atelier service error';
  res.status(status).json({
    error: true,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[ZARIYA API] Running on http://localhost:${PORT}`);
    console.log(`[GST Engine] Seller State Code: ${gstConfig.sellerStateCode} (Threshold: Rs ${gstConfig.slabThresholdPaise / 100})`);
  });
}

export default app;
