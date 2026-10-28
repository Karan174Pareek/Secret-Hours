import mongoose from 'mongoose';
import crypto from 'node:crypto';

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin', 'atelier_manager'] },
  },
  { timestamps: true }
);

// Method to verify password
adminUserSchema.methods.verifyPassword = function (password) {
  const hash = crypto.scryptSync(password, this.salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(this.passwordHash, 'hex'), Buffer.from(hash, 'hex'));
};

// Static method to create hashed user
adminUserSchema.statics.hashPassword = function (password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, passwordHash };
};

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export default AdminUser;
