import Order from '../models/Order.js';
import razorpayService from '../services/razorpayService.js';
import { formatInvoiceNumber } from '../services/invoiceService.js';

export const webhookController = {
  async handleRazorpayWebhook(req, res) {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody;

    // Verify webhook signature
    const isValid = razorpayService.verifyWebhookSignature({ rawBody, signature });
    if (!isValid && process.env.NODE_ENV === 'production') {
      console.warn('[Webhook] Tampered signature rejected.');
      return res.status(400).json({ error: true, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Webhook Received] Event: ${event}`);

    try {
      if (event === 'order.paid' || event === 'payment.captured') {
        const paymentEntity = payload.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;
        const paymentId = paymentEntity?.id;

        if (razorpayOrderId) {
          const order = await Order.findOne({ razorpayOrderId });
          if (order && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
            order.orderStatus = 'confirmed';
            order.razorpayPaymentId = paymentId;

            if (!order.invoiceNumber) {
              const count = await Order.countDocuments({ invoiceNumber: { $exists: true, $ne: null } });
              order.invoiceNumber = formatInvoiceNumber(count + 1);
              order.invoiceDate = new Date();
            }

            await order.save();
            console.log(`[Webhook Reconciled] Order #${order.orderNumber} marked paid via ${event}.`);
          }
        }
      } else if (event === 'payment.failed') {
        const paymentEntity = payload.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;

        if (razorpayOrderId) {
          const order = await Order.findOne({ razorpayOrderId });
          if (order && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'failed';
            await order.save();
            console.log(`[Webhook Failed] Order #${order.orderNumber} marked payment failed.`);
          }
        }
      }

      // Always return 200 OK immediately for webhook idempotency
      res.status(200).json({ status: 'ok' });
    } catch (err) {
      console.error('[Webhook Processing Error]:', err);
      res.status(500).json({ error: true, message: 'Internal webhook error' });
    }
  },
};

export default webhookController;
