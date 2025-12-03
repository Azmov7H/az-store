"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import { CartContext } from "@/context/ClientLayout";
import { useTranslations } from "next-intl";

// ShadCN UI
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
    <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
      {/* Product Image */}
      <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title || "Image Product"}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-slate-600 dark:text-slate-300">{product.description}</p>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">${finalPrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-slate-500 line-through">${product.price.toFixed(2)}</span>
          )}
          {discount > 0 && <Badge variant="destructive">{discount}% OFF</Badge>}
        </div>

        {/* Color Selection */}
        {product.availableColors?.length > 0 && (
          <div>
            <p className="font-semibold mb-2">{t("color")}</p>
            <div className="flex gap-3">
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

        {/* Size Selection */}
        {product.availableSizes?.length > 0 && (
          <div>
            <p className="font-semibold mb-2">{t("size")}</p>
            <div className="flex gap-3">
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
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            variant="outline"
          >
            -
          </Button>
          <span className="px-4 py-2 border rounded">{quantity}</span>
          <Button onClick={() => setQuantity(quantity + 1)} variant="outline">
            +
          </Button>
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          className="w-full py-3 text-lg font-bold"
        >
          {t("addToCart")}
        </Button>
      </div>
    </div>
  );
}
