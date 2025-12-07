"use client";

import { memo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package, Layers } from "lucide-react";
import { calculateFinalPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface DashboardProductCardProps {
    product: any;
    onEdit: () => void;
    onDelete: () => void;
    viewMode?: "grid" | "list";
}

const DashboardProductCard = memo(function DashboardProductCard({
    product,
    onEdit,
    onDelete,
    viewMode = "grid",
}: DashboardProductCardProps) {
    const finalPrice = calculateFinalPrice(product.price, product.discount || 0);

    if (viewMode === "list") {
        return (
            <div className="group flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted/20">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="md:col-span-2">
                        <h3 className="font-semibold truncate">{product.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {product.category && <Badge variant="outline" className="text-[10px] h-5 px-1.5">{product.category}</Badge>}
                            <span className="text-xs">Stock: {product.stock}</span>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="font-bold">{finalPrice.toFixed(2)} EGP</div>
                        {product.discount > 0 && <div className="text-xs line-through text-muted-foreground">{product.price} EGP</div>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 hover:text-primary">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="relative h-52 w-full bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {product.discount > 0 && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground shadow-lg animate-in zoom-in">
                        -{product.discount}%
                    </Badge>
                )}

                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80">
                        {product.category}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-5 space-y-4">
                <div>
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={product.stock > 0 ? "outline" : "destructive"} className={cn("text-xs font-normal", product.stock > 5 ? "border-green-500/50 text-green-600 dark:text-green-400" : "")}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xl font-black">{finalPrice.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">EGP</span></div>
                        {product.discount > 0 && (
                            <div className="text-sm line-through text-muted-foreground/70 decoration-destructive/50">
                                {product.price.toFixed(2)} EGP
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Button
                        variant="default"
                        size="sm"
                        className="w-full shadow-lg shadow-primary/20"
                        onClick={onEdit}
                    >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full hover:bg-destructive/10 hover:text-destructive"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});

export default DashboardProductCard;
