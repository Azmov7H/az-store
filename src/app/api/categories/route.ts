import { createSuccessResponse } from "@/lib/api-response";
import { getCategories } from "@/lib/services/category-service";

export async function GET() {
    const categories = await getCategories();
    return createSuccessResponse(categories);
}
