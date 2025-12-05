"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "../layout/theme-toggle";



interface DashboardHeaderProps {
    pageTitle: string;
}

export default function DashboardHeader({ pageTitle }: DashboardHeaderProps) {
    const pathname = usePathname();

    // Get page title from pathname
    const getPageTitle = () => {
        if (pathname.includes("/products")) return "Products";
        if (pathname.includes("/customers")) return "Customers";
        if (pathname.includes("/setting")) return "Settings";
        return "Dashboard";
    };

    return (
        <div className="flex flex-1 items-center justify-between">
            {/* Page Title */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold">{getPageTitle()}</h1>
            </div>

            {/* Actions */}
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
        </div>
    );
}
