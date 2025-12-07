"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import DashboardProductCard from "@/components/dashboard/dashboard-product-card";
import ProductEditDialog from "@/components/dashboard/product-edit-dialog";
import { getShoes, createShoe, updateShoe, deleteShoe } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Package, Search, SlidersHorizontal, LayoutGrid, List as ListIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

// Define strict types for our data
interface Product {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    discount?: number;
    // Add other fields as needed based on your API
}

export default function ProductsPage() {
    const t = useTranslations("products");
    const [shoes, setShoes] = useState<Product[]>([]);
    const [filteredShoes, setFilteredShoes] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [priceRange, setPriceRange] = useState([0, 5000]);

    const fetchShoes = async () => {
        try {
            setLoading(true);
            const data = await getShoes<Product>();
            setShoes(data.shoes);
            setFilteredShoes(data.shoes);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShoes();
    }, []);

    useEffect(() => {
        let result = shoes;

        // Search Filter
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(shoe =>
                shoe.title.toLowerCase().includes(lowerQuery) ||
                shoe.category.toLowerCase().includes(lowerQuery)
            );
        }

        // Price Filter
        result = result.filter(shoe => {
            const finalPrice = shoe.price * (1 - (shoe.discount || 0) / 100);
            return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
        });

        setFilteredShoes(result);
    }, [searchQuery, shoes, priceRange]);

    const handleSubmit = async (form: any) => {
        try {
            if (selected) {
                await updateShoe(selected._id, form);
                toast.success("Product updated successfully.");
            } else {
                await createShoe(form);
                toast.success("Product created successfully.");
            }
            setOpen(false);
            fetchShoes();
        } catch (err) {
            console.error(err);
            toast.error("Failed to save product.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteShoe(id);
            toast.success("Product deleted.");
            fetchShoes();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete product.");
        }
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Package className="w-8 h-8 text-primary" />
                        {t("productName") || "Products"}
                        <span className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                            {shoes.length}
                        </span>
                    </h1>
                    <p className="text-muted-foreground mt-2 pl-11">
                        {t("desc")}
                    </p>
                </div>
                <Button
                    onClick={() => { setSelected(null); setOpen(true) }}
                    className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 rounded-xl h-12 px-6"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    {t("addProduct") || "Add Product"}
                </Button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-background/50 p-2 rounded-xl border border-border/50">
                {/* Search */}
                <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-transparent border-transparent focus-visible:ring-0 focus-visible:bg-secondary/50 rounded-lg transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Filters & View Toggle */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="gap-2 border-border/50 bg-transparent flex-1 md:flex-none">
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="hidden sm:inline">{t("filters")}</span>
                                {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="end">
                            <div className="space-y-4">
                                <h4 className="font-medium leading-none">{t("priceRange")}</h4>
                                <div className="space-y-4">
                                    <Slider
                                        defaultValue={[0, 5000]}
                                        value={priceRange}
                                        max={5000}
                                        step={100}
                                        onValueChange={setPriceRange}
                                        className="py-4"
                                    />
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="border rounded px-2 py-1 min-w-[60px] text-center">
                                            {priceRange[0]} EGP
                                        </div>
                                        <span className="text-muted-foreground">-</span>
                                        <div className="border rounded px-2 py-1 min-w-[60px] text-center">
                                            {priceRange[1]} EGP
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-muted-foreground hover:text-primary"
                                    onClick={() => setPriceRange([0, 5000])}
                                >
                                    {t("resetFilters")}
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="flex items-center bg-secondary/50 p-1 rounded-lg border border-border/50">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="icon"
                            className="h-8 w-8 rounded-md transition-all"
                            onClick={() => setViewMode("grid")}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="icon"
                            className="h-8 w-8 rounded-md transition-all"
                            onClick={() => setViewMode("list")}
                        >
                            <ListIcon className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className={`${viewMode === 'grid' ? 'h-64' : 'h-24'} w-full rounded-2xl`} />
                            {viewMode === 'grid' && (
                                <>
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-1/3" />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : filteredShoes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/10 rounded-3xl border border-dashed border-border/50">
                    <div className="bg-muted/20 p-6 rounded-full mb-6">
                        <Package className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t("noProducts")}</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                        {searchQuery || (priceRange[0] > 0 || priceRange[1] < 5000)
                            ? t("adjustFilters")
                            : t("getStarted")}
                    </p>
                    <Button onClick={() => { setSelected(null); setOpen(true) }} variant="outline">
                        {t("addProduct") || "Add Product"}
                    </Button>
                </div>
            ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {filteredShoes.map((shoe) => (
                        <DashboardProductCard
                            key={shoe._id}
                            product={shoe}
                            onEdit={() => { setSelected(shoe); setOpen(true) }}
                            onDelete={() => handleDelete(shoe._id)}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}

            {/* Edit/Create Dialog */}
            <ProductEditDialog
                open={open}
                setOpen={setOpen}
                onSubmit={handleSubmit}
                defaultData={selected || {}}
            />
        </div>
    );
}
