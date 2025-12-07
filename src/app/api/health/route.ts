import { connectDB } from "@/lib/db/connection";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";

export async function GET() {
    try {
        await connectDB();

        return createSuccessResponse({
            status: "healthy",
            database: "connected",
            timestamp: new Date().toISOString(),
            version: "1.0.0",
        });
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Health check - DB connection failed:", error);
        }
        return createErrorResponse("Database connection failed", 500);
    }
}
