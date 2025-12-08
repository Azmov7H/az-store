import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { UAParser } from "ua-parser-js";
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
            // Parse User Agent
            const userAgent = req.headers.get("user-agent") || "";
            const parser = new UAParser(userAgent);
            const browser = parser.getBrowser();
            const os = parser.getOS();
            const device = parser.getDevice();

            // Attempt to get IP and Location from headers
            const forwardedFor = req.headers.get("x-forwarded-for");
            const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";

            // Try to get country from standard CDN headers (Vercel, Cloudflare, etc.)
            const country = req.headers.get("x-vercel-ip-country") ||
                req.headers.get("cf-ipcountry") ||
                "Unknown";

            const city = req.headers.get("x-vercel-ip-city") || "Unknown";
            const region = req.headers.get("x-vercel-ip-region") || "Unknown";

            // Determine device type if not strictly parsed
            const deviceType = device.type || (userAgent.match(/mobile/i) ? "mobile" : "desktop");

            // New session
            session = new AnalyticsSession({
                sessionId,
                device: deviceType,
                browser: `${browser.name || "Unknown"} ${browser.version || ""}`.trim(),
                os: `${os.name || "Unknown"} ${os.version || ""}`.trim(),
                ip: ip,
                location: {
                    country,
                    city,
                    region
                },
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
