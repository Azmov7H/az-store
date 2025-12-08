"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowRight, PackageX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { StockAlert } from "@/lib/services/dashboard-service";
import { useTranslations } from "next-intl";

export default function LowStockWidget({ products }: { products: StockAlert[] }) {
    const t = useTranslations("dashboard");

    return (
        <Card className="h-full border-amber-200/50 bg-amber-50/30 dark:bg-amber-950/10 dark:border-amber-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-500">
                    <AlertTriangle className="w-5 h-5" />
                    {t("lowStockAlerts")}
                </CardTitle>
                <Link href="/dashboard/products" className="text-xs text-amber-600 hover:text-amber-800 flex items-center">
                    {t("manageStock")} <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
            </CardHeader>
            <CardContent>
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                        <PackageX className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">{t("noStockAlerts")}</p>
                        <p className="text-xs opacity-70">{t("inventoryHealthy")}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {products.map((product) => (
                            <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/60 hover:bg-background/80 transition-colors border border-transparent hover:border-amber-200/50">
                                <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary">
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" title={product.title}>
                                        {product.title}
                                    </p>
                                </div>
                                <Badge variant={product.stock === 0 ? "destructive" : "secondary"} className={product.stock === 0 ? "" : "text-amber-700 bg-amber-100 border-amber-200"}>
                                    {t("itemsLeft", { count: product.stock })}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
