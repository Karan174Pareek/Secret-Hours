import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, X, ArrowRight } from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';
import { DURATION, EASE_COUTURE } from '../../motion/tokens';

export const Navbar = ({ cartCount = 0, wishlistCount = 0, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const announcements = [
    '"We have a secret to tell. Can you keep a secret?"',
    'Debut Collection: Unbecoming (Col. 01) · Prêt-à-Porter',
    'Complimentary Delivery Across India · Siliguri Atelier',
  ];

  // Rotate announcement bar every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Track scroll position for dynamic styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinksLeft = [
    { label: 'Unbecoming (Col. 01)', href: '/shop?collection=unbecoming', tag: 'Col. 01' },
    { label: 'The Collection', href: '/shop' },
    { label: 'Corsetry & Tailoring', href: '/shop?category=corsetry' },
  ];

  const navLinksRight = [
    { label: 'The Brand Story', href: '/about' },
    { label: 'Secret Society', href: '/about#society' },
  ];

  const allNavLinks = [
    { label: 'Unbecoming (Col. 01)', href: '/shop?collection=unbecoming', tag: 'NEW' },
    { label: 'The Collection', href: '/shop' },
    { label: 'Corsetry & Tailoring', href: '/shop?category=corsetry' },
    { label: 'The Brand Story', href: '/about' },
    { label: 'Secret Society', href: '/about#society' },
  ];

  return (
    <>
      {/* Top Luxury Announcement Ribbon */}
      <div className="bg-[#1D1B1A] text-[#F7F4EF] text-[9.5px] sm:text-[10px] tracking-[0.22em] uppercase py-2 px-4 text-center font-medium border-b border-[#E9DFD2]/15 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[16px]">
          <AnimatePresence mode="wait">
            <m.span
              key={activeAnnouncement}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="inline-block font-sans font-medium opacity-90 truncate max-w-full"
            >
              {announcements[activeAnnouncement]}
            </m.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F4EF]/95 backdrop-blur-md py-3 shadow-[0_4px_20px_-4px_rgba(29,27,26,0.06)] border-b border-[#E9DFD2]/80'
            : 'bg-[#F7F4EF]/90 backdrop-blur-md py-4 sm:py-5 border-b border-[#E9DFD2]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* ========================================================= */}
            {/* MOBILE ONLY LEFT WING (Width 76px for perfect centering) */}
            {/* ========================================================= */}
            <div className="flex items-center space-x-1 lg:hidden w-[76px]">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-1 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer rounded-sm"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {/* Minimalist Couture 2-line Hamburger */}
                <div className="w-5 h-3.5 flex flex-col justify-between items-start">
                  <span
                    className={`h-[1.5px] bg-[#1D1B1A] transition-all duration-300 ${
                      mobileMenuOpen ? 'w-5 rotate-45 translate-y-[6px]' : 'w-5'
                    }`}
                  />
                  <span
                    className={`h-[1.5px] bg-[#1D1B1A] transition-all duration-300 ${
                      mobileMenuOpen ? 'w-5 -rotate-45 -translate-y-[6px]' : 'w-3.5'
                    }`}
                  />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.4} />
              </button>
            </div>

            {/* ========================================================= */}
            {/* DESKTOP LEFT NAVIGATION LINKS */}
            {/* ========================================================= */}
            <nav className="hidden lg:flex items-center space-x-7 flex-1" aria-label="Primary Navigation">
              {navLinksLeft.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[11px] uppercase tracking-[0.16em] text-[#1D1B1A] hover:text-[#78645D] font-medium transition-colors duration-200 relative group py-1 font-sans"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1.25px] bg-[#1D1B1A] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* ========================================================= */}
            {/* BRAND LOGO & CREST (Strictly Centered Desktop & Mobile) */}
            {/* ========================================================= */}
            <Link
              to="/"
              className="group flex flex-col items-center justify-center text-center px-1 py-0.5 select-none transition-transform duration-300 active:scale-[0.99]"
              aria-label="Secret Hours - Home"
            >
              {/* Luxury SH Monogram Seal */}
              <div className="mb-1 sm:mb-1.5 transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#1D1B1A] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="18.5"
                    stroke="#78645D"
                    strokeWidth="0.8"
                    strokeDasharray="2.5 2"
                    opacity="0.65"
                  />
                  <circle cx="20" cy="20" r="15" stroke="#1D1B1A" strokeWidth="0.9" opacity="0.6" />
                  <text
                    x="20"
                    y="25"
                    textAnchor="middle"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontSize="14.5"
                    fontWeight="500"
                    letterSpacing="0.07em"
                    fill="#1D1B1A"
                  >
                    SH
                  </text>
                </svg>
              </div>

              {/* High-Fashion Wordmark */}
              <span className="font-serif text-[17px] sm:text-2xl md:text-[27px] tracking-[0.24em] sm:tracking-[0.28em] font-medium text-[#1D1B1A] uppercase group-hover:text-[#78645D] transition-colors duration-300 leading-tight">
                SECRET HOURS
              </span>

              {/* Haute Couture Tagline */}
              <span className="text-[6.5px] sm:text-[7.5px] md:text-[8px] uppercase tracking-[0.32em] sm:tracking-[0.38em] text-[#78645D] font-sans font-medium -mt-0.5 whitespace-nowrap">
                A Contemporary Womenswear Label
              </span>
            </Link>

            {/* ========================================================= */}
            {/* DESKTOP RIGHT WING (Links + Icons) */}
            {/* ========================================================= */}
            <div className="hidden lg:flex items-center justify-end space-x-6 flex-1">
              <nav className="flex items-center space-x-7 mr-3" aria-label="Secondary Navigation">
                {navLinksRight.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-[11px] uppercase tracking-[0.16em] text-[#1D1B1A] hover:text-[#78645D] font-medium transition-colors duration-200 relative group py-1 font-sans"
                  >
                    <span>{link.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1.25px] bg-[#1D1B1A] transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>

              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer"
                aria-label="Search Collection"
              >
                <Search size={19} strokeWidth={1.4} />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="p-1.5 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer relative"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart size={19} strokeWidth={1.4} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1D1B1A] text-[#F7F4EF] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                type="button"
                onClick={onOpenCart}
                className="p-1.5 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer relative flex items-center group"
                aria-label={`Shopping Bag with ${cartCount} items`}
              >
                <ShoppingBag size={19} strokeWidth={1.4} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1D1B1A] text-[#F7F4EF] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold group-hover:bg-[#78645D] transition-colors">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* ========================================================= */}
            {/* MOBILE ONLY RIGHT WING (Width 76px for perfect centering) */}
            {/* ========================================================= */}
            <div className="flex items-center justify-end space-x-1 lg:hidden w-[76px]">
              <Link
                to="/wishlist"
                className="p-2 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer relative"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart size={18} strokeWidth={1.4} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#1D1B1A] text-[#F7F4EF] text-[8.5px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={onOpenCart}
                className="p-2 -mr-1 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer relative flex items-center"
                aria-label={`Shopping Bag with ${cartCount} items`}
              >
                <ShoppingBag size={18} strokeWidth={1.4} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#1D1B1A] text-[#F7F4EF] text-[8.5px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE LUXURY SEARCH OVERLAY */}
        {/* ========================================================= */}
        <AnimatePresence>
          {searchOpen && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-[#E9DFD2] bg-[#F7F4EF] shadow-inner mt-3"
            >
              <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search size={18} className="absolute left-3.5 text-[#78645D]" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search corsetry, dresses, bespoke tailoring..."
                    autoFocus
                    className="w-full bg-[#FFFFFF] border border-[#E9DFD2] pl-11 pr-24 py-2.5 text-xs sm:text-sm tracking-wide text-[#1D1B1A] placeholder-[#78645D]/60 focus:outline-none focus:border-[#1D1B1A] transition-colors"
                  />
                  <div className="absolute right-2 flex items-center space-x-1">
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#1D1B1A] text-[#F7F4EF] text-[10px] uppercase tracking-wider font-medium hover:bg-[#78645D] transition-colors"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-1.5 text-[#78645D] hover:text-[#1D1B1A]"
                      aria-label="Close search"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </form>

                {/* Quick Trend Suggestions */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] uppercase tracking-wider text-[#78645D]">
                  <span className="font-semibold text-[#1D1B1A]">Trending:</span>
                  {['Unbecoming', 'Corsetry', 'Trousers', 'Evening Slip', 'Siliguri Atelier'].map((trend) => (
                    <button
                      key={trend}
                      type="button"
                      onClick={() => {
                        navigate(`/shop?search=${encodeURIComponent(trend)}`);
                        setSearchOpen(false);
                      }}
                      className="px-2 py-0.5 bg-[#E9DFD2]/40 hover:bg-[#1D1B1A] hover:text-[#F7F4EF] transition-colors cursor-pointer"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================= */}
      {/* MOBILE ATELIER NAVIGATION DRAWER */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#1D1B1A]/60 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Drawer */}
            <m.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{ duration: DURATION.base, ease: EASE_COUTURE }}
              className="fixed top-0 bottom-0 left-0 w-[84%] max-w-sm bg-[#F7F4EF] z-50 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#E9DFD2]"
            >
              {/* Top Drawer Brand Bar */}
              <div className="p-6">
                <div className="flex items-center justify-between pb-5 border-b border-[#E9DFD2]">
                  <div className="flex items-center space-x-3">
                    <svg
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#1D1B1A] w-7 h-7"
                    >
                      <circle cx="20" cy="20" r="18" stroke="#78645D" strokeWidth="0.8" strokeDasharray="2.5 2" opacity="0.65" />
                      <circle cx="20" cy="20" r="15" stroke="#1D1B1A" strokeWidth="0.9" opacity="0.6" />
                      <text
                        x="20"
                        y="25"
                        textAnchor="middle"
                        fontFamily="'Playfair Display', Georgia, serif"
                        fontSize="14.5"
                        fontWeight="500"
                        letterSpacing="0.07em"
                        fill="#1D1B1A"
                      >
                        SH
                      </text>
                    </svg>
                    <div>
                      <span className="font-serif text-lg font-medium tracking-[0.22em] text-[#1D1B1A] block leading-tight">
                        SECRET HOURS
                      </span>
                      <span className="text-[7px] uppercase tracking-[0.3em] text-[#78645D] block">
                        Prêt-à-Porter Label
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#1D1B1A] hover:text-[#78645D] transition-colors cursor-pointer"
                    aria-label="Close navigation"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Primary Editorial Links */}
                <nav className="mt-6 space-y-1">
                  {allNavLinks.map((link, idx) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 px-2 text-xs uppercase tracking-[0.16em] text-[#1D1B1A] hover:bg-[#E9DFD2]/40 hover:text-[#78645D] font-medium transition-all group border-b border-[#E9DFD2]/40"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-[#78645D]/70 font-mono">0{idx + 1}</span>
                        <span>{link.label}</span>
                      </div>
                      {link.tag ? (
                        <span className="text-[8.5px] tracking-wider px-1.5 py-0.5 bg-[#1D1B1A] text-[#F7F4EF] font-semibold">
                          {link.tag}
                        </span>
                      ) : (
                        <ArrowRight size={13} className="text-[#78645D] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  ))}
                </nav>

                {/* Secondary Services & Atelier info */}
                <div className="mt-6 pt-5 border-t border-[#E9DFD2] space-y-2.5">
                  <Link
                    to="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[11px] uppercase tracking-wider text-[#78645D] hover:text-[#1D1B1A] transition-colors py-1"
                  >
                    Track Order &amp; Invoices
                  </Link>
                  <Link
                    to="/policies/shipping"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[11px] uppercase tracking-wider text-[#78645D] hover:text-[#1D1B1A] transition-colors py-1"
                  >
                    Delivery &amp; Fitting Assistance
                  </Link>
                </div>
              </div>

              {/* Bottom Drawer Footer */}
              <div className="p-6 border-t border-[#E9DFD2] bg-[#FFFFFF]/60">
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#78645D] font-medium">
                    Siliguri Atelier &bull; Concierge
                  </p>
                  <a
                    href="tel:+919871234567"
                    className="text-xs font-serif text-[#1D1B1A] hover:text-[#78645D] transition-colors font-medium mt-0.5 block"
                  >
                    +91 98712 34567
                  </a>
                </div>

                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-3 bg-[#1D1B1A] text-[#F7F4EF] text-[10.5px] uppercase tracking-[0.2em] font-medium hover:bg-[#78645D] transition-colors shadow-sm"
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
