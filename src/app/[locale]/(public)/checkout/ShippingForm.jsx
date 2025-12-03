"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const CITIES = {
  Cairo: ["Downtown", "Zamalek", "Nasr City"],
  Giza: ["Mohandessin", "Dokki", "6th of October"],
  Alexandria: ["Downtown", "Montaza", "Stanley"],
}

export default function ShippingForm({ formData, setFormData, onNext }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === "customerCity") updated.customerDistrict = CITIES[value][0]
      return updated
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input name="customerName" value={formData.customerName} onChange={handleChange} />
          </div>

          <div>
            <Label>Email</Label>
            <Input name="customerEmail" value={formData.customerEmail} onChange={handleChange} />
          </div>

          <div>
            <Label>Phone</Label>
            <Input name="customerPhone" value={formData.customerPhone} onChange={handleChange} />
          </div>

          <div>
            <Label>City</Label>
            <select
              name="customerCity"
              value={formData.customerCity}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              {Object.keys(CITIES).map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>District</Label>
            <select
              name="customerDistrict"
              value={formData.customerDistrict}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              {CITIES[formData.customerCity].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Street</Label>
            <Input name="customerStreet" value={formData.customerStreet} onChange={handleChange} />
          </div>
        </div>

        <Button onClick={onNext}>Continue to Review</Button>
      </CardContent>
    </Card>
  )
}
