// API client utilities for frontend data fetching

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ================== SHOE ==================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const BASE_SHOE = `${API_URL}/api/shoes`;

interface ShoesResponse<T> {
    shoes: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export async function getShoes<T = unknown>(): Promise<ShoesResponse<T>> {
    const res = await fetch(BASE_SHOE, { cache: "no-store" });
    const data: ApiResponse<ShoesResponse<T>> = await res.json();

    if (!res.ok) throw new Error("Failed to fetch shoes");
    return data.data || { shoes: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
}

export async function getShoeById<T = unknown>(id: string): Promise<T> {
    const res = await fetch(`${BASE_SHOE}/${id}`);
    const data: ApiResponse<T> = await res.json();
    if (!data.data) throw new Error("Shoe not found");
    return data.data;
}

export async function createShoe<T = unknown>(data: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(BASE_SHOE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create shoe");
    return res.json();
}

export async function updateShoe<T = unknown>(id: string, data: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_SHOE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update shoe");
    return res.json();
}

export async function deleteShoe<T = unknown>(id: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_SHOE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete shoe");
    return res.json();
}

// ================== ORDER ==================
const BASE_ORDER = `${process.env.NEXT_PUBLIC_API_URL}/api/orders`;

export async function getOrders<T = unknown>(): Promise<ApiResponse<T>> {
    const res = await fetch(BASE_ORDER, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
}

export async function getOrderById<T = unknown>(id: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_ORDER}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch order");
    return res.json();
}

export async function createOrder<T = unknown>(data: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(BASE_ORDER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create order");
    return res.json();
}

export async function updateOrder<T = unknown>(id: string, data: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_ORDER}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update order");
    return res.json();
}

export async function deleteOrder<T = unknown>(id: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_ORDER}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete order");
    return res.json();
}

// ================== COMMIT ==================
const BASE_COMMIT = `${process.env.NEXT_PUBLIC_API_URL}/api/commits`;

export async function getCommits<T = unknown>(): Promise<ApiResponse<T>> {
    const res = await fetch(BASE_COMMIT, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch commits");
    return res.json();
}

export async function getCommitById<T = unknown>(id: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_COMMIT}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch commit");
    return res.json();
}

export async function createCommit<T = unknown>(data: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(BASE_COMMIT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create commit");
    return res.json();
}

export async function updateCommit<T = unknown>(id: string, data: unknown): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_COMMIT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update commit");
    return res.json();
}

export async function deleteCommit<T = unknown>(id: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_COMMIT}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete commit");
    return res.json();
}
