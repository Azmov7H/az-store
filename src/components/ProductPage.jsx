"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import { CartContext } from "@/context/ClientLayout";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProductPage({ product }) {
  const t = useTranslations("product");
  const cart = useContext(CartContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes?.[0] || null);

  const discount = product.discount || 0;
  const finalPrice = product.price * (1 - discount / 100);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;

    cart.addItem({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });

    toast.success("تمت إضافة المنتج إلى السلة", {
      description: `${product.title} (${selectedColor} - ${selectedSize})`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Product Image */}
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] rounded-lg overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title || "Image Product"}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            {product.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {product.description}
          </p>

          {/* Price Block */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xl md:text-3xl font-bold">{finalPrice.toFixed(2)} EG</span>

            {discount > 0 && (
              <>
                <span className="text-slate-500 line-through text-sm md:text-base">
                  {product.price.toFixed(2)} EG
                </span>
                <Badge variant="destructive">{discount}% OFF</Badge>
              </>
            )}
          </div>

          {/* Color Select */}
          {product.availableColors?.length > 0 && (
            <div>
              <p className="font-semibold mb-2">{t("color")}</p>
              <div className="flex gap-3 flex-wrap">
                {product.availableColors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                    className="px-4 py-2"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Size Select */}
          {product.availableSizes?.length > 0 && (
            <div>
              <p className="font-semibold mb-2">{t("size")}</p>
              <div className="flex gap-3 flex-wrap">
                {product.availableSizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="px-4 py-2"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              variant="outline"
              className="px-4 py-2"
            >
              -
            </Button>

            <span className="px-6 py-2 border rounded text-lg">{quantity}</span>

            <Button
              onClick={() => setQuantity(quantity + 1)}
              variant="outline"
              className="px-4 py-2"
            >
              +
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full py-3 text-lg font-bold"
          >
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
