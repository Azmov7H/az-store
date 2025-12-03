"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "./ui/scroll-area"

export default function ProductDialog({ open, setOpen, onSubmit, defaultData }) {
  const t = useTranslations("products")

  const [form, setForm] = useState({
    title: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    sizes: "",
    colors: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    if (defaultData) {
      setForm({
        title: defaultData.title || "",
        price: defaultData.price || "",
        discount: defaultData.discount || "",
        stock: defaultData.stock || "",
        category: defaultData.category || "",
        sizes: defaultData.availableSizes?.join(", ") || "",
        colors: defaultData.availableColors?.join(", ") || "",
        description: defaultData.description || "",
        image: defaultData.image || "",
      })
    }
  }, [defaultData])

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value })
  }

  const handleSubmit = () => {
    if (!form.title || !form.price) return

    const payload = {
      ...form,
      availableSizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
      availableColors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
    }

    onSubmit(payload)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{defaultData?._id ? t("editProduct") : t("addProduct")}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="grid gap-4 py-4">

          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label>{t("productName")}</Label>
            <Input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={t("enterProductName")}
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("price")}</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder={t("enterPrice")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("discount")}</Label>
              <Input
                type="number"
                value={form.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
                placeholder={t("enterDiscount")}
              />
            </div>
          </div>

          {/* Stock & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("stock")}</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                placeholder={t("enterStock")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("category")}</Label>
              <Input
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder={t("enterCategory")}
              />
            </div>
          </div>

          {/* Sizes & Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("sizes")}</Label>
              <Input
                value={form.sizes}
                onChange={(e) => handleChange("sizes", e.target.value)}
                placeholder={t("enterSizesCommaSeparated")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("colors")}</Label>
              <Input
                value={form.colors}
                onChange={(e) => handleChange("colors", e.target.value)}
                placeholder={t("enterColorsCommaSeparated")}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label>{t("description")}</Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder={t("enterDescription")}
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-2">
            <Label>{t("imageUrl")}</Label>
            <Input
              value={form.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder={t("enterImageUrl")}
            />
          </div>

        </ScrollArea>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {defaultData?._id ? t("update") : t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
