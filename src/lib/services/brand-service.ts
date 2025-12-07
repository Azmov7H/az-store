import { unstable_cache } from "next/cache";

export interface Brand {
    name: string;
    gradient: string;
}

const BRANDS_DATA: Brand[] = [
    { name: "NIKE", gradient: "from-red-500 to-orange-500" },
    { name: "ADIDAS", gradient: "from-blue-500 to-cyan-500" },
    { name: "PUMA", gradient: "from-yellow-500 to-amber-500" },
    { name: "NEW BALANCE", gradient: "from-green-500 to-emerald-500" },
    { name: "REEBOK", gradient: "from-purple-500 to-pink-500" },
    { name: "CONVERSE", gradient: "from-indigo-500 to-blue-500" },
];

export const getBrands = unstable_cache(
    async (): Promise<Brand[]> => {
        // In a real app, this would query the DB
        // const brands = await Shoe.distinct("brand");
        return BRANDS_DATA;
    },
    ["brands"],
    { revalidate: 3600, tags: ["brands"] }
);
