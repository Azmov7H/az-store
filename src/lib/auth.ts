// Admin authentication utilities
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

const ADMIN_TOKEN_COOKIE = "admin_token";

const getSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not set. Provide it in the environment.");
    }
    return secret;
};

export const authUtils = {
    // Verify admin login credentials against environment configuration
    verifyAdmin: (username: string, password: string): boolean => {
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;
        if (!adminUser || !adminPass) {
            // Fail closed: no credentials configured, nobody can log in
            return false;
        }

        return safeEqual(normalize(username), normalize(adminUser))
            && safeEqual(normalize(password), normalize(adminPass));
    },
    // Generate JWT token
    signJWT: (payload: JWTPayload): string => {
        return jwt.sign(payload, getSecret(), { expiresIn: "24h" });
    },

    // Verify JWT token
    verifyJWT: (token: string): JWTPayload | null => {
        try {
            return jwt.verify(token, getSecret()) as JWTPayload;
        } catch (error) {
            return null;
        }
    },

    // Verify request comes from an authenticated admin.
    // Accepts the `admin_token` cookie (set by /api/login) or a Bearer Authorization header.
    isAdminRequest: (req: NextRequest | Request): boolean => {
        const token = extractToken(req);
        return token !== null && authUtils.verifyJWT(token) !== null;
    },
};

interface JWTPayload {
    user: string;
    role: string;
    [key: string]: unknown;
}

function normalize(value: string): Buffer {
    return Buffer.from(value, "utf8");
}

function safeEqual(a: Buffer, b: Buffer): boolean {
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

function extractToken(req: NextRequest | Request): string | null {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }

    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_TOKEN_COOKIE}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}
