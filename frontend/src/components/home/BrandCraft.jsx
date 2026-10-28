import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Feather, Scissors, Shield, Compass } from 'lucide-react';
import Reveal from '../../motion/Reveal';

const CRAFT_PILLARS = [
  {
    icon: Feather,
    step: '01',
    title: 'Imperial Mulberry Silk & Real Zari',
    desc: 'Woven on traditional pit-looms in Varanasi by seventh-generation master artisans using genuine electroplated silver-gilt zari wire.',
  },
  {
    icon: Scissors,
    step: '02',
    title: 'Architectural Pattern Drafting',
    desc: 'Each garment combines classical Indian draping geometry with structured Parisian corset stays for effortless movement and silhouette poise.',
  },
  {
    icon: Compass,
    step: '03',
    title: '400+ Hours of Hand-Beading',
    desc: 'Zardozi, Marodi, and dabka metal thread embroidery meticulously needlecrafted by seasoned karigars in our Siliguri studio.',
  },
  {
    icon: Shield,
    step: '04',
    title: 'Circular Handloom Preservation',
    desc: '100% biodegradable natural silk textiles, fair wages, direct artisan equity, and zero synthetic polymers in our couture line.',
  },
];

export const BrandCraft = () => {
  return (
    <section className="py-24 bg-[#141210] text-[#FAF8F5] relative overflow-hidden">
      {/* Decorative Atelier Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story Hook */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal>
              <span className="text-xs uppercase tracking-couture text-[#C59B27] font-semibold block">
                The Atelier Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white mt-2 leading-[1.15]">
                Ancient Weaves, <br />
                <span className="italic font-light text-[#C59B27]">Architectural Modernity</span>
              </h2>
            </Reveal>

            <Reveal delay={2}>
              <p className="text-sm text-[#A8A29E] leading-relaxed font-sans font-light">
                At ZARIYA, couture is not merely fashion; it is living Indian heritage re-engineered for the global stage. Founded by creative director Ananya Verma, our atelier bridges the centuries-old looms of Banaras with high-precision structural tailoring.
              </p>
              <p className="text-sm text-[#A8A29E] leading-relaxed font-sans font-light mt-4">
                We reject mass-production. Every piece is cut from hand-spun silks and finished with custom cast-metal latkans, hand-rolled hems, and individual serial certificates.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="pt-4 flex items-center space-x-6">
                <Link
                  to="/about"
                  className="inline-flex items-center text-xs uppercase tracking-couture font-semibold text-[#C59B27] hover:text-white transition-colors group"
                >
                  Discover The Full Atelier Story <ArrowRight size={14} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
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
                  <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-sm hover:border-[#C59B27]/50 transition-colors duration-300 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full border border-[#C59B27]/30 flex items-center justify-center text-[#C59B27]">
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <span className="font-serif text-sm text-[#C59B27]/70 font-semibold tracking-widest">
                          {pillar.step}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-white mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#A8A29E] font-light leading-relaxed">
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
