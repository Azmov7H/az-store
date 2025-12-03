import { connectDB } from "@/lib/db/connection"
import { Commit } from "@/lib/db/schemas"
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response"
import { validateEmail } from "@/lib/validators"

export async function GET(request) {
  try {
    await connectDB()

    const url = new URL(request.url)
    const verified = url.searchParams.get("verified")
    const page = Number.parseInt(url.searchParams.get("page")) || 1
    const limit = Number.parseInt(url.searchParams.get("limit")) || 10

    const query = { verified: true } // Only show verified reviews

    const commits = await Commit.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Commit.countDocuments(query)

    return createSuccessResponse({
      commits,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("[v0] GET /api/commits error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()

    // Validate required fields
    if (!body.username || !body.email || !body.commit) {
      return createErrorResponse("Username, email, and review are required", 400)
    }

    // Validate email
    if (!validateEmail(body.email)) {
      return createErrorResponse("Invalid email address", 400)
    }

    // Validate rating
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return createErrorResponse("Rating must be between 1 and 5", 400)
    }

    const commit = new Commit({
      id: `review-${Date.now()}`,
      username: body.username,
      email: body.email,
      commit: body.commit,
      rating: body.rating || 5,
      verified: false,
    })

    await commit.save()

    return createSuccessResponse(
      { id: commit.id },
      "Thank you for your review! It will be displayed after verification.",
      201,
    )
  } catch (error) {
    console.error("[v0] POST /api/commits error:", error)
    return createErrorResponse("Failed to save review", 400)
  }
}
