// Admin authentication utilities
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

interface AdminCredentials {
    username: string;
    password: string;
    email: string;
}

const ADMIN_CREDENTIALS: AdminCredentials = {
    username: "admin",
    password: "admin123",
    email: "admin@shoestore.com",
};

const SECRET_KEY = process.env.JWT_SECRET || "fallback-secret-key-change-this-prod";

interface JWTPayload {
    user: string;
    role: string;
    [key: string]: unknown;
}

export const authUtils = {
    // Verify admin login credentials
    verifyAdmin: (username: string, password: string): boolean => {
        return (
            username === ADMIN_CREDENTIALS.username &&
            password === ADMIN_CREDENTIALS.password
        );
    },

    // Generate JWT token
    signJWT: (payload: JWTPayload): string => {
        return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    },

    // Verify JWT token
    verifyJWT: (token: string): JWTPayload | null => {
        try {
            return jwt.verify(token, SECRET_KEY) as JWTPayload;
        } catch (error) {
            return null;
        }
    },

    // Verify request is from admin (checks Authorization header)
    isAdminRequest: (req: NextRequest | Request): boolean => {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
        const token = authHeader.substring(7);
        return authUtils.verifyJWT(token) !== null;
    },

    // Get payload from request
    getAdminPayload: (req: NextRequest | Request): JWTPayload | null => {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
        const token = authHeader.substring(7);
        return authUtils.verifyJWT(token);
    },
};
