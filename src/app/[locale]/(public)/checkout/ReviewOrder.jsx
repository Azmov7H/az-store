"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export default function ReviewOrder({ formData, items, onBack, onNext }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="font-bold">Shipping To:</p>
          <p>{formData.customerName}</p>
          <p>{formData.customerStreet}</p>
          <p>{formData.customerDistrict}, {formData.customerCity}</p>
          <p>{formData.customerEmail}</p>
          <p>{formData.customerPhone}</p>
        </div>

        <div>
          <p className="font-bold mt-4">Order Items:</p>
          <ScrollArea className="max-h-64 space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.title} × {item.quantity}</span>
                <span>${(item.price * item.quantity * (1 - (item.discount || 0)/100)).toFixed(2)}</span>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={onBack}>Back</Button>
          <Button onClick={onNext}>Proceed to Payment</Button>
        </div>
      </CardContent>
    </Card>
  )
}
