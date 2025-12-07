import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./layout-client";

export const metadata: Metadata = {
    title: "Dashboard | Ali Store",
    description: "Admin dashboard for Ali Store e-commerce management",
    robots: {
        index: false,
        follow: false,
    },
};

interface DashboardLayoutProps {
    children: React.ReactNode;
}

import { authUtils } from "@/lib/auth";

export default async function DashboardLayout({
    children,
    params,
}: DashboardLayoutProps & { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token || !authUtils.verifyJWT(token)) {
        redirect(`/${locale}/auth/login`);
    }

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
