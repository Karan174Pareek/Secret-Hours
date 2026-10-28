import React, { useRef } from 'react';
import { m, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { SPRING_TILT } from './tokens';

/**
 * TiltCard for product listings.
 * Hardware-accelerated CSS 3D tilt with ZERO React re-renders on pointer move.
 * Automatically disabled on touch screens and under reduced motion.
 */
export const TiltCard = ({
  children,
  className = '',
  maxTilt = 7, // degrees
  ...props
}) => {
  const cardRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Normalized pointer offset (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth with physics spring
  const smoothX = useSpring(mouseX, SPRING_TILT);
  const smoothY = useSpring(mouseY, SPRING_TILT);

  // Invert axes for natural 3D tilt: cursor at top tilts top backwards
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !cardRef.current) return;

    // Skip on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative [perspective:1000px] ${className}`}
      {...props}
    >
      <m.div
        style={
          shouldReduceMotion
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="w-full h-full"
      >
        {children}
      </m.div>
    </div>
  );
};

export default TiltCard;
