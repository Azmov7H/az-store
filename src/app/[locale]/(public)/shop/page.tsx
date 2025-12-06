import type { Metadata } from "next";
import { Suspense } from "react";
import ProductGrid from "@/components/product/product-grid";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import { getProducts } from "@/lib/services/product-service";

export const metadata: Metadata = {
    title: "Shop | All Products",
    description:
        "Browse all products from Ali Store including Nike, Adidas, Puma shoes and more. Find your perfect pair today.",
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

interface ShopPageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
        page?: string;
    }>;
}

async function ProductList({ searchParams }: ShopPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const data = await getProducts({
        category: params.category,
        search: params.search,
        page,
        limit: 12,
    });

    return (
        <div className="w-full">
            {data.shoes.length > 0 ? (
                <>
                    <ProductGrid products={data.shoes} />

                    {/* Pagination info */}
                    {data.pagination.pages > 1 && (
                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            Page {data.pagination.page} of {data.pagination.pages} (
                            {data.pagination.total} products)
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">
                        No products found. Try adjusting your filters.
                    </p>
                </div>
            )}
        </div>
    );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    return (
        <section className="w-full p-4 md:p-8 flex flex-col items-center gap-6">
            <div className="w-full max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">All Products</h1>
                    <p className="text-muted-foreground">
                        Discover our complete collection of premium shoes
                    </p>
                </div>

                <Suspense
                    fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    }
                >
                    <ProductList searchParams={searchParams} />
                </Suspense>
            </div>
        </section>
    );
}
