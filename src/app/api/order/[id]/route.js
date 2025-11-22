import Shoe from "@/lib/models/Shoe";
import connectDB from "@/lib/mongodb";

export async function GET(req, context) {
  await connectDB();

  const { id } = await context.params;

  try {
    const shoe = await Shoe.findById(id);

    if (!shoe) {
      return new Response(JSON.stringify({ error: "Shoe not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(shoe), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch product" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  await connectDB();

  const { id } = await context.params;

  try {
    const deleted = await Shoe.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Shoe not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Delete failed" }),
      { status: 500 }
    );
  }
}
