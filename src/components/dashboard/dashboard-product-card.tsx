"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { calculateFinalPrice } from "@/lib/utils/format";

interface DashboardProductCardProps {
    product: any;
    onEdit: () => void;
    onDelete: () => void;
}

export default function DashboardProductCard({
    product,
    onEdit,
    onDelete,
}: DashboardProductCardProps) {
    const finalPrice = calculateFinalPrice(product.price, product.discount || 0);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
                <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.discount > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                        -{product.discount}%
                    </Badge>
                )}
            </div>

            <CardContent className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{finalPrice.toFixed(2)} EGP</span>
                    {product.discount > 0 && (
                        <span className="text-sm line-through text-muted-foreground">
                            {product.price.toFixed(2)} EGP
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                    </Badge>
                    {product.category && (
                        <Badge variant="outline">{product.category}</Badge>
                    )}
                </div>

                {product.availableColors && product.availableColors.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        Colors: {product.availableColors.join(", ")}
                    </div>
                )}

                {product.availableSizes && product.availableSizes.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        Sizes: {product.availableSizes.join(", ")}
                    </div>
                )}

                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={onEdit}
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
