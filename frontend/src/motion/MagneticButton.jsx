import React, { useRef } from 'react';
import { m, useMotionValue, useSpring } from 'motion/react';
import { SPRING_TILT } from './tokens';

/**
 * Magnetic button for primary hero CTAs.
 * Translates subtly towards the cursor on hover with zero state re-renders.
 * Automatically centers on pointer leave.
 */
export const MagneticButton = ({
  children,
  className = '',
  strength = 0.25,
  onClick,
  ...props
}) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING_TILT);
  const springY = useSpring(y, SPRING_TILT);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`cursor-pointer transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </m.button>
  );
};

export default MagneticButton;
