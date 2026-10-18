"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VisitorAnalytics = dynamic(
    () => import("./visitor-analytics"),
    { ssr: false, loading: () => <Skeleton className="h-96 w-full" /> }
);
const AdvancedAnalytics = dynamic(
    () => import("./advanced-analytics"),
    { ssr: false, loading: () => <Skeleton className="h-96 w-full" /> }
);
const CustomerAnalyticsView = dynamic(
    () => import("./customer-analytics-view"),
    { ssr: false, loading: () => <Skeleton className="h-96 w-full" /> }
);
const LocationAnalytics = dynamic(
    () => import("./location-analytics"),
    { ssr: false, loading: () => <Skeleton className="h-96 w-full" /> }
);
const RevenueChart = dynamic(
    () => import("./revenue-chart"),
    { ssr: false, loading: () => <Skeleton className="h-64 w-full" /> }
);

interface AnalyticsClientProps {
    trafficData: any;
    advancedData: any;
    customerData: any;
    locationData: any;
    revenueData: any;
}

function AnalyticsErrorState({ message }: { message: string }) {
    return (
        <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <svg
                    className="w-8 h-8 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 9v2m0 4h.01" />
                </svg>
                <p className="text-sm font-medium text-destructive">{message}</p>
            </CardContent>
        </Card>
    );
}

export default function AnalyticsClient({
    trafficData,
    advancedData,
    customerData,
    locationData,
    revenueData
}: AnalyticsClientProps) {
    const t = useTranslations("analytics");

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">{t("title")} </h2>
                <p className="text-muted-foreground">{t("des")}</p>
            </div>

            <Tabs defaultValue="customers" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-8">
                    <TabsTrigger value="customers">{t("t1")}</TabsTrigger>
                    <TabsTrigger value="traffic">{t("t2")}</TabsTrigger>
                    <TabsTrigger value="advanced">{t("t3")}</TabsTrigger>
                </TabsList>

                <TabsContent value="customers" className="space-y-6">
                    {customerData ? (
                        <CustomerAnalyticsView data={customerData} />
                    ) : (
                        <AnalyticsErrorState message="Could not load customer data. Check database connection." />
                    )}
                </TabsContent>

                <TabsContent value="traffic" className="space-y-6">
                    {trafficData ? (
                        <div className="space-y-6">
                            <VisitorAnalytics data={trafficData} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {locationData && <LocationAnalytics data={locationData} />}
                            </div>
                        </div>
                    ) : (
                        <AnalyticsErrorState message="Could not load traffic data." />
                    )}
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    {advancedData ? (
                        <>
                            {revenueData && <RevenueChart data={revenueData} />}
                            <AdvancedAnalytics data={advancedData} />
                        </>
                    ) : (
                        <AnalyticsErrorState message="Could not load advanced analytics." />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
