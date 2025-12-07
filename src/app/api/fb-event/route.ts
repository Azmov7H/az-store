import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { eventName, eventId, emails, phones } = body;

        // Placeholder for Facebook Conversions API (server-side pixel)
        // You would typically send this data to: https://graph.facebook.com/v19.0/{pixel_id}/events

        console.log(`[FB Event] ${eventName}`, { eventId, hasUserInfo: !!(emails || phones) });

        return NextResponse.json({ success: true, message: "Event received" });
    } catch (error) {
        console.error("FB Event Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
