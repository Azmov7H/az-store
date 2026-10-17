import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { validateShoeData } from "@/lib/validators";
import { authUtils } from "@/lib/auth";
import { deleteShoeById, getShoeById, updateShoeById } from "@/lib/services/shoe-service";
import type { IShoe } from "@/lib/db/schemas";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const shoe = await getShoeById(id);
        if (!shoe) {
            return createErrorResponse("Shoe not found", 404);
        }

        return createSuccessResponse(shoe);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("GET /api/shoes/[id] error:", error);
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
        const body = await request.json();

        // Validate
        const validation = validateShoeData(body);
        if (!validation.valid) {
            return createErrorResponse(validation.error || "Validation failed", 400);
        }

        const shoe = await updateShoeById(id, body as Partial<IShoe>);
        if (!shoe) {
            return createErrorResponse("Shoe not found", 404);
        }

        return createSuccessResponse(shoe);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("PUT /api/shoes/[id] error:", error);
        }
        return createErrorResponse("Failed to update shoe", 500);
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    if (!authUtils.isAdminRequest(request)) {
        return createErrorResponse("Unauthorized", 401);
    }

    try {
        const { id } = await params;

        const shoe = await deleteShoeById(id);
        if (!shoe) {
            return createErrorResponse("Shoe not found", 404);
        }

        return createSuccessResponse({ message: "Shoe deleted successfully", id: shoe.id });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("DELETE /api/shoes/[id] error:", error);
        }
        return createErrorResponse("Failed to delete shoe", 500);
    }
}
