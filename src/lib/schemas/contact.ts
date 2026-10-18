import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().trim().min(2, "Name is required").max(100),
    email: z.email().trim().max(200),
    phone: z.string().trim().max(20).optional(),
    message: z.string().trim().min(1, "Message is required").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
