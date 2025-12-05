import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/dashboard/app-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

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

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                {/* Sidebar - Hidden on mobile by default, shown on desktop */}
                <AppSidebar />

                {/* Main Content Area */}
                <SidebarInset className="flex-1">
                    {/* Header with Mobile Menu Trigger */}
                    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                        <SidebarTrigger className="md:hidden" />
                        <DashboardHeader pageTitle="Dashboard" />
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
