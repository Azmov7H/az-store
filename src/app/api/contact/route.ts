import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { validateEmail } from "@/lib/validators";
import { authUtils } from "@/lib/auth";
import { getContacts, createContact } from "@/lib/services/contact-service";
import type { IContact } from "@/lib/db/schemas";

const VALID_STATUSES = ["new", "read", "resolved"] as const;

interface ContactBody {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
}

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
        const body: ContactBody = await request.json();

        // Validate required fields
        if (!body.name || !body.email || !body.message) {
            return createErrorResponse("Name, email, and message are required", 400);
        }

        // Validate email
        if (!validateEmail(body.email)) {
            return createErrorResponse("Invalid email address", 400);
        }

        const contact = await createContact({
            name: body.name,
            email: body.email,
            phone: body.phone,
            message: body.message,
        });

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
