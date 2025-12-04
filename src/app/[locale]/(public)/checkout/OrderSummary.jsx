"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function OrderSummary({ items }) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity * (1 - (item.discount || 0)/100),
    0
  )
  const shipping = items.length >= 3 ? 0 : 10
  const total = subtotal + shipping

  return (
    <Card className="lg:col-span-1 sticky top-20">
      <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>

      <CardContent className="space-y-3">
        <ScrollArea className="max-h-96 space-y-2">
          {items.map(item => {
            const finalPrice = item.price * (1 - (item.discount || 0)/100)
            return (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.title} ({item.color}, {item.size}) × {item.quantity}</span>
                <span>${(finalPrice * item.quantity).toFixed(2)}</span>
              </div>
            )
          })}
        </ScrollArea>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? <Badge variant="success">FREE</Badge> : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
