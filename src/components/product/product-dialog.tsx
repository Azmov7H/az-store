"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Product } from "@/types/product";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateFinalPrice } from "@/lib/utils/format";

interface ProductDialogProps {
    product: Product;
    open: boolean;
    onClose: () => void;
    onAddToCart: (quantity: number, color: string, size: string) => void;
}

export default function ProductDialog({
    product,
    open,
    onClose,
    onAddToCart,
}: ProductDialogProps) {
    const t = useTranslations("carts");

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(
        product.availableColors?.[0] || ""
    );
    const [selectedSize, setSelectedSize] = useState(
        product.availableSizes?.[0] || ""
    );

    const finalPrice = calculateFinalPrice(product.price, product.discount);

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) return;
        onAddToCart(quantity, selectedColor, selectedSize);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-4">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">
                        {product.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        {product.description.length > 60
                            ? product.description.slice(0, 60) + "..."
                            : product.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Product Image */}
                    <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Price */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-2xl font-bold">
                                ${finalPrice.toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                                <>
                                    <span className="line-through opacity-60">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <Badge className="bg-red-600 text-white">
                                        -{product.discount}%
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Stock Status */}
                        {product.stock === 0 && (
                            <Badge variant="destructive">Out of Stock</Badge>
                        )}
                        {product.stock > 0 && product.stock < 10 && (
                            <Badge variant="secondary">
                                Only {product.stock} left in stock
                            </Badge>
                        )}

                        {/* Color Selection */}
                        {product.availableColors?.length > 0 && (
                            <div>
                                <label className="text-sm font-semibold block mb-2">
                                    {t("color")}
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.availableColors.map((color) => (
                                        <Button
                                            key={color}
                                            variant={selectedColor === color ? "default" : "outline"}
                                            onClick={() => setSelectedColor(color)}
                                            className="text-sm"
                                            aria-label={`Select ${color} color`}
                                        >
                                            {color}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {product.availableSizes?.length > 0 && (
                            <div>
                                <label className="text-sm font-semibold block mb-2">
                                    {t("size")}
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {product.availableSizes.map((size) => (
                                        <Button
                                            key={size}
                                            variant={selectedSize === size ? "default" : "outline"}
                                            onClick={() => setSelectedSize(size)}
                                            className="text-sm"
                                            aria-label={`Select size ${size}`}
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div>
                            <label className="text-sm font-semibold block mb-2">
                                {t("quantity")}
                            </label>
                            <div className="flex gap-2 items-center">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </Button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                    }
                                    className="w-16 text-center border rounded px-2 py-1"
                                    min="1"
                                    max={product.stock}
                                    aria-label="Quantity"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={quantity >= product.stock}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="space-y-1 text-sm opacity-80">
                            <p>✓ {t("free_shipping")}</p>
                            <p>✓ {t("money_back")}</p>
                            <p>✓ {t("secure_checkout")}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="mt-4">
                    <Button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || !selectedColor || !selectedSize}
                        className="w-full sm:w-auto"
                    >
                        {product.stock === 0 ? "Out of Stock" : t("add_to_cart")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
