"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const addItem = (product) => {
    const { id, selectedColor, selectedSize, quantity } = product;
    if (!selectedColor || !selectedSize) return; // يمنع إضافة منتجات بدون لون/مقاس

    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      const updated = existing
        ? prev.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { ...product }];

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id, selectedColor, selectedSize) => {
    setItems((prev) => {
      const updated = prev.filter(
        (item) =>
          !(item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id, quantity, selectedColor, selectedSize) => {
    setItems((prev) => {
      const updated =
        quantity <= 0
          ? prev.filter(
              (item) =>
                !(item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
            )
          : prev.map((item) =>
              item.id === id &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
                ? { ...item, quantity }
                : item
            );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clear = () => {
    setItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}
