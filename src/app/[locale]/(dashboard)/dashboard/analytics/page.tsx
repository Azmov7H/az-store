import { getTranslations } from "next-intl/server";
import {
    getTrafficData,
    getAdvancedAnalytics,
    getCustomerAnalytics,
    getLocationAnalytics,
    getRevenueAnalytics
} from "@/lib/services/analytics-service";
import VisitorAnalytics from "@/components/dashboard/visitor-analytics";
import AdvancedAnalytics from "@/components/dashboard/advanced-analytics";
import CustomerAnalyticsView from "@/components/dashboard/customer-analytics-view";
import LocationAnalytics from "@/components/dashboard/location-analytics";
import RevenueChart from "@/components/dashboard/revenue-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

function AnalyticsErrorState({ message }: { message: string }) {
    return (
        <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <p className="text-sm font-medium text-destructive">{message}</p>
            </CardContent>
        </Card>
    );
}

export default async function AnalyticsPage() {
    const t = await getTranslations("analytics");

    // Fetch all analytics data directly using server functions
    // We do NOT use fetch() here to avoid relative URL issues // fetch failed
    let trafficData = null;
    let advancedData = null;
    let customerData = null;
    let locationData = null;
    let revenueData = null;

    try {
        const [traffic, advanced, customers, locations, revenue] = await Promise.all([
            getTrafficData().catch(e => null),
            getAdvancedAnalytics().catch(e => null),
            getCustomerAnalytics().catch(e => null),
            getLocationAnalytics().catch(e => null),
            getRevenueAnalytics().catch(e => null)
        ]);
        trafficData = traffic;
        advancedData = advanced;
        customerData = customers;
        locationData = locations;
        revenueData = revenue;
    } catch (error) {
        console.error("Failed to load analytics:", error);
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">{t("title")} </h2>
                <p className="text-muted-foreground">
                   {t("des")}
                </p>
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
