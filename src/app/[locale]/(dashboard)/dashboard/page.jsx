// app/[locale]/orders/page.jsx

import { getOrders } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {getTranslations} from 'next-intl/server';
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function OrdersPage({ params }) {
  const t = await getTranslations( "dashboard")

  let orders = []
  try {
    const res = await getOrders()
    orders = res?.data?.orders || []
  } catch {
    orders = []
  }

  return (
    <main className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length === 0 ? (
          <p className="text-muted-foreground">{t("noOrders")}</p>
        ) : (
          orders.map((o) => <OrderCard key={o._id} order={o} t={t} />)
        )}
      </div>
    </main>
  )
}

function OrderCard({ order , t}) {
  return (
<Card className="border border-border rounded-xl flex flex-col justify-between h-full p-4">
  <CardHeader>
    <CardTitle className="text-lg font-semibold truncate">{order.orderId}</CardTitle>
  </CardHeader>

  <CardContent className="flex flex-col gap-4 text-sm">
    <Section title={t("customerInfo")}>
      <Item label={t("name")} value={order.customerName} />
      <Item label={t("email")} value={order.customerEmail} />
      <Item label={t("phone")} value={order.customerPhone} />
    </Section>

    <Section title={t("address")}>
      <Item label={t("city")} value={order.customerCity} />
      <Item label={t("district")} value={order.customerDistrict} />
      <Item label={t("street")} value={order.customerStreet} />
    </Section>

    <Section title={t("products")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {order.products.map((p, idx) => (
          <div key={idx} className="bg-muted/10 p-2 border rounded-md">
            <p><strong>{t("productName")}:</strong> {p.title}</p>
            <p><strong>{t("price")}:</strong> {p.price} {t("currency")}</p>
            <p><strong>{t("quantity")}:</strong> {p.quantity}</p>
            <p><strong>{t("color")}:</strong> {p.selectedColors || t("noValue")}</p>
            <p><strong>{t("size")}:</strong> {p.selectedSizes || t("noValue")}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title={t("pricing")}>
      <Item label={t("subtotal")} value={`${order.subtotal} ${t("currency")}`} />
      <Item label={t("discount")} value={`${order.discount} ${t("currency")}`} />
      <Item label={t("total")} value={`${order.total} ${t("currency")}`} />
    </Section>

    <div className="flex items-center justify-between mt-2">
      <Badge
        className={cn(
          "text-white px-2 py-1 rounded-full text-xs",
          order.status === "pending" ? "bg-yellow-500" :
          order.status === "completed" ? "bg-green-500" :
          "bg-red-500"
        )}
      >
        {t(`status_${order.status}`)}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {new Date(order.createdAt).toLocaleDateString()} 
      </span>
    </div>
  </CardContent>
</Card>

  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">{title}</h3>
      <Separator />
      {children}
    </div>
  )
}

function Item({ label, value }) {
  return (
    <p>
      <span className="font-semibold">{label}:</span> {value}
    </p>
  )
}
