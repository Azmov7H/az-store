import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";

import { AnalyticsSession } from "@/lib/db";

interface AnalyticsEventBody {
    sessionId: string;
    type: string;
    url?: string;
    path?: string;
    referrer?: string;
    metadata?: Record<string, unknown>;
    deviceInfo?: {
        device?: string;
        userAgent?: string;
        screen?: string;
        language?: string;
    };
}

export async function POST(req: Request): Promise<NextResponse> {
    try {
        await connectDB();

        // Parse the body - handle both JSON and Beacon (text/plain sometimes)
        let body: AnalyticsEventBody | null = null;
        const contentType = req.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            body = await req.json();
        } else {
            // Beacon requests might come as text
            const text = await req.text();
            if (text) {
                body = JSON.parse(text);
            }
        }

        if (!body) {
            return NextResponse.json({ error: "Empty body" }, { status: 400 });
        }

        const { sessionId, type, url, path, referrer, metadata, deviceInfo } = body;

        // Find or create session
        let session = await AnalyticsSession.findOne({ sessionId });

        if (!session) {
            // New session
            session = new AnalyticsSession({
                sessionId,
                device: deviceInfo?.device || "desktop",
                browser: deviceInfo?.userAgent,
                os: "unknown",
                ip: "anonymized",
                location: { country: "unknown" },
                events: [],
                startTime: new Date(),
                lastActive: new Date(),
            });
        }

        // Add event
        session.events.push({
            type: type as "page_view" | "product_view" | "add_to_cart" | "remove_from_cart" | "checkout_start" | "checkout_success",
            url,
            path,
            referrer,
            metadata,
            timestamp: new Date(),
        });

        session.lastActive = new Date();
        await session.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("[Analytics] Error tracking event:", error);
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
