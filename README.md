# ZARIYA Atelier — 3D Luxury Indian Couture E-Commerce

A modern, editorial 3D fashion designer label e-commerce platform built with the MERN stack (React + Vite, Tailwind CSS, Motion `motion/react`, Three.js / React Three Fiber, Node.js + Express, MongoDB), featuring an Indian GST calculation engine, Razorpay prepaid payments, Cash on Delivery (COD) with OTP verification, and GST-compliant PDF tax invoices.

---

## 1. Quick Start & Setup

### Prerequisites
- Node.js >= 18.0.0
- MongoDB instance (local or MongoDB Atlas connection string)
- Python 3 (for running `ui-ux-pro-max` search tooling)

### Installation
1. Clone the repository and install dependencies:
```bash
# Frontend setup
cd frontend
npm install

# Backend setup
cd ../backend
npm install
```

2. Configure environment variables (see `.env.example` in `backend/` and `frontend/`).

3. Start development servers:
```bash
# Start backend API (port 5000)
cd backend
npm run dev

# Start frontend dev server (port 5173)
cd frontend
npm run dev
```

---

## 2. Motion AI Kit & Animation Setup

Animations in this project are governed by the **Motion AI Kit** (`motion` package imported via `motion/react`).

### Skills & Agent Integration
The project has the `/motion` skill and Motion MCP server installed:
- Location: `.agent/skills/motion/` and `.agents/skills/motion/`
- Documentation & Easing generation: Available via `/motion` skill prompts
- Motion MCP Server URL: `https://mcp.motion.dev` (Hosted MCP server, no API key required)

### How to Re-Run `npx motion-ai`
If moving environments or adding agents, reinstall or reconfigure the Motion AI kit anytime with:
```bash
npx -y motion-ai
```
Or programmatically run the installer to sync with `.agent`, `.agents`, or global user configs.

### Core Animation Architecture
- **Lazy Loading Bundle:** UI animations use `LazyMotion` with `domAnimation` and the `<m.*>` component to keep the initial JavaScript bundle minimal.
- **Shared Element Transitions:** Dynamic import of `domMax` feature bundle is loaded on demand for the `layoutId` transition between Shop product cards and the Product Detail gallery.
- **Accessibility:** `<MotionConfig reducedMotion="user">` wraps the entire application. When a user enables "reduce motion" in their OS, all parallax, 3D tilts, and entrance offsets collapse to immediate states with zero layout shifting.
- **3D Canvas Bridge:** Scroll and pointer motion values (`useScroll`, `useMotionValue`, `useSpring`) are instantiated outside the Three.js `<Canvas>` and sampled in the 60fps render loop via `motionValue.get()` inside `useFrame`. `setState` is never invoked inside the render loop.

---

## 3. 3D Model Asset Pipeline & Optimization

This project strictly adheres to the **Two-Canvas Rule**:
1. **Home Hero Scene:** Interactive procedural silk cloth drape mesh with custom wave shader.
2. **Product Detail Studio:** 360° interactive viewer with `OrbitControls`, studio environment, and fabric/color switching.
Product listing grids use zero WebGL canvases; they use hardware-accelerated CSS 3D tilt (`useMotionValue` + `useTransform`).

### Adding Real 3D GLB Models
Every product in the database supports a `model3d` URL pointing to a Draco/Meshopt-compressed `.glb` file. When omitted, the viewer automatically generates an editorial procedural 3D mannequin/drape form.

To optimize custom 3D fashion models for mobile performance:
```bash
# Install gltf-transform globally
npm install -g @gltf-transform/cli

# Optimize, compress textures to WebP/KTX2, and apply Draco mesh compression
gltf-transform optimize input_garment.glb output_garment.glb --draco.compress true --texture-compress webp
```

---

## 4. Indian GST Engine & Compliance

All monetary values are calculated **on the server in integer paise** ($1\text{ INR} = 100\text{ paise}$).
- **Apparel Slab Threshold:** Rs 2,500.00 ($250,000$ paise) per piece.
  - Taxable value $\le \text{Rs } 2,500 \rightarrow$ **5% GST**
  - Taxable value $> \text{Rs } 2,500 \rightarrow$ **18% GST**
- **Place of Supply:**
  - Same state (`SELLER_STATE_CODE == shippingAddress.stateCode`) $\rightarrow$ **CGST** (Rate/2) + **SGST** (Rate/2)
  - Different state $\rightarrow$ **IGST** (Full Rate)
- **Tax Invoices:** Automated Section 31-compliant PDF tax invoices with sequential FY numbering (`ZAR/2026-27/0001`), HSN codes, seller GSTIN, and buyer GSTIN (B2B support).

---

## 5. Razorpay Payments & COD Flow

### Razorpay Test Mode Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/) and generate Test API Keys (`rzp_test_...`).
2. Add keys to `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxx
   RAZORPAY_KEY_SECRET=your_test_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```
3. Expose local webhook listener using ngrok:
   ```bash
   ngrok http 5000
   ```
4. Set Webhook URL in Razorpay Dashboard to `https://<ngrok-id>.ngrok-free.app/api/webhooks/razorpay` with events:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
5. Signature verification utilizes timing-safe comparison (`crypto.timingSafeEqual`) on the raw request body.

### Cash on Delivery (COD) Rules
- COD is available only for whitelisted pincodes in the `Pincode` collection.
- Enforces maximum order total cap ($\le \text{Rs } 50,000$).
- Configurable COD surcharge fee (treated with GST).
- 6-digit phone OTP verification is required before confirming the COD order.
