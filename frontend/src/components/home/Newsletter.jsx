import React, { useState } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import Reveal from '../../motion/Reveal';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setMessage('You have been cordially invited to the ZARIYA private salon roster.');
      setEmail('');
    }, 600);
  };

  return (
    <section className="py-20 bg-[#F4F0EB] border-t border-[#E7E2DA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <span className="text-xs uppercase tracking-couture text-[#C59B27] font-semibold block mb-2">
            Private Atelier Register
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141210] font-normal tracking-tight">
            Exclusive Seasonal Previews
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#6E675F] max-w-lg mx-auto font-sans leading-relaxed">
            Receive private invitations to couture salon trunk shows, private lookbooks, and bespoke fitting schedules before public release.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3.5 bg-white border border-[#E7E2DA] text-xs text-[#141210] placeholder-[#A8A29E] focus:outline-none focus:border-[#C59B27] rounded-sm transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#141210] text-[#FAF8F5] hover:bg-[#C59B27] text-xs uppercase tracking-couture font-medium transition-colors rounded-sm flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <span>Subscribing...</span>
                ) : (
                  <>
                    <span>Request Invitation</span>
                    <ArrowRight size={14} className="ml-2" />
                  </>
                )}
              </button>
            </div>

            {status === 'success' && (
              <p className="mt-3 text-xs text-[#166534] flex items-center justify-center font-medium">
                <Check size={14} className="mr-1.5" /> {message}
              </p>
            )}

            {status === 'error' && (
              <p className="mt-3 text-xs text-[#991B1B] font-medium">
                {message}
              </p>
            )}

            <p className="mt-3 text-[10px] text-[#A8A29E]">
              We respect your confidentiality. Zero spam. Unsubscribe at any time.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Newsletter;
