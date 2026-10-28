# Product Page Overrides

> **PROJECT:** ZARIYA
> **Generated:** 2026-10-28 17:42:29
> **Page Type:** Product Detail

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1400px or full-width
- **Grid:** 12-column grid for data flexibility
- **Sections:** 1. Hero, 2. Product video/mockup (center), 3. Feature breakdown per section, 4. Comparison (optional), 5. CTA

### Spacing Overrides

- **Content Density:** High — optimize for information display

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Video surround: Brand color overlay. Features: Icon color #0080FF. Text: Dark #222

### Component Overrides

- Avoid: No hover feedback on clickable elements
- Avoid: Ignore bundle size growth
- Avoid: Inputs that look like plain text

---

## Page-Specific Components

- No unique components for this page

---

## Motion Specifications
- **Shared Element Target:** Main gallery image receives the `layoutId` transition incoming from the Shop page thumbnail.
- **3D Viewer Transitions:** Toggle between 2D gallery and 3D Studio wraps in `<AnimatePresence>` with crossfade (`opacity: 0 -> 1`, 250ms).
- **Material / Color Variant Switch:** Switching color/fabric in 3D viewer tweens material properties (`roughness`, `metalness`, color) smoothly over 250ms.
- **Size Guide Modal:** `<AnimatePresence>` centered pop/scale (`scale: 0.95 -> 1`, `opacity: 0 -> 1`, 200ms) with backdrop blur and focus trap. Escape key closes.
- **Accordion Micro-interactions:** Fabric, Care, and Shipping accordions animate expansion via opacity and transform height clipping (`transform: translateY(...)`), avoiding layout reflows.

