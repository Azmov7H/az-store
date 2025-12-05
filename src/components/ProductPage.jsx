"use client";

import { useState, useContext, useMemo } from "react";
import Image from "next/image";
import { CartContext } from "@/context/ClientLayout";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/**
 * ProductPage component
 * @param {Object} product - Product data from props
 * Features:
 *  - Select color and size
 *  - Quantity selector
 *  - Add to cart with toast notification
 */
export default function ProductPage({ product }) {
  const t = useTranslations("product");
  const cart = useContext(CartContext);

  // State for selected quantity, color, and size
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState(
    product.availableSizes?.[0] || null
  );

  // Memoized calculation for final price with discount
  const finalPrice = useMemo(() => {
    const discount = product.discount || 0;
    return product.price * (1 - discount / 100);
  }, [product.price, product.discount]);

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;

    cart.addItem({
      ...product,
      quantity,
      selectedColor,
      selectedSize,
    });

    toast.success("Product added to cart", {
      description: `${product.title} (${selectedColor} - ${selectedSize})`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Responsive Grid: Image | Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Product Image */}
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] rounded-lg overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title || "Product Image"}
            fill
            className="object-cover rounded-lg"
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            {product.title}
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-2xl md:text-3xl font-bold">
              {finalPrice.toFixed(2)} EG
            </span>

            {product.discount > 0 && (
              <>
                <span className="text-slate-500 line-through text-sm md:text-base">
                  {product.price.toFixed(2)} EG
                </span>
                <Badge variant="destructive">{product.discount}% OFF</Badge>
              </>
            )}
          </div>

          {/* Color Selection */}
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

          {/* Size Selection */}
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

          {/* Quantity Selector */}
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

          {/* Add to Cart */}
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
