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
  },

  // Contact statuses
  CONTACT_STATUS: {
    NEW: "new",
    READ: "read",
    RESOLVED: "resolved",
  },

  // Product categories
  CATEGORIES: ["running", "casual", "formal", "sports", "sandals", "boots"],

  // Shoe sizes
  SHOE_SIZES: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],

  // Colors
  COLORS: ["black", "white", "red", "blue", "brown", "gray", "green", "navy"],

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
}
