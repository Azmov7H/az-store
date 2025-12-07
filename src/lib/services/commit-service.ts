import { unstable_cache } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface Commit {
    _id: string;
    username: string;
    email: string;
    commit: string;
    createdAt: string;
}

export const getCommits = unstable_cache(
    async (): Promise<Commit[]> => {
        try {
            const res = await fetch(`${BASE_URL}/api/commits`, {
                next: { revalidate: 60, tags: ["commits"] },
            });

            if (!res.ok) {
                // If the endpoint doesn't exist or fails, return empty array to prevent crash
                return [];
            }

            const data = await res.json();
            if (data.data && Array.isArray(data.data.commits)) {
                return data.data.commits;
            }
            return Array.isArray(data) ? data : data.data || [];
        } catch (error) {
            console.error("Failed to fetch commits:", error);
            return [];
        }
    },
    ["commits"],
    { revalidate: 60, tags: ["commits"] }
);
