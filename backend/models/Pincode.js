import mongoose from 'mongoose';

const pincodeSchema = new mongoose.Schema(
  {
    pincode: { type: String, required: true, unique: true, index: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    stateCode: { type: String, required: true }, // e.g. "07", "27"
    isServiceable: { type: Boolean, default: true },
    isCodAllowed: { type: Boolean, default: true },
    estimatedDays: { type: Number, default: 3 },
  },
  { timestamps: true }
);

export const Pincode = mongoose.model('Pincode', pincodeSchema);
export default Pincode;
