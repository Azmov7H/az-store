import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { contactSchema } from "@/lib/schemas/contact";
import { CONTACT_STATUSES } from "@/lib/constants";
import { authUtils } from "@/lib/auth";
import { getContacts, createContact } from "@/lib/services/contact-service";
import type { IContact } from "@/lib/db/schemas";

const VALID_STATUSES = CONTACT_STATUSES;

export async function GET(request: NextRequest) {
    // Contact messages are private leads — admin only
    if (!authUtils.isAdminRequest(request)) {
        return createErrorResponse("Unauthorized", 401);
    }

    try {
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        const page = Number.parseInt(url.searchParams.get("page") || "1") || 1;
        const limit = Number.parseInt(url.searchParams.get("limit") || "10") || 10;

        const data = await getContacts({
            status: status && VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])
                ? (status as IContact["status"])
                : undefined,
            page,
            limit,
        });

        return createSuccessResponse(data);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("GET /api/contact error:", error);
        }
        return createErrorResponse("Internal server error", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
            return createErrorResponse(parsed.error.issues[0]?.message ?? "Validation failed", 400);
        }

        const contact = await createContact(parsed.data);

        return createSuccessResponse(
            { id: contact.id },
            "Thank you for your message. We will get back to you soon.",
            201
        );
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("POST /api/contact error:", error);
        }
        return createErrorResponse("Failed to save contact message", 400);
    }
}
