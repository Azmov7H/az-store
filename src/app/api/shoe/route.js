import { connectDB } from "@/lib/mongodb";
import Shoe from "@/models/Shoe";

console.log("shoe/route.js loaded");
connectDB();

// ========= GET ALL SHOES =========
export async function GET(req) {
  try {
    const shoes = await Shoe.find();
    return new Response(JSON.stringify(shoes), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ========= CREATE SHOE =========
export async function POST(req) {
  try {
    const data = await req.json();
    const newShoe = await Shoe.create(data);
    return new Response(JSON.stringify(newShoe), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
