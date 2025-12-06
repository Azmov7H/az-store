import type { Product } from "@/types/product";
import ProductCard from "./product-card";
import ProductCardSkeleton from "./product-card-skeleton";

interface ProductGridProps {
    products: Product[];
    loading?: boolean;
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
            ))}
        </div>
    );
}
