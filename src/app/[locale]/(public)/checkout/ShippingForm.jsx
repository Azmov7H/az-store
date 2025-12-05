"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

const CITIES = {
  القاهرة: [
    "مدينة نصر",
    "المعادى",
    "التجمع الخامس",
    "المقطم",
    "القاهرة الجديدة",
    "وسط البلد",
    "الزمالك",
    "شبرا",
    "السلام",
    "حدائق القبة",
    "عين شمس",
    "العباسية",
    "حلوان",
    "منشية ناصر",
    "روض الفرج",
    "الوايلى",
    "بولاق",
    "المطرية",
    "المعصرة",
    "المرج"
  ],
  الجيزة: [
    "المهندسين",
    "الدقي",
    "الهرم",
    "الجيزة الجديدة",
    "6 أكتوبر",
    "العمرانية",
    "الشيخ زايد",
    "منشأة القناطر",
    "الوراق",
    "بولاق الدكرور",
    "الصف",
    "حدائق أهرامات",
    "الجيزة الغربية"
  ]
}

export default function ShippingForm({ formData, setFormData, onNext }) {
  const t = useTranslations("ShippingForm")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (name === "customerCity") {
        updated.customerDistrict = (CITIES[value] && CITIES[value][0]) || ""
      }
      return updated
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t("fullName")}</Label>
            <Input name="customerName" value={formData.customerName} onChange={handleChange} />
          </div>

          <div>
            <Label>{t("email")}</Label>
            <Input name="customerEmail" value={formData.customerEmail} onChange={handleChange} />
          </div>

          <div>
            <Label>{t("phone")}</Label>
            <Input name="customerPhone" value={formData.customerPhone} onChange={handleChange} />
          </div>

          <div>
            <Label>{t("city")}</Label>
            <select
              name="customerCity"
              value={formData.customerCity}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              {Object.keys(CITIES).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>{t("district")}</Label>
            <select
              name="customerDistrict"
              value={formData.customerDistrict}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              {(CITIES[formData.customerCity] || []).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>{t("street")}</Label>
            <Input name="customerStreet" value={formData.customerStreet} onChange={handleChange} />
          </div>
        </div>

        <Button onClick={onNext}>{t("continue")}</Button>
      </CardContent>
    </Card>
  )
}
