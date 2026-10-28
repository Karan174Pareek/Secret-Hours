import { DURATION, EASE_COUTURE, SPRING_SOFT, STAGGER_STEP } from './tokens';

/**
 * Reusable animation variants using transform and opacity exclusively
 */

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.slow,
      ease: EASE_COUTURE,
      delay: custom * STAGGER_STEP,
    },
  }),
};

export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: {
      duration: DURATION.base,
      ease: EASE_COUTURE,
      delay: custom * STAGGER_STEP,
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: DURATION.fast,
      ease: 'easeOut',
    },
  },
};

export const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_STEP,
      delayChildren: 0.1,
    },
  },
};

export const drawerRightVariant = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: {
    x: '0%',
    opacity: 1,
    transition: SPRING_SOFT,
  },
  exit: {
    x: '100%',
    opacity: 0.8,
    transition: {
      duration: DURATION.base,
      ease: [0.32, 0, 0.67, 0], // Fast exit
    },
  },
};

export const modalScaleVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.base,
      ease: EASE_COUTURE,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: DURATION.fast,
      ease: 'easeIn',
    },
  },
};
