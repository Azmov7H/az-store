import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getOrders } from "@/lib/services/order-service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, ShoppingCart, Clock, TrendingUp } from "lucide-react";
import type { Order } from "@/types/order";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Dashboard Overview | Ali Store",
    description: "Manage your store performance and orders",
};

import { getTrafficData, getAdvancedAnalytics } from "@/lib/services/analytics-service";
import VisitorAnalytics from "@/components/dashboard/visitor-analytics";
import AdvancedAnalytics from "@/components/dashboard/advanced-analytics";

// ... existing imports

export default async function DashboardPage() {
    const t = await getTranslations("dashboard");

    let orders: Order[] = [];
    let trafficData = null;
    let advancedData = null;

    try {
        const [ordersRes, trafficRes, advancedRes] = await Promise.all([
            getOrders(),
            getTrafficData(),
            getAdvancedAnalytics()
        ]);
        orders = ordersRes;
        trafficData = trafficRes;
        advancedData = advancedRes;
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Try individually
        try { orders = await getOrders(); } catch { }
        try { trafficData = await getTrafficData(); } catch { }
        try { advancedData = await getAdvancedAnalytics(); } catch { }
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
                {/* ... existing stats cards ... */}
                <StatsCard
                    title={t("totalRevenue") || "Total Revenue"}
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+12.5%"
                    gradient="from-green-500 to-emerald-700"
                    subtext="vs last month"
                />
                <StatsCard
                    title={t("totalOrders") || "Total Orders"}
                    value={totalOrders}
                    icon={ShoppingCart}
                    trend="+5.2%"
                    gradient="from-blue-500 to-indigo-700"
                    subtext="vs last month"
                />
                <StatsCard
                    title={t("pendingOrders") || "Pending"}
                    value={pendingOrders}
                    icon={Clock}
                    trend="-2.1%"
                    gradient="from-orange-500 to-amber-700"
                    subtext="processing now"
                />
                <StatsCard
                    title={t("completedOrders") || "Delivered"}
                    value={completedOrders}
                    icon={Package}
                    trend="+8.4%"
                    gradient="from-purple-500 to-pink-700"
                    subtext="successfully shipped"
                />
            </div>

            {/* Visitor Analytics */}
            {trafficData && <VisitorAnalytics data={trafficData} />}

            {/* Advanced Insights */}
            {advancedData && <AdvancedAnalytics data={advancedData} />}
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend, gradient, subtext }: any) {
    return (
        <Card className="relative overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.08] dark:opacity-[0.15]`} />
            <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="font-semibold text-green-600 bg-green-500/10 dark:text-green-400 dark:bg-green-500/20">
                        <TrendingUp className="w-3 h-3 mr-1" /> {trend}
                    </Badge>
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
