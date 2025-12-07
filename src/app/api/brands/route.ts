import { NextResponse } from "next/server";
import { getBrands } from "@/lib/services/brand-service";

export async function GET() {
    const brands = await getBrands();
    return NextResponse.json({
        success: true,
        data: brands
    });
}
