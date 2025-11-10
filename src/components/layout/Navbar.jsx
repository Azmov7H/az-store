"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./Toggle"
import Logo from "./Logo"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-border bg-background text-foreground">
      {/* Logo */}
      <Logo />

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <Link href="/about" className="hover:text-primary transition-colors">
          About
        </Link>
        <Link href="/contact" className="hover:text-primary transition-colors">
          Contact
        </Link>
      </nav>

      {/* Tools */}
      <div className="flex items-center gap-3">
        <ModeToggle />
        <Link
          href="/cart"
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
        </Link>
        <Button variant="outline" size="sm">
          EN
        </Button>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px]  bg-background">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-6 text-sm font-medium p-2">
              <Link href="/" onClick={() => setOpen(false)} className="hover:text-primary">
                Home
              </Link>
              <Link href="/shop" onClick={() => setOpen(false)} className="hover:text-primary">
                Shop
              </Link>
              <Link href="/about" onClick={() => setOpen(false)} className="hover:text-primary">
                About
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="hover:text-primary">
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
