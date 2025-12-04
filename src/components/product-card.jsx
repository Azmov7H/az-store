"use client"

import { useState, useContext } from "react"
import Image from "next/image"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { CartContext } from "@/context/ClientLayout"
import { toast } from "sonner"
import ProductDialog from "./product-dialog"
import AddToCartButton from "@/components/add-to-cart-button"
import Link from "next/link"

export default function ProductCard({ product }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const cart = useContext(CartContext)

//fallback
  const addItem = cart?.addItem || (() => {})

  const discount = product.discount || 0
  const finalPrice = product.price * (1 - discount / 100)

  return (
    <>
      <Card className="group overflow-hidden border shadow-sm hover:shadow-lg transition">
        
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden">
          <Link href={`shop/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg?height=256&width=256&query=shoe"}
              alt={product.title}
              fill
              className="object-cover transition group-hover:scale-110"
            />
          </Link>

          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-red-600 text-white">
              -{discount}%
            </Badge>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-lg font-bold">{product.title}</CardTitle>
          <CardDescription>
  {product.description.length > 40
    ? product.description.slice(0, 40) + "..."
    : product.description}
</CardDescription>

        </CardHeader>

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

        <CardFooter>
          <AddToCartButton
            disabled={product.stock === 0}
            onClick={() => setDialogOpen(true)}
          />
        </CardFooter>
      </Card>

      {/* Dialog */}
      {dialogOpen && (
        <ProductDialog
          open={dialogOpen}
          product={product}
          onClose={() => setDialogOpen(false)}
          onAddToCart={(quantity, color, size) => {

            addItem({
              ...product,
              quantity,
              selectedColor: color,
              selectedSize: size
            })

            toast.success("تمت إضافة المنتج إلى السلة", {
              description: `${product.title} (${color} - ${size}) • العدد: ${quantity}`
            })

            setDialogOpen(false)
          }}
        />
      )}
    </>
  )
}
