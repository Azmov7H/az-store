"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PackageSearch, Users, Settings, Package } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Products", url: "/dashboard/products", icon: Package },
    { title: "Customers", url: "/dashboard/customers", icon: Users },
    { title: "Settings", url: "/dashboard/setting", icon: Settings },
];

export default function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="w-64 bg-background border-r border-border">
            <SidebarContent className="flex flex-col justify-between h-full py-4">
                {/* Logo / Brand */}
                <div>
                    <div className="px-6 mb-6">
                        <Link href="/dashboard" className="font-bold text-xl hover:text-primary transition-colors">
                            Ali Store Dashboard
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <SidebarMenu className="space-y-1 px-2">
                        {navItems.map((item) => {
                            const active = pathname === item.url;
                            const Icon = item.icon;

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.url}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${active
                                                    ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                                                    : "text-muted-foreground hover:bg-primary/10"
                                                }`}
                                            aria-current={active ? "page" : undefined}
                                        >
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </div>

                {/* Sidebar Footer */}
                <div className="px-6 pb-4 text-xs text-muted-foreground">
                    <p>© 2024 Ali Store</p>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
