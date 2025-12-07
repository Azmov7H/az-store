"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AdvancedAnalyticsData } from "@/lib/services/analytics-service";
import { Lightbulb, ShoppingBag, Eye, TrendingUp, Palette, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface AdvancedAnalyticsProps {
    data: AdvancedAnalyticsData;
}

export default function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
    const t = useTranslations("analytics");
    if (!data) return null;
    const { topProducts, topPages, salesInsight, suggestions } = data;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">{t("sales_title")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sales Insights Cards */}
                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200/20 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Palette className="w-4 h-4 text-indigo-500" /> {t("top_color")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-indigo-700 dark:text-indigo-400">
                            {salesInsight.topColor}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{t("cart_base")}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-200/20 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Ruler className="w-4 h-4 text-pink-500" /> {t("top_size")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-pink-700 dark:text-pink-400">
                            {salesInsight.topSize}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{t("cart_base")}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-200/20 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-emerald-500" /> {t("cart_activity")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                            {salesInsight.cartAdditions}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{t("cart_week")}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products Chart */}
                <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" /> {t("top_products")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" fontSize={12} stroke="#888888" />
                                    <YAxis dataKey="name" type="category" width={100} fontSize={12} stroke="#888888" />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Suggestions / AI Insights */}
                <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-amber-500" /> {t("growth_suggestions")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {suggestions.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">Collecting more data to generate insights...</p>
                            ) : (
                                suggestions.map((s, i) => (
                                    <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 ${s.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' :
                                        s.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300' :
                                            'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300'
                                        }`}>
                                        <TrendingUp className="w-5 h-5 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {s.type === 'success' ? t("suggestion_opportunity") :
                                                    s.type === 'warning' ? t("suggestion_attention") : t("suggestion_tip")}
                                            </p>
                                            <p className="text-sm opacity-90">{s.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Pages List */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">{t("top_pages")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {topPages.map((page, i) => (
                            <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                                <span className="text-sm font-mono text-muted-foreground">{page.url}</span>
                                <Badge variant="secondary">{page.views} {t("visits")}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
