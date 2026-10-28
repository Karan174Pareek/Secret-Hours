import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

/**
 * Timing-safe HMAC verification function matching production payment service
 */
function verifyRazorpaySignature({ orderId, paymentId, signature, secret }) {
  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const actualBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

describe('Razorpay Signature Verification Tests', () => {
  const secret = 'rzp_test_secret_key_1234567890';
  const orderId = 'order_test_987654321';
  const paymentId = 'pay_test_123456789';

  it('successfully verifies a valid Razorpay HMAC-SHA256 signature', () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: validSignature,
      secret,
    });

    assert.strictEqual(isValid, true, 'Valid HMAC signature must verify');
  });

  it('rejects an invalid/tampered signature', () => {
    const tamperedSignature = 'a'.repeat(64);

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: tamperedSignature,
      secret,
    });

    assert.strictEqual(isValid, false, 'Tampered signature must be rejected');
  });

  it('rejects signature verified with incorrect secret', () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: validSignature,
      secret: 'wrong_secret',
    });

    assert.strictEqual(isValid, false, 'Wrong secret must fail verification');
  });

  it('rejects malformed or empty signatures safely', () => {
    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: 'short_sig',
      secret,
    });

    assert.strictEqual(isValid, false, 'Mismatched length must return false without exception');
  });
});
