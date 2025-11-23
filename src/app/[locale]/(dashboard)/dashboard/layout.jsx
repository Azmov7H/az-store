import React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Dashboardlayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        
        {/* Sidebar ثابتة */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 px-6 py-4">

          {/* زر فتح/إغلاق السايدبار */}
          <SidebarTrigger className="mb-4" />

          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
