import { gstConfig } from '../config/gstConfig.js';
import { brandConfig } from '../config/brandConfig.js';

/**
 * Indian GST Engine for Apparel E-Commerce
 * All monetary calculations operate strictly in INTEGER PAISE (1 INR = 100 paise).
 */

/**
 * Evaluates apparel GST slab for an item based on its pre-tax taxable unit value (after item discounts)
 * Threshold: Rs 2,500.00 = 250,000 paise
 * <= 250,000 paise -> 5% GST
 * >  250,000 paise -> 18% GST
 *
 * @param {number} unitTaxablePaise Pre-tax price in paise
 * @returns {number} Rate as decimal (0.05 or 0.18)
 */
export function determineGstRate(unitTaxablePaise) {
  if (unitTaxablePaise <= gstConfig.slabThresholdPaise) {
    return gstConfig.rates.low.rate; // 0.05 (5%)
  }
  return gstConfig.rates.standard.rate; // 0.18 (18%)
}

/**
 * Calculates tax breakdown for an array of cart/order items and ancillary fees
 *
 * @param {Object} params
 * @param {Array} params.items Array of items: { product, basePricePaise, qty, hsn }
 * @param {string} params.placeOfSupplyStateCode 2-digit Indian GST State code of buyer delivery address
 * @param {number} [params.discountPaise=0] Total order-level discount in paise
 * @param {number} [params.shippingFeePaise=0] Base shipping fee in paise
 * @param {number} [params.codFeePaise=0] Base COD surcharge fee in paise
 * @param {string} [params.sellerStateCode] Optional override for seller state code
 * @returns {Object} Comprehensive tax breakdown in paise
 */
export function calculateOrderTaxes({
  items,
  placeOfSupplyStateCode,
  discountPaise = 0,
  shippingFeePaise = 0,
  codFeePaise = 0,
  sellerStateCode = null,
}) {
  const sellerCode = sellerStateCode || process.env.SELLER_STATE_CODE || brandConfig.stateCode || '07';
  const buyerCode = String(placeOfSupplyStateCode).padStart(2, '0');
  const isIntraState = sellerCode === buyerCode;

  // 1. Calculate raw subtotal in paise
  const rawSubtotalPaise = items.reduce((acc, item) => {
    return acc + Math.round(item.basePricePaise) * item.qty;
  }, 0);

  // 2. Distribute discount proportionately across items to find true net taxable unit price per piece
  const processedItems = items.map((item) => {
    const itemSubtotal = Math.round(item.basePricePaise) * item.qty;
    const itemDiscountShare = rawSubtotalPaise > 0
      ? Math.round((itemSubtotal / rawSubtotalPaise) * discountPaise)
      : 0;

    const netItemTaxableTotal = Math.max(0, itemSubtotal - itemDiscountShare);
    // Unit taxable value per piece after discount:
    const netUnitTaxable = Math.round(netItemTaxableTotal / item.qty);

    // Dynamic slab rate tested on post-discount pre-tax value:
    const rate = determineGstRate(netUnitTaxable);

    // Compute GST amounts
    let cgstPaise = 0;
    let sgstPaise = 0;
    let igstPaise = 0;

    if (isIntraState) {
      // Intra-state: CGST (rate / 2) + SGST (rate / 2)
      // Half rate applied to total taxable
      const halfRate = rate / 2;
      cgstPaise = Math.round(netItemTaxableTotal * halfRate);
      sgstPaise = Math.round(netItemTaxableTotal * halfRate);
    } else {
      // Inter-state: IGST (full rate)
      igstPaise = Math.round(netItemTaxableTotal * rate);
    }

    const itemTotalPaise = netItemTaxableTotal + cgstPaise + sgstPaise + igstPaise;

    return {
      product: item.product,
      title: item.title,
      slug: item.slug,
      image: item.image,
      size: item.size,
      color: item.color,
      qty: item.qty,
      hsn: item.hsn || gstConfig.defaultHsn.woven,
      unitTaxablePaise: netUnitTaxable,
      totalTaxablePaise: netItemTaxableTotal,
      gstRate: rate,
      cgstPaise,
      sgstPaise,
      igstPaise,
      totalPaise: itemTotalPaise,
    };
  });

  // 3. Aggregate item totals
  const subtotalTaxablePaise = processedItems.reduce((acc, i) => acc + i.totalTaxablePaise, 0);
  const itemsCgstPaise = processedItems.reduce((acc, i) => acc + i.cgstPaise, 0);
  const itemsSgstPaise = processedItems.reduce((acc, i) => acc + i.sgstPaise, 0);
  const itemsIgstPaise = processedItems.reduce((acc, i) => acc + i.igstPaise, 0);

  // 4. Ancillary fees GST calculation (Shipping & COD Fee)
  let shippingGstPaise = 0;
  let codFeeGstPaise = 0;
  let ancillaryCgstPaise = 0;
  let ancillarySgstPaise = 0;
  let ancillaryIgstPaise = 0;

  if (gstConfig.applyGstToAncillaryFees) {
    const feeRate = gstConfig.ancillaryGstRate; // 18% standard fee GST
    if (shippingFeePaise > 0) {
      shippingGstPaise = Math.round(shippingFeePaise * feeRate);
    }
    if (codFeePaise > 0) {
      codFeeGstPaise = Math.round(codFeePaise * feeRate);
    }

    const totalAncillaryGst = shippingGstPaise + codFeeGstPaise;
    if (isIntraState) {
      ancillaryCgstPaise = Math.round(totalAncillaryGst / 2);
      ancillarySgstPaise = totalAncillaryGst - ancillaryCgstPaise; // Handle odd paise rounding
    } else {
      ancillaryIgstPaise = totalAncillaryGst;
    }
  }

  // 5. Grand totals
  const cgstTotalPaise = itemsCgstPaise + ancillaryCgstPaise;
  const sgstTotalPaise = itemsSgstPaise + ancillarySgstPaise;
  const igstTotalPaise = itemsIgstPaise + ancillaryIgstPaise;

  const grandTotalPaise =
    subtotalTaxablePaise +
    cgstTotalPaise +
    sgstTotalPaise +
    igstTotalPaise +
    shippingFeePaise +
    codFeePaise;

  return {
    isIntraState,
    sellerStateCode: sellerCode,
    sellerStateName: gstConfig.stateCodes[sellerCode] || 'West Bengal',
    placeOfSupplyStateCode: buyerCode,
    placeOfSupplyStateName: gstConfig.stateCodes[buyerCode] || 'Unknown',
    items: processedItems,
    subtotalTaxablePaise,
    discountPaise,
    itemsCgstPaise,
    itemsSgstPaise,
    itemsIgstPaise,
    cgstTotalPaise,
    sgstTotalPaise,
    igstTotalPaise,
    totalGstPaise: cgstTotalPaise + sgstTotalPaise + igstTotalPaise,
    shippingFeePaise,
    shippingGstPaise,
    codFeePaise,
    codFeeGstPaise,
    grandTotalPaise,
  };
}
