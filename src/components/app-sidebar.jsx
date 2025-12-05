// components/dashboard/Sidebar.jsx
"use client"

import Link from "next/link"
import { Home, PackageSearch, Users, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

/**
 * Navigation items for the dashboard sidebar
 */
const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Products", url: "/dashboard/products", icon: PackageSearch },
  { title: "Orders", url: "/dashboard/orders", icon: PackageSearch },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
]

/**
 * AppSidebar component
 * Displays a collapsible dashboard sidebar with navigation links
 * @param {string} pathname - Current route to highlight active menu
 */
export default function AppSidebar({ pathname }) {
  return (
    <Sidebar className="w-64 bg-background border-r border-border">
      <SidebarContent className="flex flex-col justify-between h-full py-4">
        
        {/* Logo / Brand */}
        <div>
          <div className="px-6 mb-6 font-bold text-xl">Ali Store</div>

          {/* Navigation Menu */}
          <SidebarMenu className="space-y-1 px-2">
            {navItems.map((item) => {
              const active = pathname === item.url

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        active
                          ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                          : "text-muted-foreground hover:bg-primary/10"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>

        {/* Sidebar Footer (Theme toggle, profile, etc.) */}
        <div className="px-6 pb-4">
          {/* Add optional footer items here */}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
