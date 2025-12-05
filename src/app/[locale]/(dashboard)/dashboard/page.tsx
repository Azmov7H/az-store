import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getOrders } from "@/lib/services/order-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import type { Order } from "@/types/order";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Dashboard | Ali Store",
    description: "View and manage all orders",
};

interface OrderCardProps {
    order: Order;
    t: any;
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

interface ItemProps {
    label: string;
    value: string | number;
}

export default async function DashboardPage() {
    const t = await getTranslations("dashboard");

    let orders: Order[] = [];
    try {
        orders = await getOrders();
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        orders = [];
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
                <p className="text-muted-foreground">
                    {t("subtitle") || "Manage all customer orders"}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="">
                    <CardHeader className="">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <p className="text-3xl font-bold">{orders.length}</p>
                    </CardContent>
                </Card>

                <Card className="">
                    <CardHeader className="">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <p className="text-3xl font-bold">
                            {orders.filter((o) => o.status === "pending").length}
                        </p>
                    </CardContent>
                </Card>

                <Card className="">
                    <CardHeader className="">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Completed Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <p className="text-3xl font-bold">
                            {orders.filter((o) => o.status === "delivered").length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">{t("noOrders")}</p>
                    </div>
                ) : (
                    orders.map((order) => <OrderCard key={order._id} order={order} t={t} />)
                )}
            </div>
        </div>
    );
}

function OrderCard({ order, t }: OrderCardProps) {
    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500";
            case "confirmed":
            case "processing":
                return "bg-blue-500";
            case "shipped":
                return "bg-purple-500";
            case "delivered":
                return "bg-green-500";
            case "cancelled":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <Card className="border border-border rounded-xl flex flex-col justify-between h-full p-4 hover:shadow-lg transition-shadow">
            <CardHeader className="">
                <CardTitle className="text-lg font-semibold truncate">
                    {order.orderId}
                </CardTitle>
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
                    <div className="grid grid-cols-1 gap-2">
                        {order.products.map((p, idx) => (
                            <div key={idx} className="bg-muted/10 p-2 border rounded-md">
                                <p>
                                    <strong>{t("productName")}:</strong> {p.title}
                                </p>
                                <p>
                                    <strong>{t("price")}:</strong> {p.price} {t("currency")}
                                </p>
                                <p>
                                    <strong>{t("quantity")}:</strong> {p.quantity}
                                </p>
                                {p.selectedColor && (
                                    <p>
                                        <strong>{t("color")}:</strong> {p.selectedColor}
                                    </p>
                                )}
                                {p.selectedSize && (
                                    <p>
                                        <strong>{t("size")}:</strong> {p.selectedSize}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title={t("pricing")}>
                    <Item label={t("subtotal")} value={`${order.subtotal} ${t("currency")}`} />
                    <Item label={t("discount")} value={`${order.discount} ${t("currency")}`} />
                    <Item
                        label={t("total")}
                        value={`${order.total} ${t("currency")}`}
                    />
                </Section>

                <div className="flex items-center justify-between mt-2">
                    <Badge
                        variant="default"
                        className={cn(
                            "text-white px-2 py-1 rounded-full text-xs",
                            getStatusColor(order.status)
                        )}
                    >
                        {t(`status_${order.status}`)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

function Section({ title, children }: SectionProps) {
    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-sm">{title}</h3>
            <Separator className="" />
            {children}
        </div>
    );
}

function Item({ label, value }: ItemProps) {
    return (
        <p>
            <span className="font-semibold">{label}:</span> {value}
        </p>
    );
}
