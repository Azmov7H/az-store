"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";
import { DeviceData, DailyTrafficData } from "@/lib/services/analytics-service";
import { TrendingUp, Smartphone, Globe, Laptop } from "lucide-react";
import { useTranslations } from "next-intl";

interface VisitorAnalyticsProps {
    data: {
        dailyTraffic: DailyTrafficData[];
        devices: DeviceData[];
        browsers: DeviceData[];
        os: DeviceData[];
        totalSessions: number;
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function VisitorAnalytics({ data }: VisitorAnalyticsProps) {
    const t = useTranslations("analytics");

    if (!data) return null;

    const { dailyTraffic, devices, browsers, os, totalSessions } = data;

    // Helper to format data for charts
    const formatData = (items: DeviceData[]) => {
        return items.length > 0 ? items : [{ name: "No Data", value: 1 }];
    };

    const deviceData = formatData(devices).map(d => ({
        ...d,
        name: d.name === "desktop" ? t("desktop") : d.name === "mobile" ? t("mobile") : d.name === "tablet" ? t("tablet") : d.name
    }));

    const browserData = formatData(browsers);
    const osData = formatData(os);

    const ChartCard = ({ title, icon: Icon, data }: { title: string, icon: any, data: any[] }) => (
        <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="w-4 h-4 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px]">
                <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-xl font-bold">{data.reduce((a, b) => a + (b.name === "No Data" ? 0 : b.value), 0)}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Sessions</span>
                    </div>
                </div>
                <div className="mt-2 space-y-1">
                    {data.slice(0, 3).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="truncate max-w-[100px]" title={entry.name}>{entry.name}</span>
                            </div>
                            <span className="font-medium">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Traffic Trends */}
            <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        {t("visitors_title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyTraffic}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
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
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
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

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ChartCard title={t("devices_title")} icon={Smartphone} data={deviceData} />
                <ChartCard title="Browsers" icon={Globe} data={browserData} />
                <ChartCard title="OS Platform" icon={Laptop} data={osData} />
            </div>
        </div>
    );
}
