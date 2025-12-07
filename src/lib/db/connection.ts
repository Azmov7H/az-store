import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        if (process.env.NODE_ENV === "development") {
            console.log("[DB] Connecting to MongoDB Atlas...");
        }

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        await mongoose.connect(mongoUri);

        if (process.env.NODE_ENV === "development") {
            console.log("[DB] Connected successfully");
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        if (process.env.NODE_ENV === "development") {
            console.error("[DB] Connection failed:", errorMessage);
        }
        throw new Error("Database connection failed");
    }
}

export async function disconnectDB(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
}

export function getConnection(): typeof mongoose {
    return mongoose;
}
