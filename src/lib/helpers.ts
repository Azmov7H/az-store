// Helper utility functions with TypeScript types

export function generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export function generateId(prefix: string = "ID"): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function formatPrice(price: number): string {
    return Number.parseFloat(price.toString()).toFixed(2);
}

export function calculateDiscount(price: number, discountPercent: number): string {
    return formatPrice((price * discountPercent) / 100);
}

export function calculateFinalPrice(price: number, discountPercent: number = 0): string {
    const discount = (price * discountPercent) / 100;
    return formatPrice(price - discount);
}

interface ProductWithPrice {
    price: number;
    discount?: number;
    quantity: number;
}

export function calculateOrderTotal(products: ProductWithPrice[]): string {
    let total = 0;
    products.forEach((product) => {
        const finalPrice = parseFloat(calculateFinalPrice(product.price, product.discount || 0));
        total += finalPrice * product.quantity;
    });
    return formatPrice(total);
}

export function formatDate(date: Date | string = new Date()): string {
    return new Date(date).toISOString().split("T")[0];
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

interface PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export function paginate<T>(array: T[], page: number = 1, limit: number = 10): PaginationResult<T> {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
        data: array.slice(start, end),
        total: array.length,
        page,
        limit,
        pages: Math.ceil(array.length / limit),
    };
}

export function search<T extends Record<string, unknown>>(
    items: T[],
    searchTerm: string,
    searchFields: (keyof T)[]
): T[] {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((item) =>
        searchFields.some((field) => String(item[field]).toLowerCase().includes(term))
    );
}

export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
