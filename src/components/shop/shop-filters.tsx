"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import type { Category } from "@/lib/services/category-service";

interface ShopFiltersProps {
    categories: Category[];
    pagination: { page: number; limit: number; total: number; pages: number };
    activeCategory: string | undefined;
    activeSearch: string | undefined;
    activeSort: string | undefined;
}

const SORT_OPTIONS: { value: string; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: low to high" },
    { value: "price_desc", label: "Price: high to low" },
];

export function ShopFilters({
    categories,
    pagination,
    activeCategory,
    activeSearch,
    activeSort,
}: ShopFiltersProps) {
    const t = useTranslations("products");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const draft = useRef({
        search: activeSearch ?? "",
        category: activeCategory ?? "",
        sort: activeSort ?? "newest",
    });

    const dir =
        typeof document !== "undefined" ? (document.dir as "rtl" | "ltr") : "ltr";

    useEffect(() => {
        setMounted(true);
        draft.current.search = activeSearch ?? "";
        draft.current.category = activeCategory ?? "";
        draft.current.sort = activeSort ?? "newest";
    }, [activeCategory, activeSearch, activeSort]);

    const setQuery = useCallback(
        (next: Record<string, string>) => {
            const params = new URLSearchParams();
            Object.entries(next).forEach(([key, value]) => {
                if (value === "") params.delete(key);
                else params.set(key, value);
            });
            params.delete("page");
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router]
    );

    const setSearch = useCallback(
        (value: string) => {
            draft.current.search = value;
        },
        []
    );

    useEffect(() => {
        if (!mounted) return;
        const timer = setTimeout(() => {
            setQuery({ search: draft.current.search, category: draft.current.category, sort: draft.current.sort });
        }, 300);
        return () => clearTimeout(timer);
    }, [draft.current.search, mounted, setQuery]);

    const selectCategory = (category: string) => {
        draft.current.category = category;
        draft.current.sort = "newest";
        setQuery({ search: draft.current.search, category, sort: "newest" });
        setOpen(false);
    };

    const selectSort = (value: string) => {
        draft.current.sort = value;
        setQuery({ search: draft.current.search, category: draft.current.category, sort: value });
        setOpen(false);
    };

    const goPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const range = (): number[] => {
        const pages: number[] = [];
        const { page, pages: total } = pagination;
        const from = Math.max(1, page - 2);
        const to = Math.min(total, page + 2);
        for (let i = from; i <= to; i++) pages.push(i);
        return pages;
    };

    const hasFilters = mounted && (activeSearch || activeCategory);

    return (
        <>
            {/* Mobile filter drawer trigger */}
            <div className="flex justify-end lg:hidden mb-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                            <Filter className="w-5 h-5" />
                            <span className="sr-only">{t("cart")}</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={dir === "rtl" ? "left" : "right"} className="p-4 w-[min(320px,90vw)]">
                        <SheetHeader>
                            <SheetTitle className="text-base font-semibold">{t("filters")}</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-4 pt-2">
                            <div className="relative mb-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={draft.current.search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                    className="pl-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">{t("categories")}</span>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => {
                                        const active = draft.current.category === cat.id;
                                        return (
                                            <Button
                                                key={cat.id}
                                                onClick={() => selectCategory(cat.id)}
                                                variant={active ? "default" : "outline"}
                                                size="sm"
                                                className="whitespace-nowrap"
                                            >
                                                {cat.name}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Sort</span>
                                <select
                                    value={draft.current.sort}
                                    onChange={(e) => selectSort(e.target.value)}
                                    className="border border-border bg-background rounded-md px-3 py-2 text-sm focus-visible:ring-ring focus-visible:ring-ring/50"
                                >
                                    {SORT_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop filters bar */}
            <div className="hidden lg:flex items-center justify-between gap-4 mb-6 border-b border-border/50 pb-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={mounted ? draft.current.search : activeSearch ?? ""}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="pl-9"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="self-center text-xs text-muted-foreground">{t("categories")}</span>
                    {categories.map((cat) => {
                        const active = activeCategory === cat.id;
                        return (
                            <Button
                                key={cat.id}
                                onClick={() => selectCategory(cat.id)}
                                variant={active ? "default" : "outline"}
                                size="sm"
                                className="whitespace-nowrap"
                            >
                                {cat.name}
                            </Button>
                        );
                    })}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sort</span>
                    <select
                        value={activeSort ?? "newest"}
                        onChange={(e) => selectSort(e.target.value)}
                        className="border border-border bg-background rounded-md px-3 py-2 text-sm focus-visible:ring-ring focus-visible:ring-ring/50"
                    >
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
                {hasFilters && (
                    <Link
                        href={pathname}
                        className="text-xs text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                        Clear filters
                    </Link>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <nav className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4" aria-label="Pagination">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page <= 1}
                            onClick={() => goPage(pagination.page - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {range().map((p) => (
                            <Button
                                key={p}
                                variant={p === pagination.page ? "default" : "outline"}
                                size="sm"
                                onClick={() => goPage(p)}
                                className="h-9 w-9"
                            >
                                {p}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page >= pagination.pages}
                            onClick={() => goPage(pagination.page + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Page {pagination.page} of {pagination.pages} ({pagination.total} products)
                    </p>
                </nav>
            )}
        </>
    );
}
