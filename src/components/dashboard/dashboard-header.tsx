"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
        return "Dashboard Overview";
    };

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 h-20 transition-all duration-300">
            {/* Left Section */}
            <div className="flex items-center gap-6">
                {/* Mobile Menu Toggle */}
                {toggleSidebar && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors"
                        onClick={toggleSidebar}
                        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                    >
                        {sidebarOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                )}

                {/* Page Title */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {getPageTitle()}
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium hidden md:block">
                        Welcome back, Admin
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Search Bar (Hidden on Mobile) */}
                <div className="hidden md:flex relative w-64 mr-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 h-10 rounded-full bg-secondary/50 border-transparent focus:bg-background transition-all"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-colors h-10 w-10">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 animate-pulse ring-2 ring-background"></span>
                </Button>

                {/* Theme Toggle */}
                <div className="border-l pl-3 ml-1 border-border/50">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
