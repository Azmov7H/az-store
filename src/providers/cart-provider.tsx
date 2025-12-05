"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { CartItem } from "@/types/cart";

interface CartContextType {
    items: CartItem[];
    itemCount: number;
    totalPrice: number;
    addItem: (item: CartItem) => void;
    removeItem: (id: string, color: string, size: string) => void;
    updateQuantity: (id: string, quantity: number, color: string, size: string) => void;
    clearCart: () => void;
    clear: () => void;
    isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem("cart");
            if (saved) {
                const parsed = JSON.parse(saved);
                setItems(Array.isArray(parsed) ? parsed : []);
            }
        } catch (error) {
            console.error("Failed to load cart from localStorage:", error);
            localStorage.removeItem("cart");
        }
        setIsHydrated(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem("cart", JSON.stringify(items));
            } catch (error) {
                console.error("Failed to save cart to localStorage:", error);
            }
        }
    }, [items, isHydrated]);

    const addItem = (product: CartItem) => {
        const { id, selectedColor, selectedSize, quantity } = product;

        if (!selectedColor || !selectedSize) {
            console.warn("Cannot add product without color and size");
            return;
        }

        setItems((prev) => {
            const existing = prev.find(
                (item) =>
                    item.id === id &&
                    item.selectedColor === selectedColor &&
                    item.selectedSize === selectedSize
            );

            if (existing) {
                return prev.map((item) =>
                    item === existing
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prev, { ...product }];
        });
    };

    const removeItem = (id: string, selectedColor: string, selectedSize: string) => {
        setItems((prev) =>
            prev.filter(
                (item) =>
                    !(
                        item.id === id &&
                        item.selectedColor === selectedColor &&
                        item.selectedSize === selectedSize
                    )
            )
        );
    };

    const updateQuantity = (
        id: string,
        quantity: number,
        selectedColor: string,
        selectedSize: string
    ) => {
        if (quantity <= 0) {
            removeItem(id, selectedColor, selectedSize);
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.id === id &&
                    item.selectedColor === selectedColor &&
                    item.selectedSize === selectedSize
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clear = () => {
        setItems([]);
    };

    // Computed values
    const itemCount = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items]
    );

    const totalPrice = useMemo(
        () =>
            items.reduce((total, item) => {
                const finalPrice = item.price * (1 - (item.discount || 0) / 100);
                return total + finalPrice * item.quantity;
            }, 0),
        [items]
    );

    const value: CartContextType = {
        items,
        itemCount,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        clearCart: clear, // Alias for compatibility
        isHydrated,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
