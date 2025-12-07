import { NextResponse } from "next/server";
import { authUtils } from "@/lib/auth";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const body = await req.json();
        const { user, pass } = body;

        if (authUtils.verifyAdmin(user, pass)) {
            const token = authUtils.signJWT({ user, role: "admin" });

            const response = NextResponse.json({ success: true, token });

            // Set secure cookie
            response.cookies.set("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24, // 1 day
            });

            return response;
        }

        return NextResponse.json(
            { success: false, error: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
