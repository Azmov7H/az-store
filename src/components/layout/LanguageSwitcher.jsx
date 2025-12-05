"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * LanguageSwitcher component
 * Allows users to switch between available locales (languages)
 * Updates the URL and HTML `dir` attribute accordingly
 */
export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Define available locales with code, label, and text direction
  const locales = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
  ];

  // Get current locale from URL path
  const currentLocaleCode = pathname.split("/")[1] || "en";
  const currentLocale = locales.find((l) => l.code === currentLocaleCode);

  /**
   * Handle language change
   * @param {string} locale - Selected locale code
   */
  const changeLanguage = (locale) => {
    const query = searchParams.toString();
    const newPath = `/${locale}${pathname.replace(/^\/[^\/]+/, "")}${
      query ? `?${query}` : ""
    }`;

    // Update document direction
    const selectedLocale = locales.find((l) => l.code === locale);
    document.documentElement.dir = selectedLocale?.dir || "ltr";

    // Navigate to new locale path
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
