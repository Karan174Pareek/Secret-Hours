import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PageTransition from '../motion/PageTransition';

export const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQty,
    subtotalPaise,
    estimatedGstPaise,
    grandTotalPaise,
  } = useCart();

  const subtotalRupees = subtotalPaise / 100;
  const gstRupees = estimatedGstPaise / 100;
  const grandTotalRupees = grandTotalPaise / 100;
  const prepaidSavingsRupees = (subtotalRupees * 0.05).toFixed(0);

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-[75vh] bg-[#FAF8F5] py-24 flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 text-center">
            <h1 className="font-serif text-3xl text-[#141210]">Your Atelier Bag is Empty</h1>
            <p className="text-xs sm:text-sm text-[#6E675F] mt-3 mb-8 leading-relaxed">
              Discover our curated runway creations, handcrafted lehengas, and architectural draped sarees.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 bg-[#141210] text-[#FAF8F5] text-xs uppercase tracking-couture font-medium hover:bg-[#C59B27] transition-colors shadow-luxury-md"
            >
              Explore Runway Catalog <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-[#FAF8F5] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-1">
              Atelier Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141210]">
              Shopping Bag &amp; GST Summary
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Items List */}
            <div className="lg:col-span-8 bg-white border border-[#E7E2DA] rounded-sm p-6 shadow-luxury-sm divide-y divide-[#E7E2DA]">
              {cartItems.map((item, index) => {
                const itemTotal = (item.basePricePaise * item.qty) / 100;
                const itemGst = itemTotal * item.gstRate;

                return (
                  <div key={`${item.id}-${item.size}-${index}`} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-32 object-cover object-top rounded-sm bg-[#F4F0EB] shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase tracking-editorial text-[#C59B27] font-semibold">
                              HSN {item.hsn} &middot; GST {(item.gstRate * 100).toFixed(0)}%
                            </span>
                            <h3 className="font-serif text-base font-semibold text-[#141210] mt-0.5">
                              <Link to={`/product/${item.slug}`}>{item.title}</Link>
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(index)}
                            className="text-[#6E675F] hover:text-[#991B1B] p-1 cursor-pointer transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-[#6E675F] mt-1">
                          Size: <span className="text-[#141210] font-medium">{item.size}</span> &middot; Color:{' '}
                          <span className="text-[#141210] font-medium">{item.color}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E7E2DA]/50">
                        {/* Quantity Increment/Decrement */}
                        <div className="flex items-center border border-[#E7E2DA] rounded-sm bg-[#FAF8F5]">
                          <button
                            type="button"
                            onClick={() => updateQty(index, -1)}
                            className="px-2.5 py-1 text-[#3D3833] hover:text-[#141210] cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-xs font-semibold text-[#141210]">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(index, 1)}
                            className="px-2.5 py-1 text-[#3D3833] hover:text-[#141210] cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-right">
                          <span className="font-serif text-lg font-bold text-[#141210]">
                            ₹{(itemTotal + itemGst).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#6E675F] block">
                            (Taxable: ₹{itemTotal.toLocaleString('en-IN')} + GST ₹{itemGst.toLocaleString('en-IN')})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary & Checkout Card */}
            <div className="lg:col-span-4 bg-white border border-[#E7E2DA] rounded-sm p-6 shadow-luxury-sm space-y-5 sticky top-28">
              <h2 className="font-serif text-lg font-bold text-[#141210] pb-3 border-b border-[#E7E2DA]">
                Order Summary
              </h2>

              {/* Prepaid Nudge Incentive Banner */}
              <div className="p-3.5 bg-[#C59B27]/10 border border-[#C59B27]/30 rounded-sm flex items-start space-x-2.5 text-xs text-[#141210]">
                <Sparkles size={16} className="text-[#C59B27] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Save ₹{prepaidSavingsRupees} with Prepaid Payment:</span>
                  <span className="text-[#6E675F] text-[11px]">Enjoy an instant 5% privilege discount when paying via Razorpay (UPI, Netbanking, Cards).</span>
                </div>
              </div>

              {/* Price Line Items */}
              <div className="space-y-2 text-xs text-[#6E675F]">
                <div className="flex justify-between">
                  <span>Pre-Tax Taxable Subtotal:</span>
                  <span className="font-medium text-[#141210]">₹{subtotalRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Total GST:</span>
                  <span className="font-medium text-[#141210]">₹{gstRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Insured Delivery:</span>
                  <span className="text-[#166534] font-medium">Complimentary</span>
                </div>
                <div className="pt-3 border-t border-[#E7E2DA] flex justify-between text-base font-serif font-bold text-[#141210]">
                  <span>Estimated Total:</span>
                  <span>₹{grandTotalRupees.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2">
                <Link
                  to="/checkout"
                  className="w-full py-4 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium flex items-center justify-center transition-colors shadow-luxury-md cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight size={15} className="ml-2" />
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#6E675F] pt-2">
                <ShieldCheck size={14} className="text-[#C59B27]" />
                <span>GST Compliant Invoices &middot; Razorpay 256-Bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Cart;
