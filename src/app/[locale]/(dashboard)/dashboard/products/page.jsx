"use client"

import { useEffect, useState } from "react"
import ProductCard from "@/components/ShoeCard"
import ProductDialog from "@/components/ProductDialog"
import { getShoes, createShoe, updateShoe, deleteShoe } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
  const [shoes, setShoes] = useState([])
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchShoes = async () => {
    try {
      setLoading(true)
      const data = await getShoes()
      setShoes(data.shoes)
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
        toast.success("Product updated successfully.")
      } else {
        await createShoe(form)
        toast.success("Product created successfully.")
      }
      setOpen(false)
      fetchShoes()
    } catch (err) {
      console.error(err)
      toast.error("Failed to save product.")
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteShoe(id)
      toast.success("Product deleted.")
      fetchShoes()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete product.")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6  bg-background z-10 p-2">
  <h1 className="text-xl font-bold">Products</h1>
  <Button onClick={handleCreate}>+ Add Product</Button>
</div>


      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-lg" />
          ))}
        </div>
      ) : shoes.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {shoes.map((shoe) => (
    <ProductCard
      key={shoe._id}
      product={shoe}
      onEdit={() => { setSelected(shoe); setOpen(true) }}
      onDelete={() => handleDelete(shoe._id)}
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
