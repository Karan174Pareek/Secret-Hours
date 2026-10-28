import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from '../../motion/Reveal';

const COLLECTIONS = [
  {
    id: 'unbecoming',
    title: 'Unbecoming (Collection 01)',
    tagline: 'The freedom of being, without the pressure of becoming. Reclaiming femininity on your own terms.',
    pieces: 'Debut Collection',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    link: '/shop?collection=unbecoming',
    colorAccent: '#E9DFD2',
  },
  {
    id: 'night-hours',
    title: 'The Night Hours',
    tagline: 'Some outfits deserve their own little secret. Sculptural evening gowns and after-hours corsetry.',
    pieces: 'Evening Capsule',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
    link: '/shop?collection=night-hours',
    colorAccent: '#78645D',
  },
  {
    id: 'between-us',
    title: 'Between Us',
    tagline: 'Between us, you look good. For the outfit that says everything without explaining a thing.',
    pieces: 'Prêt & Separates',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    link: '/shop?collection=between-us',
    colorAccent: '#1D1B1A',
  },
];

export const FeaturedCollection = () => {
  return (
    <section className="py-24 bg-[#F7F4EF] border-t border-[#E9DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <Reveal>
            <div className="inline-flex items-center space-x-2 text-[#78645D] text-xs uppercase tracking-couture font-semibold mb-3 font-sans">
              <Sparkles size={14} />
              <span>A Story Unfolding in Public</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1D1B1A] font-normal tracking-tight">
              Collections &amp; Capsule Drops
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <Link
              to="/shop"
              className="mt-4 md:mt-0 inline-flex items-center text-xs uppercase tracking-couture text-[#1D1B1A] hover:text-[#78645D] font-semibold transition-colors group font-sans"
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
