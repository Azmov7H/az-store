import type { Order, CreateOrderData } from "@/types/order";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderData): Promise<Order> {
    const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to create order" }));
        throw new Error(error.error || "Failed to create order");
    }

    const data = await res.json();
    // API returns { success: true, data: { order details } }
    return data.data || data;
}

/**
 * Fetch all orders (admin only)
 */
export async function getOrders(): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/api/orders`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch orders");
    }

    const data = await res.json();
    // API returns { success: true, data: { orders: [...] } }
    return data.data?.orders || [];
}

/**
 * Fetch a single order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch order");
    }

    const data = await res.json();
    return data.data || null;
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
    id: string,
    status: Order["status"]
): Promise<Order> {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!res.ok) {
        throw new Error("Failed to update order");
    }

    const data = await res.json();
    return data.data;
}
