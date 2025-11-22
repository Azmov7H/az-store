import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Shoe from "@/models/Shoe";

connectDB();

const districts = {
  Cairo: [
    'Nasr City', 'Heliopolis', 'Maadi', 'Zamalek', 'Garden City',
    'Downtown', 'Dokki', 'Shubra', 'El Rehab', '6th of October (Cairo part)'
  ],
  Giza: [
    'Dokki', 'Mohandessin', '6th of October', 'Haram', 'Imbaba',
    'Agouza', 'Boulaq', 'Sheikh Zayed', '6th of October (Giza part)'
  ]
};

export async function GET() {
  try {
    const orders = await Order.find().populate("product");
    return Response.json(orders, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      product: productId,
      customerName,
      phone,
      city,
      district,
      street,
      selectedColor,
      selectedSize,
      quantity
    } = body;

    // Validate city
    if (!['Cairo', 'Giza'].includes(city)) {
      return Response.json({ message: "City must be Cairo or Giza" }, { status: 400 });
    }

    // Validate district
    if (!districts[city].includes(district)) {
      return Response.json({ message: "Invalid district for selected city" }, { status: 400 });
    }

    // Validate product
    const shoe = await Shoe.findById(productId);
    if (!shoe) {
      return Response.json({ message: "Shoe not found" }, { status: 404 });
    }

    // Validate color
    if (!shoe.availableColors.includes(selectedColor)) {
      return Response.json({ message: "Selected color not available" }, { status: 400 });
    }

    // Validate size
    if (!shoe.availableSizes.includes(selectedSize)) {
      return Response.json({ message: "Selected size not available" }, { status: 400 });
    }

    // Create order
    const newOrder = await Order.create(body);

    return Response.json(
      { message: "Order created successfully", order: newOrder },
      { status: 201 }
    );

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
