import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    console.log("[DB] Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[DB] Connected successfully");
  } catch (error) {
    console.error("[DB] Connection failed:", error.message);
    throw new Error("Database connection failed");
  }
}
