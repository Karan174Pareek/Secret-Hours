import Pincode from '../models/Pincode.js';
import { gstConfig } from '../config/gstConfig.js';

export const pincodeController = {
  // Check delivery and COD eligibility for a 6-digit Indian pincode
  async checkPincode(req, res, next) {
    try {
      const { pincode } = req.params;
      const cleanPincode = String(pincode).trim();

      if (!/^\d{6}$/.test(cleanPincode)) {
        return res.status(400).json({ error: true, message: 'Please enter a valid 6-digit Indian postal code.' });
      }

      let record = await Pincode.findOne({ pincode: cleanPincode });

      // If not in database, provide a default serviceable state mapping
      if (!record) {
        // Derive state code from first digits of Indian pincode
        const firstDigit = cleanPincode[0];
        let stateCode = '19'; // West Bengal (Siliguri) default
        let stateName = 'West Bengal';
        let city = cleanPincode.startsWith('734') ? 'Siliguri' : 'Bengal Region';

        if (cleanPincode.startsWith('734')) {
          stateCode = '19';
          stateName = 'West Bengal';
          city = 'Siliguri';
        } else if (firstDigit === '7') {
          stateCode = '19';
          stateName = 'West Bengal';
          city = 'Kolkata / Bengal';
        } else if (firstDigit === '1') {
          stateCode = '07';
          stateName = 'Delhi';
          city = 'Delhi NCR';
        } else if (firstDigit === '2') {
          stateCode = '09';
          stateName = 'Uttar Pradesh';
          city = 'Noida / Agra';
        } else if (firstDigit === '3') {
          stateCode = '08';
          stateName = 'Rajasthan';
          city = 'Jaipur';
        } else if (firstDigit === '4') {
          stateCode = '27';
          stateName = 'Maharashtra';
          city = 'Mumbai / Pune';
        } else if (firstDigit === '5') {
          stateCode = '37';
          stateName = 'Andhra Pradesh / Telangana';
          city = 'Hyderabad';
        } else if (firstDigit === '6') {
          stateCode = '33';
          stateName = 'Tamil Nadu / Kerala';
          city = 'Chennai / Kochi';
        } else if (firstDigit === '8') {
          stateCode = '10';
          stateName = 'Bihar / Jharkhand';
          city = 'Patna';
        }

        record = {
          pincode: cleanPincode,
          city,
          state: stateName,
          stateCode,
          isServiceable: true,
          isCodAllowed: true,
          estimatedDays: cleanPincode.startsWith('734') ? 1 : 3,
        };
      }

      const isIntraState = record.stateCode === (process.env.SELLER_STATE_CODE || '19');

      res.json({
        success: true,
        pincode: record.pincode,
        city: record.city,
        state: record.state,
        stateCode: record.stateCode,
        isServiceable: record.isServiceable,
        isCodAllowed: record.isCodAllowed,
        estimatedDays: record.estimatedDays,
        isIntraState,
        taxType: isIntraState ? 'CGST + SGST (Intra-State)' : 'IGST (Inter-State)',
      });
    } catch (err) {
      next(err);
    }
  },

  // Admin list all pincodes
  async getAllPincodes(req, res, next) {
    try {
      const list = await Pincode.find().sort({ state: 1, pincode: 1 });
      res.json({ success: true, count: list.length, pincodes: list });
    } catch (err) {
      next(err);
    }
  },

  // Admin toggle COD allowed on pincode
  async toggleCod(req, res, next) {
    try {
      const { pincode } = req.params;
      const { isCodAllowed, isServiceable } = req.body;

      const updated = await Pincode.findOneAndUpdate(
        { pincode },
        { ...(isCodAllowed !== undefined ? { isCodAllowed } : {}), ...(isServiceable !== undefined ? { isServiceable } : {}) },
        { new: true, upsert: true }
      );

      res.json({ success: true, pincode: updated });
    } catch (err) {
      next(err);
    }
  },
};

export default pincodeController;
