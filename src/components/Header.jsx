"use client"

import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * DashboardHeader component
 * Displays the top header with page title and a sidebar toggle button
 * @param {string} pageTitle - Title of the current page
 * @param {function} toggleSidebar - Function to open/close the sidebar
 * @param {boolean} sidebarOpen - Current state of the sidebar
 */
export default function DashboardHeader({ pageTitle, toggleSidebar, sidebarOpen }) {
  return (
    <header className="flex items-center justify-between bg-background border-b border-border px-6 py-4 sticky top-0 z-10">
      
      {/* Left section: Sidebar toggle + Page title */}
      <div className="flex items-center gap-4">
        
        {/* Sidebar toggle button visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Page title */}
        <h1 className="text-xl font-bold">{pageTitle}</h1>
      </div>

      {/* Right section: reserved for future actions */}
      {/* You can add user profile, notifications, etc. here */}
    </header>
  )
}
