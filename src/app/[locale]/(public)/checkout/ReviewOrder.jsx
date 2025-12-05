"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export default function ReviewOrder({ formData, items, onBack, onNext }) {
  const t = useTranslations("ReviewOrder")

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity * (1 - (item.discount || 0)/100),
    0
  )
  const shipping = 40
  const total = subtotal + shipping

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="font-bold">{t("shippingTo")}:</p>
          <p>{formData.customerName}</p>
          <p>{formData.customerStreet}</p>
          <p>{formData.customerDistrict}, {formData.customerCity}</p>
          <p>{formData.customerEmail}</p>
          <p>{formData.customerPhone}</p>
        </div>

        <div>
          <p className="font-bold mt-4">{t("orderItems")}:</p>
          <ScrollArea className="max-h-64 space-y-2">
            {items.map((item) => {
              const finalPrice = item.price * (1 - (item.discount || 0)/100) * item.quantity
              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.title} × {item.quantity} ({item.color}, {item.size})</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              )
            })}
          </ScrollArea>
        </div>

        <div className="border-t pt-2 space-y-1 text-sm">
          <div className="flex justify-between"><span>{t("subtotal")}</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>{t("shipping")}</span><span>${shipping.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg"><span>{t("total")}</span><span>${total.toFixed(2)}</span></div>
        </div>

        <div className="flex gap-4 mt-4">
          <Button variant="secondary" onClick={onBack}>{t("back")}</Button>
          <Button onClick={onNext}>{t("proceedPayment")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
