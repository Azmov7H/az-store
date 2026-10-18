"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useTranslations } from "next-intl";
import { calculateFinalPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import ProductDialog from "@/components/product/product-dialog";
import type { Product } from "@/types/product";

export default function StickyBuyBar({ product }: { product: Product }) {
    const t = useTranslations("carts");
    const { addItem } = useCart();
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(
        product.availableColors?.[0] || ""
    );
    const [selectedSize, setSelectedSize] = useState(
        product.availableSizes?.[0] || ""
    );
    const finalPrice = calculateFinalPrice(product.price, product.discount);
    const isOutOfStock = product.stock === 0;
    const ready = Boolean(selectedColor && selectedSize);

    const handleAddToCart = () => {
        if (!ready || isOutOfStock) return;
        addItem({
            id: product.id,
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
        setOpen(false);
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 p-4 lg:hidden z-20">
                <div className="max-w-7xl mx-auto px-4 flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">
                            {finalPrice.toFixed(2)} EGP
                        </span>
                        {product.discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                                {product.price.toFixed(2)} EGP
                            </span>
                        )}
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        disabled={isOutOfStock || !ready}
                        className="w-full h-12"
                    >
                        {isOutOfStock ? t("outOfStock") : t("add_to_cart")}
                    </Button>
                    {!ready && (
                        <p className="text-xs text-muted-foreground text-center">
                            {t("select_color")} & {t("select_size")}
                        </p>
                    )}
                </div>
            </div>

            <ProductDialog
                open={open}
                product={product}
                onClose={() => setOpen(false)}
                onAddToCart={handleAddToCart}
            />
        </>
    );
}
