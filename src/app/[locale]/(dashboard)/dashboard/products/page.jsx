"use client"

import { useEffect, useState } from "react"
import DashboardProductCard from "@/components/dashboard/dashboard-product-card"
import ProductEditDialog from "@/components/dashboard/product-edit-dialog"
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
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => { setSelected(null); setOpen(true) }} className="w-full sm:w-auto">
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-lg" />
          ))}
        </div>
      ) : shoes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
          <Button onClick={() => { setSelected(null); setOpen(true) }} className="mt-4">
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {shoes.map((shoe) => (
            <DashboardProductCard
              key={shoe._id}
              product={shoe}
              onEdit={() => { setSelected(shoe); setOpen(true) }}
              onDelete={() => handleDelete(shoe._id)}
            />
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <ProductEditDialog
        open={open}
        setOpen={setOpen}
        onSubmit={handleSubmit}
        defaultData={selected || {}}
      />
    </div>
  )
}
