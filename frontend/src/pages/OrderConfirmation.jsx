import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, FileText, ArrowRight, Truck, ShieldCheck, MapPin } from 'lucide-react';
import PageTransition from '../motion/PageTransition';

export const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/track/${orderNumber}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (e) {
      console.error('Failed to fetch order', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C59B27] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-[#FAF8F5] min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Banner */}
          <div className="bg-white border border-[#E7E2DA] rounded-sm p-8 sm:p-12 text-center shadow-luxury-md">
            <div className="w-16 h-16 rounded-full bg-[#166534]/10 text-[#166534] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} strokeWidth={1.5} />
            </div>

            <span className="text-[10px] uppercase tracking-couture text-[#78645D] font-semibold block mb-1">
              Secret Hours &middot; Order Confirmed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B1A]">
              Thank You, {order ? order.customer.name : 'Esteemed Client'}
            </h1>
            <p className="text-xs sm:text-sm text-[#78645D] mt-3 max-w-lg mx-auto font-sans leading-relaxed">
              Your piece has been placed in our atelier production queue. It will arrive sealed in our minimal matte box bearing the card: <span className="italic font-medium text-[#1D1B1A]">&ldquo;We trust you with our secret.&rdquo;</span>
            </p>

            {/* Order Reference & Sequential Invoice Number */}
            <div className="my-8 p-4 bg-[#F7F4EF] border border-[#E9DFD2] rounded-sm grid grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="text-[#78645D] block">Order Reference:</span>
                <span className="font-mono font-bold text-sm text-[#1D1B1A] mt-0.5 block">
                  #{orderNumber}
                </span>
              </div>
              <div>
                <span className="text-[#78645D] block">Tax Invoice No:</span>
                <span className="font-mono font-bold text-sm text-[#1D1B1A] mt-0.5 block">
                  {order?.invoiceNumber || 'SH/2026-27/00001'}
                </span>
              </div>
            </div>

            {/* Download Tax Invoice PDF Button */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`/api/orders/${order ? order._id : orderNumber}/invoice`}
                download
                className="px-6 py-3.5 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium flex items-center justify-center transition-colors shadow-luxury-sm"
              >
                <FileText size={15} className="mr-2" /> Download GST Tax Invoice (PDF)
              </a>
              <Link
                to="/shop"
                className="px-6 py-3.5 bg-transparent border border-[#141210] text-[#141210] hover:bg-[#FAF8F5] text-xs uppercase tracking-couture font-medium flex items-center justify-center transition-colors"
              >
                Continue Exploring <ArrowRight size={14} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Itemized Order & Delivery Details */}
          {order && (
            <div className="mt-10 bg-white border border-[#E7E2DA] rounded-sm p-6 sm:p-8 shadow-luxury-sm space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#141210] pb-3 border-b border-[#E7E2DA]">
                Order Details &amp; Tax Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 divide-y divide-[#E7E2DA]/60">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-serif font-semibold text-[#141210]">{item.title}</p>
                      <p className="text-[#6E675F] text-[11px]">
                        Size: {item.size} &middot; Qty: {item.qty} &middot; HSN {item.hsn} ({(item.gstRate * 100).toFixed(0)}% GST)
                      </p>
                    </div>
                    <span className="font-serif font-bold text-sm text-[#141210]">
                      ₹{(item.totalPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* GST Breakdown Table */}
              <div className="pt-4 border-t border-[#E7E2DA] space-y-2 text-xs text-[#6E675F]">
                <div className="flex justify-between">
                  <span>Taxable Subtotal:</span>
                  <span className="font-medium text-[#141210]">₹{(order.subtotalTaxablePaise / 100).toLocaleString('en-IN')}</span>
                </div>
                {order.discountPaise > 0 && (
                  <div className="flex justify-between text-[#166534]">
                    <span>Prepaid 5% Incentive:</span>
                    <span className="font-medium">-₹{(order.discountPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {order.cgstTotalPaise > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span>CGST (Intra-State 50%):</span>
                      <span className="font-medium text-[#141210]">₹{(order.cgstTotalPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST (Intra-State 50%):</span>
                      <span className="font-medium text-[#141210]">₹{(order.sgstTotalPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>IGST (Inter-State 100%):</span>
                    <span className="font-medium text-[#141210]">₹{(order.igstTotalPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {order.codFeePaise > 0 && (
                  <div className="flex justify-between">
                    <span>COD Fee (incl. GST):</span>
                    <span className="font-medium text-[#141210]">₹{((order.codFeePaise + order.codFeeGstPaise) / 100).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#E7E2DA] flex justify-between text-base font-serif font-bold text-[#141210]">
                  <span>Total Paid / Payable:</span>
                  <span>₹{(order.grandTotalPaise / 100).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delivery Address Box */}
              <div className="pt-4 border-t border-[#E7E2DA] text-xs text-[#6E675F] space-y-1">
                <p className="font-semibold text-[#141210] flex items-center">
                  <MapPin size={14} className="text-[#C59B27] mr-1.5" /> Shipping Address (Place of Supply)
                </p>
                <p>{order.shippingAddress?.addressLine1}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                <p>Phone: {order.customer?.phone} &middot; Payment: {order.paymentMethod?.toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default OrderConfirmation;
