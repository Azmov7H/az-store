"use client";

import { useState, useContext, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { CartContext } from "@/context/ClientLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function ProductPage({ product }) {
  const t = useTranslations("product");
  const { addItem } = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes?.[0] || null);

  const finalPrice = useMemo(() => {
    const discount = product.discount || 0;
    return product.price * (1 - discount / 100);
  }, [product.price, product.discount]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;

    addItem({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });

    toast.success("Product added to cart", {
      description: `${product.title} (${selectedColor} - ${selectedSize})`,
    });
  };

  const isDisabled = !selectedColor || !selectedSize;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative w-full h-[450px] rounded-lg overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover rounded-lg"
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-slate-600 dark:text-slate-300">{product.description}</p>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xl font-bold">{finalPrice.toFixed(2)} EG</span>
            {product.discount > 0 && (
              <>
                <span className="text-slate-500 line-through">{product.price.toFixed(2)} EG</span>
                <Badge variant="destructive">{product.discount}% OFF</Badge>
              </>
            )}
          </div>

          {/* Colors */}
          {product.availableColors?.length > 0 && (
            <div>
              <p className="font-semibold mb-2">{t("color")}</p>
              <div className="flex gap-3 flex-wrap">
                {product.availableColors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.availableSizes?.length > 0 && (
            <div>
              <p className="font-semibold mb-2">{t("size")}</p>
              <div className="flex gap-3 flex-wrap">
                {product.availableSizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-4">
            <Button onClick={() => setQuantity(Math.max(1, quantity - 1))} variant="outline">-</Button>
            <span className="px-6 py-2 border rounded">{quantity}</span>
            <Button onClick={() => setQuantity(quantity + 1)} variant="outline">+</Button>
          </div>

          {/* Add to Cart */}
          <Button onClick={handleAddToCart} disabled={isDisabled} className="w-full py-3 font-bold">
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
