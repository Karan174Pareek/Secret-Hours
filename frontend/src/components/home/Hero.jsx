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
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#1D1B1A]/5 border border-[#78645D]/30 mb-6"
        >
          <Sparkles size={13} className="text-[#78645D]" />
          <span className="text-[10px] uppercase tracking-couture font-semibold text-[#1D1B1A]">
            SECRET HOURS PRESENTS &middot; COLLECTION 01: UNBECOMING
          </span>
        </m.div>

        {/* Monumental Serif Typography */}
        <m.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_COUTURE, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.08] tracking-tight text-[#1D1B1A] max-w-4xl"
        >
          We have a secret to tell. <br />
          <span className="italic font-normal text-[#78645D]">Can you keep a secret?</span>
        </m.h1>

        {/* Brand Mission Subtitle */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_COUTURE, delay: 0.35 }}
          className="mt-6 text-sm sm:text-base md:text-lg text-[#78645D] max-w-2xl font-sans font-normal leading-relaxed"
        >
          The freedom of being, without the pressure of becoming. Contemporary silhouettes designed for women who refuse to be defined by age, expectations, or a single version of themselves.
        </m.p>

        {/* Magnetic Action Buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_COUTURE, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 font-sans"
        >
          {/* Primary Magnetic CTA */}
          <Link to="/shop?collection=unbecoming">
            <MagneticButton className="px-8 py-4 bg-[#1D1B1A] text-[#F7F4EF] text-xs uppercase tracking-couture font-medium hover:bg-[#78645D] hover:text-white shadow-luxury-md flex items-center group">
              Discover Unbecoming
              <ArrowRight size={15} className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
          </Link>

          {/* Secondary Outline CTA */}
          <Link to="/about">
            <button
              type="button"
              className="px-8 py-4 bg-transparent border border-[#1D1B1A] text-[#1D1B1A] text-xs uppercase tracking-couture font-medium hover:bg-[#1D1B1A] hover:text-[#F7F4EF] transition-colors duration-200 cursor-pointer"
            >
              The Brand Story
            </button>
          </Link>
        </m.div>

        {/* Micro Credential Counters */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.slow, ease: EASE_COUTURE, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-[#E9DFD2] grid grid-cols-3 gap-6 sm:gap-12 text-center max-w-lg font-sans"
        >
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#1D1B1A]">Col. 01</p>
            <p className="text-[10px] uppercase tracking-editorial text-[#78645D] mt-0.5">Unbecoming Launch</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#1D1B1A]">Prêt-à-Porter</p>
            <p className="text-[10px] uppercase tracking-editorial text-[#78645D] mt-0.5">Affordable Luxury</p>
          </div>
          <div>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#1D1B1A]">5% &amp; 18%</p>
            <p className="text-[10px] uppercase tracking-editorial text-[#78645D] mt-0.5">GST Slabs Compliant</p>
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
