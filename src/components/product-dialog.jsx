"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "@/components/add-to-cart-button"

/**
 * ProductDialog component
 * Shows a modal with product details, options, and add-to-cart functionality
 * @param {object} product - Product object
 * @param {boolean} open - Dialog open state
 * @param {function} onClose - Function to close the dialog
 * @param {function} onAddToCart - Function to add product to cart
 */
export default function ProductDialog({ product, open, onClose, onAddToCart }) {
  const t = useTranslations("carts")

  // State for quantity, selected color, and size
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0] || null)
  const [selectedSize, setSelectedSize] = useState(product.availableSizes?.[0] || null)

  const discount = product.discount || 0
  const finalPrice = product.price * (1 - discount / 100)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto p-4">
        {/* Header with title and short description */}
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{product.title}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {product.description.length > 60
              ? product.description.slice(0, 60) + "..."
              : product.description}
          </DialogDescription>
        </DialogHeader>

        {/* Main content grid: Image & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

          {/* Product Image */}
          <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Price with discount badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold">${finalPrice.toFixed(2)}</span>
              {discount > 0 && (
                <>
                  <span className="line-through opacity-60">${product.price.toFixed(2)}</span>
                  <Badge className="bg-red-600 text-white">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Color Selection */}
            {product.availableColors?.length > 0 && (
              <div>
                <label className="text-sm font-semibold">{t("color")}</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {product.availableColors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      className="text-sm"
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
                <label className="text-sm font-semibold">{t("size")}</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {product.availableSizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="text-sm"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="text-sm font-semibold">{t("quantity")}</label>
              <div className="flex gap-2 items-center mt-2">
                <Button
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center border rounded"
                />
                <Button variant="outline" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
            </div>

            {/* Trust Badges / Info */}
            <div className="space-y-1 text-sm opacity-80">
              <p>✓ {t("free_shipping")}</p>
              <p>✓ {t("money_back")}</p>
              <p>✓ {t("secure_checkout")}</p>
            </div>
          </div>
        </div>

        {/* Footer: Add to Cart */}
        <DialogFooter className="mt-4">
          <AddToCartButton
            onClick={() => onAddToCart(quantity, selectedColor, selectedSize)}
            disabled={product.stock === 0}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
