"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "../context/CartContext"
import { toast } from "sonner"
export default function AddToCartButton({ product, selectedColor, selectedSize, quantity = 1 }) {
  const { addToCart } = useCart()

  const handleAdd = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a color and size")
      return
    }
    addToCart(product, quantity, selectedColor, selectedSize)
    toast.success("Product added to cart")
  }

  return (
    <Button className="w-full" onClick={handleAdd}>
      Add to Cart
    </Button>
  )
}
