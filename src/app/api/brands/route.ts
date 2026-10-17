import { createSuccessResponse } from "@/lib/api-response";
import { getBrands } from "@/lib/services/brand-service";

export async function GET() {
    const brands = await getBrands();
    return createSuccessResponse(brands);
}
