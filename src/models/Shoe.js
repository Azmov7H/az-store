import { Schema, model, models } from "mongoose";

const ShoeSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, enum: ['Men', 'Women', 'All'], default: 'All' },
  image: { type: String },
  availableColors: [{ type: String }],
  availableSizes: [{ type: String }],
}, { timestamps: true });

export default models.Shoe || model("Shoe", ShoeSchema);
