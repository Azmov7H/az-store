import { getProducts } from "./product-service";
import { getOrders } from "./order-service";
import { getCommits } from "./commit-service";
// import { getUsers } from "./user-service"; // If exists

export interface SiteStats {
    products: number;
    customers: number;
    brands: number;
    satisfaction: number;
}

export async function getSiteStats(): Promise<SiteStats> {
    const [productsData, orders, commits] = await Promise.all([
        getProducts({ limit: 1 }), // We just need the total count if available, or fetch all to count
        getOrders().catch(() => []),
        getCommits().catch(() => [])
    ]);

    // Determine counts
    const productCount = productsData.pagination?.total || productsData.shoes?.length || 0;

    // Estimate customers from unique emails in orders and commits
    const uniqueCustomers = new Set([
        ...orders.map(o => o.customerEmail),
        ...commits.map(c => c.email)
    ]);

    return {
        products: productCount,
        customers: uniqueCustomers.size > 100 ? uniqueCustomers.size : 100, // Fake "100+" if low
        brands: 12, // Still static as we don't have a Brands API yet
        satisfaction: 98 // Static for now
    };
}
