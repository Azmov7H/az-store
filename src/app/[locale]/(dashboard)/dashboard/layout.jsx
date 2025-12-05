import AppSidebar from "@/components/app-sidebar";
import DashboardHeader from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  // استخدم await لأن cookies() الآن Async
  const allCookies = await cookies();
  const dashboardCookie = allCookies.get("dashboard-auth");
  const token = dashboardCookie?.value || "";

  if (token !== process.env.NEXT_PUBLIC_DASHBOARD_SECRET) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 w-64 transition-transform bg-background border-r border-border md:translate-x-0">
        <AppSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64">
        <DashboardHeader pageTitle="Dashboard" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
    </SidebarProvider>
  );
}
