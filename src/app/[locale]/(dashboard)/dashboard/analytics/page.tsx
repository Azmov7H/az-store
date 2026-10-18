import { getTranslations } from "next-intl/server";
import {
    getTrafficData,
    getAdvancedAnalytics,
    getCustomerAnalytics,
    getLocationAnalytics,
    getRevenueAnalytics
} from "@/lib/services/analytics-service";
import AnalyticsClient from "../../../../../components/dashboard/analytics-client";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const t = await getTranslations("analytics");

    const [traffic, advanced, customers, locations, revenue] = await Promise.all([
        getTrafficData().catch((e) => null),
        getAdvancedAnalytics().catch((e) => null),
        getCustomerAnalytics().catch((e) => null),
        getLocationAnalytics().catch((e) => null),
        getRevenueAnalytics().catch((e) => null)
    ]);

    return (
        <AnalyticsClient
            trafficData={traffic}
            advancedData={advanced}
            customerData={customers}
            locationData={locations}
            revenueData={revenue}
        />
    );
}
