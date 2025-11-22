"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createShoe, updateShoe } from "@/lib/api"

export default function ShoeForm({ editData, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
    availableColors: "",
    availableSizes: "",
  })

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title,
        price: editData.price,
        category: editData.category,
        description: editData.description,
        image: editData.image,
        availableColors: editData.availableColors.join(","),
        availableSizes: editData.availableSizes.join(","),
      })
    }
  }, [editData])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      ...form,
      availableColors: form.availableColors.split(","),
      availableSizes: form.availableSizes.split(","),
    }

    if (editData) {
      await updateShoe(editData._id, payload)
    } else {
      await createShoe(payload)
    }

    onSuccess()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{editData ? "Edit Shoe" : "Add Shoe"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">

          <div>
            <Label>Title</Label>
            <Input name="title" value={form.title} onChange={handleChange} />
          </div>

          <div>
            <Label>Price</Label>
            <Input name="price" value={form.price} onChange={handleChange} />
          </div>

          <div>
            <Label>Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} />
          </div>

          <div>
            <Label>Description</Label>
            <Input name="description" value={form.description} onChange={handleChange} />
          </div>

          <div>
            <Label>Image URL</Label>
            <Input name="image" value={form.image} onChange={handleChange} />
          </div>

          <div>
            <Label>Available Colors (comma separated)</Label>
            <Input name="availableColors" value={form.availableColors} onChange={handleChange} />
          </div>

          <div>
            <Label>Available Sizes (comma separated)</Label>
            <Input name="availableSizes" value={form.availableSizes} onChange={handleChange} />
          </div>

          <Button type="submit">
            {editData ? "Update Shoe" : "Create Shoe"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}
