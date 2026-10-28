import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from '../../motion/Reveal';

const COLLECTIONS = [
  {
    id: 'noor',
    title: 'The Royal Noor Bridal',
    tagline: 'Imperial Zardozi & Hand-Beaded Heirloom Lehengas',
    pieces: '14 Bespoke Ensembles',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    link: '/shop?collection=noor',
    colorAccent: '#C59B27',
  },
  {
    id: 'aaranya',
    title: 'Aaranya Metamorphosis',
    tagline: 'Sculptural Pleated Metallic Tissue & Organza Drapes',
    pieces: '18 Runway Silhouettes',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    link: '/shop?collection=aaranya',
    colorAccent: '#B48C36',
  },
  {
    id: 'vanya',
    title: 'Vanya Imperial Silk',
    tagline: 'Hand-Spun Matka Silk Sherwanis & Tailored Bandhgalas',
    pieces: '12 Ceremonial Drops',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
    link: '/shop?collection=vanya',
    colorAccent: '#9E7A18',
  },
];

export const FeaturedCollection = () => {
  return (
    <section className="py-24 bg-[#FAF8F5] border-t border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 text-[#C59B27] text-xs uppercase tracking-couture font-semibold mb-3">
              <Sparkles size={14} />
              <span>Autumn / Winter Collections</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#141210] font-normal tracking-tight">
              Curated Haute Couture
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <Link
              to="/shop"
              className="mt-4 md:mt-0 inline-flex items-center text-xs uppercase tracking-couture text-[#141210] hover:text-[#C59B27] font-semibold transition-colors group"
            >
              View Full Archive <ArrowRight size={14} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {COLLECTIONS.map((col, index) => (
            <Reveal key={col.id} delay={index * 2}>
              <Link
                to={col.link}
                className="group block relative h-[520px] rounded-sm overflow-hidden bg-[#141210] shadow-luxury-md"
              >
                {/* Background Image with smooth zoom on hover */}
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover object-top opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Editorial Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

                {/* Top Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="text-[10px] uppercase tracking-couture text-[#FAF8F5]/90 bg-[#141210]/60 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full font-medium">
                    {col.pieces}
                  </span>
                </div>

                {/* Bottom Content Card */}
                <div className="absolute bottom-6 left-6 right-6 z-10 text-[#FAF8F5]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C59B27] font-semibold mb-1">
                    Couture Capsule 0{index + 1}
                  </p>
                  <h3 className="font-serif text-2xl font-bold tracking-wide text-white group-hover:text-[#C59B27] transition-colors duration-300">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#A8A29E] mt-2 line-clamp-2 font-sans font-light">
                    {col.tagline}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs uppercase tracking-couture font-medium text-white group-hover:text-[#C59B27] transition-colors">
                    <span>Explore Lookbook</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
