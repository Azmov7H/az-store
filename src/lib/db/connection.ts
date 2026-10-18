import mongoose from "mongoose";

// Avoid log spam: when the DB is unreachable, every server page render would
// otherwise repeat the failure. Log the first occurrence per process only
// (dev mode); page-level fallbacks still render real error states.
let loggedConnectionFailure = false;

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

        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 6000 });

        loggedConnectionFailure = false;
        if (process.env.NODE_ENV === "development") {
            console.log("[DB] Connected successfully");
        }
    } catch (error) {
        if (process.env.NODE_ENV === "development" && !loggedConnectionFailure) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("[DB] Connection failed:", errorMessage);
            loggedConnectionFailure = true;
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
