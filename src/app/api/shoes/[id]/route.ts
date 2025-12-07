import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Shoe } from "@/lib/db/schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { validateShoeData } from "@/lib/validators";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { id } = await params;

        const shoe = await Shoe.findOne({ id });
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
    try {
        await connectDB();

        const { id } = await params;
        const body = await request.json();

        // Validate
        const validation = validateShoeData(body);
        if (!validation.valid) {
            return createErrorResponse(validation.error || "Validation failed", 400);
        }

        // Update using MongoDB _id
        const shoe = await Shoe.findByIdAndUpdate(id, body, { new: true });

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
    try {
        await connectDB();
        const { id } = await params;

        const shoe = await Shoe.findOneAndDelete({ id });
        if (!shoe) {
            return createErrorResponse("Shoe not found", 404);
        }

        return createSuccessResponse({ message: "Shoe deleted successfully", shoe });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("DELETE /api/shoes/[id] error:", error);
        }
        return createErrorResponse("Failed to delete shoe", 500);
    }
}
