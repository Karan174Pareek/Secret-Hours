import { useScroll, useSpring, useMotionValue } from 'motion/react';
import { SPRING_SOFT, SPRING_TILT } from './tokens';

/**
 * Custom hook to bridge Motion smoothed scroll & pointer values into R3F WebGL canvas
 * Values can be sampled with .get() inside useFrame with ZERO React state updates.
 */
export const useMotion3DBridge = () => {
  // Global page scroll progress
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, SPRING_SOFT);

  // Normalized pointer offset for scene parallax (-1 to 1)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothPointerX = useSpring(pointerX, SPRING_TILT);
  const smoothPointerY = useSpring(pointerY, SPRING_TILT);

  const handlePointerMove = (e) => {
    // Window center normalization
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    pointerX.set(x);
    pointerY.set(y);
  };

  return {
    smoothScroll,
    smoothPointerX,
    smoothPointerY,
    handlePointerMove,
  };
};

export default useMotion3DBridge;
