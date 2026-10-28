import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { calculateOrderTaxes } from '../services/gstEngine.js';
import { generateInvoicePdf, formatInvoiceNumber } from '../services/invoiceService.js';
import crypto from 'node:crypto';

export const orderController = {
  // Public Order Tracking
  async trackOrder(req, res, next) {
    try {
      const { orderNumber } = req.params;
      const order = await Order.findOne({ orderNumber }).select('-__v');
      if (!order) {
        return res.status(404).json({ error: true, message: 'No atelier order found with this reference number.' });
      }
      res.json({ success: true, order });
    } catch (err) {
      next(err);
    }
  },

  // Download PDF Tax Invoice
  async downloadInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }],
      });

      if (!order) {
        return res.status(404).json({ error: true, message: 'Order invoice not found.' });
      }

      // Assign sequential invoice number if not already generated
      if (!order.invoiceNumber) {
        const orderCount = await Order.countDocuments({ invoiceNumber: { $exists: true, $ne: null } });
        order.invoiceNumber = formatInvoiceNumber(orderCount + 1);
        order.invoiceDate = new Date();
        await order.save();
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Invoice-${order.invoiceNumber.replace(/\//g, '-')}.pdf"`);

      generateInvoicePdf(order, res);
    } catch (err) {
      next(err);
    }
  },

  // Calculate live Cart Taxes endpoint (used by frontend for instant real-time breakdown)
  async calculateCartTaxes(req, res, next) {
    try {
      const { items, pincode, stateCode = '07', isPrepaid = false, isCod = false } = req.body;
      if (!items || !items.length) {
        return res.status(400).json({ error: true, message: 'Cart items cannot be empty.' });
      }

      // Fetch official server prices from database to prevent client price tampering
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
        const basePricePaise = dbProduct ? dbProduct.basePricePaise : item.basePricePaise;

        return {
          product: dbProduct ? dbProduct._id : idKey,
          title: dbProduct ? dbProduct.title : item.title,
          slug: dbProduct ? dbProduct.slug : item.slug,
          image: dbProduct ? dbProduct.images[0] : item.image,
          size: item.size || 'M',
          color: item.color || 'Default',
          qty: Math.max(1, Number(item.qty) || 1),
          basePricePaise,
          hsn: dbProduct ? dbProduct.hsn : (item.hsn || '6204'),
        };
      });

      const rawSubtotal = verifiedItems.reduce((acc, i) => acc + i.basePricePaise * i.qty, 0);

      // 5% instant discount on prepaid orders
      const discountPaise = isPrepaid ? Math.round(rawSubtotal * 0.05) : 0;
      const codFeePaise = isCod ? 15000 : 0; // Rs 150

      const taxes = calculateOrderTaxes({
        items: verifiedItems,
        placeOfSupplyStateCode: stateCode,
        discountPaise,
        shippingFeePaise: 0, // Complimentary white-glove shipping
        codFeePaise,
      });

      res.json({ success: true, taxes });
    } catch (err) {
      next(err);
    }
  },
};

export default orderController;
