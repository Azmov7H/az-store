import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { authUtils } from "@/lib/auth";
import { createOrder, getOrders } from "@/lib/services/order-service";
import type { CreateOrderData, Order } from "@/types/order";

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as CreateOrderData & { discount?: number };

        // The service enforces required fields and computes server-side pricing
        const order = await createOrder(body);
        return createSuccessResponse(order, "Order created successfully", 201);
    } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        if (message === "Customer name is required." || message === "Customer email is required." || message === "At least one product is required.") {
            return createErrorResponse(message, 400);
        }
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
