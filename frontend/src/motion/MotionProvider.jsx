import React from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';

/**
 * Global Motion Configuration & Lazy Bundle Provider
 * - LazyMotion loads the lightweight domAnimation bundle
 * - MotionConfig reducedMotion="user" respects user's accessibility preferences
 */
export const MotionProvider = ({ children }) => {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
};

export default MotionProvider;
