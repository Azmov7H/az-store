import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { AnalyticsSession } from "@/lib/db/schemas";
import { authUtils } from "@/lib/auth";

interface FunnelData {
    totalSessions: number;
    productViews: number;
    addToCarts: number;
    checkouts: number;
    purchases: number;
}

interface ConversionStep {
    step: string;
    count: number;
    rate: number | string;
}

export async function GET(req: Request): Promise<NextResponse> {
    if (!authUtils.isAdminRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();

        // Funnel steps: Page View -> Product View -> Add to Cart -> Checkout Start -> Checkout Success

        // Use last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const matchTime = { "events.timestamp": { $gte: thirtyDaysAgo } };

        // Aggregation to count unique sessions that performed each action
        const funnel = await AnalyticsSession.aggregate([
            { $match: matchTime },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    productViews: {
                        $sum: { $cond: [{ $in: ["product_view", "$events.type"] }, 1, 0] },
                    },
                    addToCarts: {
                        $sum: { $cond: [{ $in: ["add_to_cart", "$events.type"] }, 1, 0] },
                    },
                    checkouts: {
                        $sum: { $cond: [{ $in: ["checkout_start", "$events.type"] }, 1, 0] },
                    },
                    purchases: {
                        $sum: { $cond: [{ $in: ["checkout_success", "$events.type"] }, 1, 0] },
                    },
                },
            },
        ]);

        const data: FunnelData = funnel[0] || {
            totalSessions: 0,
            productViews: 0,
            addToCarts: 0,
            checkouts: 0,
            purchases: 0,
        };

        // Calculate rates
        const conversionStats: ConversionStep[] = [
            { step: "Visitors", count: data.totalSessions, rate: 100 },
            {
                step: "Product Views",
                count: data.productViews,
                rate: data.totalSessions
                    ? parseFloat(((data.productViews / data.totalSessions) * 100).toFixed(1))
                    : 0,
            },
            {
                step: "Add to Cart",
                count: data.addToCarts,
                rate: data.productViews
                    ? parseFloat(((data.addToCarts / data.productViews) * 100).toFixed(1))
                    : 0,
            },
            {
                step: "Checkout",
                count: data.checkouts,
                rate: data.addToCarts
                    ? parseFloat(((data.checkouts / data.addToCarts) * 100).toFixed(1))
                    : 0,
            },
            {
                step: "Purchase",
                count: data.purchases,
                rate: data.checkouts
                    ? parseFloat(((data.purchases / data.checkouts) * 100).toFixed(1))
                    : 0,
            },
        ];

        return NextResponse.json({
            success: true,
            data: conversionStats,
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Analytics Conversions Error:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
