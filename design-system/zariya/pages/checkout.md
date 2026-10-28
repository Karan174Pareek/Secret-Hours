# Checkout Page Overrides

> **PROJECT:** ZARIYA
> **Generated:** 2026-10-28 17:42:46
> **Page Type:** Checkout / Payment

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 800px (narrow, focused)
- **Layout:** Single column, centered
- **Sections:** 1. Hero headline, 2. Short description, 3. Benefit bullets (3 max), 4. CTA, 5. Footer

### Spacing Overrides

- **Content Density:** Low — focus on clarity

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Minimalist: Brand + white #FFFFFF + accent. Buttons: High contrast 7:1+. Text: Black/Dark grey

### Component Overrides

- No overrides — use Master component specs

---

## Page-Specific Components

- No unique components for this page

---

## Motion Specifications
- **Calm Checkout Policy:** Zero decorative motion on inputs, error banners, or the primary pay button. Complete focus on clarity and speed.
- **Step Transitions:** Switching between Address -> Shipping -> Payment -> Review slides horizontally (`x: 10 -> 0`, `opacity: 0 -> 1`, 200ms) with `AnimatePresence`.
- **Dynamic Price & GST Number Tweens:** When shipping method, pincode, or prepaid discount changes, order total and GST numbers tween smoothly over 200ms.
- **COD OTP Modal:** Centered scale entrance (`scale: 0.95 -> 1`, 200ms) with auto-focus on first OTP input box.
- **Order Confirmation Success:** Subtle emerald checkmark draw (`pathLength: 0 -> 1`, 400ms) and fade-in of order number and invoice download CTA.

