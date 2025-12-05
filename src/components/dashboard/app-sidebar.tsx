"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users, Settings, X } from "lucide-react";

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

interface AppSidebarProps {
    onClose?: () => void;
}

export default function AppSidebar({ onClose }: AppSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
                <Link href="/dashboard" className="font-bold text-xl hover:text-primary transition-colors">
                    Ali Store
                </Link>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-muted rounded-md"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const active = pathname === item.url;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.url}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                    ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
                                    : "text-muted-foreground hover:bg-primary/10"
                                }`}
                            aria-current={active ? "page" : undefined}
                        >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t text-xs text-muted-foreground">
                <p>© 2024 Ali Store</p>
            </div>
        </div>
    );
}
