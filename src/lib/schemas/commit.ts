import { z } from "zod";

export const commitSchema = z.object({
    username: z.string().trim().min(2, "Username is required").max(60),
    email: z.email().trim().max(200),
    commit: z.string().trim().min(3, "Review is required").max(1000),
    rating: z.coerce.number().int().min(1).max(5).default(5),
});

export type CommitInput = z.infer<typeof commitSchema>;
