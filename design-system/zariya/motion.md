# Motion System Specification — ZARIYA Atelier

> **Authority:** This document defines the animation and micro-interaction standard for ZARIYA Atelier. Linked from `MASTER.md`. Followed alongside `pages/*.md`.
> **Framework:** Motion (`motion/react`) with `LazyMotion` + `domAnimation` and `m` components. Global wrapper `<MotionConfig reducedMotion="user">`.

---

## 1. Motion Tokens

### Durations
- `--motion-duration-fast`: `150ms` (`0.15s`) — Micro-feedback (icon states, tooltips, button hover, subtle color shifts)
- `--motion-duration-base`: `300ms` (`0.30s`) — Standard UI transitions (drawers, modals, dropdowns, accordion expand, page exit)
- `--motion-duration-slow`: `600ms` (`0.60s`) — Editorial moments, hero text reveals, image mask reveals, storytelling chapters

### Luxury Easing Curve
- **The Couture Ease:** `[0.22, 1, 0.36, 1]` (custom cubic bezier: rapid initial movement with an extended, silky deceleration tail).
- **CSS equivalent:** `cubic-bezier(0.22, 1, 0.36, 1)`

### Spring Preset (Soft & Low-Bounce)
- **Soft Spring:** `{ stiffness: 260, damping: 28, mass: 0.8 }` (tactile, organic, zero disruptive oscillation).
- **Tilt Spring (Zero-Render Parallax):** `{ stiffness: 300, damping: 30 }` for product card tilt.

### Stagger Step
- `--motion-stagger-step`: `0.06s` (60ms) between child elements in grids, headlines, and collection cards.

---

## 2. Core Rules & Constraints

1. **Transform and Opacity Only:**
   - ONLY animate `transform` (`x`, `y`, `scale`, `rotateX`, `rotateY`) and `opacity`.
   - **NEVER** animate `width`, `height`, `top`, `left`, `margin`, or `padding` on lists, cards, or images to prevent browser reflow and layout thrashing (CLS).
2. **Entrances:**
   - Use `whileInView` with `viewport={{ once: true, margin: "-10%" }}`.
   - Initial state: subtle offset (`y: 20` or `y: 30`) and `opacity: 0`.
   - Never pop elements in violently; always ease out smoothly.
3. **Page Transitions:**
   - `AnimatePresence` with `mode="wait"` at router level.
   - Page exit: clean fade + slight rise (`opacity: 0, y: -8`), capped at 250–300ms so navigation feels immediate and never blocks the user.
4. **Shared Element Transitions:**
   - `layoutId` transition (using `domMax` feature bundle) between the Shop catalog product card thumbnail and the Product Detail primary image.
5. **Drawers & Modals (Cart, Size Guide, Filter, Toasts):**
   - Wrapped in `<AnimatePresence>`.
   - Backdrop: fade in (`opacity: 0` to `opacity: 1`, 200ms).
   - Drawer panel: spring slide from right (`x: "100%"` to `x: "0%"`), exit quickly (`x: "100%"`, 250ms).
   - Trap focus inside open modals; keep Escape key handler and backdrop click always active.
6. **Zero-Render CSS 3D Tilt on Product Cards:**
   - Powered by `useMotionValue` + `useSpring` + `useTransform`.
   - Calculate normalized mouse offset `(x, y)` in `[-0.5, 0.5]`, pipe to spring, transform to `rotateX` (`-8deg` to `8deg`) and `rotateY` (`-8deg` to `8deg`).
   - Driven entirely on the compositor thread with **zero React re-renders** on mousemove.
   - Disabled on touch screens (media query `(hover: hover)`) and under reduced motion.
7. **Scroll-Driven Storytelling (About Page):**
   - `useScroll` + `useTransform` for parallax portrait depth, progressive timeline drawing (`pathLength`), and sticky chapter highlights.
8. **Calm Checkout Discipline:**
   - No decorative animations on inputs, errors, or payment buttons.
   - Step indicator: smooth line transition (`layoutId` or width tween).
   - Order totals: subtle numeric counter tween on price updates.
   - Success state: gentle green checkmark pulse on verified OTP and paid order.
9. **Magnetic CTAs & Image Masks:**
   - Reserved strictly for primary hero elements and couture editorial spotlights.

---

## 3. Motion Bridge to 3D Canvases

1. **Zero-State Bridge:**
   - Scroll and pointer motion values (`useScroll`, `useMotionValue`, `useSpring`) are instantiated **outside** the WebGL `<Canvas>`.
   - Inside R3F components, read values via `motionValue.get()` within `useFrame((state, delta) => { ... })`.
   - **NEVER** call `setState` inside `useFrame` or on mouse/scroll events.
2. **Canvas Lifecycle & Power Budget:**
   - Canvases pause rendering or unmount when off-screen via `useInView` / `IntersectionObserver`.
   - Fall back to static high-res editorial poster under `prefers-reduced-motion: reduce`, low power mode, or when WebGL is unsupported.
