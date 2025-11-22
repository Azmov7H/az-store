import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

connectDB();

export async function GET(req, { params }) {
  const { id } = await params; // ⚠️ في Next.js 16 params ليست promise
  try {
    const order = await Order.findById(id).populate("product");
    if (!order) return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await Order.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Order deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
