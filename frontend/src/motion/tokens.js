/**
 * Motion Tokens for ZARIYA Atelier
 * Defined in design-system/zariya/motion.md
 */

// Durations in seconds
export const DURATION = {
  fast: 0.15, // 150ms micro-feedback
  base: 0.3,  // 300ms standard UI transitions
  slow: 0.6,  // 600ms editorial reveals & chapters
};

// Luxury Couture Easing Curve: rapid initial ease with long silky deceleration
export const EASE_COUTURE = [0.22, 1, 0.36, 1];

// Soft Spring preset (low bounce, organic settle)
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8,
};

// Tilt Spring for zero-render 3D pointer parallax
export const SPRING_TILT = {
  stiffness: 300,
  damping: 30,
};

// Stagger step for child item reveals
export const STAGGER_STEP = 0.06;
