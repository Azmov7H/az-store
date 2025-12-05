import { connectDB } from "@/lib/db/connection";
import { Order } from "@/lib/db/schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { generateOrderId } from "@/lib/helpers";

function validateOrder(order) {
  if (!order.customerName) return { valid: false, error: "Customer name is required." };
  if (!order.customerEmail) return { valid: false, error: "Customer email is required." };
  if (!order.products || !Array.isArray(order.products) || order.products.length === 0)
    return { valid: false, error: "At least one product is required." };

  for (const p of order.products) {
    if (!p.title) return { valid: false, error: "Product title is required." };
    if (!p.price && p.price !== 0) return { valid: false, error: "Product price is required." };
    if (!p.quantity) return { valid: false, error: "Product quantity is required." };
    if (!p.selectedColor) p.selectedColor = "N/A";
    if (!p.selectedSize) p.selectedSize = "N/A";
  }

  return { valid: true };
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const validation = validateOrder(body);
    if (!validation.valid) return createErrorResponse(validation.error, 400);

    const shipping = body.products.length >= 3 ? 0 : 40;
    const subtotal = body.products.reduce(
      (sum, item) => sum + item.price * item.quantity * (1 - (item.discount || 0) / 100),
      0
    );
    const total = subtotal + shipping - (body.discount || 0);

    const order = new Order({
      orderId: generateOrderId(),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerCity: body.customerCity,
      customerDistrict: body.customerDistrict,
      customerStreet: body.customerStreet,
      products: body.products.map((item) => ({
        ...item,
        selectedColor: item.selectedColor || "N/A",
        selectedSize: item.selectedSize || "N/A",
      })),
      subtotal,
      discount: body.discount || 0,
      shipping,
      total,
      status: "pending",
    });

    await order.save();
    return createSuccessResponse(order, 201);
  } catch (error) {
    console.error("[v1] POST /api/orders error:", error);
    return createErrorResponse("Failed to create order", 400);
  }
}
export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const status = url.searchParams.get("status"); // فلترة حسب الحالة
    const page = Number.parseInt(url.searchParams.get("page")) || 1;
    const limit = Number.parseInt(url.searchParams.get("limit")) || 10;

    const query = {};
    if (status) query.status = status;

    // جلب الطلبات
    const orders = await Order.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // حساب إجمالي الطلبات لصفحات الـ pagination
    const total = await Order.countDocuments(query);

    return createSuccessResponse({
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[v1] GET /api/orders error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}