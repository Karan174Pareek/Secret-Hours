import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1D1B1A] text-[#F7F4EF] pt-16 pb-12 border-t border-[#E9DFD2]/20">
      {/* Brand Trust & Secret Hours Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#78645D]/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/30 flex items-center justify-center text-[#E9DFD2] mb-1">
              <Award size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#F7F4EF]">Elegance &amp; Rebellion</h4>
            <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-sans">Modern silhouettes designed with architectural corsetry, fluid slips, and unapologetic details.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/30 flex items-center justify-center text-[#E9DFD2] mb-1">
              <Truck size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#F7F4EF]">Discreet Packaging</h4>
            <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-sans">Minimal matte boxes with a sealed card reading: &ldquo;We trust you with our secret.&rdquo;</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/30 flex items-center justify-center text-[#E9DFD2] mb-1">
              <ShieldCheck size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#F7F4EF]">GST-Compliant Invoicing</h4>
            <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-sans">Automated Section 31 tax invoices with verified HSN codes (6204/6211) and B2B input tax credit.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/30 flex items-center justify-center text-[#E9DFD2] mb-1">
              <RefreshCw size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#F7F4EF]">The Secret Society</h4>
            <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-sans">A shared space for women to dress like themselves and evolve beyond expectations.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Brand Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-3xl font-bold tracking-[0.25em] text-[#F7F4EF] block">
              SECRET HOURS
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#E9DFD2] block -mt-2 font-sans font-medium">
              A Contemporary Womenswear Label
            </span>
            <p className="text-xs text-[#E9DFD2]/80 leading-relaxed pr-6 max-w-sm font-sans">
              Born from the belief that what we wear is an extension of who we are. Built around individuality, self-expression, and the freedom to be unapologetically yourself.
            </p>
            <div className="pt-2 font-sans">
              <p className="text-xs text-[#E9DFD2] font-semibold">The Siliguri Atelier:</p>
              <p className="text-xs text-[#E9DFD2]/70">The Atelier, Sevoke Road, Near Vega Circle, Siliguri, West Bengal 734001</p>
              <p className="text-xs text-[#E9DFD2]/70 mt-1">Concierge: +91 98712 34567 | concierge@secrethours.com</p>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3 font-sans">
            <h5 className="text-[11px] uppercase tracking-couture font-semibold text-[#E9DFD2]">Collections</h5>
            <ul className="space-y-2.5 text-xs text-[#E9DFD2]/70">
              <li><Link to="/shop?collection=unbecoming" className="hover:text-[#F7F4EF] transition-colors">Unbecoming (Collection 01)</Link></li>
              <li><Link to="/shop?category=corsetry" className="hover:text-[#F7F4EF] transition-colors">Structural Corsetry</Link></li>
              <li><Link to="/shop?category=slips" className="hover:text-[#F7F4EF] transition-colors">Fluid Drapes &amp; Slips</Link></li>
              <li><Link to="/shop?category=outerwear" className="hover:text-[#F7F4EF] transition-colors">Tailored Rebel Outerwear</Link></li>
              <li><Link to="/shop?category=separates" className="hover:text-[#F7F4EF] transition-colors">Contradiction Separates</Link></li>
            </ul>
          </div>

          {/* Client Care & Society */}
          <div className="space-y-3 font-sans">
            <h5 className="text-[11px] uppercase tracking-couture font-semibold text-[#E9DFD2]">Client Care</h5>
            <ul className="space-y-2.5 text-xs text-[#E9DFD2]/70">
              <li><Link to="/about" className="hover:text-[#F7F4EF] transition-colors">The Founders&rsquo; Story</Link></li>
              <li><Link to="/about#society" className="hover:text-[#F7F4EF] transition-colors">Secret Society</Link></li>
              <li><Link to="/account/orders" className="hover:text-[#F7F4EF] transition-colors">Track Order &amp; Invoice</Link></li>
              <li><Link to="/policies/shipping" className="hover:text-[#F7F4EF] transition-colors">White-Glove Delivery</Link></li>
              <li><Link to="/policies/returns" className="hover:text-[#F7F4EF] transition-colors">Returns &amp; Alterations</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3 font-sans">
            <h5 className="text-[11px] uppercase tracking-couture font-semibold text-[#E9DFD2]">Legal &amp; Policies</h5>
            <ul className="space-y-2.5 text-xs text-[#E9DFD2]/70">
              <li><Link to="/policies/terms" className="hover:text-[#F7F4EF] transition-colors">Terms of Service</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-[#F7F4EF] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policies/returns" className="hover:text-[#F7F4EF] transition-colors">Refund &amp; Cancellation Policy</Link></li>
              <li><Link to="/policies/shipping" className="hover:text-[#F7F4EF] transition-colors">Shipping Policy</Link></li>
              <li><a href="#gst-compliance" className="hover:text-[#F7F4EF] transition-colors flex items-center">GSTIN Verification <ArrowUpRight size={12} className="ml-1" /></a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: GSTIN & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#78645D]/30 text-xs text-[#E9DFD2]/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <div>
          <span>&copy; {new Date().getFullYear()} Secret Hours Apparel Private Limited. All Rights Reserved.</span>
          <span className="block sm:inline sm:ml-3 text-[11px] text-[#E9DFD2]/80">GSTIN: 19AAAAZ0000A1Z5 (State Code: 19 &middot; West Bengal)</span>
        </div>
        <div className="flex items-center space-x-6 text-[11px] tracking-wider uppercase">
          <span className="text-[#E9DFD2]">Prepaid &middot; Razorpay Secure</span>
          <span>Cash on Delivery (OTP Verified)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
