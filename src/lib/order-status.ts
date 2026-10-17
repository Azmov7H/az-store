import type { Order } from "@/types/order";

export type OrderStatus = Order["status"];

export const ORDER_STATUSES: readonly OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
];

/** Tailwind classes used to badge order statuses consistently across dashboard views */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    confirmed: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    processing: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    shipped: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    delivered: "text-green-500 bg-green-500/10 border-green-500/20",
    cancelled: "text-red-500 bg-red-500/10 border-red-500/20",
};
