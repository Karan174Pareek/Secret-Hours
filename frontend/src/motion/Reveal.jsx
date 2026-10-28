import React from 'react';
import { m } from 'motion/react';
import { DURATION, EASE_COUTURE, STAGGER_STEP } from './tokens';

/**
 * Editorial scroll-reveal component for sections, text, and imagery.
 * Uses whileInView with viewport margin -10% and once: true.
 */
export const Reveal = ({
  children,
  delay = 0,
  y = 28,
  duration = DURATION.slow,
  className = '',
  as = 'div',
}) => {
  const Component = m[as] || m.div;

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        duration,
        ease: EASE_COUTURE,
        delay: delay * STAGGER_STEP,
      }}
      className={className}
    >
      {children}
    </Component>
  );
};

export default Reveal;
