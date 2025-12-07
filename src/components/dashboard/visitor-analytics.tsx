"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { DeviceData, DailyTrafficData } from "@/lib/services/analytics-service";
import { Users, Smartphone, Monitor, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChartDataInput {
    name: string;
    value: number;
    [key: string]: string | number; // Index signature for Recharts
}

interface VisitorAnalyticsProps {
    data: {
        dailyTraffic: DailyTrafficData[];
        devices: DeviceData[];
        totalSessions: number;
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function VisitorAnalytics({ data }: VisitorAnalyticsProps) {
    const t = useTranslations("analytics");

    if (!data) return null;

    const { dailyTraffic, devices, totalSessions } = data;

    // Default data if empty (to avoid empty chart ugly look)
    const chartData = dailyTraffic.length > 0 ? dailyTraffic : [
        { date: "Mon", count: 0 },
        { date: "Tue", count: 0 },
        { date: "Wed", count: 0 },
        { date: "Thu", count: 0 },
        { date: "Fri", count: 0 },
        { date: "Sat", count: 0 },
        { date: "Sun", count: 0 },
    ];

    const deviceData: ChartDataInput[] = (devices.length > 0 ? devices : [{ name: "unknown", value: 1 }]).map(d => ({
        name: d.name === "desktop" ? t("desktop") : d.name === "mobile" ? t("mobile") : d.name === "tablet" ? t("tablet") : d.name === "unknown" ? t("unknown") : d.name,
        value: d.value
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Chart */}
            <Card className="col-span-1 lg:col-span-2 shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        {t("visitors_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey={chartData[0]?.date ? "date" : "_id"}
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        // If valid date, format it. If day name (Mon, Tue), keep it.
                                        return isNaN(date.getTime()) ? str : date.toLocaleDateString(undefined, { weekday: 'short' });
                                    }}
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorTraffic)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Device Chart */}
            <Card className="col-span-1 shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-primary" />
                        {t("devices_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-bold">{totalSessions}</span>
                            <span className="text-xs text-muted-foreground">{t("visits")}</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {deviceData.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="capitalize">{entry.name}</span>
                                </div>
                                <span className="font-medium">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
