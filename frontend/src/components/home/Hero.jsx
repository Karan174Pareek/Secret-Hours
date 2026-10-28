import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { m, useInView } from 'motion/react';
import HeroFabricCanvas from '../3d/HeroFabricCanvas';
import MagneticButton from '../../motion/MagneticButton';
import useMotion3DBridge from '../../motion/useScrollProgress';
import { DURATION, EASE_COUTURE } from '../../motion/tokens';

export const Hero = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { margin: '0px 0px -20% 0px' });
  const { smoothScroll, smoothPointerX, smoothPointerY, handlePointerMove } = useMotion3DBridge();

  return (
    <section
      ref={heroRef}
      onMouseMove={handlePointerMove}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#FAF8F5] pt-12 pb-20 select-none"
    >
      {/* 3D WebGL Canvas 1: Flowing Zari Silk Cloth Drape */}
      <HeroFabricCanvas
        smoothScroll={smoothScroll}
        smoothPointerX={smoothPointerX}
        smoothPointerY={smoothPointerY}
        isVisible={isHeroInView}
      />

      {/* Subtle Editorial Gradient Overlay for Text Readability (Contrast > 15:1) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/30 to-transparent pointer-events-none z-10" />

      {/* Main Editorial Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Pre-title Badge */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_COUTURE, delay: 0.1 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#141210]/5 border border-[#C59B27]/40 mb-6"
        >
          <Sparkles size={13} className="text-[#C59B27]" />
          <span className="text-[10px] uppercase tracking-couture font-semibold text-[#141210]">
            AUTUMN / WINTER 2026 COUTURE RUNWAY
          </span>
        </m.div>

        {/* Monumental Serif Typography */}
        <m.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_COUTURE, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[1.08] tracking-tight text-[#141210] max-w-4xl"
        >
          The Architecture of <br />
          <span className="italic font-normal text-[#C59B27]">Heritage Silk</span> &amp; Zari
        </m.h1>

        {/* Brand Mission Subtitle */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_COUTURE, delay: 0.35 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-[#3D3833] max-w-2xl font-sans font-normal leading-relaxed"
        >
          Ancient Banarasi weaving traditions sculpted into bold architectural silhouettes.
          Each heirloom creation is hand-embroidered over hundreds of artisan hours in our Siliguri atelier.
        </m.p>

        {/* Magnetic Action Buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_COUTURE, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          {/* Primary Magnetic CTA */}
          <Link to="/shop">
            <MagneticButton className="px-8 py-4 bg-[#141210] text-[#FAF8F5] text-xs uppercase tracking-couture font-medium hover:bg-[#C59B27] hover:text-white shadow-luxury-md flex items-center group">
              Explore The Collection
              <ArrowRight size={15} className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </Link>

          {/* Secondary Outline CTA */}
          <Link to="/about#atelier">
            <button
              type="button"
              className="px-8 py-4 bg-transparent border border-[#141210] text-[#141210] text-xs uppercase tracking-couture font-medium hover:bg-[#141210] hover:text-[#FAF8F5] transition-colors duration-200 cursor-pointer"
            >
              Atelier Philosophy
            </button>
          </Link>
        </m.div>

        {/* Micro Credential Counters */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.slow, ease: EASE_COUTURE, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-[#E7E2DA]/80 grid grid-cols-3 gap-6 sm:gap-12 text-center max-w-lg"
        >
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#141210]">400+</p>
            <p className="text-[10px] uppercase tracking-editorial text-[#6E675F] mt-0.5">Artisan Hours / Piece</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#141210]">100%</p>
            <p className="text-[10px] uppercase tracking-editorial text-[#6E675F] mt-0.5">Pure Mulberry &amp; Zari</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#141210]">₹2,500</p>
            <p className="text-[10px] uppercase tracking-editorial text-[#6E675F] mt-0.5">GST Slab Compliant</p>
          </div>
        </m.div>
      </div>

      {/* Gentle Scroll Invitation Indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer pointer-events-auto"
        onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#6E675F] mb-1">Scroll to Explore</span>
        <ChevronDown size={16} className="text-[#C59B27] animate-bounce" />
      </m.div>
    </section>
  );
};

export default Hero;
