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
    <Card className="border border-border rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
           {order.orderId}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Customer Section */}
        <Section title={t("customerInfo")}>
          <Item label={"Name"} value={order.customerName} />
          <Item label={"customerEmail"} value={order.customerEmail} />
          <Item label={"customerPhone"} value={order.customerPhone} />
        </Section>

        {/* Address Section */}
        <Section title={t("address")}>
          <Item label={t("city")} value={order.customerCity} />
          <Item label={t("district")} value={order.customerDistrict} />
          <Item label={t("street")} value={order.customerStreet} />
        </Section>

        {/* Products */}
        <Section title={t("products")}>
          <div className="space-y-2">
            {order.products.map((p, idx) => (
              <Card key={idx} className="bg-muted/40 p-3 border">
                <p><strong>{t("productName")}:</strong> {p.title}</p>
                <p><strong>{t("price")}:</strong> {p.price} {t("currency")}</p>
                <p><strong>{t("quantity")}:</strong> {p.quantity}</p>
                <p><strong>{t("color")}:</strong> {p.selectedColor || t("noValue")}</p>
                <p><strong>{t("size")}:</strong> {p.selectedSize || t("noValue")}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Price Info */}
        <Section title={t("pricing")}>
          <Item label={t("subtotal")} value={`${order.subtotal} ${t("currency")}`} />
          <Item label={t("discount")} value={`${order.discount} ${t("currency")}`} />
          <Item label={t("total")} value={`${order.total} ${t("currency")}`} />
        </Section>

        {/* Status */}
        <div className="flex items-center gap-2">
          <strong>{t("status")}:</strong>
          <Badge variant={order.status === "pending" ? "secondary" : "default"}>
            {t(`status_${order.status}`)}
          </Badge>
        </div>

        {/* Date */}
        <Item
          label={t("createdAt")}
          value={new Date(order.createdAt).toLocaleString()}
        />
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
