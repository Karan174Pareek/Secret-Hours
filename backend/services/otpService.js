import crypto from 'node:crypto';

/**
 * In-memory store for OTPs (in production, backed by Redis with TTL)
 */
const otpStore = new Map();

/**
 * Pluggable OtpProvider interface with Dev/Console implementation
 * Ready slots for MSG91 / Twilio
 */
export const otpService = {
  /**
   * Generates a 6-digit OTP and logs/sends to phone
   *
   * @param {string} phone Normalized 10-digit Indian mobile number
   * @returns {Object} { success: boolean, devCode?: string }
   */
  async sendOtp(phone) {
    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      throw new Error('Please enter a valid 10-digit Indian mobile number.');
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minute expiry

    otpStore.set(cleanPhone, { otp, expiresAt, attempts: 0 });

    const provider = process.env.OTP_PROVIDER || 'console';

    if (provider === 'console' || process.env.NODE_ENV !== 'production') {
      console.log(`\n========================================`);
      console.log(`[DEV OTP PROVIDER] Phone: +91-${cleanPhone}`);
      console.log(`[DEV OTP CODE]     ${otp}`);
      console.log(`[DEV OTP EXPIRES]  5 minutes`);
      console.log(`========================================\n`);

      return {
        success: true,
        phone: cleanPhone,
        devCode: otp, // Returned for dev test convenience
        message: 'OTP sent to mobile phone (check terminal console).',
      };
    }

    // Production Slot: MSG91 / Twilio API integration
    // await sendViaSmsProvider(cleanPhone, otp);
    return {
      success: true,
      phone: cleanPhone,
      message: 'OTP sent successfully to registered phone number.',
    };
  },

  /**
   * Verifies the provided 6-digit OTP
   *
   * @param {string} phone
   * @param {string} code
   * @returns {boolean}
   */
  verifyOtp(phone, code) {
    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    const record = otpStore.get(cleanPhone);

    if (!record) {
      return false;
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return false;
    }

    if (record.attempts >= 4) {
      otpStore.delete(cleanPhone);
      throw new Error('Too many invalid attempts. Please request a new OTP.');
    }

    const expectedBuffer = Buffer.from(record.otp, 'utf8');
    const inputBuffer = Buffer.from(String(code).trim(), 'utf8');

    if (expectedBuffer.length !== inputBuffer.length) {
      record.attempts += 1;
      return false;
    }

    const isValid = crypto.timingSafeEqual(expectedBuffer, inputBuffer);
    if (isValid) {
      otpStore.delete(cleanPhone); // Consume on success
      return true;
    }

    record.attempts += 1;
    return false;
  },
};

export default otpService;
