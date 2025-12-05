"use client"

import { useState, useContext } from "react"
import { CartContext } from "@/context/ClientLayout"
import { useTranslations } from "next-intl"

import ShippingForm from "./ShippingForm"
import ReviewOrder from "./ReviewOrder"
import PaymentStep from "./PaymentStep"
import OrderSummary from "./OrderSummary"

export default function Checkout() {
  const t = useTranslations("Checkout")
  const { items = [], clear = () => {} } = useContext(CartContext)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCity: "القاهرة",
    customerDistrict: "مدينة نصر",
    customerStreet: "",
  })

  if (items.length === 0)
    return <div className="min-h-screen flex items-center justify-center text-2xl">{t("emptyCart")}</div>

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">

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
              clear={clear}
              onBack={() => setStep(2)}
            />
          )}
        </div>

        {/* Order Summary */}
        <OrderSummary items={items} />
      </div>
    </div>
  )
}
