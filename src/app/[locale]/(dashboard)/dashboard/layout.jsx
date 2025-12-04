// components/dashboard/Layout.jsx
"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar"; 
import { usePathname } from "next/navigation";
import AppSidebar from "@/components/app-sidebar";
import DashboardHeader from "@/components/Header";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transition-transform bg-background border-r border-border md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AppSidebar pathname={pathname} />
        </div>

        {/* Overlay Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:pl-64">
          <DashboardHeader
            pageTitle="Dashboard"
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
