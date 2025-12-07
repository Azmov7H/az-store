import { getTranslations } from "next-intl/server";
import { getSiteStats } from "@/lib/services/stats-service";
import { Users, Package, Store, Star } from "lucide-react";

export default async function Stats() {
    const t = await getTranslations("Stats");
    const statsData = await getSiteStats();

    const stats = [
        {
            icon: Users,
            value: `${statsData.customers}+`,
            label: t("customers"),
        },
        {
            icon: Package,
            value: `${statsData.products}+`,
            label: t("products"),
        },
        {
            icon: Store,
            value: `${statsData.brands}+`,
            label: t("brands"),
        },
        {
            icon: Star,
            value: `${statsData.satisfaction}%`,
            label: t("satisfaction"),
        },
    ];

    return (
        <section className="w-full py-16 px-4 bg-gradient-to-b from-muted/20 to-background">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="text-center group hover:scale-105 transition-transform duration-300"
                            >
                                <div className="flex justify-center mb-3">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                </div>

                                <div className="text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                    {stat.value}
                                </div>

                                <div className="text-muted-foreground font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
