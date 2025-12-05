"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { calculateFinalPrice } from "@/lib/utils/format";
import type { CartItem } from "@/types/cart";

interface OrderSummaryProps {
    items: CartItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
    const t = useTranslations("OrderSummary");

    const subtotal = items.reduce((sum, item) => {
        const finalPrice = calculateFinalPrice(item.price, item.discount);
        return sum + finalPrice * item.quantity;
    }, 0);

    const shipping = items.length >= 3 ? 0 : 40;
    const total = subtotal + shipping;

    return (
        <Card className="lg:col-span-1 sticky top-20 h-fit">
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <ScrollArea className="max-h-96">
                    <div className="space-y-2 pr-4">
                        {items.map((item) => {
                            const finalPrice = calculateFinalPrice(item.price, item.discount);
                            const itemTotal = finalPrice * item.quantity;
                            return (
                                <div
                                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                                    className="flex justify-between text-sm"
                                >
                                    <div className="flex-1 pr-2">
                                        <p className="font-medium truncate">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.selectedColor}, {item.selectedSize} × {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-semibold whitespace-nowrap">
                                        {itemTotal.toFixed(2)} EGP
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <Separator />

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{t("subtotal")}</span>
                        <span>{subtotal.toFixed(2)} EGP</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>{t("shipping")}</span>
                        {shipping === 0 ? (
                            <Badge className="bg-green-600">{t("free")}</Badge>
                        ) : (
                            <span>{shipping.toFixed(2)} EGP</span>
                        )}
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                        <span>{t("total")}</span>
                        <span>{total.toFixed(2)} EGP</span>
                    </div>
                </div>

                {items.length >= 3 && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            🎉 Free shipping applied!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
