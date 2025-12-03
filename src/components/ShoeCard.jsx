"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="p-2">
        <CardTitle className="text-lg font-bold">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-40 object-cover rounded-md mb-2"
        />
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <p className="mt-2 font-semibold">Price: {product.price} EGP</p>
        {product.discount > 0 && (
          <p className="text-sm text-red-500">Discount: {product.discount}%</p>
        )}
        <p className="text-sm mt-1">Stock: {product.stock}</p>
        <p className="text-sm mt-1">
          Sizes: {product.availableSizes?.join(", ")}
        </p>
        <p className="text-sm mt-1">
          Colors: {product.availableColors?.join(", ")}
        </p>
      </CardContent>
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
