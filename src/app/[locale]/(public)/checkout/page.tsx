"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/hooks/use-cart";

import ShippingForm from "./shipping-form";
import ReviewOrder from "./review-order";
import PaymentStep from "./payment-step";
import OrderSummary from "./order-summary";

interface FormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCity: string;
    customerDistrict: string;
    customerStreet: string;
}

export default function CheckoutPage() {
    const t = useTranslations("Checkout");
    const { items, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerCity: "القاهرة",
        customerDistrict: "مدينة نصر",
        customerStreet: "",
    });

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{t("emptyCart")}</h1>
                    <p className="text-muted-foreground">
                        Add some products to your cart to checkout
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`w-16 h-1 ${step > s ? "bg-primary" : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-16 mt-2 text-sm">
                        <span className={step >= 1 ? "font-semibold" : "text-muted-foreground"}>
                            Shipping
                        </span>
                        <span className={step >= 2 ? "font-semibold" : "text-muted-foreground"}>
                            Review
                        </span>
                        <span className={step >= 3 ? "font-semibold" : "text-muted-foreground"}>
                            Payment
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Steps */}
                    <div className="lg:col-span-2 space-y-6">
                        {step === 1 && (
                            <ShippingForm
                                formData={formData}
                                setFormData={setFormData}
                                onNext={() => setStep(2)}
                            />
                        )}
                        {step === 2 && (
                            <ReviewOrder
                                formData={formData}
                                items={items}
                                onBack={() => setStep(1)}
                                onNext={() => setStep(3)}
                            />
                        )}
                        {step === 3 && (
                            <PaymentStep
                                formData={formData}
                                items={items}
                                clearCart={clearCart}
                                onBack={() => setStep(2)}
                            />
                        )}
                    </div>

                    {/* Order Summary */}
                    <OrderSummary items={items} />
                </div>
            </div>
        </div>
    );
}
