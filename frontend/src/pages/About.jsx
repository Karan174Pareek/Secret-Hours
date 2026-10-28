import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, Feather, Scissors, Clock, MapPin, Compass } from 'lucide-react';
import { m, useScroll, useTransform } from 'motion/react';
import Reveal from '../motion/Reveal';
import PageTransition from '../motion/PageTransition';

const TIMELINE = [
  {
    year: '2018',
    title: 'The Varanasi Inception',
    desc: 'Creative Director Ananya Verma spent nine months in the weavers’ lanes of Varanasi, documenting vanishing silver electroplated zari pit-loom techniques.',
  },
  {
    year: '2020',
    title: 'The Siliguri Flagship Atelier',
    desc: 'Establishment of our Siliguri flagship atelier in West Bengal, uniting 40 multigenerational master karigars under fair-equity wages and health stewardship.',
  },
  {
    year: '2022',
    title: 'Lakmé Fashion Week Grand Finale',
    desc: 'Runway debut of "Aaranya" to international critical acclaim, lauded by Vogue India as "the arrival of modern Indian architectural couture".',
  },
  {
    year: '2024',
    title: 'Zero-Polymer Handloom Standard',
    desc: 'Complete phase-out of synthetic lining and petroleum-based sequins across 100% of atelier creations, replaced with certified biological silk and cast brass.',
  },
  {
    year: '2026',
    title: 'Global Digital Runway & 3D Studio',
    desc: 'Pioneering real-time 3D cloth shader immersion and instant GST Section 31 tax compliance for luxury patrons across India and worldwide.',
  },
];

export const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  // Parallax offsets for storytelling showpiece
  const portraitY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);
  const quoteY = useTransform(scrollYProgress, [0.1, 0.5], [40, -30]);
  const timelineProgress = useTransform(scrollYProgress, [0.3, 0.85], ['0%', '100%']);

  return (
    <PageTransition>
      <div ref={containerRef} className="bg-[#FAF8F5] min-h-screen py-16">
        {/* Editorial Chapter 1: The Designer & Atelier Hook */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Designer Portrait with Motion Parallax */}
            <div className="lg:col-span-5 relative">
              <m.div
                style={{ y: portraitY }}
                className="relative aspect-[3/4] max-w-md mx-auto rounded-sm overflow-hidden bg-[#141210] border border-[#E7E2DA] shadow-luxury-lg"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                  alt="Ananya Verma, Creative Director of ZARIYA"
                  className="w-full h-full object-cover object-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-[#FAF8F5]">
                  <p className="font-serif text-xl font-bold">Ananya Verma</p>
                  <p className="text-[10px] uppercase tracking-couture text-[#C59B27] mt-0.5">
                    Founder &amp; Creative Director
                  </p>
                </div>
              </m.div>
            </div>

            {/* Philosophy Content */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-1">
                  Atelier Heritage
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl text-[#141210] leading-tight font-normal">
                  "Couture is an architectural dialogue between <span className="italic font-light text-[#C59B27]">time, weaver, and body</span>."
                </h1>
              </Reveal>

              <Reveal delay={2}>
                <p className="text-sm text-[#3D3833] font-sans leading-relaxed">
                  ZARIYA was founded in 2018 with a singular, uncompromising vision: to liberate Indian handlooms from nostalgic repetition and elevate them into modern architectural couture.
                </p>
                <p className="text-sm text-[#6E675F] font-sans leading-relaxed mt-4">
                  Too often, traditional Indian festive wear compromises structural poise for decorative excess. We engineer our garments with calibrated internal corsetry, weight-distributed skirts, and sculpted accordion drapes that move with liquid grace.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="pt-4 grid grid-cols-3 gap-6 border-t border-[#E7E2DA]">
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#141210]">40+</span>
                    <span className="text-[10px] uppercase tracking-editorial text-[#6E675F] block mt-0.5">Master Karigars</span>
                  </div>
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#141210]">7th</span>
                    <span className="text-[10px] uppercase tracking-editorial text-[#6E675F] block mt-0.5">Generation Weavers</span>
                  </div>
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#141210]">100%</span>
                    <span className="text-[10px] uppercase tracking-editorial text-[#6E675F] block mt-0.5">Pure Natural Silk</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Chapter 2: Craftsmanship & Handloom Journey */}
        <section id="craft" className="py-24 bg-[#141210] text-[#FAF8F5] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Reveal>
                <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-2">
                  Chapter II &middot; The Craft Process
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
                  The Four Pillars of Zariya Craft
                </h2>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Reveal delay={1}>
                <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-sm space-y-4 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27]">
                    <Feather size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">1. Hand-Spun Silk</h3>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    Sourced from organic sericulture clusters in Bhagalpur and Chanderi. Unbleached mulberry silk woven with natural irregularities that give each meter distinct character.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={2}>
                <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-sm space-y-4 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27]">
                    <Sparkles size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">2. Pure Silver Zari</h3>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    We exclusively employ authentic silver-gilt wire beaten and wound around silk core threads on Banaras wooden spindle wheels, creating a quiet, moonlight luster.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={3}>
                <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-sm space-y-4 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27]">
                    <Scissors size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">3. Architectural Draping</h3>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    Every ensemble is pinned and molded directly on customized wooden dressmaker forms, balancing gravity with precision pleating and internal structural canvas.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={4}>
                <div className="p-6 bg-[#1C1917] border border-[#292524] rounded-sm space-y-4 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27]">
                    <Clock size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">4. 400+ Artisan Hours</h3>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    Zardozi, Marodi, and pitta embroidery needle-worked in tandem by four karigars per frame. Finished with hand-turned silk piping and heirloom brass closures.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Chapter 3: Progressive Milestones Timeline */}
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Reveal>
              <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-2">
                Chapter III &middot; Atelier History
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141210]">
                Milestones &amp; Preservation
              </h2>
            </Reveal>
          </div>

          <div className="relative border-l-2 border-[#E7E2DA] ml-4 sm:ml-32 space-y-12">
            {TIMELINE.map((item, idx) => (
              <Reveal key={item.year} delay={idx * 1.5}>
                <div className="relative pl-8 sm:pl-10">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#FAF8F5] border-2 border-[#C59B27]" />
                  <span className="sm:absolute sm:-left-28 sm:top-1 font-serif text-lg font-bold text-[#C59B27] block sm:text-right sm:w-20">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#141210] mt-1 sm:mt-0">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E675F] leading-relaxed mt-1 font-sans font-light">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Chapter 4: Studio & Private Atelier Appointment CTA */}
        <section id="atelier" className="py-20 bg-white border-t border-[#E7E2DA]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Reveal>
              <span className="text-[10px] uppercase tracking-couture text-[#C59B27] font-semibold block mb-2">
                Flagship Atelier &middot; Siliguri
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141210]">
                Experience Bespoke Couture
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-[#6E675F] max-w-xl mx-auto leading-relaxed">
                We welcome brides, grooms, and collectors to our Siliguri atelier for private champagne fittings and tactile fabric consultations.
              </p>
            </Reveal>

            <Reveal delay={2}>
              <div className="mt-8 p-6 bg-[#FAF8F5] border border-[#E7E2DA] rounded-sm max-w-lg mx-auto text-xs space-y-2 text-[#3D3833]">
                <p className="font-semibold text-sm text-[#141210]">The Flagship Atelier:</p>
                <p>The Atelier, Sevoke Road, Near Vega Circle, Siliguri, West Bengal 734001</p>
                <p>Concierge Line: +91 98712 34567 | concierge@zariyaatelier.com</p>
                <p className="text-[11px] text-[#C59B27] pt-2">Consultations by advance appointment only.</p>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium transition-colors shadow-luxury-md"
                >
                  Explore The Collection <ArrowRight size={14} className="ml-2 inline" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default About;
