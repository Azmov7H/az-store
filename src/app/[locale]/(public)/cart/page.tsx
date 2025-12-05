"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCart } from "@/hooks/use-cart";
import { calculateFinalPrice } from "@/lib/utils/format";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CartPage() {
    const t = useTranslations("carts");
    const { items, removeItem, updateQuantity } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg">
                {t("loading")}
            </div>
        );
    }

    const subtotal = items.reduce((sum, item) => {
        const finalPrice = calculateFinalPrice(item.price, item.discount);
        return sum + finalPrice * item.quantity;
    }, 0);

    const shipping = items.length >= 3 ? 0 : 40;
    const total = subtotal + shipping;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-10">{t("cart")}</h1>

            {items.length === 0 ? (
                <Card className="p-12 text-center">
                    <CardTitle className="text-xl mb-6">{t("empty")}</CardTitle>
                    <Button asChild>
                        <Link href="/shop">{t("continue")}</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">{t("items")}</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <ScrollArea className="h-max pr-3">
                                <div className="space-y-6">
                                    {items.map((item) => {
                                        const finalPrice = calculateFinalPrice(
                                            item.price,
                                            item.discount
                                        );
                                        return (
                                            <Card
                                                key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                                                className="border p-4 flex gap-4"
                                            >
                                                <div className="relative w-28 h-28 rounded-md overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="112px"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-lg truncate">
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <Badge variant="secondary">
                                                            {t("color")}: {item.selectedColor}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            {t("size")}: {item.selectedSize}
                                                        </Badge>
                                                    </div>

                                                    <p className="mt-3 font-bold text-lg">
                                                        {(finalPrice * item.quantity).toFixed(2)} EGP
                                                    </p>

                                                    <div className="flex items-center gap-3 mt-4">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity - 1,
                                                                    item.selectedColor,
                                                                    item.selectedSize
                                                                )
                                                            }
                                                            disabled={item.quantity === 1}
                                                            aria-label="Decrease quantity"
                                                        >
                                                            −
                                                        </Button>

                                                        <span className="text-md font-semibold w-8 text-center">
                                                            {item.quantity}
                                                        </span>

                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity + 1,
                                                                    item.selectedColor,
                                                                    item.selectedSize
                                                                )
                                                            }
                                                            aria-label="Increase quantity"
                                                        >
                                                            +
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            className="ml-auto"
                                                            onClick={() =>
                                                                removeItem(
                                                                    item.id,
                                                                    item.selectedColor,
                                                                    item.selectedSize
                                                                )
                                                            }
                                                        >
                                                            {t("remove")}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card className="h-fit sticky top-20">
                        <CardHeader>
                            <CardTitle className="text-2xl">{t("orderSummary")}</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-md">
                                <span>{t("subtotal")}</span>
                                <span>{subtotal.toFixed(2)} EGP</span>
                            </div>

                            <div className="flex justify-between text-md">
                                <span>{t("shipping")}</span>
                                <span>
                                    {shipping === 0 ? (
                                        <Badge className="bg-green-600">{t("free")}</Badge>
                                    ) : (
                                        `${shipping.toFixed(2)} EGP`
                                    )}
                                </span>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-bold text-xl">
                                <span>{t("total")}</span>
                                <span>{total.toFixed(2)} EGP</span>
                            </div>

                            <Button className="w-full" asChild>
                                <Link href="/checkout">{t("checkout")}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
