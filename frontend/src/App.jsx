import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import MotionProvider from './motion/MotionProvider';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ScrollToTop from './components/common/ScrollToTop';

// Production Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Policies from './pages/Policies';
import Admin from './pages/Admin';

function AppContent() {
  const location = useLocation();
  const { totalItemsCount, wishlist, openCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F5]">
      <ScrollToTop />
      <Navbar
        cartCount={totalItemsCount}
        wishlistCount={wishlist.length}
        onOpenCart={openCart}
      />

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/confirmation/:orderNumber" element={<OrderConfirmation />} />
            <Route path="/account/orders" element={<OrderConfirmation />} />
            <Route path="/about" element={<About />} />
            <Route path="/policies/:tab" element={<Policies />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}

export function App() {
  return (
    <MotionProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </MotionProvider>
  );
}

export default App;
