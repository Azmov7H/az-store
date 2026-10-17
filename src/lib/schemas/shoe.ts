import { z } from "zod";

export const SHOE_CATEGORIES = ["running", "casual", "formal", "sports", "sandals", "boots"] as const;
export const SHOE_GENDERS = ["men", "women", "kids", "unisex"] as const;

// Core field validators (no defaults) so partial updates don't inject implicit values
const shoeShape = {
    title: z.string().trim().min(3, "Title must be 3-100 characters").max(100),
    description: z
        .string()
        .trim()
        .min(10, "Description is required and must be at least 10 characters")
        .max(2000),
    price: z.number().min(0, "Price must be a positive number").max(1_000_000),
    discount: z.number().min(0).max(100),
    image: z.string().trim().min(1, "Image is required").max(2000),
    category: z.enum(SHOE_CATEGORIES, "Category is required"),
    gender: z.enum(SHOE_GENDERS, "Gender/Target is required"),
    availableColors: z
        .array(z.string().trim().min(1))
        .min(1, "Available colors must be an array with at least one color"),
    availableSizes: z
        .array(z.string().trim().min(1))
        .min(1, "Available sizes must be an array with at least one size"),
    stock: z.coerce.number().int().min(0, "Stock must be a positive number").max(1_000_000),
    rating: z.coerce.number().min(0).max(5),
    reviews: z.coerce.number().int().min(0),
    isNew: z.coerce.boolean(),
};

export const shoeSchema = z.object({
    ...shoeShape,
    discount: shoeShape.discount.default(0),
    gender: shoeShape.gender.default("unisex"),
    rating: shoeShape.rating.default(0),
    reviews: shoeShape.reviews.default(0),
    isNew: shoeShape.isNew.default(false),
});

// Partial update: only provided fields are validated/applied, never defaulted
export const shoeUpdateSchema = z.object(shoeShape).partial();

export type ShoeInput = z.infer<typeof shoeSchema>;
export type ShoeUpdateInput = z.infer<typeof shoeUpdateSchema>;
