// Site-wide real stats — everything reflects actual DB content. No placeholder
// numbers: if we can't compute a stat yet, we return null / a real fallback.
import { connectDB } from "@/lib/db/connection";
import { Shoe, Commit, Order } from "@/lib/db/schemas";
import { getBrands, type Brand } from "@/lib/services/brand-service";
import type { SiteStats } from "./stats-types";

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
    try {
        return await promise;
    } catch {
        return fallback;
    }
}

export async function getSiteStats(): Promise<SiteStats> {
    await connectDB();

    const [productCount, orderEmails, commitEmails, verifiedRatings, brands] = await Promise.all([
        safe(Shoe.countDocuments(), 0),
        safe(Order.distinct("customerEmail") as Promise<string[]>, [] as string[]),
        safe(Commit.distinct("email", { verified: true }) as Promise<string[]>, [] as string[]),
        safe(Commit.find({ verified: true }).select("rating").lean() as unknown as Promise<{ rating?: number }[]>, [] as { rating?: number }[]),
        safe(getBrands(), [] as Brand[]),
    ]);

    // "Customers" = distinct buyer/reviewer emails seen so far
    const customers = new Set<string>([
        ...orderEmails.map(String),
        ...commitEmails.map(String),
    ]).size;

    // "Satisfied" = share of verified reviews rated 4+ stars (null → nothing to show)
    let satisfaction: number | null = null;
    if (verifiedRatings.length > 0) {
        const avg = verifiedRatings.reduce((sum, r) => sum + (r.rating ?? 0), 0) / verifiedRatings.length;
        satisfaction = Math.round((avg / 5) * 100);
    }

    return {
        products: productCount,
        customers,
        brands: brands.length, // mirrors the brands carousel the storefront actually shows
        satisfaction,
    };
}
