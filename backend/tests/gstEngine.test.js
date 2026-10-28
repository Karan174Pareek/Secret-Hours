import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { determineGstRate, calculateOrderTaxes } from '../services/gstEngine.js';

describe('Indian GST Engine Unit Tests', () => {
  describe('Boundary Tests for 5% vs 18% Apparel Slabs', () => {
    it('applies 5% rate at exactly Rs 2,500.00 (250,000 paise)', () => {
      const rate = determineGstRate(250000);
      assert.strictEqual(rate, 0.05, 'Boundary Rs 2500.00 must be 5% GST');
    });

    it('applies 18% rate at Rs 2,500.01 (250,001 paise)', () => {
      const rate = determineGstRate(250001);
      assert.strictEqual(rate, 0.18, 'Boundary Rs 2500.01 must be 18% GST');
    });

    it('applies 5% rate for low-value pret (e.g. Rs 1,800 = 180,000 paise)', () => {
      const rate = determineGstRate(180000);
      assert.strictEqual(rate, 0.05);
    });

    it('applies 18% rate for high couture (e.g. Rs 1,45,000 = 14,500,000 paise)', () => {
      const rate = determineGstRate(14500000);
      assert.strictEqual(rate, 0.18);
    });
  });

  describe('Intra-State vs Inter-State GST Split', () => {
    it('correctly splits intra-state into CGST 50% + SGST 50% and 0 IGST (Seller: 19 West Bengal, Buyer: 19 West Bengal)', () => {
      const result = calculateOrderTaxes({
        items: [
          {
            product: 'p1',
            title: 'Chanderi Kurta',
            basePricePaise: 200000, // Rs 2,000 => 5% GST = Rs 100 (10,000 paise)
            qty: 1,
            hsn: '6204',
          },
        ],
        placeOfSupplyStateCode: '19', // West Bengal
        sellerStateCode: '19',
      });

      assert.strictEqual(result.isIntraState, true);
      assert.strictEqual(result.items[0].gstRate, 0.05);
      assert.strictEqual(result.cgstTotalPaise, 5000, 'CGST must be 2.5% = 5,000 paise');
      assert.strictEqual(result.sgstTotalPaise, 5000, 'SGST must be 2.5% = 5,000 paise');
      assert.strictEqual(result.igstTotalPaise, 0, 'IGST must be 0 for intra-state supply');
      assert.strictEqual(result.grandTotalPaise, 210000, 'Total must be Rs 2,100 (210,000 paise)');
    });

    it('correctly charges full IGST and 0 CGST/SGST for inter-state supply (Seller: 19 West Bengal, Buyer: 27 Maharashtra)', () => {
      const result = calculateOrderTaxes({
        items: [
          {
            product: 'p2',
            title: 'Royal Noor Lehenga',
            basePricePaise: 10000000, // Rs 1,00,000 => 18% GST = Rs 18,000 (1,800,000 paise)
            qty: 1,
            hsn: '6204',
          },
        ],
        placeOfSupplyStateCode: '27', // Maharashtra
        sellerStateCode: '19',
      });

      assert.strictEqual(result.isIntraState, false);
      assert.strictEqual(result.items[0].gstRate, 0.18);
      assert.strictEqual(result.cgstTotalPaise, 0);
      assert.strictEqual(result.sgstTotalPaise, 0);
      assert.strictEqual(result.igstTotalPaise, 1800000, 'IGST must be full 18% = 1,800,000 paise');
      assert.strictEqual(result.grandTotalPaise, 11800000, 'Total must be Rs 1,18,000');
    });
  });

  describe('Discounts & Slab Re-Evaluation', () => {
    it('shifts from 18% slab to 5% slab when discount brings unit pre-tax price under Rs 2,500', () => {
      // Item initially Rs 2,800 (280,000 paise) with Rs 400 (40,000 paise) discount -> net unit taxable Rs 2,400 <= 2500
      const result = calculateOrderTaxes({
        items: [
          {
            product: 'p3',
            title: 'Tussar Silk Tunic',
            basePricePaise: 280000,
            qty: 1,
            hsn: '6204',
          },
        ],
        discountPaise: 40000, // Rs 400 discount
        placeOfSupplyStateCode: '29', // Karnataka
        sellerStateCode: '07',
      });

      assert.strictEqual(result.items[0].unitTaxablePaise, 240000);
      assert.strictEqual(result.items[0].gstRate, 0.05, 'Discounted price of Rs 2,400 should trigger 5% GST slab');
      assert.strictEqual(result.igstTotalPaise, 12000, '5% of Rs 2,400 is Rs 120 = 12,000 paise');
      assert.strictEqual(result.grandTotalPaise, 252000, 'Net total: 240,000 + 12,000 = 252,000 paise');
    });
  });

  describe('Paise Integer Rounding Parity', () => {
    it('ensures no fractional paise or floating point corruption on odd tax amounts', () => {
      const result = calculateOrderTaxes({
        items: [
          {
            product: 'p4',
            title: 'Odd Cent Item',
            basePricePaise: 333333, // Rs 3,333.33 -> 18%
            qty: 1,
            hsn: '6204',
          },
        ],
        placeOfSupplyStateCode: '07',
        sellerStateCode: '07',
      });

      assert.strictEqual(Number.isInteger(result.cgstTotalPaise), true);
      assert.strictEqual(Number.isInteger(result.sgstTotalPaise), true);
      assert.strictEqual(Number.isInteger(result.grandTotalPaise), true);
      assert.strictEqual(
        result.cgstTotalPaise + result.sgstTotalPaise,
        result.totalGstPaise,
        'CGST + SGST must exactly equal total GST'
      );
    });
  });
});
