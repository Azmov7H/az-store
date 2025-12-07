import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Order } from "@/lib/db/schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

interface RouteParams {
    params: Promise<{ id: string }>;
}

interface OrderUpdateBody {
    status?: typeof VALID_STATUSES[number];
    [key: string]: unknown;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { id } = await params;

        const order = await Order.findOne({ orderId: id });
        if (!order) {
            return createErrorResponse("Order not found", 404);
        }

        return createSuccessResponse(order);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("GET /api/orders/[id] error:", error);
        }
        return createErrorResponse("Internal server error", 500);
    }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { id } = await params;
        const body: OrderUpdateBody = await request.json();

        // Validate status update
        if (body.status && !VALID_STATUSES.includes(body.status)) {
            return createErrorResponse("Invalid order status", 400);
        }

        const order = await Order.findOneAndUpdate({ orderId: id }, body, { new: true });
        if (!order) {
            return createErrorResponse("Order not found", 404);
        }

        return createSuccessResponse(order);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("PUT /api/orders/[id] error:", error);
        }
        return createErrorResponse("Failed to update order", 400);
    }
}
