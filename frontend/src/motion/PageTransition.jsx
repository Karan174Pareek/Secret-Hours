import React from 'react';
import { m } from 'motion/react';
import { DURATION, EASE_COUTURE } from './tokens';

/**
 * PageTransition wrapper for router views.
 * Provides subtle rise and fade on enter, and snappy exit (<300ms).
 */
export const PageTransition = ({ children, className = '' }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: DURATION.base,
        ease: EASE_COUTURE,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
};

export default PageTransition;
