// MongoDB Schemas using Mongoose
import mongoose from "mongoose"

// Shoe Schema
const shoeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    image: { type: String, required: true },
    category: { type: String, enum: ["running", "casual", "formal", "sports", "sandals", "boots"], required: true },
    availableColors: [ {type: String} ],
    availableSizes: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    isNew: { type: Boolean, default: "New" },
  },
  { timestamps: true },
)

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerCity: { type: String, required: true },
    customerDistrict: { type: String, required: true },
    customerStreet: { type: String, required: true },
    products: [
      {
        shoeId: String,
        title: String,
        price: Number,
        quantity: Number,
        selectedColor: String,
        selectedSize: String,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: String,
  },
  { timestamps: true },
)

// Contact Schema
const contactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "resolved"], default: "new" },
  },
  { timestamps: true },
)

// Commit/Review Schema
const commitSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    commit: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Create models
// Create models (FIXED)
const Shoe = mongoose.models.Shoe || mongoose.model("Shoe", shoeSchema);
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
const Commit = mongoose.models.Commit || mongoose.model("Commit", commitSchema);

export { Shoe, Order, Contact, Commit };

