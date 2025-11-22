"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

export default function ProductDialog({ open, setOpen, onSubmit, defaultData }) {

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
    if (defaultData) {
      setForm(defaultData)
    }
  }, [defaultData])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{defaultData ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3">
          <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
          <Input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
          <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <Input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
          <Input name="availableColors" placeholder="Colors (comma separated)" value={form.availableColors} onChange={handleChange} />
          <Input name="availableSizes" placeholder="Sizes (comma separated)" value={form.availableSizes} onChange={handleChange} />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>{defaultData ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
