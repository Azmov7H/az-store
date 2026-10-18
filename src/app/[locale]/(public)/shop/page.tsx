import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ProductGrid from "@/components/product/product-grid";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import { ShopFilters } from "@/components/shop/shop-filters";
import { Button } from "@/components/ui/button";
import { getShoes } from "@/lib/services/shoe-service";
import { getCategories } from "@/lib/services/category-service";
import type { Category } from "@/lib/services/category-service";

export const metadata: Metadata = {
    title: "Shop | All Products",
    description:
        "Browse all products from Ali Store including Nike, Adidas, Puma shoes and more. Find your perfect pair today.",
};

interface ShopPageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
        sort?: string;
        page?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const t = await getTranslations("Home");
    const products = (await getTranslations("products")) as unknown as Record<string, string>;
    const params = await searchParams;
    const page = parseInt(params.page || "1");

    const [shoesData, categories] = await Promise.all([
        getShoes({
            category: params.category,
            search: params.search,
            sort: (params.sort ?? "newest") as
                | "newest"
                | "price_asc"
                | "price_desc",
            page,
            limit: 12,
        }),
        getCategories(),
    ]);

    return (
        <section className="w-full p-4 md:p-8 flex flex-col items-center gap-6">
            <div className="w-full max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">{t("shopTitle")}</h1>
                    <p className="text-muted-foreground">{t("shopDesc")}</p>
                </div>

                <ShopFilters
                    categories={categories}
                    pagination={shoesData.pagination}
                    activeCategory={params.category ?? undefined}
                    activeSearch={params.search ?? undefined}
                    activeSort={params.sort ?? undefined}
                />

                <Suspense
                    fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    }
                >
                    <ProductGrid products={shoesData.shoes} />
                </Suspense>

                {shoesData.shoes.length === 0 && (
                    <div className="mt-8 text-center py-12">
                        <p className="text-lg text-muted-foreground mb-4">
                            {products.noProducts}
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            {products.adjustFilters}
                        </p>
                        <div className="inline-flex items-center justify-center">
                            <Link href="/shop">
                                <Button variant="outline">{products.viewAll}</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
