"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Locale {
    code: string;
    label: string;
    dir: "ltr" | "rtl";
}

const locales: Locale[] = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
];

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();

    const currentLocaleCode = pathname.split("/")[1] || "en";
    const currentLocale = locales.find((l) => l.code === currentLocaleCode);

    const changeLanguage = (locale: string) => {
        const segments = pathname.split("/");
        segments[1] = locale;
        const newPath = segments.join("/");

        const selectedLocale = locales.find((l) => l.code === locale);
        if (selectedLocale) {
            document.documentElement.dir = selectedLocale.dir;
            document.documentElement.lang = selectedLocale.code;
        }

        router.push(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    aria-label="Change language"
                >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentLocale?.label}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {locales.map((loc) => (
                    <DropdownMenuItem
                        key={loc.code}
                        onClick={() => changeLanguage(loc.code)}
                        className={currentLocaleCode === loc.code ? "bg-accent" : ""}
                    >
                        {loc.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
