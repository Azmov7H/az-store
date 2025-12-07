import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { Shoe } from "@/lib/db/schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { validateShoeData } from "@/lib/validators";

interface ShoesQuery {
    category?: string;
    price?: {
        $gte?: number;
        $lte?: number;
    };
    $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
    }>;
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search")?.toLowerCase();
        const page = Number.parseInt(url.searchParams.get("page") || "1") || 1;
        const limit = Number.parseInt(url.searchParams.get("limit") || "10") || 10;

        const query: ShoesQuery = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        const minPrice = url.searchParams.get("minPrice");
        const maxPrice = url.searchParams.get("maxPrice");

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const shoes = await Shoe.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Shoe.countDocuments(query);

        return createSuccessResponse({
            shoes,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("GET /api/shoes error:", error);
        }
        return createErrorResponse("Internal server error", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate
        const validation = validateShoeData(body);
        if (!validation.valid) {
            return createErrorResponse(validation.error || "Validation failed");
        }

        const shoe = new Shoe({
            id: `shoe-${Date.now()}`,
            ...body,
        });

        await shoe.save();
        return createSuccessResponse(shoe, "Shoe created successfully", 201);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("POST /api/shoes error:", error);
        }
        return createErrorResponse("Failed to create shoe", 400);
    }
}
