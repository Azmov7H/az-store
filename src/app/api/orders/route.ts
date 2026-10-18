import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { authUtils } from "@/lib/auth";
import { createOrderSchema } from "@/lib/schemas/order";
import { createOrder, getOrders } from "@/lib/services/order-service";
import type { Order } from "@/types/order";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = createOrderSchema.safeParse(body);
        if (!parsed.success) {
            return createErrorResponse(parsed.error.issues[0]?.message ?? "Validation failed", 400);
        }

        // The service computes server-side pricing (ignores client totals)
        const order = await createOrder(parsed.data);
        return createSuccessResponse(order, "Order created successfully", 201);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("POST /api/orders error:", error);
        }
        return createErrorResponse("Failed to create order", 400);
    }
}

export async function GET(request: NextRequest) {
    // Order list contains customer PII — admin only
    if (!authUtils.isAdminRequest(request)) {
        return createErrorResponse("Unauthorized", 401);
    }

    try {
        const url = new URL(request.url);
        const status = url.searchParams.get("status");
        const page = Number.parseInt(url.searchParams.get("page") || "1") || 1;
        const limit = Number.parseInt(url.searchParams.get("limit") || "10") || 10;

        let all = await getOrders();

        if (status) {
            all = all.filter((o: Order) => o.status === status);
        }

        const total = all.length;
        const start = (page - 1) * limit;
        const orders = all.slice(start, start + limit);

        return createSuccessResponse({
            orders,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("GET /api/orders error:", error);
        }
        return createErrorResponse("Internal server error", 500);
    }
}
