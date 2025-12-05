"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "../layout/theme-toggle";

interface DashboardHeaderProps {
    pageTitle: string;
    toggleSidebar?: () => void;
    sidebarOpen?: boolean;
}

export default function DashboardHeader({
    pageTitle,
    toggleSidebar,
    sidebarOpen = false
}: DashboardHeaderProps) {
    const pathname = usePathname();

    // Get page title from pathname
    const getPageTitle = () => {
        if (pathname.includes("/products")) return "Products";
        if (pathname.includes("/customers")) return "Customers";
        if (pathname.includes("/setting")) return "Settings";
        return "Dashboard";
    };

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between bg-background border-b px-4 md:px-6 h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                {toggleSidebar && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={toggleSidebar}
                        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                    >
                        {sidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                )}

                {/* Page Title */}
                <h1 className="text-xl md:text-2xl font-bold">{getPageTitle()}</h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        3
                    </Badge>
                </Button>

                {/* Theme Toggle */}
                <ModeToggle />
            </div>
        </header>
    );
}
