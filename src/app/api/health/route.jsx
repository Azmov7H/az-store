import { connectDB } from "@/lib/db/connection"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response"

export async function GET() {
  try {
    await connectDB()

    return createSuccessResponse({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    })
  } catch (error) {
    console.error("[v0] Health check - DB connection failed:", error)
    return createErrorResponse("Database connection failed", 500)
  }
}
