"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { updateOrder, fetchProductById } from "@/lib/api"

export default function OrderDialog({ open, setOpen, order, onUpdated }) {

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    district: "",
    street: "",
    selectedColor: "",
    selectedSize: "",
    quantity: 1,
  })

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (order) {
      setForm({
        customerName: order.customerName || "",
        phone: order.phone || "",
        city: order.city || "Cairo",
        district: order.district || "",
        street: order.street || "",
        selectedColor: order.selectedColor || "",
        selectedSize: order.selectedSize || "",
        quantity: order.quantity || 1,
      })

      ;(async () => {
        try {
          const prod = await fetchProductById(order.product)
          setProduct(prod)
        } catch {}
      })()
    }
  }, [order])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateOrder(order._id, { ...form })
      toast.success("Order updated successfully")
      onUpdated && onUpdated()
      setOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Order #{order?._id?.slice(-6)}
          </DialogTitle>
        </DialogHeader>

        {/* PRODUCT INFO */}
        {product && (
          <Card className="border bg-muted/30">
            <CardContent className="flex gap-4 items-center p-3">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
              )}
              <div>
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-muted-foreground">
                  Color: {form.selectedColor} • Size: {form.selectedSize}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

          {/* Customer Name */}
          <div className="flex flex-col gap-1">
            <Label>Customer Name</Label>
            <Input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <Label>Phone</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-1">
            <Label>City</Label>
            <Input
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          {/* District */}
          <div className="flex flex-col gap-1">
            <Label>District</Label>
            <Input
              name="district"
              value={form.district}
              onChange={handleChange}
            />
          </div>

          {/* Street */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label>Street</Label>
            <Input
              name="street"
              value={form.street}
              onChange={handleChange}
            />
          </div>

          {/* Color */}
          <div className="flex flex-col gap-1">
            <Label>Selected Color</Label>
            <Input
              name="selectedColor"
              value={form.selectedColor}
              onChange={handleChange}
            />
          </div>

          {/* Size */}
          <div className="flex flex-col gap-1">
            <Label>Selected Size</Label>
            <Input
              name="selectedSize"
              value={form.selectedSize}
              onChange={handleChange}
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1">
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              min={1}
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* FOOTER */}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
