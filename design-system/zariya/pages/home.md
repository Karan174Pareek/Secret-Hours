# Home Page Overrides

> **PROJECT:** ZARIYA
> **Generated:** 2026-10-28 17:41:51
> **Page Type:** Landing / Marketing

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 800px (narrow, focused)
- **Layout:** Single column, centered
- **Sections:** 1. Dynamic hero (personalized), 2. Relevant features, 3. Tailored testimonials, 4. Smart CTA

### Spacing Overrides

- **Content Density:** Low — focus on clarity

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Adaptive based on user data. A/B test color variations per segment.

### Component Overrides

- Avoid: Expect z-index to work across contexts

---

## Page-Specific Components

- No unique components for this page

---

## Motion Specifications
- **Hero Canvas Bridge:** `useScroll` + `useSpring` feeds pointer parallax and scroll velocity to `HeroFabricCanvas` without React re-renders. Read via `motionValue.get()` in `useFrame`.
- **Text & Mask Reveals:** Staggered line reveal (`y: 30 -> 0`, `opacity: 0 -> 1`, ease `[0.22, 1, 0.36, 1]`) with 60ms stagger.
- **Magnetic CTA:** Hero "Explore Collection" button uses subtle magnetic hover attraction (max 8px offset) with auto-centering on pointer leave.
- **Section Reveals:** `whileInView` with `viewport={{ once: true, margin: "-10%" }}` for featured collections, craft atelier teaser, and testimonials.

