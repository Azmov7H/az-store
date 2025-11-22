"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const locales = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" }
  ];

  const currentLocaleCode = pathname.split("/")[1] || "en";
  const currentLocale = locales.find(l => l.code === currentLocaleCode);

  const changeLanguage = (locale) => {
    const query = searchParams.toString();
    const newPath = `/${locale}${pathname.replace(/^\/[^\/]+/, "")}${query ? `?${query}` : ""}`;
    document.documentElement.dir = locales.find(l => l.code === locale)?.dir || "ltr";
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {currentLocale?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem key={loc.code} onClick={() => changeLanguage(loc.code)}>
            {loc.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
