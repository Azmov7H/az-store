"use client";

import { useTranslations } from "next-intl";
import { calculateFinalPrice } from "@/lib/utils/format";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/product-card";
import ProductAddToCart from "@/components/product/product-add-to-cart";
import ProductViewTracker from "@/components/product/product-view-tracker";
import StickyBuyBar from "@/components/product/sticky-buy-bar";
import type { Product } from "@/types/product";

interface ProductPageClientProps {
    product: Product;
    related: Product[];
}

export default function ProductPageClient({ product, related }: ProductPageClientProps) {
    const t = useTranslations("ProductPage");
    const finalPrice = calculateFinalPrice(product.price, product.discount);

    return (
        <div className="min-h-screen bg-neutral-50/50 dark:bg-background">
            {/* Breadcrumb Header */}
            <div className="w-full border-b bg-background/50 backdrop-blur-sm sticky top-[var(--header-height)] z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                            <span aria-hidden="true">🏠</span> {t("home")}
                        </Link>
                        <span aria-hidden="true">›</span>
                        <Link href="/shop" className="hover:text-primary transition-colors">
                            {t("shop")}
                        </Link>
                        <span aria-hidden="true">›</span>
                        <span className="text-foreground font-bold truncate max-w-[200px]">{product.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Product Image Section */}
                    <div className="relative group">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl border border-border/50 transition-all duration-500 hover:shadow-primary/10">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>

                        {/* Background Decor */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

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

                    {/* Product Info Section */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Badge variant="secondary" className="px-3 py-1 font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                                {product.category}
                            </Badge>
                            {product.rating > 0 && (
                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                    <span className="text-yellow-400" aria-hidden="true">★</span>
                                    <span>{product.rating.toFixed(1)}</span>
                                    <span className="text-muted-foreground">{t("reviews", { count: product.reviews })}</span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                            {product.title}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                {finalPrice.toFixed(2)} EGP
                            </span>
                            {product.discount > 0 && (
                                <span className="text-xl text-muted-foreground line-through decoration-2 decoration-destructive/30">
                                    {product.price.toFixed(2)} EGP
                                </span>
                            )}
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>

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
                        <ProductAddToCart product={product} button={finalPrice.toFixed(2)} />
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="mt-24 pb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-bold tracking-tight">{t("you_might_like")}</h2>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {related.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
                <ProductViewTracker product={product} />
                <StickyBuyBar product={product} />
            </div>
        </div>
    );
}
