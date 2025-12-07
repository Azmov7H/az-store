import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { AnalyticsSession } from "@/lib/db/schemas";
import { authUtils } from "@/lib/auth";

interface DeviceData {
    name: string;
    value: number;
}

interface DailyTrafficData {
    _id: string;
    count: number;
}

interface TrafficData {
    devices: DeviceData[];
    browsers: DeviceData[];
    dailyTraffic: DailyTrafficData[];
}

import { getTrafficData } from "@/lib/services/analytics-service";

export async function GET(req: Request): Promise<NextResponse> {
    if (!authUtils.isAdminRequest(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await getTrafficData();

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Analytics Traffic Error:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
