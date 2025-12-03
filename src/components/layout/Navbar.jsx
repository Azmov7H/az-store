"use client"

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./Toggle";
import Logo from "./Logo";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { useContext } from "react";
import { CartContext } from "@/context/ClientLayout";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navbar");
  const cart = useContext(CartContext);
  const itemCount = cart?.items?.reduce((a, c) => a + c.quantity, 0) || 0;

  return (
    <header className="fixed top-0 w-full z-50 bg-background shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Logo */}
        <Logo />

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          {["home", "shop", "about", "contact"].map((link) => (
            <Link
              key={link}
              href={link === "home" ? "/" : `/${link}`}
              className="relative group hover:text-primary transition-colors"
            >
              {t(link)}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Tools */}
        <div className=" flex items-center gap-3">
          

              <Link
      href="/cart"
      className="relative p-2 rounded-full hover:bg-primary/10 transition-colors"
      aria-label={t("cart")}
    >
      <ShoppingBag className="h-5 w-5 text-foreground" />

      {itemCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] h-4 w-4 flex items-center justify-center p-0"
        >
          {itemCount}
        </Badge>
      )}
    </Link>
  
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
                aria-label={t("menu")}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-background p-6">
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold">{t("menu")}</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-5 mt-6 text-sm font-medium">
                {["home", "shop", "about", "contact"].map((link) => (
                  <Link
                    key={link}
                    href={link === "home" ? "/" : `/${link}`}
                    onClick={() => setOpen(false)}
                    className="hover:text-primary transition-colors"
                  >
                    {t(link)}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 border-t pt-4">
                <div className="flex items-center gap-3">
                  <ModeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
