import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getOrders } from "@/lib/services/order-service";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Order } from "@/types/order";

import RecentOrdersWidget from "../../../../components/dashboard/recent-orders-widget";
import LowStockWidget from "../../../../components/dashboard/low-stock-widget";
import QuickActionsWidget from "../../../../components/dashboard/quick-actions";
import { getLowStockProducts, type StockAlert } from "@/lib/services/dashboard-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Dashboard Overview | Ali Store",
    description: "Manage your store performance and orders",
};

export default async function DashboardPage() {
    const t = await getTranslations("dashboard");

    let orders: Order[] = [];
    let lowStockProducts: StockAlert[] = [];

    try {
        const [ordersRes, lowStockRes] = await Promise.all([
            getOrders(),
            getLowStockProducts()
        ]);
        orders = ordersRes;
        lowStockProducts = lowStockRes;
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        try { orders = await getOrders(); } catch { }
        try { lowStockProducts = await getLowStockProducts(); } catch { }
    }

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter((o) => o.status === "delivered").length;

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.total || 0);
    }, 0);

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title={t("totalRevenue") || "Total Revenue"}
                    value={`${totalRevenue.toLocaleString()} EGP`}
                    icon={DollarSign}
                    gradient="from-green-500 to-emerald-700"
                    subtext={t("allTimeTotal")}
                />
                <StatsCard
                    title={t("totalOrders") || "Total Orders"}
                    value={totalOrders}
                    icon={ShoppingCart}
                    gradient="from-blue-500 to-indigo-700"
                    subtext={t("allTimeTotal")}
                />
                <StatsCard
                    title={t("pendingOrders") || "Pending"}
                    value={pendingOrders}
                    icon={Clock}
                    gradient="from-orange-500 to-amber-700"
                    subtext={t("processingNow")}
                />
                <StatsCard
                    title={t("completedOrders") || "Delivered"}
                    value={completedOrders}
                    icon={Package}
                    gradient="from-purple-500 to-pink-700"
                    subtext={t("successfullyShipped")}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Recent Orders (Takes up 2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <RecentOrdersWidget orders={orders} />
                </div>

                {/* Right Column: Operational Widgets (Takes up 1 column) */}
                <div className="lg:col-span-1 space-y-6">
                    <QuickActionsWidget />
                    <LowStockWidget products={lowStockProducts} />
                </div>
            </div>
        </div>
    );
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    gradient: string;
    subtext: string;
}

function StatsCard({ title, value, icon: Icon, gradient, subtext }: StatsCardProps) {
    return (
        <Card className="relative overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.08] dark:opacity-[0.15]`} />
            <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                    <div className="text-3xl font-black tracking-tight">{value}</div>
                    <p className="text-xs text-muted-foreground font-medium">{subtext}</p>
                </div>
            </CardContent>
        </Card>
    );
}
