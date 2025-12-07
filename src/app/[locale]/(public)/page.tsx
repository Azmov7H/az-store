import type { Metadata } from "next";
import { Suspense } from "react";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Brands from "@/components/home/brands";
import Stats from "@/components/home/stats";
import Testimonials from "@/components/home/testimonials";
import ProductGrid from "@/components/product/product-grid";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import { getProducts } from "@/lib/services/product-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Home",
    description:
        "Welcome to Ali Store - Your premier destination for quality shoes from top brands like Nike, Adidas, and Puma.",
};

async function FeaturedProducts() {
    const data = await getProducts({ limit: 4 });

    return (
        <section className="w-full py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-bold mb-3 tracking-tight">Featured Collection</h2>
                        <p className="text-muted-foreground text-lg">
                            Discover our latest arrivals and most popular styles selected just for you.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="hidden md:flex gap-2">
                        <Link href="/shop">
                            View All Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <ProductGrid products={data.shoes} />

                <div className="mt-12 text-center md:hidden">
                    <Button asChild variant="outline" className="w-full gap-2">
                        <Link href="/shop">
                            View All Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default async function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />

            <Features />

            <Brands />

            <div className="bg-gradient-to-b from-background to-muted/30">
                <Suspense
                    fallback={
                        <section className="w-full py-20 px-4">
                            <div className="max-w-7xl mx-auto">
                                <div className="mb-12">
                                    <h2 className="text-4xl font-bold mb-3">Featured Collection</h2>
                                    <p className="text-muted-foreground">Loading our best products...</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <ProductCardSkeleton key={i} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    }
                >
                    <FeaturedProducts />
                </Suspense>
            </div>

            <Stats />

            <Testimonials />
        </div>
    );
}
