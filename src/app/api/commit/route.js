import { connectDB } from "@/lib/mongodb";
import Commit from "@/models/Commit";

connectDB();

export async function GET(req) {
  try {
    const commits = await Commit.find();
    return new Response(JSON.stringify(commits), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const commit = await Commit.create(data);
    return new Response(JSON.stringify(commit), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
