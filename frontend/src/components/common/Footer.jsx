import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#141210] text-[#FAF8F5] pt-16 pb-12 border-t border-[#C59B27]/30">
      {/* Brand Trust & Couture Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#292524]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27] mb-1">
              <Award size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#FAF8F5]">Handloom Heritage</h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed">Authentic Banarasi zari, Chanderi &amp; mulberry silk sourced directly from master weaver clusters.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27] mb-1">
              <Truck size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#FAF8F5]">Insured White-Glove Shipping</h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed">Tamper-proof sealed luxury garment bags with express transit across 27,000+ Indian pincodes.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27] mb-1">
              <ShieldCheck size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#FAF8F5]">GST-Compliant Invoicing</h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed">Automated Section 31 tax invoices with verified HSN codes and B2B input tax credit eligibility.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27] mb-1">
              <RefreshCw size={20} strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#FAF8F5]">Bespoke Alterations</h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed">Complimentary fit adjustments within 14 days of delivery through our Siliguri flagship atelier.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Atelier Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-3xl font-bold tracking-[0.22em] text-[#FAF8F5] block">
              ZARIYA
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C59B27] block -mt-2">
              Haute Couture Atelier &middot; Siliguri
            </span>
            <p className="text-xs text-[#A8A29E] leading-relaxed pr-6 max-w-sm">
              ZARIYA synthesizes architectural precision with ancient Indian handloom textiles. Each couture garment is sculpted over hundreds of artisan hours in our Siliguri studio.
            </p>
            <div className="pt-2">
              <p className="text-xs text-[#E7E2DA] font-medium">The Flagship Atelier:</p>
              <p className="text-xs text-[#A8A29E]">The Atelier, Sevoke Road, Near Vega Circle, Siliguri, West Bengal 734001</p>
              <p className="text-xs text-[#A8A29E] mt-1">Concierge: +91 98712 34567 | concierge@zariyaatelier.com</p>
            </div>
          </div>

          {/* Couture Collections */}
          <div className="space-y-3">
            <h5 className="text-[11px] uppercase tracking-couture font-semibold text-[#C59B27]">Collections</h5>
            <ul className="space-y-2.5 text-xs text-[#A8A29E]">
              <li><Link to="/shop?collection=noor" className="hover:text-[#FAF8F5] transition-colors">The Royal Noor (Bridal)</Link></li>
              <li><Link to="/shop?collection=aaranya" className="hover:text-[#FAF8F5] transition-colors">Aaranya Draped Sarees</Link></li>
              <li><Link to="/shop?collection=vanya" className="hover:text-[#FAF8F5] transition-colors">Vanya Raw Silk Sherwanis</Link></li>
              <li><Link to="/shop?category=pret" className="hover:text-[#FAF8F5] transition-colors">Atelier Pret &amp; Separates</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-[#FAF8F5] transition-colors">Embroidered Zari Potlis</Link></li>
            </ul>
          </div>

          {/* Client Care & Concierge */}
          <div className="space-y-3">
            <h5 className="text-[11px] uppercase tracking-couture font-semibold text-[#C59B27]">Client Care</h5>
            <ul className="space-y-2.5 text-xs text-[#A8A29E]">
              <li><Link to="/about" className="hover:text-[#FAF8F5] transition-colors">Book Atelier Fitting</Link></li>
              <li><Link to="/account/orders" className="hover:text-[#FAF8F5] transition-colors">Track Order &amp; Invoice</Link></li>
              <li><Link to="/policies/shipping" className="hover:text-[#FAF8F5] transition-colors">Shipping &amp; Delivery</Link></li>
              <li><Link to="/policies/returns" className="hover:text-[#FAF8F5] transition-colors">Returns &amp; Cancellations</Link></li>
              <li><Link to="/contact" className="hover:text-[#FAF8F5] transition-colors">Customer Concierge</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h5 className="text-[11px] uppercase tracking-couture font-semibold text-[#C59B27]">Legal &amp; Policies</h5>
            <ul className="space-y-2.5 text-xs text-[#A8A29E]">
              <li><Link to="/policies/terms" className="hover:text-[#FAF8F5] transition-colors">Terms of Service</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-[#FAF8F5] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/policies/returns" className="hover:text-[#FAF8F5] transition-colors">Refund &amp; Cancellation Policy</Link></li>
              <li><Link to="/policies/shipping" className="hover:text-[#FAF8F5] transition-colors">Shipping Policy</Link></li>
              <li><a href="#gst-compliance" className="hover:text-[#FAF8F5] transition-colors flex items-center">GSTIN Verification <ArrowUpRight size={12} className="ml-1" /></a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: GSTIN & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#292524] text-xs text-[#78716C] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>&copy; {new Date().getFullYear()} Zariya Haute Couture Private Limited. All Rights Reserved.</span>
          <span className="block sm:inline sm:ml-3 text-[11px] text-[#A8A29E]">GSTIN: 19AAAAZ0000A1Z5 (State Code: 19 &middot; West Bengal)</span>
        </div>
        <div className="flex items-center space-x-6 text-[11px] tracking-wider uppercase">
          <span className="text-[#C59B27]">Prepaid &middot; Razorpay Secure</span>
          <span>Cash on Delivery (OTP Verified)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
