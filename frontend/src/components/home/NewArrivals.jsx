import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import TiltCard from '../../motion/TiltCard';
import Reveal from '../../motion/Reveal';

export const SAMPLE_PRODUCTS = [
  {
    id: 'prod-01',
    slug: 'the-unbecoming-sculpted-corset',
    title: 'The Unbecoming Sculpted Corset',
    collection: 'Unbecoming (Col. 01)',
    category: 'Structural Corsetry',
    basePricePaise: 1450000, // Rs 14,500
    hsn: '6211',
    gstRate: 0.18,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    fabric: 'Structured Wool-Crepe & Internal Steel Boning',
    tag: 'Debut Signature',
  },
  {
    id: 'prod-02',
    slug: 'the-contradiction-bias-cut-silk-slip',
    title: 'The Contradiction Bias-Cut Silk Slip',
    collection: 'Unbecoming (Col. 01)',
    category: 'Fluid Drapes & Slips',
    basePricePaise: 1850000, // Rs 18,500
    hsn: '6204',
    gstRate: 0.18,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    fabric: '100% Pure Mulberry Silk Satin',
    tag: 'Liquid Drape',
  },
  {
    id: 'prod-03',
    slug: 'muted-mocha-rebellious-rib-knit-top',
    title: 'Muted Mocha Rebellious Rib Knit Top',
    collection: 'Between Us',
    category: 'Contradiction Separates',
    basePricePaise: 220000, // Rs 2,200 (<= Rs 2,500 attracts 5% GST!)
    hsn: '6109',
    gstRate: 0.05,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    fabric: 'Fine Merino Wool & Cashmere Rib Blend',
    tag: '5% GST Tier',
  },
  {
    id: 'prod-04',
    slug: 'midnight-rebel-oversized-tailored-blazer',
    title: 'Midnight Rebel Oversized Tailored Blazer',
    collection: 'Unbecoming (Col. 01)',
    category: 'Tailored Outerwear',
    basePricePaise: 2400000, // Rs 24,000
    hsn: '6204',
    gstRate: 0.18,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    fabric: 'Double-Faced Italian Wool & Silk Cupro',
    tag: 'Tailored Rebel',
  },
];

export const NewArrivals = ({ onAddToCart }) => {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);

  useEffect(() => {
    // Fetch live catalog from database
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          const formatted = data.products.slice(0, 4).map((p) => ({
            id: p._id,
            _id: p._id,
            slug: p.slug,
            title: p.title,
            collection: p.collectionName,
            category: p.category,
            basePricePaise: p.basePricePaise,
            hsn: p.hsn,
            gstRate: p.gstRate,
            image: p.images && p.images[0] ? p.images[0] : p.image,
            fabric: p.fabric,
            tag: p.isFeatured ? 'Signature Piece' : 'New Arrival',
          }));
          setProducts(formatted);
        }
      })
      .catch((err) => {
        console.warn('Using sample products for new arrivals', err);
      });
  }, []);

  return (
    <section className="py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 font-sans">
          <Reveal>
            <span className="text-xs uppercase tracking-couture text-[#78645D] font-semibold block mb-2">
              Collection 01: Unbecoming
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1D1B1A] font-normal tracking-tight">
              Curated Silhouettes &amp; Drops
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#78645D] font-sans leading-relaxed">
              A space for every version of you — including the ones the world hasn&rsquo;t met yet.
            </p>
          </Reveal>
        </div>

        {/* Product Grid with TiltCard (Zero React re-renders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const priceRupees = product.basePricePaise / 100;
            const gstAmount = priceRupees * product.gstRate;
            const inclusivePrice = priceRupees + gstAmount;

            return (
              <Reveal key={product.id || product.slug} delay={index * 1.5}>
                <div className="group flex flex-col h-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-sm overflow-hidden hover:border-[#C59B27]/60 transition-colors duration-300">
                  {/* Image Container with CSS 3D Tilt */}
                  <TiltCard maxTilt={8} className="overflow-hidden bg-[#F4F0EB]">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {/* Entire image is a direct Link to product detail */}
                      <Link
                        to={`/product/${product.slug}`}
                        className="block w-full h-full cursor-pointer"
                        aria-label={`View details of ${product.title}`}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>

                      {/* Tag Badge */}
                      <span className="absolute top-3 left-3 bg-[#141210]/80 backdrop-blur-sm text-[#FAF8F5] text-[9px] uppercase tracking-couture font-medium px-2.5 py-1 rounded-sm pointer-events-none">
                        {product.tag}
                      </span>

                      {/* Action Overlay: visible on hover on desktop, with quick touch controls */}
                      <div className="absolute inset-0 bg-[#141210]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 p-4 pointer-events-none group-hover:pointer-events-auto">
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 h-10 rounded-full bg-white text-[#141210] hover:bg-[#C59B27] hover:text-white flex items-center justify-center transition-colors shadow-luxury-md cursor-pointer z-30 pointer-events-auto"
                          aria-label={`View details of ${product.title}`}
                        >
                          <Eye size={18} strokeWidth={1.5} />
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onAddToCart) onAddToCart(product);
                          }}
                          className="w-10 h-10 rounded-full bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] flex items-center justify-center transition-colors shadow-luxury-md cursor-pointer z-30 pointer-events-auto"
                          aria-label={`Add ${product.title} to Cart`}
                        >
                          <ShoppingBag size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </TiltCard>

                  {/* Product Metadata & Price Breakdown */}
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-editorial text-[#C59B27] font-semibold">
                        {product.category} &middot; HSN {product.hsn}
                      </p>
                      <h3 className="font-serif text-base font-semibold text-[#141210] mt-1 group-hover:text-[#C59B27] transition-colors line-clamp-1">
                        <Link to={`/product/${product.slug}`} className="hover:text-[#C59B27] transition-colors">
                          {product.title}
                        </Link>
                      </h3>
                      <p className="text-[11px] text-[#6E675F] font-light mt-1 line-clamp-1">
                        {product.fabric}
                      </p>
                    </div>

                    {/* GST-Compliant Pricing breakdown & Quick Add */}
                    <div className="mt-4 pt-3 border-t border-[#E7E2DA]">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-serif text-lg font-bold text-[#141210]">
                            ₹{inclusivePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#6E675F] block">
                            Taxable: ₹{priceRupees.toLocaleString('en-IN')} + {(product.gstRate * 100).toFixed(0)}% GST
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onAddToCart) onAddToCart(product);
                          }}
                          className="p-2 rounded-full border border-[#E7E2DA] hover:border-[#C59B27] hover:bg-[#C59B27] hover:text-white text-[#141210] transition-colors cursor-pointer"
                          title="Add to Atelier Bag"
                          aria-label={`Add ${product.title} to Atelier Bag`}
                        >
                          <ShoppingBag size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-3.5 border border-[#141210] text-[#141210] hover:bg-[#141210] hover:text-[#FAF8F5] text-xs uppercase tracking-couture font-medium transition-colors duration-200"
          >
            Explore All 24 Runway Creations <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
