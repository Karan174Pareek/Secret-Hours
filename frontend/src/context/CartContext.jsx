import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('zariya_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('zariya_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('zariya_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('zariya_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to sync wishlist to localStorage', e);
    }
  }, [wishlist]);

  const addToCart = (product, selectedSize = 'M', selectedColor = 'Default') => {
    const prodId = String(product._id || product.id || '');
    const prodImage = product.image || (product.images && product.images[0]) || '';

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (String(item.id) === prodId || String(item._id) === prodId) && item.size === selectedSize && item.color === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += 1;
        return updated;
      }

      return [
        ...prev,
        {
          id: prodId,
          _id: prodId,
          product: prodId,
          slug: product.slug,
          title: product.title,
          image: prodImage,
          basePricePaise: product.basePricePaise,
          hsn: product.hsn,
          gstRate: product.gstRate,
          size: selectedSize,
          color: selectedColor,
          qty: 1,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].qty + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].qty = newQty;
      return updated;
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Calculations in paise (Server is always authority; client provides instant estimation)
  const subtotalPaise = cartItems.reduce(
    (acc, item) => acc + item.basePricePaise * item.qty,
    0
  );

  const estimatedGstPaise = cartItems.reduce(
    (acc, item) => acc + Math.round(item.basePricePaise * item.qty * item.gstRate),
    0
  );

  const grandTotalPaise = subtotalPaise + estimatedGstPaise;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQty,
        wishlist,
        toggleWishlist,
        subtotalPaise,
        estimatedGstPaise,
        grandTotalPaise,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
