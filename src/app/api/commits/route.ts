import { NextRequest } from "next/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { commitSchema } from "@/lib/schemas/commit";
import { createCommit, getCommitsPaged } from "@/lib/services/commit-service";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const page = Number.parseInt(url.searchParams.get("page") || "1") || 1;
        const limit = Number.parseInt(url.searchParams.get("limit") || "10") || 10;

        const data = await getCommitsPaged(page, limit);
        return createSuccessResponse(data);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("GET /api/commits error:", error);
        }
        return createErrorResponse("Internal server error", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = commitSchema.safeParse(body);
        if (!parsed.success) {
            return createErrorResponse(parsed.error.issues[0]?.message ?? "Validation failed", 400);
        }
        const { username, email, commit, rating } = parsed.data;

        const saved = await createCommit({ username, email, commit, rating });

        return createSuccessResponse(
            { id: saved.id },
            "Thank you for your review! It will be displayed after verification.",
            201
        );
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("POST /api/commits error:", error);
        }
        return createErrorResponse("Failed to save review", 400);
    }
}
