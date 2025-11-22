"use client"
import React, { useEffect, useState } from "react"
import ProductCard from "@/components/ShoeCard"
import ProductDialog from "@/components/ProductDialog"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const [shoes, setShoes] = useState([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const fetchShoes = async () => {
    const res = await fetch("http://localhost:5000/api/shoes")
    const data = await res.json()
    setShoes(data)
  }

  useEffect(() => {
    fetchShoes()
  }, [])

  const handleCreate = () => {
    setSelected(null)
    setOpen(true)
  }

  const handleSubmit = async (form) => {
    if (selected) {
      await fetch(`http://localhost:5000/api/shoes/${selected._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } else {
      await fetch(`http://localhost:5000/api/shoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }

    setOpen(false)
    fetchShoes()
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/shoes/${id}`, { method: "DELETE" })
    fetchShoes()
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Products</h1>
        <Button onClick={handleCreate}>+ Add Product</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shoes.map((shoe) => (
          <ProductCard 
            key={shoe._id} 
            shoe={shoe} 
            onEdit={(s) => { setSelected(s); setOpen(true) }} 
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ProductDialog
        open={open}
        setOpen={setOpen}
        onSubmit={handleSubmit}
        defaultData={selected}
      />
    </div>
  )
}
