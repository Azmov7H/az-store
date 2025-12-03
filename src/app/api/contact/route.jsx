import { connectDB } from "@/lib/db/connection"
import { Contact } from "@/lib/db/schemas"
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response"
import { validateEmail } from "@/lib/validators"

export async function GET(request) {
  try {
    await connectDB()

    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const page = Number.parseInt(url.searchParams.get("page")) || 1
    const limit = Number.parseInt(url.searchParams.get("limit")) || 10

    const query = {}
    if (status && ["new", "read", "resolved"].includes(status)) {
      query.status = status
    }

    const contacts = await Contact.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Contact.countDocuments(query)

    return createSuccessResponse({
      contacts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("[v0] GET /api/contact error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return createErrorResponse("Name, email, and message are required", 400)
    }

    // Validate email
    if (!validateEmail(body.email)) {
      return createErrorResponse("Invalid email address", 400)
    }

    const contact = new Contact({
      id: `contact-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      message: body.message,
      status: "new",
    })

    await contact.save()

    return createSuccessResponse({ id: contact.id }, "Thank you for your message. We will get back to you soon.", 201)
  } catch (error) {
    console.error("[v0] POST /api/contact error:", error)
    return createErrorResponse("Failed to save contact message", 400)
  }
}
