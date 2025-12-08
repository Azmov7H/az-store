"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, ShieldCheck, RefreshCw, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/hooks/use-cart";
import { analytics } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductAddToCartProps {
    product: Product;
    button:Number | string;
}

export default function ProductAddToCart({ product , button }: ProductAddToCartProps) {
    const t = useTranslations("ProductPage");
    const router = useRouter();
    const { addItem } = useCart();
    const [selectedColor, setSelectedColor] = useState<string>(
        product.availableColors[0] || ""
    );
    const [selectedSize, setSelectedSize] = useState<string>(
        product.availableSizes[0] || ""
    );
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (!selectedColor || !selectedSize) {
            toast.error("Please select both color and size");
            return;
        }

        if (product.stock === 0) {
            toast.error(t("out_of_stock"));
            return;
        }

        if (quantity > product.stock) {
            toast.error(t("only_left", { count: product.stock }));
            return;
        }

        setIsAdding(true);

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 600));

        try {
            addItem({
                id: product.id,
                _id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                discount: product.discount,
                image: product.image,
                selectedColor,
                selectedSize,
                quantity,
                stock: product.stock,
            });

            // Track Add to Cart
            analytics.addToCart(product, quantity, { color: selectedColor, size: selectedSize });

            toast.success(t("add_to_cart"), {
                description: `${quantity} × ${product.title}`,
                action: {
                    label: t("view_cart"),
                    onClick: () => router.push("/cart"),
                },
            });

            setQuantity(1);
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setIsAdding(false);
        }
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity((prev) => prev + 1);
        } else {
            toast.error(t("only_left", { count: product.stock }));
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const isOutOfStock = product.stock === 0;

    return (
        <Card className="p-8 space-y-8 border shadow-lg bg-card/50 backdrop-blur-sm rounded-3xl overflow-visible relative">
            {/* Color Selection */}
            {product.availableColors.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{t("select_color")}</h3>
                        <span className="text-sm text-muted-foreground font-medium">{selectedColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {product.availableColors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2",
                                    selectedColor === color
                                        ? "border-primary bg-primary/10 text-primary scale-105 shadow-sm"
                                        : "border-transparent bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                                )}
                            >
                                {color}
                                {selectedColor === color && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-md">
                                        <Check className="w-3 h-3" />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selection */}
            {product.availableSizes.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{t("select_size")}</h3>
                        <span className="text-sm text-muted-foreground font-medium">{selectedSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {product.availableSizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "relative h-12 min-w-12 px-3 rounded-xl text-sm font-bold transition-all duration-200 border-2 flex items-center justify-center",
                                    selectedSize === size
                                        ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20"
                                        : "border-border bg-background hover:border-primary/50 text-foreground"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity and Actions */}
            <div className="pt-4 space-y-6">
                <div className="flex items-center justify-between bg-secondary/30 p-2 rounded-2xl border border-secondary">
                    <span className="font-medium pl-4 text-sm text-muted-foreground">{t("quantity")}</span>
                    <div className="flex items-center gap-1 bg-background rounded-xl p-1 shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={decrementQuantity}
                            disabled={quantity === 1 || isOutOfStock}
                            className="h-10 w-10 rounded-lg hover:bg-muted"
                        >
                            −
                        </Button>
                        <span className="text-lg font-bold w-12 text-center tabular-nums">
                            {quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={incrementQuantity}
                            disabled={quantity >= product.stock || isOutOfStock}
                            className="h-10 w-10 rounded-lg hover:bg-muted"
                        >
                            +
                        </Button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="default"
                        size="lg"
                        className={cn(
                            "flex-1 h-14 text-lg font-bold rounded-2xl shadow-xl transition-all duration-300",
                            isAdding ? "scale-95 opacity-90" : "hover:scale-[1.02] hover:shadow-primary/30"
                        )}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAdding || !selectedColor || !selectedSize}
                    >
                        {isAdding ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                {t("adding")}
                            </div>
                        ) : isOutOfStock ? (
                            t("out_of_stock")
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {t("add_to_cart")} - {button}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50 text-center">
                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground group">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span>{t("secure_checkout")}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground group">
                    <div className="p-2 rounded-full bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
                        <RefreshCw className="w-4 h-4" />
                    </div>
                    <span>{t("free_returns")}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground group">
                    <div className="p-2 rounded-full bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-4 h-4" />
                    </div>
                    <span>{t("secure_payment")}</span>
                </div>
            </div>
        </Card>
    );
}
