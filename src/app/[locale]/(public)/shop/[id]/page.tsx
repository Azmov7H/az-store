import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getProductById, getProducts } from "@/lib/services/product-service";
import { calculateFinalPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProductCard from "@/components/product/product-card";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";

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

    const finalPrice = calculateFinalPrice(product.price, product.discount);

    return {
        title: `${product.title} | Ali Store`,
        description: product.description,
        openGraph: {
            title: product.title,
            description: product.description,
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 600,
                    alt: product.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: product.title,
            description: product.description,
            images: [product.image],
        },
    };
}

async function RelatedProducts({ category, currentId }: { category: string; currentId: string }) {
    const data = await getProducts({ category, limit: 4 });
    const related = data.shoes.filter((p) => p.id !== currentId).slice(0, 4);

    if (related.length === 0) return null;

    return (
        <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    const finalPrice = calculateFinalPrice(product.price, product.discount);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2">
                    <li>
                        <Link href="/" className="hover:text-foreground">
                            Home
                        </Link>
                    </li>
                    <li>/</li>
                    <li>
                        <Link href="/shop" className="hover:text-foreground">
                            Shop
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-foreground font-medium">{product.title}</li>
                </ol>
            </nav>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Product Image */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                    {product.discount > 0 && (
                        <Badge className="absolute top-4 right-4 bg-red-600 text-white text-lg px-4 py-2">
                            -{product.discount}%
                        </Badge>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                        <Badge variant="secondary" className="text-sm">
                            {product.category}
                        </Badge>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold">${finalPrice.toFixed(2)}</span>
                        {product.discount > 0 && (
                            <span className="text-2xl line-through opacity-60">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    {product.rating > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`text-2xl ${i < Math.floor(product.rating)
                                                ? "text-yellow-500"
                                                : "text-gray-300"
                                            }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {product.rating.toFixed(1)} ({product.reviews} reviews)
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock Status */}
                    {product.stock === 0 ? (
                        <Badge variant="destructive" className="w-fit">
                            Out of Stock
                        </Badge>
                    ) : product.stock < 10 ? (
                        <Badge variant="secondary" className="w-fit">
                            Only {product.stock} left in stock
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="w-fit bg-green-100 text-green-800">
                            In Stock
                        </Badge>
                    )}

                    {/* Colors & Sizes */}
                    <div className="grid grid-cols-2 gap-4">
                        {product.availableColors.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">Available Colors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.availableColors.map((color) => (
                                        <Badge key={color} variant="outline">
                                            {color}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.availableSizes.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2">Available Sizes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.availableSizes.map((size) => (
                                        <Badge key={size} variant="outline">
                                            {size}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <Button size="lg" className="w-full md:w-auto" asChild>
                        <Link href="/shop">Back to Shop</Link>
                    </Button>
                </div>
            </div>

            {/* Related Products */}
            <Suspense
                fallback={
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
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
        </div>
    );
}
