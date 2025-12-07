import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getProductById, getProducts } from "@/lib/services/product-service";
import { getTranslations } from "next-intl/server";
import { calculateFinalPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/product-card";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import ProductAddToCart from "@/components/product/product-add-to-cart";
import ProductViewTracker from "@/components/product/product-view-tracker";
import { Star, ChevronRight, Home } from "lucide-react";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: `${product.title} | Ali Store`,
        description: product.description,
        openGraph: {
            title: product.title,
            description: product.description,
            images: [{ url: product.image, width: 800, height: 600, alt: product.title }],
        },
    };
}

async function RelatedProducts({ category, currentId }: { category: string; currentId: string }) {
    const data = await getProducts({ category, limit: 4 });
    const related = data.shoes.filter((p) => p.id !== currentId).slice(0, 4);
    const t = await getTranslations("ProductPage");

    if (related.length === 0) return null;

    return (
        <section className="mt-24 pb-12">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold tracking-tight">{t("you_might_like")}</h2>
                <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {related.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const t = await getTranslations("ProductPage");
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    const finalPrice = calculateFinalPrice(product.price, product.discount);

    return (
        <div className="min-h-screen bg-neutral-50/50 dark:bg-background">
            {/* Breadcrumb Header */}
            <div className="w-full border-b bg-background/50 backdrop-blur-sm sticky top-[64px] z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <Home className="w-4 h-4" /> {t("home")}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        <Link href="/shop" className="hover:text-primary transition-colors">
                            {t("shop")}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Product Image Section */}
                    <div className="relative group perspective-1000">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl border border-border/50 transition-all duration-500 hover:shadow-primary/10">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />

                            {/* Floating Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-3">
                                {product.discount > 0 && (
                                    <Badge variant="destructive" className="px-4 py-1.5 text-base font-bold shadow-lg animate-fadeIn">
                                        {t("save_percent", { percent: product.discount })}
                                    </Badge>
                                )}
                                {product.isNew && (
                                    <Badge className="bg-blue-600 text-white px-4 py-1.5 text-base font-bold shadow-lg animate-fadeIn animation-delay-200">
                                        {t("new_arrival")}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <Badge variant="secondary" className="px-3 py-1 font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                                    {product.category}
                                </Badge>
                                {product.rating > 0 && (
                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{product.rating.toFixed(1)}</span>
                                        <span className="text-muted-foreground">{t("reviews", { count: product.reviews })}</span>
                                    </div>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
                                {product.title}
                            </h1>

                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    {finalPrice.toFixed(2)} EG
                                </span>
                                {product.discount > 0 && (
                                    <span className="text-xl text-muted-foreground line-through decoration-2 decoration-destructive/30">
                                        {product.price.toFixed(2)} EG
                                    </span>
                                )}
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Inventory Status */}
                        <div className="flex items-center gap-3 py-4 border-y border-border/50">
                            {product.stock === 0 ? (
                                <div className="flex items-center gap-2 text-destructive font-bold">
                                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                                    {t("out_of_stock")}
                                </div>
                            ) : product.stock < 10 ? (
                                <div className="flex items-center gap-2 text-orange-500 font-bold animate-pulse">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                    {t("only_left", { count: product.stock })}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-green-500 font-bold">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                                    {t("in_stock")}
                                </div>
                            )}
                        </div>

                        {/* Add to Cart Component */}
                        <ProductAddToCart product={product} />
                    </div>
                </div>

                {/* Related Products */}
                <Suspense
                    fallback={
                        <section className="mt-24">
                            <h2 className="text-2xl font-bold mb-6">Loading related products...</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        </section>
                    }
                >
                    <RelatedProducts category={product.category} currentId={product.id} />
                </Suspense>
                <ProductViewTracker product={product} />
            </div>
        </div>
    );
}
