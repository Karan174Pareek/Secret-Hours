import PDFDocument from 'pdfkit';
import { brandConfig } from '../config/brandConfig.js';
import { gstConfig } from '../config/gstConfig.js';

/**
 * Generates sequential FY-based invoice number (e.g. ZAR/2026-27/00042)
 *
 * @param {number} sequenceNumber Monotonically increasing order/invoice count
 * @param {Date} [date] Invoice date
 * @returns {string} Formatted invoice number
 */
export function formatInvoiceNumber(sequenceNumber, date = new Date()) {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth(); // 0-indexed: April is 3
  
  // Indian Fiscal Year starts April 1st
  let startYear = currentYear;
  let endYear = currentYear + 1;
  if (currentMonth < 3) {
    startYear = currentYear - 1;
    endYear = currentYear;
  }

  const fy = `${startYear}-${String(endYear).slice(2)}`;
  const paddedSeq = String(sequenceNumber).padStart(5, '0');
  return `ZAR/${fy}/${paddedSeq}`;
}

/**
 * Builds a Section 31 CGST Act compliant Tax Invoice PDF stream
 *
 * @param {Object} order The Mongoose Order document
 * @param {NodeJS.WritableStream} res Writable HTTP response stream
 */
export function generateInvoicePdf(order, res) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  doc.pipe(res);

  const primaryColor = '#141210';
  const accentColor = '#997520';
  const grayColor = '#555555';
  const borderColor = '#D5CEC5';

  // --- Header: Brand & Tax Invoice Title ---
  doc
    .font('Helvetica-Bold')
    .fontSize(22)
    .fillColor(primaryColor)
    .text(brandConfig.name.toUpperCase(), 40, 40, { characterSpacing: 2 });

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(grayColor)
    .text(brandConfig.legalName, 40, 68)
    .text(`${brandConfig.address.line1}, ${brandConfig.address.city} - ${brandConfig.address.pincode}`, 40, 80)
    .text(`GSTIN: ${brandConfig.gstin} | PAN: ${brandConfig.pan} | State Code: ${brandConfig.stateCode} (${brandConfig.state})`, 40, 92)
    .text(`Concierge: ${brandConfig.contact.carePhone} | ${brandConfig.contact.conciergeEmail}`, 40, 104);

  // Title Box (Top Right)
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor(accentColor)
    .text('TAX INVOICE', 360, 40, { align: 'right' });

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(grayColor)
    .text('(Under Section 31 of CGST Act, 2017)', 360, 56, { align: 'right' })
    .text(`Invoice No: ${order.invoiceNumber || 'PENDING'}`, 360, 72, { align: 'right' })
    .text(`Invoice Date: ${new Date(order.invoiceDate || order.createdAt).toLocaleDateString('en-IN')}`, 360, 84, { align: 'right' })
    .text(`Order Reference: #${order.orderNumber}`, 360, 96, { align: 'right' })
    .text(`Payment Mode: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})`, 360, 108, { align: 'right' });

  // Divider
  doc
    .strokeColor(borderColor)
    .lineWidth(0.8)
    .moveTo(40, 126)
    .lineTo(555, 126)
    .stroke();

  // --- Bill To & Place of Supply ---
  const posState = gstConfig.stateCodes[order.shippingAddress.stateCode] || order.shippingAddress.state;
  const isIntraState = order.shippingAddress.stateCode === (process.env.SELLER_STATE_CODE || '07');

  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(primaryColor)
    .text('BILLED & DELIVERED TO:', 40, 138)
    .text('PLACE OF SUPPLY (POS):', 330, 138);

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(grayColor)
    .text(order.customer.name, 40, 152)
    .text(order.shippingAddress.addressLine1, 40, 164)
    .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`, 40, 176)
    .text(`Phone: ${order.customer.phone} | Email: ${order.customer.email}`, 40, 188);

  if (order.customer.buyerGstin) {
    doc.text(`Buyer GSTIN: ${order.customer.buyerGstin} (B2B Supply)`, 40, 200);
  } else {
    doc.text('Consumer Transaction (B2C Supply)', 40, 200);
  }

  doc
    .text(`State: ${posState}`, 330, 152)
    .text(`State Code: ${order.shippingAddress.stateCode}`, 330, 164)
    .text(`Supply Nature: ${isIntraState ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}`, 330, 176)
    .text('Reverse Charge Applicable: NO', 330, 188);

  // Divider before items table
  doc
    .strokeColor(borderColor)
    .lineWidth(0.8)
    .moveTo(40, 218)
    .lineTo(555, 218)
    .stroke();

  // --- Table Header ---
  const tableTop = 228;
  doc
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor(primaryColor);

  doc.text('ITEM DESCRIPTION', 40, tableTop, { width: 140 });
  doc.text('HSN', 185, tableTop, { width: 35 });
  doc.text('QTY', 225, tableTop, { width: 25, align: 'center' });
  doc.text('TAXABLE (₹)', 255, tableTop, { width: 55, align: 'right' });
  doc.text('RATE', 315, tableTop, { width: 30, align: 'center' });

  if (isIntraState) {
    doc.text('CGST (₹)', 350, tableTop, { width: 45, align: 'right' });
    doc.text('SGST (₹)', 400, tableTop, { width: 45, align: 'right' });
  } else {
    doc.text('IGST (₹)', 370, tableTop, { width: 75, align: 'right' });
  }
  doc.text('TOTAL (₹)', 485, tableTop, { width: 65, align: 'right' });

  doc
    .strokeColor(borderColor)
    .lineWidth(0.5)
    .moveTo(40, tableTop + 14)
    .lineTo(555, tableTop + 14)
    .stroke();

  // --- Table Rows ---
  let y = tableTop + 22;
  doc.font('Helvetica').fontSize(7.5).fillColor(grayColor);

  order.items.forEach((item) => {
    const taxableRupees = (item.totalTaxablePaise / 100).toFixed(2);
    const itemTotalRupees = (item.totalPaise / 100).toFixed(2);
    const rateText = `${(item.gstRate * 100).toFixed(0)}%`;

    doc.fillColor(primaryColor).text(`${item.title} (${item.size})`, 40, y, { width: 140, lineBreak: false });
    doc.fillColor(grayColor).text(item.hsn, 185, y, { width: 35 });
    doc.text(String(item.qty), 225, y, { width: 25, align: 'center' });
    doc.text(taxableRupees, 255, y, { width: 55, align: 'right' });
    doc.text(rateText, 315, y, { width: 30, align: 'center' });

    if (isIntraState) {
      doc.text((item.cgstPaise / 100).toFixed(2), 350, y, { width: 45, align: 'right' });
      doc.text((item.sgstPaise / 100).toFixed(2), 400, y, { width: 45, align: 'right' });
    } else {
      doc.text((item.igstPaise / 100).toFixed(2), 370, y, { width: 75, align: 'right' });
    }
    doc.fillColor(primaryColor).text(itemTotalRupees, 485, y, { width: 65, align: 'right' });

    y += 20;
  });

  // Ancillary fees (Shipping / COD)
  if (order.shippingFeePaise > 0 || order.codFeePaise > 0) {
    if (order.shippingFeePaise > 0) {
      const shipTaxable = (order.shippingFeePaise / 100).toFixed(2);
      const shipGst = (order.shippingGstPaise / 100).toFixed(2);
      const shipTotal = ((order.shippingFeePaise + order.shippingGstPaise) / 100).toFixed(2);

      doc.fillColor(primaryColor).text('Express White-Glove Shipping & Insurance', 40, y, { width: 140 });
      doc.fillColor(grayColor).text('9968', 185, y);
      doc.text('1', 225, y, { width: 25, align: 'center' });
      doc.text(shipTaxable, 255, y, { width: 55, align: 'right' });
      doc.text('18%', 315, y, { width: 30, align: 'center' });
      doc.text(shipGst, isIntraState ? 375 : 370, y, { width: 75, align: 'right' });
      doc.fillColor(primaryColor).text(shipTotal, 485, y, { width: 65, align: 'right' });
      y += 18;
    }

    if (order.codFeePaise > 0) {
      const codTaxable = (order.codFeePaise / 100).toFixed(2);
      const codGst = (order.codFeeGstPaise / 100).toFixed(2);
      const codTotal = ((order.codFeePaise + order.codFeeGstPaise) / 100).toFixed(2);

      doc.fillColor(primaryColor).text('Cash on Delivery Verification & Collection Fee', 40, y, { width: 140 });
      doc.fillColor(grayColor).text('9971', 185, y);
      doc.text('1', 225, y, { width: 25, align: 'center' });
      doc.text(codTaxable, 255, y, { width: 55, align: 'right' });
      doc.text('18%', 315, y, { width: 30, align: 'center' });
      doc.text(codGst, isIntraState ? 375 : 370, y, { width: 75, align: 'right' });
      doc.fillColor(primaryColor).text(codTotal, 485, y, { width: 65, align: 'right' });
      y += 18;
    }
  }

  // --- Summary Box ---
  y += 10;
  doc
    .strokeColor(borderColor)
    .lineWidth(0.8)
    .moveTo(300, y)
    .lineTo(555, y)
    .stroke();

  y += 8;
  const renderSummaryRow = (label, valPaise, bold = false) => {
    doc
      .font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(bold ? 9 : 8)
      .fillColor(bold ? primaryColor : grayColor)
      .text(label, 300, y, { width: 130, align: 'right' })
      .text(`₹ ${(valPaise / 100).toFixed(2)}`, 435, y, { width: 115, align: 'right' });
    y += 15;
  };

  renderSummaryRow('Total Taxable Value:', order.subtotalTaxablePaise);
  if (order.discountPaise > 0) {
    renderSummaryRow('Prepaid Incentive Discount:', -order.discountPaise);
  }
  if (isIntraState) {
    renderSummaryRow('CGST Total:', order.cgstTotalPaise);
    renderSummaryRow('SGST Total:', order.sgstTotalPaise);
  } else {
    renderSummaryRow('IGST Total:', order.igstTotalPaise);
  }

  doc
    .strokeColor(borderColor)
    .lineWidth(0.8)
    .moveTo(300, y)
    .lineTo(555, y)
    .stroke();
  y += 6;

  renderSummaryRow('TOTAL AMOUNT PAYABLE:', order.grandTotalPaise, true);

  // --- Footer Disclaimers & Signature ---
  const bottomY = 730;
  doc
    .strokeColor(borderColor)
    .lineWidth(0.5)
    .moveTo(40, bottomY)
    .lineTo(555, bottomY)
    .stroke();

  doc
    .font('Helvetica')
    .fontSize(7)
    .fillColor(grayColor)
    .text(
      'Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
      40,
      bottomY + 8
    )
    .text(
      'This is a computer-generated tax invoice issued in accordance with Section 31 of the CGST Act, 2017. Authorized Signatory: Zariya Haute Couture Pvt Ltd.',
      40,
      bottomY + 18
    );

  doc.end();
}
