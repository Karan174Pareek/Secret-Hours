import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import TiltCard from '../../motion/TiltCard';
import Reveal from '../../motion/Reveal';

export const SAMPLE_PRODUCTS = [
  {
    id: 'prod-01',
    slug: 'chand-taara-bridal-lehenga',
    title: 'Chand-Taara Royal Zardozi Lehenga',
    collection: 'The Royal Noor',
    category: 'Couture Bridal',
    basePricePaise: 14500000, // Rs 1,45,000 (Taxable)
    hsn: '6204',
    gstRate: 0.18, // 18% since > Rs 2,500
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    fabric: 'Pure Mulberry Silk with Real Zari',
    tag: 'Runway Exclusive',
  },
  {
    id: 'prod-02',
    slug: 'metallic-tissue-draped-saree',
    title: 'Aaranya Pleated Metallic Tissue Saree',
    collection: 'Aaranya Metamorphosis',
    category: 'Draped Sarees',
    basePricePaise: 4200000, // Rs 42,000 (Taxable)
    hsn: '6214',
    gstRate: 0.18,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    fabric: 'Hand-Pleated Organza & Metallic Tissue',
    tag: 'Bestseller',
  },
  {
    id: 'prod-03',
    slug: 'chanderi-handloom-kurta-ensemble',
    title: 'Imperial Chanderi Silk Tunic Ensemble',
    collection: 'Atelier Pret',
    category: 'Pret Separates',
    basePricePaise: 240000, // Rs 2,400 (Taxable <= Rs 2,500 => 5% GST!)
    hsn: '6204',
    gstRate: 0.05, // 5% GST boundary showcase!
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    fabric: 'Hand-Spun Chanderi Silk & Zari Border',
    tag: '5% GST Slab',
  },
  {
    id: 'prod-04',
    slug: 'sculpted-corset-palazzo-set',
    title: 'Sculpted Zardozi Corset & Silk Palazzo',
    collection: 'Modern Couture',
    category: 'Contemporary Drapes',
    basePricePaise: 2850000, // Rs 28,500 (Taxable)
    hsn: '6211',
    gstRate: 0.18,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    fabric: 'Raw Silk & Fine Cutdana Beadwork',
    tag: 'Limited Edition',
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
            tag: p.isFeatured ? 'Runway Exclusive' : 'New Arrival',
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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <span className="text-xs uppercase tracking-couture text-[#C59B27] font-semibold block mb-2">
              New Season Drops
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#141210] font-normal tracking-tight">
              Autumn Runway Arrivals
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#6E675F] font-sans leading-relaxed">
              Explore our latest limited-batch creations. Hand-draped and embellished by master craftsmen.
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
