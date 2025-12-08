import { connectDB } from "@/lib/db/connection";
import { AnalyticsSession, Order } from "@/lib/db/schemas";

export interface DeviceData {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface DailyTrafficData {
    date: string;
    count: number;
    [key: string]: string | number;
}

export interface TrafficData {
    devices: DeviceData[];
    browsers: DeviceData[];
    os: DeviceData[];
    dailyTraffic: DailyTrafficData[];
    totalSessions: number;
}

export async function getTrafficData(): Promise<TrafficData> {
    await connectDB();

    // Device breakdown
    const devices = await AnalyticsSession.aggregate([
        { $group: { _id: "$device", count: { $sum: 1 } } },
    ]);

    // Browser breakdown
    const browsers = await AnalyticsSession.aggregate([
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
    ]);

    // OS breakdown
    const os = await AnalyticsSession.aggregate([
        { $group: { _id: "$os", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
    ]);

    // Sessions over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyTraffic = await AnalyticsSession.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // Fill in missing days
    const filledDailyTraffic: DailyTrafficData[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const found = dailyTraffic.find(dt => dt._id === dateStr);
        filledDailyTraffic.push({
            date: dateStr,
            count: found ? found.count : 0
        });
    }
    filledDailyTraffic.reverse(); // Show oldest to newest

    const totalSessions = await AnalyticsSession.countDocuments();

    return {
        devices: devices.map((d) => ({ name: d._id || "unknown", value: d.count })),
        browsers: browsers.map((b) => ({ name: b._id || "unknown", value: b.count })),
        os: os.map((o) => ({ name: o._id || "unknown", value: o.count })),
        dailyTraffic: filledDailyTraffic,
        totalSessions
    };
}

export interface TopProduct {
    name: string;
    views: number;
    [key: string]: string | number;
}

export interface TopPage {
    url: string;
    views: number;
}

export interface SalesInsight {
    topColor: string;
    topSize: string;
    cartAdditions: number;
}

export interface Suggestion {
    type: "info" | "warning" | "success";
    message: string;
}

export interface AdvancedAnalyticsData {
    topProducts: TopProduct[];
    topPages: TopPage[];
    salesInsight: SalesInsight;
    suggestions: Suggestion[];
}

export async function getAdvancedAnalytics(): Promise<AdvancedAnalyticsData> {
    await connectDB();

    // Top Products
    const topProductsRaw = await AnalyticsSession.aggregate([
        { $unwind: "$events" },
        { $match: { "events.type": "product_view" } },
        { $group: { _id: "$events.metadata.productName", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 5 }
    ]);
    const topProducts = topProductsRaw.map(p => ({ name: p._id || "Unknown", views: p.views }));

    // Top Pages
    const topPagesRaw = await AnalyticsSession.aggregate([
        { $unwind: "$events" },
        { $match: { "events.type": "page_view" } },
        { $group: { _id: "$events.url", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 5 }
    ]);
    const topPages = topPagesRaw.map(p => {
        let url = p._id || "/";
        try { url = new URL(url).pathname; } catch { }
        return { url, views: p.views };
    });

    // Sales Insights (Colors/Sizes)
    const colorStats = await AnalyticsSession.aggregate([
        { $unwind: "$events" },
        { $match: { "events.type": "add_to_cart", "events.metadata.details.color": { $exists: true } } },
        { $group: { _id: "$events.metadata.details.color", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const sizeStats = await AnalyticsSession.aggregate([
        { $unwind: "$events" },
        { $match: { "events.type": "add_to_cart", "events.metadata.details.size": { $exists: true } } },
        { $group: { _id: "$events.metadata.details.size", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    const cartAdditions = await AnalyticsSession.aggregate([
        { $unwind: "$events" },
        { $match: { "events.type": "add_to_cart" } },
        { $count: "total" }
    ]);

    const salesInsight = {
        topColor: colorStats[0]?._id || "N/A",
        topSize: sizeStats[0]?._id || "N/A",
        cartAdditions: cartAdditions[0]?.total || 0
    };

    // Suggestions Logic
    const suggestions: Suggestion[] = [];
    if (salesInsight.topColor !== "N/A") {
        suggestions.push({ type: "success", message: `Color '${salesInsight.topColor}' is trending. Ensure sufficient stock.` });
    }
    if (topProducts.length > 0) {
        suggestions.push({ type: "info", message: `Promote '${topProducts[0].name}' on the home page to maximize conversions.` });
    }
    if (salesInsight.cartAdditions === 0) {
        suggestions.push({ type: "warning", message: "No items added to cart recently. Check product pricing or availability." });
    } else if (salesInsight.cartAdditions < 5) {
        suggestions.push({ type: "warning", message: "Cart addition rate is low. Consider offering a discount coupon." });
    }

    return { topProducts, topPages, salesInsight, suggestions };
}

export interface CustomerAnalytics {
    totalCustomers: number;
    newCustomersLastMonth: number;
    activeCustomers: number;
    churnRiskCount: number;
    vipCount: number;
    customerLifeTimeValue: number;
    retentionRate: number;
    customerGrowth: { date: string; count: number }[];
}

export async function getCustomerAnalytics(): Promise<CustomerAnalytics> {
    await connectDB();

    const customerStats = await Order.aggregate([
        {
            $group: {
                _id: "$customerEmail",
                firstOrder: { $min: "$createdAt" },
                lastOrder: { $max: "$createdAt" },
                totalSpend: { $sum: "$total" },
                orderCount: { $sum: 1 }
            }
        }
    ]);

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let newCustomers = 0;
    let activeCustomers = 0;
    let churnRisk = 0;
    let vips = 0;
    let totalLTV = 0;
    const totalCustomers = customerStats.length;

    const growthMap = new Map<string, number>();

    for (const c of customerStats) {
        if (new Date(c.firstOrder) > thirtyDaysAgo) newCustomers++;
        if (new Date(c.lastOrder) > thirtyDaysAgo) activeCustomers++;
        if (new Date(c.lastOrder) < sixtyDaysAgo) churnRisk++;
        if (c.totalSpend > 500) vips++;
        totalLTV += c.totalSpend;

        const monthKey = new Date(c.firstOrder).toISOString().slice(0, 7);
        growthMap.set(monthKey, (growthMap.get(monthKey) || 0) + 1);
    }

    const avgLTV = totalCustomers > 0 ? totalLTV / totalCustomers : 0;
    const returningCustomers = customerStats.filter(c => c.orderCount > 1).length;
    const retentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

    const growthData: { date: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthKey = d.toISOString().slice(0, 7);
        growthData.push({
            date: monthKey,
            count: growthMap.get(monthKey) || 0
        });
    }

    return {
        totalCustomers,
        newCustomersLastMonth: newCustomers,
        activeCustomers,
        churnRiskCount: churnRisk,
        vipCount: vips,
        customerLifeTimeValue: Math.round(avgLTV),
        retentionRate: Math.round(retentionRate),
        customerGrowth: growthData
    };
}

export interface RevenueData {
    date: string;
    revenue: number;
}

export interface LocationData {
    country: string;
    count: number;
}

export async function getRevenueAnalytics(): Promise<RevenueData[]> {
    await connectDB();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const revenueStats = await Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: "cancelled" } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalRevenue: { $sum: "$total" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const filledRevenue: RevenueData[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const found = revenueStats.find(r => r._id === dateStr);
        filledRevenue.push({
            date: dateStr,
            revenue: found ? found.totalRevenue : 0
        });
    }
    return filledRevenue.reverse();
}

export async function getLocationAnalytics(): Promise<LocationData[]> {
    await connectDB();

    const locationStats = await AnalyticsSession.aggregate([
        { $match: { "location.country": { $exists: true, $ne: null } } },
        { $group: { _id: "$location.country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    return locationStats.map(l => ({
        country: l._id || "Unknown",
        count: l.count
    }));
}
