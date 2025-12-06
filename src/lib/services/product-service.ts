import type { Product, ProductsResponse } from "@/types/product";
import { unstable_cache } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Fetch all products with optional filters
 * Server-side only with caching
 */
export const getProducts = unstable_cache(
    async (params?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<ProductsResponse> => {
        const searchParams = new URLSearchParams();

        if (params?.category) searchParams.set("category", params.category);
        if (params?.search) searchParams.set("search", params.search);
        if (params?.page) searchParams.set("page", params.page.toString());
        if (params?.limit) searchParams.set("limit", params.limit.toString());

        const url = `${BASE_URL}/api/shoes${searchParams.toString() ? `?${searchParams}` : ""}`;

        const res = await fetch(url, {
            next: { revalidate: 60, tags: ["products"] },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.statusText}`);
        }

        const data = await res.json();
        return data.data || { shoes: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
    },
    ["products"],
    { revalidate: 60, tags: ["products"] }
);

/**
 * Fetch a single product by ID
 * Server-side only with caching
 */
export const getProductById = unstable_cache(
    async (id: string): Promise<Product | null> => {
        const res = await fetch(`${BASE_URL}/api/shoes/${id}`, {
            next: { revalidate: 60, tags: [`product-${id}`] },
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Failed to fetch product: ${res.statusText}`);
        }

        const data = await res.json();
        return data.data || null;
    },
    ["product"],
    { revalidate: 60 }
);

/**
 * Fetch featured/new products
 * Server-side only with caching
 */
export const getFeaturedProducts = unstable_cache(
    async (limit: number = 6): Promise<Product[]> => {
        const res = await fetch(`${BASE_URL}/api/shoes?limit=${limit}`, {
            next: { revalidate: 300, tags: ["featured-products"] },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch featured products: ${res.statusText}`);
        }

        const data = await res.json();
        return data.data?.shoes || [];
    },
    ["featured-products"],
    { revalidate: 300, tags: ["featured-products"] }
);

/**
 * Client-side product fetching (for dynamic updates)
 */
export async function fetchProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const url = `/api/shoes${searchParams.toString() ? `?${searchParams}` : ""}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data || { shoes: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } };
}
