import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Pincode from '../models/Pincode.js';
import { calculateOrderTaxes } from '../services/gstEngine.js';
import { formatInvoiceNumber } from '../services/invoiceService.js';
import razorpayService from '../services/razorpayService.js';
import otpService from '../services/otpService.js';
import crypto from 'node:crypto';

export const paymentController = {
  // 1. Create Razorpay Order (Prepaid)
  async createRazorpayOrder(req, res, next) {
    try {
      const { customer, shippingAddress, items } = req.body;

      if (!customer || !shippingAddress || !items || !items.length) {
        return res.status(400).json({ error: true, message: 'Incomplete checkout parameters.' });
      }

      // Fetch authentic DB prices (Never trust client sent numbers)
      const rawIdentifiers = items.map((i) => i.id || i._id || i.product || i.slug).filter(Boolean);
      const validObjectIds = rawIdentifiers.filter((id) => /^[0-9a-fA-F]{24}$/.test(String(id)));
      const slugsOrCustomIds = rawIdentifiers.filter((id) => !/^[0-9a-fA-F]{24}$/.test(String(id)));

      const queryOr = [];
      if (validObjectIds.length) queryOr.push({ _id: { $in: validObjectIds } });
      if (slugsOrCustomIds.length) queryOr.push({ slug: { $in: slugsOrCustomIds } });

      const dbProducts = queryOr.length ? await Product.find({ $or: queryOr }) : [];
      const productMap = new Map();
      dbProducts.forEach((p) => {
        productMap.set(p._id.toString(), p);
        if (p.slug) productMap.set(p.slug, p);
      });

      const verifiedItems = items.map((item) => {
        const idKey = String(item.id || item._id || item.product || '');
        const slugKey = String(item.slug || '');
        const dbProduct = productMap.get(idKey) || productMap.get(slugKey);
        if (!dbProduct) {
          throw new Error(`Garment ${item.title || idKey || slugKey} is no longer available in the atelier collection.`);
        }

        return {
          product: dbProduct._id,
          title: dbProduct.title,
          slug: dbProduct.slug,
          image: dbProduct.images[0],
          size: item.size || 'M',
          color: item.color || 'Default',
          qty: Math.max(1, Number(item.qty) || 1),
          basePricePaise: dbProduct.basePricePaise,
          hsn: dbProduct.hsn,
        };
      });

      // 5% instant discount on prepaid Razorpay orders to nudge away from COD
      const rawSubtotal = verifiedItems.reduce((acc, i) => acc + i.basePricePaise * i.qty, 0);
      const prepaidDiscountPaise = Math.round(rawSubtotal * 0.05);

      const taxes = calculateOrderTaxes({
        items: verifiedItems,
        placeOfSupplyStateCode: shippingAddress.stateCode || '07',
        discountPaise: prepaidDiscountPaise,
        shippingFeePaise: 0,
        codFeePaise: 0,
      });

      const orderNumber = `ZA-${Date.now().toString().slice(-6)}-${crypto.randomInt(100, 999)}`;

      const order = new Order({
        orderNumber,
        customer,
        shippingAddress,
        items: taxes.items,
        subtotalTaxablePaise: taxes.subtotalTaxablePaise,
        discountPaise: taxes.discountPaise,
        cgstTotalPaise: taxes.cgstTotalPaise,
        sgstTotalPaise: taxes.sgstTotalPaise,
        igstTotalPaise: taxes.igstTotalPaise,
        shippingFeePaise: 0,
        shippingGstPaise: 0,
        codFeePaise: 0,
        codFeeGstPaise: 0,
        grandTotalPaise: taxes.grandTotalPaise,
        paymentMethod: 'razorpay',
        paymentStatus: 'pending',
        orderStatus: 'pending_payment',
      });

      await order.save();

      // Call official Razorpay SDK
      const razorpayOrder = await razorpayService.createOrder({
        amountPaise: taxes.grandTotalPaise,
        receipt: order._id.toString(),
        notes: {
          orderNumber: order.orderNumber,
          customerName: customer.name,
          phone: customer.phone,
        },
      });

      order.razorpayOrderId = razorpayOrder.orderId;
      await order.save();

      res.json({
        success: true,
        orderId: razorpayOrder.orderId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: razorpayOrder.keyId,
        localOrderId: order._id,
        orderNumber: order.orderNumber,
        isMock: razorpayOrder.isMock,
      });
    } catch (err) {
      next(err);
    }
  },

  // 2. Verify Razorpay Payment Signature
  async verifyRazorpayPayment(req, res, next) {
    try {
      const { localOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      const order = await Order.findById(localOrderId);
      if (!order) {
        return res.status(404).json({ error: true, message: 'Order record not found.' });
      }

      // Timing-safe HMAC verification
      const isValid = razorpayService.verifyPaymentSignature({
        razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      if (!isValid) {
        order.paymentStatus = 'failed';
        await order.save();
        return res.status(400).json({ error: true, message: 'Invalid payment signature. Verification failed.' });
      }

      // Mark order paid and assign sequential FY invoice number
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;

      if (!order.invoiceNumber) {
        const orderCount = await Order.countDocuments({ invoiceNumber: { $exists: true, $ne: null } });
        order.invoiceNumber = formatInvoiceNumber(orderCount + 1);
        order.invoiceDate = new Date();
      }

      await order.save();

      // Decrement stock for purchased items
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product, 'sizes.size': item.size },
          { $inc: { 'sizes.$.stock': -item.qty } }
        );
      }

      res.json({
        success: true,
        message: 'Payment verified successfully.',
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber,
        grandTotalRupees: order.grandTotalPaise / 100,
      });
    } catch (err) {
      next(err);
    }
  },

  // 3. Send Phone OTP for Cash on Delivery (COD)
  async sendCodOtp(req, res, next) {
    try {
      const { phone, pincode, totalPaise } = req.body;
      if (!phone) {
        return res.status(400).json({ error: true, message: 'Mobile phone number is required.' });
      }

      // 1. Max COD amount check (<= Rs 50,000 = 5,000,000 paise)
      if (totalPaise > 5000000) {
        return res.status(400).json({
          error: true,
          message: 'Cash on Delivery is limited to orders up to ₹50,000. Please choose Razorpay prepaid.',
        });
      }

      // 2. Check pincode COD whitelist
      if (pincode) {
        const pincodeRecord = await Pincode.findOne({ pincode: String(pincode).trim() });
        if (pincodeRecord && !pincodeRecord.isCodAllowed) {
          return res.status(400).json({
            error: true,
            message: 'Cash on Delivery is currently unserviceable for this postal pincode.',
          });
        }
      }

      const result = await otpService.sendOtp(phone);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  // 4. Confirm COD Order with verified OTP
  async confirmCodOrder(req, res, next) {
    try {
      const { customer, shippingAddress, items, otpCode } = req.body;

      if (!customer?.phone || !otpCode) {
        return res.status(400).json({ error: true, message: 'Phone number and verification OTP code are required.' });
      }

      // Verify OTP with timing-safe comparison
      const isOtpValid = otpService.verifyOtp(customer.phone, otpCode);
      if (!isOtpValid) {
        return res.status(400).json({ error: true, message: 'Invalid or expired OTP. Please verify and try again.' });
      }

      // Fetch authentic DB prices
      const rawIdentifiers = items.map((i) => i.id || i._id || i.product || i.slug).filter(Boolean);
      const validObjectIds = rawIdentifiers.filter((id) => /^[0-9a-fA-F]{24}$/.test(String(id)));
      const slugsOrCustomIds = rawIdentifiers.filter((id) => !/^[0-9a-fA-F]{24}$/.test(String(id)));

      const queryOr = [];
      if (validObjectIds.length) queryOr.push({ _id: { $in: validObjectIds } });
      if (slugsOrCustomIds.length) queryOr.push({ slug: { $in: slugsOrCustomIds } });

      const dbProducts = queryOr.length ? await Product.find({ $or: queryOr }) : [];
      const productMap = new Map();
      dbProducts.forEach((p) => {
        productMap.set(p._id.toString(), p);
        if (p.slug) productMap.set(p.slug, p);
      });

      const verifiedItems = items.map((item) => {
        const idKey = String(item.id || item._id || item.product || '');
        const slugKey = String(item.slug || '');
        const dbProduct = productMap.get(idKey) || productMap.get(slugKey);
        if (!dbProduct) {
          throw new Error(`Garment ${item.title || idKey || slugKey} is no longer available.`);
        }

        return {
          product: dbProduct._id,
          title: dbProduct.title,
          slug: dbProduct.slug,
          image: dbProduct.images[0],
          size: item.size || 'M',
          color: item.color || 'Default',
          qty: Math.max(1, Number(item.qty) || 1),
          basePricePaise: dbProduct.basePricePaise,
          hsn: dbProduct.hsn,
        };
      });

      // Rs 150 COD handling surcharge
      const codFeePaise = 15000;

      const taxes = calculateOrderTaxes({
        items: verifiedItems,
        placeOfSupplyStateCode: shippingAddress.stateCode || '07',
        discountPaise: 0,
        shippingFeePaise: 0,
        codFeePaise,
      });

      const orderNumber = `ZA-${Date.now().toString().slice(-6)}-${crypto.randomInt(100, 999)}`;
      const orderCount = await Order.countDocuments({ invoiceNumber: { $exists: true, $ne: null } });
      const invoiceNumber = formatInvoiceNumber(orderCount + 1);

      const order = new Order({
        orderNumber,
        invoiceNumber,
        invoiceDate: new Date(),
        customer,
        shippingAddress,
        items: taxes.items,
        subtotalTaxablePaise: taxes.subtotalTaxablePaise,
        discountPaise: 0,
        cgstTotalPaise: taxes.cgstTotalPaise,
        sgstTotalPaise: taxes.sgstTotalPaise,
        igstTotalPaise: taxes.igstTotalPaise,
        shippingFeePaise: 0,
        shippingGstPaise: 0,
        codFeePaise: taxes.codFeePaise,
        codFeeGstPaise: taxes.codFeeGstPaise,
        grandTotalPaise: taxes.grandTotalPaise,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
        otpVerified: true,
      });

      await order.save();

      // Decrement stock
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product, 'sizes.size': item.size },
          { $inc: { 'sizes.$.stock': -item.qty } }
        );
      }

      res.status(201).json({
        success: true,
        message: 'COD Order placed and confirmed successfully.',
        orderNumber: order.orderNumber,
        invoiceNumber: order.invoiceNumber,
        grandTotalRupees: order.grandTotalPaise / 100,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default paymentController;
