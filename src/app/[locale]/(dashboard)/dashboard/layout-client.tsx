"use client";

import { useState } from "react";
import type { Metadata } from "next";
import AppSidebar from "@/components/dashboard/app-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";

interface DashboardLayoutClientProps {
    children: React.ReactNode;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-background">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <AppSidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader
                    pageTitle="Dashboard"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
