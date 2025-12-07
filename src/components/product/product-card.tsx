"use client";

import { useState, memo, useCallback, lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateFinalPrice, truncate } from "@/lib/utils/format";

// Lazy load the dialog component
const ProductDialog = lazy(() => import("./product-dialog"));

interface ProductCardProps {
    product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { addItem } = useCart();

    const finalPrice = calculateFinalPrice(product.price, product.discount);

    const handleAddToCart = useCallback((quantity: number, color: string, size: string) => {
        addItem({
            id: product.id,
            _id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            discount: product.discount,
            image: product.image,
            selectedColor: color,
            selectedSize: size,
            quantity,
            stock: product.stock,
        });

        toast.success("Product added to cart", {
            description: `${product.title} (${color} - ${size}) • Quantity: ${quantity}`,
        });

        setDialogOpen(false);
    }, [addItem, product]);

    return (
        <>
            <Card className="group overflow-hidden border shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* Product Image */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Link href={`/shop/${product.id}`} aria-label={`View ${product.title}`}>
                        <Image
                            src={product.image || "/placeholder.svg?height=256&width=256"}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {product.discount > 0 && (
                            <Badge className="bg-red-600 text-white">
                                -{product.discount}%
                            </Badge>
                        )}
                        {product.isNew && (
                            <Badge className="bg-green-600 text-white">New</Badge>
                        )}
                    </div>

                    {/* Stock Status */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-lg">
                                Out of Stock
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <CardHeader>
                    <CardTitle className="text-lg font-bold line-clamp-1">
                        {product.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {truncate(product.description, 60)}
                    </CardDescription>
                </CardHeader>

                {/* Price */}
                <CardContent>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                            {finalPrice.toFixed(2)} EG
                        </span>
                        {product.discount > 0 && (
                            <span className="text-sm line-through opacity-50">
                                {product.price.toFixed(2)} EG
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    {product.rating > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span>{product.rating.toFixed(1)}</span>
                            {product.reviews > 0 && (
                                <span className="opacity-60">({product.reviews})</span>
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Add to Cart Button */}
                <CardFooter>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        disabled={product.stock === 0}
                        className="w-full"
                        aria-label={product.stock === 0 ? "Out of stock" : `Add ${product.title} to cart`}
                    >
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                </CardFooter>
            </Card>

            {/* Product Dialog - Lazy Loaded */}
            {dialogOpen && (
                <Suspense fallback={<div className="sr-only">Loading product details...</div>}>
                    <ProductDialog
                        open={dialogOpen}
                        product={product}
                        onClose={() => setDialogOpen(false)}
                        onAddToCart={handleAddToCart}
                    />
                </Suspense>
            )}
        </>
    );
});

export default ProductCard;
