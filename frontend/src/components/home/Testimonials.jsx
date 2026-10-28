import React from 'react';
import { Quote } from 'lucide-react';
import Reveal from '../../motion/Reveal';

const PRESS_QUOTES = [
  {
    quote: "ZARIYA Atelier redefines Indian bridal couture with razor-sharp modern geometry that breathes through 300-year-old Banarasi silk weaves.",
    publication: "Vogue India",
    edition: "Runway & Bridal Issue",
  },
  {
    quote: "An ethereal marriage of fluid fabric kinetics and architectural restraint. Truly the vanguard of modern Indian design.",
    publication: "Harper's Bazaar India",
    edition: "Haute Couture Preview",
  },
  {
    quote: "Every garment feels like wearable museum sculpture. The hand-feel of their pure zari tissue is unparalleled in contemporary pret.",
    publication: "Elle Luxury",
    edition: "Designer Spotlight",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-[#FAF8F5] border-t border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <Reveal>
            <span className="text-xs uppercase tracking-couture text-[#C59B27] font-semibold block mb-2">
              Editorial Acclaim
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141210] font-normal tracking-tight">
              In The Press &amp; Runways
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRESS_QUOTES.map((item, idx) => (
            <Reveal key={item.publication} delay={idx * 2}>
              <div className="p-8 bg-white border border-[#E7E2DA] rounded-sm shadow-luxury-sm hover:shadow-luxury-md transition-shadow duration-300 flex flex-col justify-between h-full">
                <div>
                  <Quote size={28} className="text-[#C59B27]/40 mb-4" />
                  <p className="font-serif text-base sm:text-lg italic text-[#141210] leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#E7E2DA]">
                  <p className="font-serif font-bold text-sm tracking-wide text-[#141210]">
                    {item.publication}
                  </p>
                  <p className="text-[11px] uppercase tracking-editorial text-[#6E675F] mt-0.5">
                    {item.edition}
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
