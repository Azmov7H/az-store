import { getOrders } from "@/lib/services/order-service";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import { User, MapPin, Box } from "lucide-react";
import type { Order } from "@/types/order";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
    const t = await getTranslations("ordersPage");
    let orders: Order[] = [];

    try {
        orders = await getOrders();
    } catch (error) {
        console.error("Failed to fetch orders:", error);
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
                <Badge variant="outline" className="px-3 py-1 font-medium bg-background/50 backdrop-blur">
                    {t("total_suffix", { count: orders.length })}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-3xl border border-dashed border-border/50">
                        <Box className="w-16 h-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{t("no_orders_title")}</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            {t("no_orders_desc")}
                        </p>
                    </div>
                ) : (
                    orders.map((order) => <OrderCard key={order._id} order={order} t={t} />)
                )}
            </div>
        </div>
    );
}

function OrderCard({ order, t }: { order: Order; t: any }) {
    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "pending": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            case "confirmed":
            case "processing": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "shipped": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
            case "delivered": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "cancelled": return "text-red-500 bg-red-500/10 border-red-500/20";
            default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
        }
    };

    return (
        <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-5 border-b border-border/50 bg-secondary/20">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className="mb-2 font-mono text-xs opacity-70">
                            #{order.orderId.slice(-6).toUpperCase()}
                        </Badge>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            {order.total} {t("currency")}
                            {order.shipping > 0 && (
                                <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                                    (+{order.shipping} ship)
                                </span>
                            )}
                        </CardTitle>
                    </div>
                    <Badge variant="outline" className={cn("px-3 py-1 capitalize font-bold shadow-sm border", getStatusColor(order.status))}>
                        {t(`status_${order.status}`) || order.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
                {/* Customer Info */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-semibold">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                    </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Shipping Info */}
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-secondary text-secondary-foreground">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-medium">{order.customerCity}, {order.customerDistrict}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{order.customerStreet}</p>
                    </div>
                </div>

                {/* Products Preview */}
                <div className="bg-muted/30 rounded-xl p-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {t("items")} ({order.products.length})
                    </p>
                    <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                        {order.products.map((p, idx) => (
                            <div key={idx} className="flex justify-between text-sm group/item">
                                <span className="truncate flex-1 font-medium text-foreground/80 group-hover/item:text-primary transition-colors">
                                    <span className="text-xs text-muted-foreground mr-2 font-mono">{p.quantity}x</span>
                                    {p.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-muted-foreground font-medium">
                    <span>{new Date(order.createdAt || Date.now()).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</span>
                    <span>{t("details")} →</span>
                </div>
            </CardContent>
        </Card>
    );
}
