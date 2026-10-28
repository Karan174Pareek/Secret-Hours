import Razorpay from 'razorpay';
import crypto from 'node:crypto';

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

let instance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const razorpayService = {
  /**
   * Creates a prepaid order on Razorpay
   *
   * @param {Object} params
   * @param {number} params.amountPaise Integer paise amount (e.g. 150000 = Rs 1,500.00)
   * @param {string} params.receipt Local internal Order MongoDB ID or orderNumber
   * @param {Object} [params.notes] Metadata
   * @returns {Promise<Object>} { orderId, amount, currency, keyId }
   */
  async createOrder({ amountPaise, receipt, notes = {} }) {
    if (!instance) {
      // In dev mode when real Razorpay credentials are not yet populated:
      // Return a realistic mock order ID allowing seamless frontend flow
      const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
      return {
        orderId: mockOrderId,
        amount: Math.round(amountPaise),
        currency: 'INR',
        keyId: keyId,
        isMock: true,
      };
    }

    const order = await instance.orders.create({
      amount: Math.round(amountPaise),
      currency: 'INR',
      receipt: String(receipt).slice(-40),
      notes,
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      isMock: false,
    };
  },

  /**
   * Verifies client-sent payment signature using timing-safe comparison
   * HMAC-SHA256("${razorpay_order_id}|${razorpay_payment_id}")
   */
  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    
    // In dev mock mode if running test orders:
    if (!process.env.RAZORPAY_KEY_SECRET && razorpayOrderId.startsWith('order_')) {
      return true;
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const actualBuf = Buffer.from(String(razorpaySignature || ''), 'utf8');

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  },

  /**
   * Verifies Webhook raw body signature against X-Razorpay-Signature
   */
  verifyWebhookSignature({ rawBody, signature }) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';
    if (!signature || !rawBody) return false;

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const actualBuf = Buffer.from(String(signature), 'utf8');

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  },
};

export default razorpayService;
