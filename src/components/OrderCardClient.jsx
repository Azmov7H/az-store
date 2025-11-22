"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteOrder } from "@/lib/api"
import { toast } from "sonner"
import OrderCard from "./OrderCard"

export default function OrderCardClient({ order }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleDeleted = async (orderId) => {
    try {
      setLoading(true)
      await deleteOrder(orderId)
      toast.warning("Order deleted.")
      router.refresh()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdated = () => {
    router.refresh()
  }

  return (
    <OrderCard
      order={order}
      onDeleted={handleDeleted}
      onUpdated={handleUpdated}
      loading={loading}
    />
  )
}
