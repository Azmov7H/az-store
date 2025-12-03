"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export default function AddToCartButton({ disabled, onClick }) {
  const t = useTranslations("carts")

  return (
    <Button
      className="w-full"
      disabled={disabled}
      onClick={onClick}
    >
      {disabled ? t("out_of_stock") : t("add_to_cart")}
    </Button>
  )
}
