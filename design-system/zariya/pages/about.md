# About Page Overrides

> **PROJECT:** ZARIYA
> **Generated:** 2026-10-28 17:42:58
> **Page Type:** Blog / Article

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Full-width sections, centered content
- **Sections:** 1. Intro hook, 2. Chapter 1 (problem), 3. Chapter 2 (journey), 4. Chapter 3 (solution), 5. Climax CTA

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Progressive reveal. Each chapter has distinct color. Building intensity.

### Component Overrides

- Avoid: Jump directly without transition
- Avoid: Content wider than viewport
- Avoid: Load 50MB textures

---

## Page-Specific Components

- No unique components for this page

---

## Motion Specifications
- **Scroll-Storytelling Showpiece:** Built with `useScroll` and `useTransform` for multi-chapter narrative progression without scroll-jacking.
- **Parallax Designer Portrait:** Slow multi-layer parallax offset (`y: -50px` to `50px`) on portrait backdrop and foreground signature.
- **Interactive Handloom Timeline:** Progressive SVG thread/path draw (`pathLength` linked to scroll offset `[0, 1]`) through the heritage milestones.
- **Sticky Craft Atelier Steps:** Pinning card step transitions with soft crossfade as user scrolls through fabric sourcing, zari embroidery, and hand finishing.

