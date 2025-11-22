import { connectDB } from "@/lib/mongodb";
import Shoe from "@/models/Shoe";

console.log("[id]/route.js loaded");
connectDB();

// ===== GET ONE =====
export async function GET(req, ctx) {
  try {
    const { id } = await ctx.params; // FIX: params is a Promise

    const shoe = await Shoe.findById(id);
    if (!shoe) {
      return new Response(JSON.stringify({ error: "Shoe not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(shoe), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ===== UPDATE =====
export async function PUT(req, ctx) {
  try {
    const { id } = await ctx.params; // FIX

    const body = await req.json();

    const updated = await Shoe.findByIdAndUpdate(id, body, { new: true });

    if (!updated) {
      return new Response(JSON.stringify({ error: "Shoe not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ===== DELETE =====
export async function DELETE(req, ctx) {
  try {
    const { id } = await ctx.params; // FIX

    const deleted = await Shoe.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Shoe not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Shoe deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
