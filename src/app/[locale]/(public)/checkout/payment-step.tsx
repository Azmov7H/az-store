"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { calculateFinalPrice } from "@/lib/utils/format";
import { createOrder } from "@/lib/services/order-service";
import { analytics } from "@/lib/analytics";
import type { CartItem } from "@/types/cart";
import type { CreateOrderData } from "@/types/order";

interface FormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCity: string;
    customerDistrict: string;
    customerStreet: string;
}

interface PaymentStepProps {
    formData: FormData;
    items: CartItem[];
    clearCart: () => void;
    onBack: () => void;
}

export default function PaymentStep({
    formData,
    items,
    clearCart,
    onBack,
}: PaymentStepProps) {
    const t = useTranslations("PaymentStep");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState("");

    const subtotal = items.reduce((sum, item) => {
        const finalPrice = calculateFinalPrice(item.price, item.discount);
        return sum + finalPrice * item.quantity;
    }, 0);

    const shipping = items.length >= 3 ? 0 : 40;
    const total = subtotal + shipping;

    const handleSubmit = async () => {
        setLoading(true);

        const orderData: CreateOrderData = {
            ...formData,
            products: items.map((item) => ({
                shoeId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
            })),
            subtotal,
            discount: 0,
            total,
        };

        try {
            const order = await createOrder(orderData);
            setOrderId(order.orderId);
            toast.success(t("success"));

            // Track successful purchase
            analytics.checkoutSuccess(order.orderId, total);

            clearCart();

            // Redirect to home after 3 seconds
            setTimeout(() => {
                router.push("/");
            }, 3000);
        } catch (error) {
            console.error("Order creation failed:", error);
            toast.error(t("error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="">
            <CardHeader className="">
                <CardTitle className="">{t("title")}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {orderId ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                        <div className="text-green-600 dark:text-green-400 mb-2">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-lg font-bold text-green-700 dark:text-green-300">
                            {t("orderId", { id: orderId })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Redirecting to homepage...
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">
                                Payment on delivery (Cash on Delivery)
                            </p>
                            <p className="text-sm">
                                You will pay <span className="font-bold">{total.toFixed(2)} EGP</span> when
                                you receive your order.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="outline" size="default" onClick={onBack} disabled={loading} className="min-w-24">
                                {t("back")}
                            </Button>
                            <Button onClick={handleSubmit} variant="default" size="default" disabled={loading} className="flex-1">
                                {loading ? t("processing") : t("completePurchase")}
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
