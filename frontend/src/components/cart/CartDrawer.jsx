import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { drawerRightVariant } from '../../motion/variants';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQty,
    subtotalPaise,
    estimatedGstPaise,
    grandTotalPaise,
  } = useCart();

  const drawerRef = useRef(null);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#141210]/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <m.div
              ref={drawerRef}
              variants={drawerRightVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#E7E2DA] flex items-center justify-between">
                <div>
                  <h2 id="cart-title" className="font-serif text-xl font-bold tracking-wide text-[#141210]">
                    Your Atelier Selection
                  </h2>
                  <span className="text-[10px] uppercase tracking-editorial text-[#6E675F]">
                    {cartItems.length} {cartItems.length === 1 ? 'Garment' : 'Garments'} Selected
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="p-2 text-[#3D3833] hover:text-[#C59B27] cursor-pointer"
                  aria-label="Close bag"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-serif text-lg text-[#3D3833]">Your atelier bag is empty</p>
                    <p className="text-xs text-[#6E675F] mt-2 mb-6">Discover our curated runway creations and bridal ensembles.</p>
                    <Link
                      to="/shop"
                      onClick={closeCart}
                      className="inline-flex items-center px-6 py-3 bg-[#141210] text-[#FAF8F5] text-xs uppercase tracking-couture font-medium hover:bg-[#C59B27] transition-colors"
                    >
                      Explore Collection <ArrowRight size={14} className="ml-2" />
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item, index) => {
                    const itemTotal = (item.basePricePaise * item.qty) / 100;
                    const itemGst = itemTotal * item.gstRate;

                    return (
                      <div key={`${item.id}-${item.size}-${index}`} className="flex space-x-4 pb-6 border-b border-[#E7E2DA]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-28 object-cover object-top rounded-sm bg-[#F4F0EB] shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-serif text-sm font-semibold text-[#141210] line-clamp-1">
                                {item.title}
                              </h3>
                              <button
                                type="button"
                                onClick={() => removeFromCart(index)}
                                className="text-[#6E675F] hover:text-[#991B1B] p-1 cursor-pointer"
                                aria-label={`Remove ${item.title}`}
                              >
                                <Trash2 size={15} strokeWidth={1.5} />
                              </button>
                            </div>
                            <p className="text-[11px] text-[#6E675F] mt-0.5">
                              Size: {item.size} &middot; HSN {item.hsn}
                            </p>
                            <p className="text-[11px] text-[#C59B27] font-medium mt-0.5">
                              GST Rate: {item.gstRate * 100}%
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-[#E7E2DA] rounded-sm bg-white">
                              <button
                                type="button"
                                onClick={() => updateQty(index, -1)}
                                className="px-2 py-1 text-[#3D3833] hover:text-[#141210] cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-xs font-medium text-[#141210]">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(index, 1)}
                                className="px-2 py-1 text-[#3D3833] hover:text-[#141210] cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Price */}
                            <span className="font-serif text-sm font-bold text-[#141210]">
                              ₹{(itemTotal + itemGst).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Summary & Checkout Button */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#E7E2DA] bg-white space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#6E675F]">
                      <span>Taxable Value:</span>
                      <span>₹{(subtotalPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#6E675F]">
                      <span>Estimated GST (5% / 18%):</span>
                      <span>₹{(estimatedGstPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#6E675F]">
                      <span>White-Glove Shipping:</span>
                      <span className="text-[#166534] font-medium">Complimentary</span>
                    </div>
                    <div className="pt-2 border-t border-[#E7E2DA] flex justify-between text-base font-serif font-bold text-[#141210]">
                      <span>Total Payable:</span>
                      <span>₹{(grandTotalPaise / 100).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className="w-full py-4 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium flex items-center justify-center transition-colors shadow-luxury-md cursor-pointer"
                    >
                      Proceed to Checkout &amp; Address <ArrowRight size={15} className="ml-2" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-[10px] text-[#6E675F] pt-1">
                    <ShieldCheck size={13} className="text-[#C59B27]" />
                    <span>Razorpay 256-Bit SSL Encrypted &middot; Official GST Invoice</span>
                  </div>
                </div>
              )}
            </m.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
