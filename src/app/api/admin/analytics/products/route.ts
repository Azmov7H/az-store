import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { AnalyticsSession, Order } from "@/lib/db/schemas";
import { authUtils } from "@/lib/auth";

interface ProductView {
    _id: string;
    name: string;
    views: number;
}

interface ProductSold {
    _id: string;
    title: string;
    sold: number;
    revenue: number;
}

interface ProductsData {
    topViewed: ProductView[];
    topSold: ProductSold[];
}

export async function GET(req: Request): Promise<NextResponse> {
    if (!authUtils.isAdminRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();

        // 1. Top viewed products (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const topViewed = await AnalyticsSession.aggregate([
            { $match: { "events.timestamp": { $gte: thirtyDaysAgo } } },
            { $unwind: "$events" },
            { $match: { "events.type": "product_view" } },
            {
                $group: {
                    _id: "$events.metadata.productId",
                    name: { $first: "$events.metadata.productName" },
                    views: { $sum: 1 },
                },
            },
            { $sort: { views: -1 } },
            { $limit: 10 },
        ]);

        // 2. Top sold products (last 30 days)
        const topSold = await Order.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: "cancelled" } } },
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.shoeId",
                    title: { $first: "$products.title" },
                    sold: { $sum: "$products.quantity" },
                    revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
                },
            },
            { $sort: { sold: -1 } },
            { $limit: 10 },
        ]);

        const data: ProductsData = {
            topViewed,
            topSold,
        };

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Analytics Products Error:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
