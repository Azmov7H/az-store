"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  Home,
  PackageSearch,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Logo from "./layout/Logo"
import { ModeToggle } from "./layout/Toggle"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Products", url: "/dashboard/products", icon: PackageSearch },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="backdrop-blur-xl p-6 border-r border-border/40">
      <SidebarContent className="flex flex-col justify-between h-full py-4">

        {/* TOP */}
        <div className="space-y-4">
                      <SidebarGroupLabel>
              <div className="flex items-center justify-between px-2 mb-5">
                <Logo />
              </div>
            </SidebarGroupLabel>
          <SidebarGroup>


            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {items.map((item) => {
                  const active = pathname === item.url

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={`
                          group flex items-center gap-3 rounded-xl px-3 py-2
                          transition-all duration-200
                          hover:bg-primary/10
                          ${
                            active
                              ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                              : "text-muted-foreground"
                          }
                        `}
                      >
                        <Link href={item.url}>
                          <item.icon
                            className={`h-5 w-5 transition-colors ${
                              active ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* BOTTOM */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between bg-muted/40 rounded-xl p-3">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ModeToggle />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
