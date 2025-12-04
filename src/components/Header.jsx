// components/dashboard/Header.jsx
"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ pageTitle, toggleSidebar, sidebarOpen }) {
  return (
    <header className="flex items-center justify-between bg-background border-b border-border px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>
    </header>
  );
}
