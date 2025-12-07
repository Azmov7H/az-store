import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { AnalyticsSession, Order } from "@/lib/db/schemas";
import { authUtils } from "@/lib/auth";

interface OverviewData {
    sessionsToday: number;
    sessionsTotal: number;
    salesToday: number;
    ordersToday: number;
    activeUsers: number;
}

export async function GET(req: Request): Promise<NextResponse> {
    if (!authUtils.isAdminRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();

        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));

        // 1. Total Sessions (Today)
        const sessionsToday = await AnalyticsSession.countDocuments({
            createdAt: { $gte: startOfDay },
        });

        // 2. Total Sessions (All Time)
        const sessionsTotal = await AnalyticsSession.countDocuments();

        // 3. Total Sales (Today)
        const salesTodayAgg = await Order.aggregate([
            { $match: { createdAt: { $gte: startOfDay }, status: { $ne: "cancelled" } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
        ]);
        const salesToday = salesTodayAgg[0]?.total || 0;

        // 4. Total Orders (Today)
        const ordersToday = await Order.countDocuments({
            createdAt: { $gte: startOfDay },
        });

        // 5. Active Users (Last 15 mins)
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const activeUsers = await AnalyticsSession.countDocuments({
            lastActive: { $gte: fifteenMinsAgo },
        });

        const data: OverviewData = {
            sessionsToday,
            sessionsTotal,
            salesToday,
            ordersToday,
            activeUsers,
        };

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Analytics Overview Error:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
