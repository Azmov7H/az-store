"use client"
import React, { useEffect, useState } from "react"
import ProductCard from "@/components/ShoeCard"
import ProductDialog from "@/components/ProductDialog"
import { getShoes, createShoe, updateShoe, deleteShoe } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner" // أو أي مكتبة toast تستخدمها

export default function ProductsPage() {
  const [shoes, setShoes] = useState([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchShoes = async () => {
    try {
      setLoading(true)
      const data = await getShoes()
      setShoes(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load products.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShoes()
  }, [])

  const handleCreate = () => {
    setSelected(null)
    setOpen(true)
  }

  const handleSubmit = async (form) => {
    try {
      if (selected) {
        await updateShoe(selected._id, form)
        toast.success("Product updated!")
      } else {
        await createShoe(form)
        toast.success("Product created!")
      }
      setOpen(false)
      fetchShoes()
    } catch (err) {
      console.error(err)
      toast.error("Failed to submit product.")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await deleteShoe(id)
      toast.success("Product deleted!")
      fetchShoes()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete product.")
    }
  }

  return (
    <div className="p-6 ">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-xl font-bold">Products</h1>
        <Button onClick={handleCreate}>+ Add Product</Button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-gray-500">Loading...</div>
      ) : shoes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products found.</div>
      ) : (
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shoes.map((shoe) => (
            <ProductCard
              key={shoe._id}
              shoe={shoe}
              onEdit={(s) => { setSelected(s); setOpen(true) }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ProductDialog
        open={open}
        setOpen={setOpen}
        onSubmit={handleSubmit}
        defaultData={selected || {}}
      />
    </div>
  )
}
