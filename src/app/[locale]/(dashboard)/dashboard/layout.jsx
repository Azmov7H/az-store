import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Dashboardlayout({children}) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
      </SidebarProvider>
    </div>
  )
}
