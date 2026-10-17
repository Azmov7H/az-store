"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Box, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Order } from "@/types/order";
import { ORDER_STATUS_COLORS } from "@/lib/order-status";

export default function RecentOrdersWidget({ orders }: { orders: Order[] }) {
    const t = useTranslations("dashboard");
    const recentOrders = orders.slice(0, 5);

    return (
        <Card className="h-full border-dashed border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {t("recentActivity")}
                </CardTitle>
                <Link href="/dashboard/orders" className="text-xs text-primary hover:underline flex items-center">
                    {t("viewAll")} <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground bg-muted/30 rounded-xl">
                        <Box className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">{t("noRecentOrders")}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.orderId} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
                                        <span className="text-xs text-muted-foreground hidden sm:inline-block">
                                            #{order.orderId.slice(-6).toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-bold">{order.total} EGP</span>
                                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${ORDER_STATUS_COLORS[order.status]} border`}>
                                        {t(`status_${order.status}`)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
