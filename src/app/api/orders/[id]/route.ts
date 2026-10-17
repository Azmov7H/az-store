import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Order } from "@/lib/db/schemas";
import type { IOrder, IOrderProduct } from "@/lib/db/schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { authUtils } from "@/lib/auth";

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

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
    if (!authUtils.isAdminRequest(request)) {
        return createErrorResponse("Unauthorized", 401);
    }

    try {
        await connectDB();
        const { id } = await params;
        const raw = (await request.json()) as OrderUpdateBody;

        // Only forward whitelisted fields (mass-assignment protection)
        const body: OrderUpdateBody = {};
        if (raw.status !== undefined) body.status = raw.status;
        if (raw.notes !== undefined) body.notes = raw.notes;
        if (raw.customerName !== undefined) body.customerName = raw.customerName;
        if (raw.customerEmail !== undefined) body.customerEmail = raw.customerEmail;
        if (raw.customerPhone !== undefined) body.customerPhone = raw.customerPhone;
        if (raw.customerCity !== undefined) body.customerCity = raw.customerCity;
        if (raw.customerDistrict !== undefined) body.customerDistrict = raw.customerDistrict;
        if (raw.customerStreet !== undefined) body.customerStreet = raw.customerStreet;
        if (raw.products !== undefined) body.products = raw.products;
        if (raw.discount !== undefined) body.discount = raw.discount;

        // Validate status update
        if (body.status && !VALID_STATUSES.includes(body.status)) {
            return createErrorResponse("Invalid order status", 400);
        }

        const order = await Order.findOneAndUpdate(
            { orderId: id },
            body as Partial<IOrder>,
            { new: true }
        );
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
