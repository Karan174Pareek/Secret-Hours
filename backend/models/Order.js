import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String },
  size: { type: String, required: true },
  color: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  hsn: { type: String, required: true },
  
  // All monetary fields in INTEGER PAISE
  unitTaxablePaise: { type: Number, required: true },
  totalTaxablePaise: { type: Number, required: true },
  gstRate: { type: Number, required: true },
  cgstPaise: { type: Number, default: 0 },
  sgstPaise: { type: Number, default: 0 },
  igstPaise: { type: Number, default: 0 },
  totalPaise: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    invoiceNumber: { type: String, unique: true, sparse: true, index: true },
    invoiceDate: { type: Date },
    
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      buyerGstin: { type: String, default: null }, // Optional B2B GSTIN
    },
    
    shippingAddress: {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      stateCode: { type: String, required: true }, // 2-digit Indian GST State code, e.g. "07", "27"
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    
    items: [orderItemSchema],
    
    // Aggregated financial totals in INTEGER PAISE
    subtotalTaxablePaise: { type: Number, required: true },
    discountPaise: { type: Number, default: 0 },
    cgstTotalPaise: { type: Number, default: 0 },
    sgstTotalPaise: { type: Number, default: 0 },
    igstTotalPaise: { type: Number, default: 0 },
    shippingFeePaise: { type: Number, default: 0 },
    shippingGstPaise: { type: Number, default: 0 },
    codFeePaise: { type: Number, default: 0 },
    codFeeGstPaise: { type: Number, default: 0 },
    grandTotalPaise: { type: Number, required: true },
    
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'pending_payment',
        'pending_confirmation',
        'confirmed',
        'shipped',
        'delivered',
        'rto',
        'cancelled',
      ],
      default: 'pending_payment',
      index: true,
    },
    
    // Razorpay Fields
    razorpayOrderId: { type: String, default: null, index: true },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    
    // Cash on Delivery OTP Verification
    otpVerified: { type: Boolean, default: false },
    cashCollected: { type: Boolean, default: false },
    cashCollectedAt: { type: Date },
    
    notes: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;
