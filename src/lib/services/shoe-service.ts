// Server-side shoe (product) service — direct Mongoose access with DTO mapping,
// no self-HTTP round trips. Cached variants use unstable_cache with ISR-friendly tags.
import { unstable_cache, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Shoe } from "@/lib/db/schemas";
import type { IShoe } from "@/lib/db/schemas";
import type { Product, ProductFilters, ProductsResponse } from "@/types/product";

type ShoeDoc = IShoe & { _id: unknown };

export function toShoeDTO(doc: ShoeDoc): Product {
    return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        price: doc.price,
        discount: doc.discount ?? 0,
        image: doc.image,
        category: doc.category,
        gender: doc.gender,
        availableColors: doc.availableColors ?? [],
        availableSizes: doc.availableSizes ?? [],
        stock: doc.stock ?? 0,
        rating: doc.rating ?? 0,
        reviews: doc.reviews ?? 0,
        isNew: doc.isNew ?? false,
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
    };
}

interface ShoeQuery {
    category?: IShoe["category"];
    price?: { $gte?: number; $lte?: number };
    $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
    }>;
}

function buildQuery(filters: ProductFilters): ShoeQuery {
    const query: ShoeQuery = {};
    if (filters.category) query.category = filters.category as ShoeQuery["category"];

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    if (filters.search) {
        const search = filters.search.toLowerCase();
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    return query;
}

/**
 * Fetch products with optional filters + pagination.
 * Cached for 60s (matches the previous ISR behaviour of the shop pages).
 */
export const getShoes = unstable_cache(
    async (
        filters: ProductFilters & { page?: number; limit?: number } = {}
    ): Promise<ProductsResponse> => {
        await connectDB();

        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit ?? 10;
        const query = buildQuery(filters);

        const [docs, total] = await Promise.all([
            Shoe.find(query)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .lean() as unknown as ShoeDoc[],
            Shoe.countDocuments(query),
        ]);

        return {
            shoes: docs.map(toShoeDTO),
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    },
    ["shoes-list"],
    { revalidate: 60, tags: ["shoes"] }
);

/** Back-compat alias used across pages */
export const getProducts = getShoes;

/**
 * Fetch a single product by its public `id` (cached for 60s).
 */
export const getShoeById = unstable_cache(
    async (id: string): Promise<Product | null> => {
        await connectDB();
        const doc = (await Shoe.findOne({ id }).lean()) as unknown as ShoeDoc | null;
        return doc ? toShoeDTO(doc) : null;
    },
    ["shoe-by-id"],
    { revalidate: 60, tags: ["shoes"] }
);

/** Back-compat alias */
export const getProductById = getShoeById;

/** Generate a unique public id for a new shoe */
export function generateShoeId(): string {
    return `shoe-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Create a shoe. `data` is expected to be pre-validated by the caller.
 */
export async function createShoe(
    data: Omit<Partial<IShoe>, "id"> & { title: string; price: number }
): Promise<Product> {
    await connectDB();
    const doc = await new Shoe({ ...data, id: generateShoeId() }).save();
    revalidateTag("shoes", "max");
    return toShoeDTO(doc.toJSON() as ShoeDoc);
}

/**
 * Update a shoe by its public `id`; returns the updated DTO or null.
 */
export async function updateShoeById(
    id: string,
    patch: Partial<IShoe>
): Promise<Product | null> {
    await connectDB();
    const doc = (await Shoe.findOneAndUpdate({ id }, patch, {
        new: true,
    }).lean()) as unknown as ShoeDoc | null;
    revalidateTag("shoes", "max");
    return doc ? toShoeDTO(doc) : null;
}

/**
 * Delete a shoe by its public `id`.
 */
export async function deleteShoeById(id: string): Promise<Product | null> {
    await connectDB();
    const doc = (await Shoe.findOneAndDelete({ id }).lean()) as unknown as ShoeDoc | null;
    revalidateTag("shoes", "max");
    return doc ? toShoeDTO(doc) : null;
}
