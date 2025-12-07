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
            <CardHeader className="">
                <CardTitle className="">{t("title")}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <ScrollArea className="max-h-96">
                    <div className="space-y-3 pr-4">
                        {items.map((item) => {
                            const originalPrice = item.price;
                            const finalPrice = calculateFinalPrice(item.price, item.discount);
                            const itemTotal = finalPrice * item.quantity;
                            const hasDiscount = item.discount > 0;

                            return (
                                <div
                                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                                    className="flex justify-between text-sm pb-3 border-b last:border-0"
                                >
                                    <div className="flex-1 pr-2">
                                        <p className="font-medium truncate">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.selectedColor}, {item.selectedSize} × {item.quantity}
                                        </p>
                                        {hasDiscount && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                                                    -{item.discount}%
                                                </Badge>
                                                <span className="text-xs line-through text-muted-foreground">
                                                    {(originalPrice * item.quantity).toFixed(2)} EGP
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold whitespace-nowrap">
                                            {itemTotal.toFixed(2)} EGP
                                        </span>
                                        {hasDiscount && (
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                Save {((originalPrice - finalPrice) * item.quantity).toFixed(2)} EGP
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <Separator className="" />

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{t("subtotal")}</span>
                        <span>{subtotal.toFixed(2)} EGP</span>
                    </div>

                    {/* Show total discount savings if any items have discounts */}
                    {items.some(item => item.discount > 0) && (
                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                            <span>Total Discount Savings</span>
                            <span>
                                -{items.reduce((total, item) => {
                                    const originalPrice = item.price * item.quantity;
                                    const finalPrice = calculateFinalPrice(item.price, item.discount) * item.quantity;
                                    return total + (originalPrice - finalPrice);
                                }, 0).toFixed(2)} EGP
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm">
                        <span>{t("shipping")}</span>
                        {shipping === 0 ? (
                            <Badge variant="default" className="bg-green-600">{t("free")}</Badge>
                        ) : (
                            <span>{shipping.toFixed(2)} EGP</span>
                        )}
                    </div>

                    <Separator className="" />

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
