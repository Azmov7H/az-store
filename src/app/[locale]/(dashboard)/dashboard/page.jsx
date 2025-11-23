// app/orders/page.jsx

import { getOrders } from "@/lib/api"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  let orders = []
  try {
    orders = await getOrders()
    console.log(orders)
  } catch (err) {
    // handle server error (render fallback)
    orders = []
  }

  return (
    <main className="w-full itmes-center p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders found.</p>
        ) : (
          orders.map((o) => <OrderRow key={o._id} order={o} />)
        )}
      </div>
    </main>
  )
}

// small client wrapper to allow update/delete interactions
import React from "react"
import OrderCardClient from "@/components/OrderCardClient"

function OrderRow({ order }) {
  return <OrderCardClient order={order} />
}
