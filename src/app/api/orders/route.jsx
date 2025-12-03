import { connectDB } from "@/lib/db/connection"
import { Order } from "@/lib/db/schemas"
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response"
import { generateOrderId } from "@/lib/helpers"
import { validateOrder } from "@/lib/validators"

export async function GET(request) {
  try {
    await connectDB()

    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const page = Number.parseInt(url.searchParams.get("page")) || 1
    const limit = Number.parseInt(url.searchParams.get("limit")) || 10

    const query = {}
    if (status) {
      query.status = status
    }

    const orders = await Order.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Order.countDocuments(query)

    return createSuccessResponse({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("[v0] GET /api/orders error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()

    // Validate
    const validation = validateOrder(body)
    if (!validation.valid) {
      return createErrorResponse(validation.error, 400)
    }

    const order = new Order({
      orderId: generateOrderId(),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerCity: body.customerCity,
      customerDistrict: body.customerDistrict,
      customerStreet: body.customerStreet,
      products: body.products,
      subtotal: body.subtotal,
      discount: body.discount || 0,
      total: body.total,
      status: "pending",
    })

    await order.save()
    return createSuccessResponse(order, 201)
  } catch (error) {
    console.error("[v0] POST /api/orders error:", error)
    return createErrorResponse("Failed to create order", 400)
  }
}
