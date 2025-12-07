import { unstable_cache } from "next/cache";

export interface Category {
    id: string;
    name: string;
}

const CATEGORIES_DATA: Category[] = [
    { id: "running", name: "Running" },
    { id: "casual", name: "Casual" },
    { id: "formal", name: "Formal" },
    { id: "sports", name: "Sports" },
    { id: "sandals", name: "Sandals" },
    { id: "boots", name: "Boots" },
];

export const getCategories = unstable_cache(
    async (): Promise<Category[]> => {
        return CATEGORIES_DATA;
    },
    ["categories"],
    { revalidate: 3600, tags: ["categories"] }
);
