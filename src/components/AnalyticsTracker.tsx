"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/analytics";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Track page view on mount and when path changes
        const url = window.location.href;
        analytics.pageView(url);
    }, [pathname, searchParams]);

    return null;
}
