"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function PaymentStep({ formData, items, clear, onBack }) {
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity * (1 - (item.discount || 0)/100),
    0
  )
  const shipping = items.length >= 3 ? 0 : 10
  const total = subtotal + shipping

  const handleSubmit = async () => {
    setLoading(true)

    const orderData = {
      ...formData,
      products: items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        discount: item.discount || 0,
      })),
      subtotal,
      total,
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    })

    const data = await res.json()
    if (res.ok) {
      setOrderId(data.data.orderId)
      toast.success("تم طلب المنتج بنجاح")
      clear()
    } else {
      toast.error(data.error || "Failed to create order")
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader><CardTitle>Confirm & Pay</CardTitle></CardHeader>

      <CardContent className="flex gap-2 items-center">
        {orderId && <p className="text-green-600 font-bold">Order Success! ID: {orderId}</p>}
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Complete Purchase"}
        </Button>
        <Button variant="secondary" onClick={onBack}>Back</Button>
      </CardContent>
    </Card>
  )
}
