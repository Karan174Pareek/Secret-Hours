import React from 'react';
import { Quote } from 'lucide-react';
import Reveal from '../../motion/Reveal';

const CAMPAIGN_LINES = [
  {
    quote: "Between us, you look good. For the outfit that says everything without explaining a thing.",
    source: "The Attitude",
    context: "Secret Hours Campaign",
  },
  {
    quote: "Growing older. Never dressing smaller. Because becoming more of yourself should never mean becoming less visible.",
    source: "The Philosophy",
    context: "Secret Hours Brand Book",
  },
  {
    quote: "This stays between us. Some outfits deserve their own little secret.",
    source: "The Playful Side",
    context: "Collection 01: Unbecoming",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-[#F7F4EF] border-t border-[#E9DFD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <Reveal>
            <span className="text-xs uppercase tracking-couture text-[#78645D] font-semibold block mb-2 font-sans">
              Lines to Live By
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1D1B1A] font-normal tracking-tight">
              A Story Unfolding in Public
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CAMPAIGN_LINES.map((item, idx) => (
            <Reveal key={item.source} delay={idx * 2}>
              <div className="p-8 bg-white border border-[#E9DFD2] rounded-sm shadow-luxury-sm hover:shadow-luxury-md transition-shadow duration-300 flex flex-col justify-between h-full font-sans">
                <div>
                  <Quote size={28} className="text-[#78645D]/40 mb-4" />
                  <p className="font-serif text-base sm:text-lg italic text-[#1D1B1A] leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#E9DFD2]">
                  <p className="font-serif font-bold text-sm tracking-wide text-[#1D1B1A]">
                    {item.source}
                  </p>
                  <p className="text-[11px] uppercase tracking-editorial text-[#78645D] mt-0.5">
                    {item.context}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
