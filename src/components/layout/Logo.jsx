"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

/**
 * Logo component
 * Displays the site/app logo using Avatar from ShadCN UI
 */
export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Avatar wrapper */}
      <Avatar className="w-10 h-10">
        {/* Logo image */}
        <AvatarImage src="/logo.png" alt="Logo" />
        {/* Fallback text in case image fails */}
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
    </div>
  );
}
