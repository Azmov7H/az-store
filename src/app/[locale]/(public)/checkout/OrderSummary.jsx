"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function OrderSummary({ items }) {
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity * (1 - (item.discount || 0) / 100),
        0
    )

    const shipping = subtotal > 50 ? 0 : 10
    const total = subtotal + shipping

    return (
        <Card className="lg:col-span-1 sticky top-20">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                <ScrollArea className="max-h-96 space-y-2">
                    {items.map(item => {
                        const finalPrice = item.price * (1 - (item.discount || 0) / 100)
                        return (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.title} (x{item.quantity})</span>
                                <span>${(finalPrice * item.quantity).toFixed(2)}</span>
                            </div>
                        )
                    })}
                </ScrollArea>

                {/* Calculation */}
                <div className="border-t pt-3 space-y-2">

                    {/* Subtotal */}
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>
                            ${items
                                .reduce(
                                    (sum, item) =>
                                        sum + item.price * item.quantity * (1 - (item.discount || 0) / 100),
                                    0
                                )
                                .toFixed(2)}
                        </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>
                            {subtotal > 50 ? (
                                <Badge variant="success">FREE</Badge>
                            ) : (
                                `$${shipping.toFixed(2)}`
                            )}
                        </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                            ${(subtotal + shipping).toFixed(2)}
                        </span>
                    </div>

                </div>
            </CardContent>
        </Card>


    )
}
