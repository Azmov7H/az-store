"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users, Settings, X, LogOut ,CalendarArrowDown  } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Logo from "../layout/logo";

interface NavItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { title: "overview", url: "/dashboard", icon: Home },
    { title: "orders", url: "/dashboard/orders", icon: CalendarArrowDown },
    { title: "products", url: "/dashboard/products", icon: Package },
    { title: "customers", url: "/dashboard/customers", icon: Users },
    { title: "settings", url: "/dashboard/setting", icon: Settings },
];

interface AppSidebarProps {
    onClose?: () => void;
}

export default function AppSidebar({ onClose }: AppSidebarProps) {
    const pathname = usePathname();
    const t = useTranslations("Sidebar");

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="scale-90 origin-left">
                    <Logo />
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="lg:hidden hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const active = pathname === item.url;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.url}
                            onClick={onClose}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${active
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                            aria-current={active ? "page" : undefined}
                        >
                            <Icon className={`h-5 w-5 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} aria-hidden="true" />
                            <span className="font-medium relative z-10">{t(item.title)}</span>

                            {/* Active Shine Effect */}
                            {active && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justification-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">{t("logout")}</span>
                </Button>
                <div className="mt-4 px-2 text-xs text-muted-foreground/50 text-center">
                    <p>© 2024 Ali Store</p>
                    <p>v1.0.0 Admin Panel</p>
                </div>
            </div>
        </div>
    );
}
