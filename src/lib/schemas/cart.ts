import { z } from "zod";
import type { CartItem } from "@/types/cart";

// Runtime-validated shape of persisted cart items.
const cartItemStorageSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().catch(""),
    price: z.number().min(0),
    discount: z.number().min(0).max(100).catch(0),
    image: z.string().min(1),
    selectedColor: z.string().min(1),
    selectedSize: z.string().min(1),
    quantity: z.number().int().min(1),
    stock: z.number().int().min(0).catch(0),
});

// Salvage only the valid entries instead of nuking the whole cart; sanity cap at 50.
export const cartStorageSchema = z
    .array(z.unknown())
    .transform((raw) =>
        raw
            .filter((item) => cartItemStorageSchema.safeParse(item).success)
            .slice(0, 50)
            .map((item) => cartItemStorageSchema.parse(item))
    )
    .catch(() => []) as z.ZodType<CartItem[]>;
