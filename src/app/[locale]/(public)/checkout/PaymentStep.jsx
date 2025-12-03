"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

export default function PaymentStep({ formData, items, clear, onBack }) {
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity * (1 - (item.discount || 0)/100),
    0
  )

  const shipping = subtotal > 50 ? 0 : 10
  const total = subtotal + shipping

  const handleSubmit = async () => {
    setLoading(true)

    const orderData = {
      ...formData,
      products: items,
      subtotal,
      total
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    })

    const data = await res.json()
    setOrderId(data?.data?.orderId)
    clear()
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader><CardTitle>Confirm & Pay</CardTitle></CardHeader>

      <CardContent className="space-y-4">
        {orderId && (
          <p className="text-green-600 font-bold">Order Success! ID: {orderId}</p>
        )}

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : "Complete Purchase"}
        </Button>

        <Button variant="secondary" onClick={onBack}>Back</Button>
      </CardContent>
    </Card>
  )
}
