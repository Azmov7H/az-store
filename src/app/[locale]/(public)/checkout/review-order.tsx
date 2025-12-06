"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { calculateFinalPrice } from "@/lib/utils/format";
import type { CartItem } from "@/types/cart";

interface FormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCity: string;
    customerDistrict: string;
    customerStreet: string;
}

interface ReviewOrderProps {
    formData: FormData;
    items: CartItem[];
    onBack: () => void;
    onNext: () => void;
}

export default function ReviewOrder({
    formData,
    items,
    onBack,
    onNext,
}: ReviewOrderProps) {
    const t = useTranslations("ReviewOrder");

    const subtotal = items.reduce((sum, item) => {
        const finalPrice = calculateFinalPrice(item.price, item.discount);
        return sum + finalPrice * item.quantity;
    }, 0);

    const shipping = items.length >= 3 ? 0 : 40;
    const total = subtotal + shipping;

    return (
        <Card className="">
            <CardHeader className="">
                <CardTitle className="">{t("title")}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Shipping Information */}
                <div>
                    <h3 className="font-bold text-lg mb-2">{t("shippingTo")}:</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-1">
                        <p className="font-semibold">{formData.customerName}</p>
                        <p className="text-sm">{formData.customerStreet}</p>
                        <p className="text-sm">
                            {formData.customerDistrict}, {formData.customerCity}
                        </p>
                        <p className="text-sm text-muted-foreground">{formData.customerEmail}</p>
                        <p className="text-sm text-muted-foreground">{formData.customerPhone}</p>
                    </div>
                </div>

                {/* Order Items */}
                <div>
                    <h3 className="font-bold text-lg mb-2">{t("orderItems")}:</h3>
                    <ScrollArea className="max-h-64">
                        <div className="space-y-2">
                            {items.map((item) => {
                                const finalPrice = calculateFinalPrice(item.price, item.discount);
                                const itemTotal = finalPrice * item.quantity;
                                return (
                                    <div
                                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                                        className="flex justify-between items-center text-sm p-2 bg-muted rounded"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.selectedColor}, {item.selectedSize} × {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-semibold">{itemTotal.toFixed(2)} EGP</span>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                <Separator className="" />

                {/* Price Summary */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{t("subtotal")}</span>
                        <span>{subtotal.toFixed(2)} EGP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>{t("shipping")}</span>
                        <span>{shipping === 0 ? "FREE" : `${shipping.toFixed(2)} EGP`}</span>
                    </div>
                    <Separator className="" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>{t("total")}</span>
                        <span>{total.toFixed(2)} EGP</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <Button variant="outline" size="default" onClick={onBack} className="flex-1">
                        {t("back")}
                    </Button>
                    <Button onClick={onNext} variant="default" size="default" className="flex-1">
                        {t("proceedPayment")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
