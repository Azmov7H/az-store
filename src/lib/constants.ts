// Backend constants and configurations

export const CONSTANTS = {
    // Order statuses
    ORDER_STATUS: {
        PENDING: "pending",
        CONFIRMED: "confirmed",
        PROCESSING: "processing",
        SHIPPED: "shipped",
        DELIVERED: "delivered",
        CANCELLED: "cancelled",
    } as const,

    // Contact statuses
    CONTACT_STATUS: {
        NEW: "new",
        READ: "read",
        RESOLVED: "resolved",
    } as const,

    // Product categories
    CATEGORIES: ["running", "casual", "formal", "sports", "sandals", "boots"] as const,

    // Shoe sizes
    SHOE_SIZES: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"] as const,

    // Colors
    COLORS: ["black", "white", "red", "blue", "brown", "gray", "green", "navy"] as const,

    // Pagination defaults
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,

    // Business info
    BUSINESS: {
        name: "ShoeStore",
        email: "contact@shoestore.com",
        phone: "+20 1234567890",
        address: "Cairo, Egypt",
    },
} as const;

// Type exports for use in other files
export type OrderStatus = typeof CONSTANTS.ORDER_STATUS[keyof typeof CONSTANTS.ORDER_STATUS];
export type ContactStatus = typeof CONSTANTS.CONTACT_STATUS[keyof typeof CONSTANTS.CONTACT_STATUS];
export type Category = typeof CONSTANTS.CATEGORIES[number];
export type ShoeSize = typeof CONSTANTS.SHOE_SIZES[number];
export type Color = typeof CONSTANTS.COLORS[number];
