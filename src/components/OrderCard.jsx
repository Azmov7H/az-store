"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { fetchProductById } from "@/lib/api"
import OrderDialog from "./OrderDialog"

import {
  Package,
  Phone,
  MapPin,
  CalendarClock,
  Palette,
  Ruler,
  Hash,
} from "lucide-react"
import Image from "next/image"

export default function OrderCard({ order, onUpdated, onDeleted }) {
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const p = await fetchProductById(order.product)
        setProduct(p)
      } catch {}
    })()
  }, [order])

  return (
    <>
      <Card className="w-full border border-border/60 hover:shadow-md transition-all">
        <CardHeader className="flex justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Order #{order._id.slice(-6)}
          </CardTitle>

          <Badge className="flex items-center gap-2" variant="outline">
            <CalendarClock className="w-3 h-3" />
            {new Date(order.createdAt).toLocaleDateString()}
          </Badge>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Product */}
          <div className="flex flex-col items-center justify-center gap-2">
            {product?.image && (
              <Image
              width={300}
              height={300}
              loading="lazy"
                src={product.image}
                alt={product.title}
                className="w-20 h-20 rounded-md object-cover border"
              />
            )}
            <p className="text-xs font-medium text-center">
              {product ? product.title : "Loading product..."}
            </p>
          </div>

          <Separator className="sm:hidden" />

          {/* Customer Info */}
          <div className="flex flex-col gap-1">
            <p className="font-medium flex gap-2 items-center">
              <Package className="w-4 h-4 text-primary" />
              {order.customerName}
            </p>
            <p className="text-sm flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              {order.phone}
            </p>
            <p className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {order.city}, {order.district}, {order.street}
            </p>
          </div>

          <Separator className="sm:hidden" />

          {/* Order Info */}
          <div className="flex flex-col gap-1 text-right sm:text-left">
            <p className="text-sm flex items-center gap-2 justify-end sm:justify-start">
              <Palette className="w-4 h-4 text-primary" />
              Color: <strong>{order.selectedColor}</strong>
            </p>
            <p className="text-sm flex items-center gap-2 justify-end sm:justify-start">
              <Ruler className="w-4 h-4 text-primary" />
              Size: <strong>{order.selectedSize}</strong>
            </p>
            <p className="text-sm">
              Qty: <strong>{order.quantity}</strong>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            View / Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDeleted(order._id)}>
            Delete
          </Button>
        </CardFooter>
      </Card>

      <OrderDialog open={open} setOpen={setOpen} order={order} onUpdated={onUpdated} />
    </>
  )
}
