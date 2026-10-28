import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Award, Feather, Scissors, Clock, MapPin, Compass, Shield } from 'lucide-react';
import { m, useScroll, useTransform } from 'motion/react';
import Reveal from '../motion/Reveal';
import PageTransition from '../motion/PageTransition';

export const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const portraitY = useTransform(scrollYProgress, [0, 0.4], [0, -50]);

  return (
    <PageTransition>
      <div ref={containerRef} className="bg-[#F7F4EF] min-h-screen py-16">
        {/* Chapter 1: The Brand Story & Introduction */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual with Motion Parallax */}
            <div className="lg:col-span-5 relative">
              <m.div
                style={{ y: portraitY }}
                className="relative aspect-[3/4] max-w-md mx-auto rounded-sm overflow-hidden bg-[#1D1B1A] border border-[#E9DFD2] shadow-luxury-lg"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                  alt="Secret Hours Editorial"
                  className="w-full h-full object-cover object-top opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B1A]/85 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-[#F7F4EF] font-sans">
                  <p className="font-serif text-2xl font-bold tracking-wide">SECRET HOURS</p>
                  <p className="text-[10px] uppercase tracking-couture text-[#E9DFD2] mt-0.5">
                    A Contemporary Womenswear Label
                  </p>
                </div>
              </m.div>
            </div>

            {/* Philosophy Content */}
            <div className="lg:col-span-7 space-y-6">
              <Reveal>
                <span className="text-[10px] uppercase tracking-couture text-[#78645D] font-semibold block mb-1 font-sans">
                  01 / The Brand Story
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl text-[#1D1B1A] leading-tight font-normal">
                  We have a secret to tell. <br />
                  <span className="italic font-light text-[#78645D]">Can you keep a secret?</span>
                </h1>
              </Reveal>

              <Reveal delay={2}>
                <p className="text-sm text-[#1D1B1A] font-sans leading-relaxed">
                  Some things are better left unsaid. Some stories are too personal to explain, and some sides of us can only be expressed without saying a word. Welcome to <strong>Secret Hours</strong> — where fashion becomes a language of its own.
                </p>
                <p className="text-sm text-[#78645D] font-sans leading-relaxed mt-4">
                  Born from the belief that what we wear is an extension of who we are, Secret Hours is a contemporary clothing label built around individuality, self-expression, and the freedom to be unapologetically yourself.
                </p>
                <p className="text-sm text-[#78645D] font-sans leading-relaxed mt-4">
                  We believe every woman has different versions of herself — the bold one, the quiet one, the ambitious one, the rebellious one, the one who follows the rules, and the one who secretly wants to break them. None of these versions cancels out the others. They are all part of her story. And we believe fashion should make room for every single one.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="pt-4 grid grid-cols-3 gap-6 border-t border-[#E9DFD2] font-sans">
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#1D1B1A]">Affordable</span>
                    <span className="text-[10px] uppercase tracking-editorial text-[#78645D] block mt-0.5">Luxury Prêt</span>
                  </div>
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#1D1B1A]">Every</span>
                    <span className="text-[10px] uppercase tracking-editorial text-[#78645D] block mt-0.5">Version of You</span>
                  </div>
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#1D1B1A]">Col. 01</span>
                    <span className="text-[10px] uppercase tracking-editorial text-[#78645D] block mt-0.5">Unbecoming</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Chapter 2: What the Name Means */}
        <section className="py-24 bg-white border-y border-[#E9DFD2]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 font-sans">
              <Reveal>
                <span className="text-[10px] uppercase tracking-couture text-[#78645D] font-semibold block mb-2">
                  02 / What The Name Means
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-[#1D1B1A] font-normal">
                  Secret Hours
                </h2>
                <p className="text-xs uppercase tracking-couture text-[#78645D] mt-2 font-medium">
                  Two Contrasting Ideas United
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Reveal delay={1}>
                <div className="p-8 bg-[#F7F4EF] border border-[#E9DFD2] rounded-sm h-full flex flex-col justify-between font-sans">
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#1D1B1A] block mb-3">SECRET</span>
                    <p className="text-sm text-[#1D1B1A] leading-relaxed">
                      The private side of a woman — her individuality, her hidden desires, her unapologetic thoughts, and the parts of herself the world doesn&rsquo;t always get to see.
                    </p>
                  </div>
                  <p className="text-xs text-[#78645D] italic mt-6 pt-4 border-t border-[#E9DFD2]">
                    &ldquo;It is not about hiding yourself. It is about discovering yourself without needing to explain everything to everyone.&rdquo;
                  </p>
                </div>
              </Reveal>

              <Reveal delay={2}>
                <div className="p-8 bg-[#F7F4EF] border border-[#E9DFD2] rounded-sm h-full flex flex-col justify-between font-sans">
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#1D1B1A] block mb-3">HOURS</span>
                    <p className="text-sm text-[#1D1B1A] leading-relaxed">
                      The different phases of life, the moments of transformation, and the evolving versions of ourselves that we grow into over time.
                    </p>
                  </div>
                  <p className="text-xs text-[#78645D] italic mt-6 pt-4 border-t border-[#E9DFD2]">
                    &ldquo;Together, Secret Hours represents the space between who society expects a woman to be and who she truly wants to be.&rdquo;
                  </p>
                </div>
              </Reveal>
            </div>

            {/* The One-Line Meaning */}
            <div className="mt-14 p-8 bg-[#1D1B1A] text-[#F7F4EF] text-center rounded-sm">
              <span className="text-[10px] uppercase tracking-couture text-[#E9DFD2] font-semibold block mb-2 font-sans">
                The Meaning In One Line
              </span>
              <p className="font-serif text-xl sm:text-2xl italic leading-relaxed text-[#F7F4EF]">
                &ldquo;A space for every version of you — including the ones the world hasn&rsquo;t met yet.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 3: The Founders' Story */}
        <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Reveal>
              <span className="text-[10px] uppercase tracking-couture text-[#78645D] font-semibold block mb-2">
                08 / The Founders&rsquo; Story
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1D1B1A] font-normal">
                More Than a Label
              </h2>
            </Reveal>
          </div>

          <div className="bg-white border border-[#E9DFD2] p-8 sm:p-12 rounded-sm shadow-luxury-sm">
            <Reveal delay={1}>
              <p className="text-base text-[#1D1B1A] leading-relaxed font-serif italic mb-6">
                &ldquo;Secret Hours was founded by two fashion design graduates who share a belief that fashion should evolve with women rather than dictate how they should dress.&rdquo;
              </p>
              <div className="space-y-4 text-sm text-[#78645D] leading-relaxed font-sans font-light">
                <p>
                  The story isn&rsquo;t simply about two friends starting a business. It is about creating the kind of fashion space they want women to have: one where elegance can coexist with rebellion, confidence with vulnerability, and growing older with becoming bolder.
                </p>
                <p>
                  The brand celebrates the idea that a woman doesn&rsquo;t have to choose one version of herself to be understood. She can be sophisticated and playful. Traditional and experimental. Quiet and outspoken. Timeless and completely current.
                </p>
                <p className="font-medium text-[#1D1B1A] pt-4">
                  Secret Hours exists for every version of her.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Chapter 4: Collection 01 - UNBECOMING */}
        <section id="unbecoming" className="py-24 bg-[#1D1B1A] text-[#F7F4EF] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Reveal>
                <span className="text-[10px] uppercase tracking-couture text-[#E9DFD2] font-semibold block mb-2 font-sans">
                  Collection 01 Concept
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal">
                  UNBECOMING
                </h2>
                <p className="font-serif italic text-lg text-[#E9DFD2] mt-2">
                  &ldquo;The freedom of being, without the pressure of becoming.&rdquo;
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 font-sans">
              <Reveal delay={1}>
                <div className="p-6 bg-[#252221] border border-[#78645D]/30 rounded-sm space-y-3 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/40 flex items-center justify-center text-[#E9DFD2]">
                    <Feather size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">Reclaiming Meaning</h3>
                  <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-light">
                    The word <em>unbecoming</em> traditionally means inappropriate or unsuitable. This collection reclaims that meaning with pride.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={2}>
                <div className="p-6 bg-[#252221] border border-[#78645D]/30 rounded-sm space-y-3 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/40 flex items-center justify-center text-[#E9DFD2]">
                    <Scissors size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">Softness &amp; Structure</h3>
                  <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-light">
                    Through powerful silhouettes, flowing forms, rebellious detailing, corsetry, and contrasting textures, we explore tension between conformity and freedom.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={3}>
                <div className="p-6 bg-[#252221] border border-[#78645D]/30 rounded-sm space-y-3 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/40 flex items-center justify-center text-[#E9DFD2]">
                    <Shield size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">Unlearning Expectations</h3>
                  <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-light">
                    It challenges the idea that femininity must always be delicate, elegance must always be restrained, or a woman must become predictable as she grows older.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={4}>
                <div className="p-6 bg-[#252221] border border-[#78645D]/30 rounded-sm space-y-3 h-full">
                  <div className="w-10 h-10 rounded-full border border-[#E9DFD2]/40 flex items-center justify-center text-[#E9DFD2]">
                    <Compass size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">The Truth In You</h3>
                  <p className="text-xs text-[#E9DFD2]/70 leading-relaxed font-light">
                    &ldquo;It is not about becoming someone new. It is about un-becoming everything that was never truly you.&rdquo;
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Chapter 5: Secret Society & Siliguri Atelier Concierge */}
        <section id="society" className="py-20 bg-white border-t border-[#E9DFD2]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center font-sans">
            <Reveal>
              <span className="text-[10px] uppercase tracking-couture text-[#78645D] font-semibold block mb-2">
                The Secret Society &middot; Siliguri Atelier
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1D1B1A]">
                Between Us, You Look Good.
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-[#78645D] max-w-xl mx-auto leading-relaxed">
                Connect with our concierge for private previews, fitting appointments, and custom styling advice.
              </p>
            </Reveal>

            <Reveal delay={2}>
              <div className="mt-8 p-6 bg-[#F7F4EF] border border-[#E9DFD2] rounded-sm max-w-lg mx-auto text-xs space-y-2 text-[#78645D]">
                <p className="font-semibold text-sm text-[#1D1B1A]">The Siliguri Atelier:</p>
                <p>The Atelier, Sevoke Road, Near Vega Circle, Siliguri, West Bengal 734001</p>
                <p>Concierge Line: +91 98712 34567 | concierge@secrethours.com</p>
                <p className="text-[11px] text-[#78645D] pt-2 italic">&ldquo;We trust you with our secret.&rdquo;</p>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-[#1D1B1A] text-[#F7F4EF] hover:bg-[#78645D] text-xs uppercase tracking-couture font-medium transition-colors shadow-luxury-md"
                >
                  Explore Unbecoming Collection <ArrowRight size={14} className="ml-2 inline" />
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
