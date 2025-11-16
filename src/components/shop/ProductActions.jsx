"use client"

import { Button } from "@/components/ui/button"
import { Sheet,SheetClose, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import OrderForm from "./OrderForm"
import AddToCartButton from "./AddToCartButton"

export default function ProductActions({ product }) {
  return (
    <div className="flex flex-col gap-4">
      <AddToCartButton product={product} />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            Buy Now – ${product.price}
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full max-w-md">
          {/* SheetHeader */}
          <SheetHeader>
            <SheetTitle>Order Form</SheetTitle>
          </SheetHeader>

          <OrderForm product={product} onClose={() => {}} />

          <SheetFooter>
            {/* Close button */}
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
