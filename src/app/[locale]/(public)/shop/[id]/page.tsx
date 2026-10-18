import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/services/shoe-service";
import ProductPageClient from "@/components/product/product-page-client";

export const metadata: Metadata = {
    title: "Product Not Found",
    description: "",
};

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const [product, related] = await Promise.all([
        getProductById(id),
        getProducts({ limit: 5 }).then((res) =>
            res.shoes.filter((p) => p.id !== id).slice(0, 4)
        ),
    ]);

    if (!product) {
        notFound();
    }

    return <ProductPageClient product={product} related={related} />;
}
