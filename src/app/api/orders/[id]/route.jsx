import { connectDB } from "@/lib/db/connection"
import { Order } from "@/lib/db/schemas"
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response"

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]

export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = params

    const order = await Order.findOne({ orderId: id })
    if (!order) {
      return createErrorResponse("Order not found", 404)
    }

    return createSuccessResponse(order)
  } catch (error) {
    console.error("[v0] GET /api/orders/[id] error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const { id } = params
    const body = await request.json()

    // Validate status update
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return createErrorResponse("Invalid order status", 400)
    }

    const order = await Order.findOneAndUpdate({ orderId: id }, body, { new: true })
    if (!order) {
      return createErrorResponse("Order not found", 404)
    }

    return createSuccessResponse(order)
  } catch (error) {
    console.error("[v0] PUT /api/orders/[id] error:", error)
    return createErrorResponse("Failed to update order", 400)
  }
}
