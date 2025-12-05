"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export default function PaymentStep({ formData, items, clear, onBack }) {
  const t = useTranslations("PaymentStep")
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity * (1 - (item.discount || 0)/100),
    0
  )
  const shipping = items.length >= 3 ? 0 : 40;
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
  selectedColor: item.selectedColor, 
  selectedSize: item.selectedSize, 
  discount: item.discount || 0
      })),
      subtotal,
      total,
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      })

      const data = await res.json()
      if (res.ok) {
        setOrderId(data.data.orderId)
        toast.success(t("success"))
        clear()
      } else {
        toast.error(data.error || t("error"))
      }
    } catch (err) {
      console.error(err)
      toast.error(t("error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>{t("title")}</CardTitle></CardHeader>

      <CardContent className="flex gap-2 items-center">
        {orderId && <p className="text-green-600 font-bold">{t("orderId", { id: orderId })}</p>}
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? t("processing") : t("completePurchase")}
        </Button>
        <Button variant="secondary" onClick={onBack}>{t("back")}</Button>
      </CardContent>
    </Card>
  )
}
