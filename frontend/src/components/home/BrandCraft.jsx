import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, Scissors, Shield, Compass } from 'lucide-react';
import Reveal from '../../motion/Reveal';

const CRAFT_PILLARS = [
  {
    icon: Feather,
    step: '01',
    title: 'Individuality & Expression',
    desc: 'Born from the belief that what we wear is an extension of who we are, built around the freedom to be unapologetically yourself.',
  },
  {
    icon: Scissors,
    step: '02',
    title: 'Softness Meets Structure',
    desc: 'Architectural steel-boned corsetry, fluid bias-cut silk drapes, and tailored silhouettes with intentional contrast details.',
  },
  {
    icon: Compass,
    step: '03',
    title: 'Unlearning the Mould',
    desc: 'Letting go of the need to appear perfect or behave appropriately. Reclaiming feminine identity without seeking permission.',
  },
  {
    icon: Shield,
    step: '04',
    title: 'Growing Older. Never Dressing Smaller.',
    desc: 'Because becoming more of yourself should never mean becoming less visible. Confidence has no age limit or dress code.',
  },
];

export const BrandCraft = () => {
  return (
    <section className="py-24 bg-[#1D1B1A] text-[#F7F4EF] relative overflow-hidden">
      {/* Decorative Atelier Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#E9DFD2_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story Hook */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal>
              <span className="text-xs uppercase tracking-couture text-[#E9DFD2] font-semibold block font-sans">
                The Secret Society
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#F7F4EF] mt-2 leading-[1.15]">
                A Space for Every <br />
                <span className="italic font-light text-[#E9DFD2]">Version of You</span>
              </h2>
            </Reveal>

            <Reveal delay={2}>
              <p className="text-sm text-[#E9DFD2]/80 leading-relaxed font-sans font-light">
                We believe every woman has different versions of herself — the bold one, the quiet one, the ambitious one, the rebellious one, the one who follows the rules, and the one who secretly wants to break them.
              </p>
              <p className="text-sm text-[#E9DFD2]/80 leading-relaxed font-sans font-light mt-4">
                None of these versions cancels out the others. They are all part of her story. Secret Hours is a shared space for women to dress like themselves and evolve on their own terms.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="pt-4 flex items-center space-x-6 font-sans">
                <Link
                  to="/about"
                  className="inline-flex items-center text-xs uppercase tracking-couture font-semibold text-[#E9DFD2] hover:text-white transition-colors group"
                >
                  Discover The Founders&rsquo; Story <ArrowRight size={14} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 4 Craft Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CRAFT_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.step} delay={idx * 1.5}>
                  <div className="p-6 bg-[#252221] border border-[#78645D]/30 rounded-sm hover:border-[#E9DFD2]/60 transition-colors duration-300 flex flex-col justify-between h-full font-sans">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/30 flex items-center justify-center text-[#E9DFD2]">
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <span className="font-serif text-sm text-[#E9DFD2]/80 font-semibold tracking-widest">
                          {pillar.step}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-white mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#E9DFD2]/70 font-light leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCraft;
