"use client"

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // تحميل السلة من localStorage عند فتح الموقع
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // حفظ السلة تلقائياً
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    const existing = cart.find(
      (item) =>
        item.product._id === product._id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { product, selectedColor, selectedSize, quantity }]);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    setCart(
      cart.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
