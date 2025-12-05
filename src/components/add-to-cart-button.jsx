"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

/**
 * AddToCartButton component
 * Displays a full-width button for adding products to the cart
 * Shows "Out of Stock" if disabled
 * @param {boolean} disabled - Whether the button is disabled
 * @param {function} onClick - Click handler function
 */
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
