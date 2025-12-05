"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { useCart } from "@/hooks/use-cart";
import { ModeToggle } from "./theme-toggle";
import Logo from "./logo";
import LanguageSwitcher from "./language-switcher";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const t = useTranslations("Navbar");
    const { itemCount } = useCart();

    const navLinks = [
        { key: "home", href: "/" },
        { key: "shop", href: "/shop" },
        { key: "about", href: "/about" },
        { key: "contact", href: "/contact" },
    ];

    return (
        <header className="fixed top-0 w-full z-50 bg-background shadow-md border-b border-border">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <Logo />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm" role="navigation">
                    {navLinks.map((link) => (
                        <Link
                            key={link.key}
                            href={link.href}
                            className="relative group hover:text-primary transition-colors"
                        >
                            {t(link.key)}
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Toolbar */}
                <div className="flex items-center gap-3">
                    {/* Cart Icon */}
                    <Link
                        href="/cart"
                        className="relative p-2 rounded-full hover:bg-primary/10 transition-colors"
                        aria-label={`${t("cart")}${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
                    >
                        <ShoppingBag className="h-5 w-5 text-foreground" />
                        {itemCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] h-5 w-5 flex items-center justify-center p-0">
                                {itemCount > 99 ? "99+" : itemCount}
                            </Badge>
                        )}
                    </Link>

                    {/* Desktop Tools */}
                    <div className="hidden md:flex gap-2 items-center">
                        <ModeToggle />
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label={open ? "Close menu" : "Open menu"}
                            >
                                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-64 bg-background p-6">
                            <SheetHeader>
                                <SheetTitle className="text-lg font-semibold">
                                    {t("menu")}
                                </SheetTitle>
                            </SheetHeader>

                            {/* Mobile Navigation */}
                            <nav className="flex flex-col gap-5 mt-6 text-sm font-medium" role="navigation">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.key}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {t(link.key)}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile Tools */}
                            <div className="mt-6 border-t pt-4 flex items-center gap-3">
                                <ModeToggle />
                                <LanguageSwitcher />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
