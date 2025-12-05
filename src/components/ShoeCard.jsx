"use client"

import React, { memo } from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Helper function to truncate long text
function truncate(text, length = 40) {
  if (!text) return ""
  return text.length > length ? text.slice(0, length) + "..." : text
}

// Main ProductCard component
function ProductCardComponent({ product, onEdit, onDelete }) {
  return (
    <Card className="flex flex-col border rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
      {/* Card header with product title */}
      <CardHeader className="p-2">
        <CardTitle className="text-lg font-bold">{product.title}</CardTitle>
      </CardHeader>

      {/* Card content: image and product details */}
      <CardContent className="flex flex-col gap-2">
        <Image
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-cover rounded-md"
          width={400}
          height={160}
          placeholder="blur"
          blurDataURL="/placeholder.png" // Placeholder for better UX
        />

        {/* Product description */}
        <p className="text-sm text-muted-foreground">
          {truncate(product.description)}
        </p>

        {/* Price */}
        <p className="mt-1 font-semibold">Price: {product.price} EGP</p>

        {/* Discount, only if available */}
        {product.discount > 0 && (
          <p className="text-sm text-red-500">Discount: {product.discount}%</p>
        )}

        {/* Stock */}
        <p className="text-sm mt-1">Stock: {product.stock}</p>

        {/* Sizes, only if available */}
        {product.availableSizes && (
          <p className="text-sm mt-1">
            Sizes: {product.availableSizes.join(", ")}
          </p>
        )}

        {/* Colors, only if available */}
        {product.availableColors && (
          <p className="text-sm mt-1">
            Colors: {product.availableColors.join(", ")}
          </p>
        )}
      </CardContent>

      {/* Card footer with action buttons */}
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

// Export memoized component to prevent unnecessary re-renders
export default memo(ProductCardComponent)
