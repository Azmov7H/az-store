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

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const cookieStore = await cookies();
    const token = cookieStore.get("dashboard-auth")?.value;

    if (token !== process.env.DASHBOARD_SECRET) {
        redirect("/auth/login");
    }

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
