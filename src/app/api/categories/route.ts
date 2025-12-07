import { NextResponse } from "next/server";

const CATEGORIES = [
    "running",
    "casual",
    "formal",
    "sports",
    "sandals",
    "boots"
];

export async function GET() {
    return NextResponse.json({
        success: true,
        data: CATEGORIES.map(c => ({
            id: c,
            name: c.charAt(0).toUpperCase() + c.slice(1)
        }))
    });
}
