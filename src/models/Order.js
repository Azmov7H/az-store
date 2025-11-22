import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Shoe', required: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, enum: ['Cairo', 'Giza'], required: true },
  district: { type: String, required: true },
  street: { type: String },
  selectedColor: { type: String, required: true },
  selectedSize: { type: String, required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true });

export default models.Order || model("Order", OrderSchema);
