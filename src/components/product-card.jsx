"use client"

import { useState, useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CartContext } from "@/context/ClientLayout"
import { toast } from "sonner"
import ProductDialog from "./product-dialog"
import AddToCartButton from "@/components/add-to-cart-button"

/**
 * ProductCard component
 * Displays a product with image, price, discount, and add-to-cart functionality
 * Opens a dialog for selecting options (color, size, quantity)
 * @param {object} product - Product data
 */
export default function ProductCard({ product }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const cart = useContext(CartContext)

  // Fallback if cart context is undefined
  const addItem = cart?.addItem || (() => {})

  const discount = product.discount || 0
  const finalPrice = product.price * (1 - discount / 100)

  return (
    <>
      <Card className="group overflow-hidden border shadow-sm hover:shadow-lg transition">
        {/* Product Image with hover scale effect */}
        <div className="relative h-64 w-full overflow-hidden">
          <Link href={`shop/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg?height=256&width=256&query=shoe"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-red-600 text-white">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Product Title & Short Description */}
        <CardHeader>
          <CardTitle className="text-lg font-bold">{product.title}</CardTitle>
          <CardDescription>
            {product.description.length > 40
              ? product.description.slice(0, 40) + "..."
              : product.description}
          </CardDescription>
        </CardHeader>

        {/* Price Section */}
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{finalPrice.toFixed(2)} EG</span>
            {discount > 0 && (
              <span className="text-sm line-through opacity-50">
                {product.price.toFixed(2)} EG
              </span>
            )}
          </div>
        </CardContent>

        {/* Add to Cart Button */}
        <CardFooter>
          <AddToCartButton
            disabled={product.stock === 0}
            onClick={() => setDialogOpen(true)}
          />
        </CardFooter>
      </Card>

      {/* Product Dialog for options */}
      {dialogOpen && (
        <ProductDialog
          open={dialogOpen}
          product={product}
          onClose={() => setDialogOpen(false)}
          onAddToCart={(quantity, color, size) => {
            // Add selected product to cart
            addItem({
              ...product,
              quantity,
              selectedColor: color,
              selectedSize: size,
            })

            // Show success toast
            toast.success("Product added to cart", {
              description: `${product.title} (${color} - ${size}) • Quantity: ${quantity}`,
            })

            // Close dialog
            setDialogOpen(false)
          }}
        />
      )}
    </>
  )
}
