// Central app constants — the single source of truth for enums, statuses,
// money rules and pagination defaults. Keep DRY: import from here instead of
// redeclaring string unions inline.

// ==================== MONEY & SHIPPING ====================

export const CURRENCY = "EGP" as const;

/** Flat shipping fee (EGP) applied under the free-shipping threshold. */
export const SHIPPING_FEE = 40;

/** Orders with this many (or more) line items ship free. */
export const FREE_SHIPPING_MIN_ITEMS = 3;

/**
 * Server-side shipping calculation. The cart sidebar, checkout steps and
 * order-service all derive from this so the UI never drifts from the DB.
 */
export function calculateShipping(itemCount: number): number {
    return itemCount >= FREE_SHIPPING_MIN_ITEMS ? 0 : SHIPPING_FEE;
}

// ==================== ORDER & CONTACT STATUSES ====================

export const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Status → tailwind classes, shared by dashboard orders views. */
export const ORDER_STATUS_COLORS: Record<
    OrderStatus,
    { label: string; badge: string; icon: string }
> = {
    pending: {
        label: "Pending",
        badge: "bg-yellow-400/10 text-yellow-500 border-yellow-400/20",
        icon: "bg-yellow-400",
    },
    confirmed: {
        label: "Confirmed",
        badge: "bg-blue-400/10 text-blue-500 border-blue-400/20",
        icon: "bg-blue-400",
    },
    processing: {
        label: "Processing",
        badge: "bg-purple-400/10 text-purple-500 border-purple-400/20",
        icon: "bg-purple-400",
    },
    shipped: {
        label: "Shipped",
        badge: "bg-orange-400/10 text-orange-500 border-orange-400/20",
        icon: "bg-orange-400",
    },
    delivered: {
        label: "Delivered",
        badge: "bg-green-400/10 text-green-500 border-green-400/20",
        icon: "bg-green-400",
    },
    cancelled: {
        label: "Cancelled",
        badge: "bg-red-400/10 text-red-500 border-red-400/20",
        icon: "bg-red-400",
    },
};

export const CONTACT_STATUSES = ["new", "read", "resolved"] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

// ==================== PRODUCT TAXONOMY ====================

export const SHOE_CATEGORIES = ["running", "casual", "formal", "sports", "sandals", "boots"] as const;

export type ShoeCategory = (typeof SHOE_CATEGORIES)[number];

export const SHOE_GENDERS = ["men", "women", "kids", "unisex"] as const;

export type ShoeGender = (typeof SHOE_GENDERS)[number];

export const SHOE_SIZES = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"] as const;

export type ShoeSize = (typeof SHOE_SIZES)[number];

export const SHOE_COLORS = [
    "black",
    "white",
    "red",
    "blue",
    "brown",
    "gray",
    "green",
    "navy",
] as const;

export type ShoeColor = (typeof SHOE_COLORS)[number];

// ==================== PAGINATION ====================

export const PAGINATION = {
    page: 1,
    limit: 10,
    maxLimit: 100,
} as const;
