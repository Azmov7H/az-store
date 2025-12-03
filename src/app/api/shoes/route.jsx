import { connectDB } from "@/lib/db/connection"
import { Shoe } from "@/lib/db/schemas"
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response"
import { validateShoeData } from "@/lib/validators"

export async function GET(request) {
  try {
    await connectDB()

    const url = new URL(request.url)
    const category = url.searchParams.get("category")
    const search = url.searchParams.get("search")?.toLowerCase()
    const page = Number.parseInt(url.searchParams.get("page")) || 1
    const limit = Number.parseInt(url.searchParams.get("limit")) || 10

    const query = {}

    // Filter by category
    if (category) {
      query.category = category
    }

    // Search by title or description
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const shoes = await Shoe.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Shoe.countDocuments(query)

    return createSuccessResponse({
      shoes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET /api/shoes error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate
    const validation = validateShoeData(body)
    if (!validation.valid) {
      return createErrorResponse(validation.error)
    }

    const shoe = new Shoe({
      id: `shoe-${Date.now()}`,
      ...body,
    })

    await shoe.save()
    return createSuccessResponse(shoe, 201)
  } catch (error) {
    console.error("[v0] POST /api/shoes error:", error)
    return createErrorResponse("Failed to create shoe", 400)
  }
}
