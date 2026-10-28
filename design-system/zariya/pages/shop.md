# Shop Page Overrides

> **PROJECT:** ZARIYA
> **Generated:** 2026-10-28 17:42:12
> **Page Type:** Product Detail

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 800px (narrow, focused)
- **Layout:** Single column, centered
- **Sections:** 1. Hero (Name/Role), 2. Project Grid (Masonry), 3. About/Philosophy, 4. Contact

### Spacing Overrides

- **Content Density:** Low — focus on clarity

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Neutral background (let work shine). Text: Black/White. Accent: Minimal.

### Component Overrides

- Avoid: Ignore bundle size growth
- Avoid: Tiny text on mobile
- Avoid: Random font sizes

---

## Page-Specific Components

- No unique components for this page

---

## Motion Specifications
- **Shared Element Transition (`layoutId`):** Clicking a product card animates its image seamlessly into the Product Detail main gallery image (using `domMax` on demand).
- **Zero-Render CSS 3D Tilt (`TiltCard.jsx`):** Product cards track pointer with `useMotionValue` + `useSpring` + `useTransform` (`rotateX`, `rotateY`). Zero state changes on move; disabled on touch and reduced motion.
- **Filter Drawer:** `<AnimatePresence>` slide-in from right (`x: "100%" -> "0%"`, 300ms soft spring) with backdrop fade (`opacity: 0 -> 1`, 200ms). Escape key closes.
- **Grid Re-order & Stagger:** Staggered card entrance (60ms) when filters change; no animating width/height.

