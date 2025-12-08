import { connectDB } from "@/lib/db/connection";
import { Shoe } from "@/lib/db/schemas";
import { unstable_cache } from "next/cache";

export interface StockAlert {
    id: string;
    title: string;
    stock: number;
    image: string;
}

export const getLowStockProducts = unstable_cache(
    async (threshold: number = 5): Promise<StockAlert[]> => {
        await connectDB();

        const products = await Shoe.find({ stock: { $lte: threshold } })
            .select("id title stock image")
            .limit(5)
            .sort({ stock: 1 }); // Lowest stock first

        return products.map(p => ({
            id: p.id,
            title: p.title,
            stock: p.stock,
            image: p.image
        }));
    },
    ["low-stock-products"],
    { revalidate: 60, tags: ["products", "stock"] }
);
