"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function OrderForm({ product, onClose }) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "Cairo",
    district: "",
    street: "",
    selectedColor: product.availableColors[0],
    selectedSize: product.availableSizes[0],
    quantity: 1,
  })

  const [locations, setLocations] = useState({}) // هنجلب منها districts

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/locations`)
        const data = await res.json()
        setLocations(data)
      } catch (err) {
        console.error("Failed to fetch locations", err)
      }
    }
    fetchLocations()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === "city") setForm((prev) => ({ ...prev, district: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: product._id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success("Order placed!")
      onClose && onClose()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        type="text"
        name="customerName"
        placeholder="Full Name"
        value={form.customerName}
        onChange={handleChange}
        required
      />
      <Input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
      />

      {/* City */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border px-3 py-2 rounded">{form.city}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>City</DropdownMenuLabel>
          {locations && Object.keys(locations).map((c) => (
            <DropdownMenuItem key={c} onClick={() => setForm((prev) => ({ ...prev, city: c, district: "" }))}>
              {c}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* District */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border px-3 py-2 rounded">
          {form.district || "Select District"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>District</DropdownMenuLabel>
          {form.city && locations[form.city]?.map((d) => (
            <DropdownMenuItem key={d} onClick={() => setForm((prev) => ({ ...prev, district: d }))}>
              {d}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        type="text"
        name="street"
        placeholder="Street"
        value={form.street}
        onChange={handleChange}
        required
      />

      {/* Color */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border px-3 py-2 rounded">{form.selectedColor}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Color</DropdownMenuLabel>
          {product.availableColors.map((color) => (
            <DropdownMenuItem key={color} onClick={() => setForm((prev) => ({ ...prev, selectedColor: color }))}>
              {color}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Size */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border px-3 py-2 rounded">{form.selectedSize}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Size</DropdownMenuLabel>
          {product.availableSizes.map((size) => (
            <DropdownMenuItem key={size} onClick={() => setForm((prev) => ({ ...prev, selectedSize: size }))}>
              {size}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button type="submit" className="bg-primary text-white">Confirm Order</Button>
    </form>
  )
}
