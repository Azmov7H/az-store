import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { validateShoeData } from "@/lib/validators";
import { authUtils } from "@/lib/auth";
import { createShoe, getShoes } from "@/lib/services/shoe-service";
import type { IShoe } from "@/lib/db/schemas";

type ProductFilters = Parameters<typeof getShoes>[0];

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);

        const minPrice = url.searchParams.get("minPrice");
        const maxPrice = url.searchParams.get("maxPrice");

        const filters: ProductFilters = {
            category: url.searchParams.get("category") ?? undefined,
            search: url.searchParams.get("search") ?? undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            page: Number.parseInt(url.searchParams.get("page") || "1") || 1,
            limit: Number.parseInt(url.searchParams.get("limit") || "10") || 10,
        };

        const data = await getShoes(filters);
        return createSuccessResponse(data);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("GET /api/shoes error:", error);
        }
        return createErrorResponse("Internal server error", 500);
    }
}

export async function POST(request: NextRequest) {
    if (!authUtils.isAdminRequest(request)) {
        return createErrorResponse("Unauthorized", 401);
    }

    try {
        const body = await request.json();

        // Validate
        const validation = validateShoeData(body);
        if (!validation.valid) {
            return createErrorResponse(validation.error || "Validation failed");
        }

        const shoe = await createShoe(body as Partial<IShoe> & { title: string; price: number });
        return createSuccessResponse(shoe, "Shoe created successfully", 201);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("POST /api/shoes error:", error);
        }
        return createErrorResponse("Failed to create shoe", 400);
    }
}
