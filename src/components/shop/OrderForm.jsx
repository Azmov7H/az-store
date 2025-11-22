"use client"

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

export default function OrderForm({ product, initialLocations }) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: Object.keys(initialLocations)[0] || "",
    district: "",
    street: "",
    selectedColor: product.availableColors[0],
    selectedSize: product.availableSizes[0],
    quantity: 1,
  });

  const [locations] = useState(initialLocations);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === "city") setForm(prev => ({ ...prev, district: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: product._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Order placed successfully!");
      setForm(prev => ({ ...prev, customerName: "", phone: "", street: "", quantity: 1 }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Full Name" required />
      <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />
      <Input name="street" value={form.street} onChange={handleChange} placeholder="Street" required />

      {/* City */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border px-3 py-2 rounded">{form.city || "Select City"}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>City</DropdownMenuLabel>
          {Object.keys(locations).map(c => (
            <DropdownMenuItem key={c} onClick={() => setForm(prev => ({ ...prev, city: c, district: "" }))}>{c}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* District */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border px-3 py-2 rounded">{form.district || "Select District"}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>District</DropdownMenuLabel>
          {form.city && locations[form.city]?.map(d => (
            <DropdownMenuItem key={d} onClick={() => setForm(prev => ({ ...prev, district: d }))}>{d}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Color */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border px-3 py-2 rounded">{form.selectedColor}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Color</DropdownMenuLabel>
          {product.availableColors.map(color => (
            <DropdownMenuItem key={color} onClick={() => setForm(prev => ({ ...prev, selectedColor: color }))}>{color}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Size */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border px-3 py-2 rounded">{form.selectedSize}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Size</DropdownMenuLabel>
          {product.availableSizes.map(size => (
            <DropdownMenuItem key={size} onClick={() => setForm(prev => ({ ...prev, selectedSize: size }))}>{size}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button type="submit" className="bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition">
        Confirm Order
      </Button>
    </form>
  );
}
