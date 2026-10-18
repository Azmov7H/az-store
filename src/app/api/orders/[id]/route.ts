import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { authUtils } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/constants";
import { getOrderById, updateOrder } from "@/lib/services/order-service";
import type { IOrderProduct } from "@/lib/db/schemas";

const VALID_STATUSES = ORDER_STATUSES;

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Whitelisted, admin-controlled fields. Orders are financial records:
// the public must never be able to rewrite totals, products or customer data.
interface OrderUpdateBody {
    status?: typeof VALID_STATUSES[number];
    notes?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerCity?: string;
    customerDistrict?: string;
    customerStreet?: string;
    products?: IOrderProduct[];
    discount?: number;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    if (!authUtils.isAdminRequest(request)) {
        return createErrorResponse("Unauthorized", 401);
    }

    try {
        const { id } = await params;

        const order = await getOrderById(id);
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
    if (!authUtils.isAdminRequest(request)) {
        return createErrorResponse("Unauthorized", 401);
    }

    try {
        const { id } = await params;
        const body = (await request.json()) as OrderUpdateBody;

        // Validate status update
        if (body.status && !VALID_STATUSES.includes(body.status)) {
            return createErrorResponse("Invalid order status", 400);
        }

        const order = await updateOrder(id, body);
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

