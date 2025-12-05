import type { Metadata } from "next";
import { Suspense } from "react";
import Hero from "@/components/home/hero";
import Testimonials from "@/components/home/testimonials";
import ProductGrid from "@/components/product/product-grid";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import { getProducts } from "@/lib/services/product-service";

export const metadata: Metadata = {
    title: "Home",
    description:
        "Welcome to Ali Store - Your premier destination for quality shoes from top brands like Nike, Adidas, and Puma.",
};

async function FeaturedProducts() {
    const data = await getProducts({ limit: 3 });

    return (
        <section className="w-full py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
                    <p className="text-muted-foreground">
                        Check out our latest and most popular shoes
                    </p>
                </div>
                <ProductGrid products={data.shoes} />
            </div>
        </section>
    );
}

export default async function HomePage() {
    return (
        <div className="flex flex-col">
            <Hero />

            <Suspense
                fallback={
                    <section className="w-full py-12 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
                                <p className="text-muted-foreground">Loading...</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </section>
                }
            >
                <FeaturedProducts />
            </Suspense>

            <Testimonials />
        </div>
    );
}
