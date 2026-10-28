import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, ArrowRight } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';
import { DURATION, EASE_COUTURE } from '../../motion/tokens';

export const Navbar = ({ cartCount = 0, wishlistCount = 0, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Unbecoming (Col. 01)', href: '/shop?collection=unbecoming' },
    { label: 'The Collection', href: '/shop' },
    { label: 'Corsetry & Tailoring', href: '/shop?category=corsetry' },
    { label: 'The Brand Story', href: '/about' },
    { label: 'Secret Society', href: '/about#society' },
  ];

  return (
    <>
      {/* Top Announcement Ribbon */}
      <div className="bg-[#1D1B1A] text-[#F7F4EF] text-[11px] tracking-couture uppercase py-2 px-4 text-center font-medium border-b border-[#E9DFD2]/20">
        <span className="opacity-95 font-sans">
          "We have a secret to tell. Can you keep a secret?" &middot; Debut Collection 01 &middot; Complimentary Delivery
        </span>
      </div>

      {/* Main Luxury Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F4EF]/95 backdrop-blur-md py-3.5 shadow-luxury-sm border-b border-[#E9DFD2]'
            : 'bg-[#F7F4EF]/90 backdrop-blur-md py-5 border-b border-[#E9DFD2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          {/* Left Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[11px] uppercase tracking-editorial text-[#1D1B1A] hover:text-[#78645D] font-medium transition-colors duration-200 relative group py-1 font-sans"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1D1B1A] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Central Wordmark */}
          <Link to="/" className="text-center group flex flex-col items-center">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-semibold text-[#1D1B1A] group-hover:text-[#78645D] transition-colors duration-300">
              SECRET HOURS
            </span>
            <span className="text-[8.5px] uppercase tracking-[0.35em] text-[#78645D] -mt-0.5 font-sans font-medium">
              A Contemporary Womenswear Label
            </span>
          </Link>

          {/* Right Navigation & Utility Icons */}
          <div className="flex items-center space-x-6">
            <nav className="hidden lg:flex items-center space-x-8 mr-2">
              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[12px] uppercase tracking-editorial text-[#3D3833] hover:text-[#C59B27] font-medium transition-colors duration-200 relative group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C59B27] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Search Trigger */}
            <Link
              to="/shop"
              className="p-1.5 text-[#3D3833] hover:text-[#C59B27] transition-colors cursor-pointer"
              aria-label="Search Collection"
            >
              <Search size={20} strokeWidth={1.5} />
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-1.5 text-[#3D3833] hover:text-[#C59B27] transition-colors cursor-pointer relative"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#141210] text-[#FAF8F5] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="p-1.5 text-[#141210] hover:text-[#C59B27] transition-colors cursor-pointer relative flex items-center"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C59B27] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#141210]/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <m.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{ duration: DURATION.base, ease: EASE_COUTURE }}
              className="fixed top-0 bottom-0 left-0 w-[82%] max-w-sm bg-[#FAF8F5] z-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#E7E2DA]">
                  <div>
                    <span className="font-serif text-2xl font-bold tracking-[0.2em] text-[#1D1B1A]">
                      SECRET HOURS
                    </span>
                    <span className="block text-[8px] uppercase tracking-[0.3em] text-[#78645D]">
                      A Contemporary Womenswear Label
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-[#3D3833] hover:text-[#C59B27] cursor-pointer"
                    aria-label="Close navigation"
                  >
                    <X size={22} strokeWidth={1.5} />
                  </button>
                </div>

                <nav className="mt-8 space-y-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-base tracking-editorial uppercase text-[#141210] hover:text-[#C59B27] font-medium transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-6 border-t border-[#E7E2DA] space-y-4">
                    <Link
                      to="/account/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs uppercase tracking-editorial text-[#6E675F] hover:text-[#141210]"
                    >
                      Track Order &amp; Invoices
                    </Link>
                    <Link
                      to="/policies/shipping"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs uppercase tracking-editorial text-[#6E675F] hover:text-[#141210]"
                    >
                      Domestic &amp; International Delivery
                    </Link>
                  </div>
                </nav>
              </div>

              <div className="pt-8 border-t border-[#E7E2DA]">
                <p className="text-xs text-[#6E675F] font-sans mb-3">
                  Atelier Concierge: <br />
                  <span className="text-[#141210] font-medium">+91 98712 34567</span>
                </p>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-3 bg-[#141210] text-[#FAF8F5] text-xs uppercase tracking-couture font-medium hover:bg-[#C59B27] transition-colors"
                >
                  Explore Collection <ArrowRight size={14} className="ml-2" />
                </Link>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
