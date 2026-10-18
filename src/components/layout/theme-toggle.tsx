"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const noopSubscribe = () => () => {};
const getClientFlag = () => true;
const getServerFlag = () => false;

// Client-only rendering without setState-in-effect (avoids SSR hydration mismatch)
function useMounted(): boolean {
    return useSyncExternalStore(noopSubscribe, getClientFlag, getServerFlag);
}

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const mounted = useMounted();
    const t = useTranslations("Navbar");

    if (!mounted) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label={t("toggleTheme")}>
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">{t("toggleTheme")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    {t("light")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    {t("dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    {t("system")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
