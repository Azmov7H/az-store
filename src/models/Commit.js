import { Schema, model, models } from "mongoose";

const CommitSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  commit: { type: String, required: true },
}, { timestamps: true });

export default models.Commit || model("Commit", CommitSchema);
