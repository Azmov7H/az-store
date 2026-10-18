"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { CartItem } from "@/types/cart";
import { cartStorageSchema } from "@/lib/schemas/cart";

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

// ---------------------------------------------------------------------------
// External cart store (module scoped) — keeps localStorage rehydration out of
// setState-in-effect and works with useSyncExternalStore.
// ---------------------------------------------------------------------------
const CART_KEY = "cart";
const EMPTY: CartItem[] = [];

let snapshot: CartItem[] = EMPTY;
let hydrated = false;

const cartListeners = new Set<() => void>();
const hydrationListeners = new Set<() => void>();

function getSnapshot(): CartItem[] {
    return snapshot;
}
function getServerSnapshot(): CartItem[] {
    return EMPTY;
}
function getHydrationSnapshot(): boolean {
    return hydrated;
}
function getServerHydrationSnapshot(): boolean {
    return false;
}

function subscribeCart(listener: () => void): () => void {
    hydrateFromStorage();
    cartListeners.add(listener);
    return () => {
        cartListeners.delete(listener);
    };
}

function subscribeHydration(listener: () => void): () => void {
    hydrateFromStorage();
    hydrationListeners.add(listener);
    return () => {
        hydrationListeners.delete(listener);
    };
}

function hydrateFromStorage(): void {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;

    let restored: CartItem[] | null = null;
    try {
        const saved = window.localStorage.getItem(CART_KEY);
        if (saved) {
            const parsed = cartStorageSchema.safeParse(JSON.parse(saved));
            if (parsed.success) restored = parsed.data;
        }
    } catch {
        try {
            window.localStorage.removeItem(CART_KEY);
        } catch {
            // storage unavailable — ignore
        }
    }

    if (restored && restored.length > 0) {
        snapshot = restored;
        emit(cartListeners);
    }
    emit(hydrationListeners);
}

function emit(listeners: Set<() => void>): void {
    for (const listener of listeners) listener();
}

// Persist happens inside the mutators (user-event paths), not in effects.
function commit(next: CartItem[]): void {
    snapshot = next.length > 0 ? next : EMPTY;
    if (typeof window !== "undefined") {
        try {
            window.localStorage.setItem(CART_KEY, JSON.stringify(snapshot));
        } catch (error) {
            console.error("Failed to save cart to localStorage:", error);
        }
    }
    emit(cartListeners);
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const items = useSyncExternalStore(subscribeCart, getSnapshot, getServerSnapshot);
    const isHydrated = useSyncExternalStore(
        subscribeHydration,
        getHydrationSnapshot,
        getServerHydrationSnapshot
    );

    const addItem = (product: CartItem) => {
        const { id, selectedColor, selectedSize, quantity } = product;

        if (!selectedColor || !selectedSize) {
            console.warn("Cannot add product without color and size");
            return;
        }

        // Rehydrate on demand (belt & braces for events fired before hydration)
        hydrateFromStorage();

        const existing = snapshot.find(
            (item) =>
                item.id === id &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
        );

        if (existing) {
            const desired = existing.quantity + quantity;
            const capped = existing.stock > 0 ? Math.min(desired, existing.stock) : desired;
            commit(
                snapshot.map((item) =>
                    item === existing ? { ...item, quantity: capped } : item
                )
            );
            return;
        }

        const initial = product.stock > 0 ? Math.min(quantity, product.stock) : quantity;
        commit([...snapshot, { ...product, quantity: initial }]);
    };

    const removeItem = (id: string, selectedColor: string, selectedSize: string) => {
        hydrateFromStorage();
        commit(
            snapshot.filter(
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

        hydrateFromStorage();
        commit(
            snapshot.map((item) => {
                const isTarget =
                    item.id === id &&
                    item.selectedColor === selectedColor &&
                    item.selectedSize === selectedSize;
                if (!isTarget) return item;
                const capped = item.stock > 0 ? Math.min(quantity, item.stock) : quantity;
                return { ...item, quantity: capped };
            })
        );
    };

    const clear = () => {
        hydrateFromStorage();
        commit([]);
    };

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = items.reduce((total, item) => {
        const finalPrice = item.price * (1 - (item.discount || 0) / 100);
        return total + finalPrice * item.quantity;
    }, 0);

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
