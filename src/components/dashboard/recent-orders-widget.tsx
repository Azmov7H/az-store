"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, Box, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function RecentOrdersWidget({ orders }: { orders: Order[] }) {
    const t = useTranslations("dashboard");
    const recentOrders = orders.slice(0, 5);

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
                            <div key={order._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
                                        <span className="text-xs text-muted-foreground hidden sm:inline-block">
                                            #{order.orderId.slice(-6).toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-bold">{order.total} EG</span>
                                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${getStatusColor(order.status)} border`}>
                                        {t(`status_${order.status}` as any)}
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
