import { z } from "zod";

export const orderProductSchema = z.object({
    shoeId: z.string().trim().min(1),
    title: z.string().trim().min(1),
    price: z.number().min(0),
    quantity: z.number().int().min(1).default(1),
    selectedColor: z.string().trim().min(1),
    selectedSize: z.string().trim().optional(),
});

export const createOrderSchema = z.object({
    customerName: z.string().trim().min(2, "Customer name is required").max(100),
    customerEmail: z.email().trim().max(200),
    customerPhone: z
        .string()
        .trim()
        .regex(/^[+\d][\d\s\-()]{5,}$/, "A valid phone number is required"),
    customerCity: z.string().trim().min(2, "City is required").max(100),
    customerDistrict: z.string().trim().min(2, "District is required").max(100),
    customerStreet: z.string().trim().max(200).default(""),
    products: z.array(orderProductSchema).min(1, "At least one product is required"),
    notes: z.string().trim().max(1000).optional(),
    // informational from client; server recomputes authoritative pricing
    discount: z.number().min(0).max(100).default(0),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
