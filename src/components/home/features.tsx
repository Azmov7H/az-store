"use client";

import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
}

export default function Features() {
    const t = useTranslations("Features");

    const features: Feature[] = [
        {
            icon: Truck,
            title: t("shipping_title"),
            description: t("shipping_desc"),
        },
        {
            icon: RotateCcw,
            title: t("returns_title"),
            description: t("returns_desc"),
        },
        {
            icon: Shield,
            title: t("secure_title"),
            description: t("secure_desc"),
        },
        {
            icon: Headphones,
            title: t("support_title"),
            description: t("support_desc"),
        },
    ];

    return (
        <section className="w-full py-16 px-4 bg-gradient-to-b from-background to-muted/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                        {t("heading")}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {t("description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
