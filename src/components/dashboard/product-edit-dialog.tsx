"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Sparkles, Tag, DollarSign, Box, Layers } from "lucide-react";

interface ProductEditDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSubmit: (data: any) => void;
    defaultData?: any;
}

export default function ProductEditDialog({
    open,
    setOpen,
    onSubmit,
    defaultData = {},
}: ProductEditDialogProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        discount: "",
        stock: "",
        category: "",
        sizes: "",
        colors: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        // Fetch categories
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategories(data.data);
                }
            })
            .catch(() => {
                // Silently fail - categories will be empty
            });
    }, []);

    useEffect(() => {
        if (defaultData && Object.keys(defaultData).length > 0) {
            setFormData({
                title: defaultData.title || "",
                price: defaultData.price?.toString() || "",
                discount: defaultData.discount?.toString() || "",
                stock: defaultData.stock?.toString() || "",
                category: defaultData.category || "",
                sizes: defaultData.availableSizes?.join(", ") || "",
                colors: defaultData.availableColors?.join(", ") || "",
                description: defaultData.description || "",
                image: defaultData.image || "",
            });
        } else {
            // Reset form when creating new product
            setFormData({
                title: "",
                price: "",
                discount: "",
                stock: "",
                category: "",
                sizes: "",
                colors: "",
                description: "",
                image: "",
            });
        }
    }, [defaultData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            ...defaultData,
            title: formData.title,
            price: parseFloat(formData.price) || 0,
            discount: parseFloat(formData.discount) || 0,
            stock: parseInt(formData.stock) || 0,
            category: formData.category,
            availableSizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
            availableColors: formData.colors.split(",").map((c) => c.trim()).filter(Boolean),
            description: formData.description,
            image: formData.image,
        };

        onSubmit(productData);
        setOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/50">
                <DialogHeader className="p-6 border-b border-border/50 bg-secondary/20">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <Sparkles className="w-5 h-5 text-primary" />
                        {defaultData && Object.keys(defaultData).length > 0
                            ? "Edit Product"
                            : "Add New Product"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-muted-foreground" />
                                        Product Name
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nike Air Max 90"
                                        className="h-10 border-border/50 bg-secondary/20 focus:bg-background transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-muted-foreground" />
                                        Category
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger id="category" className="h-10 border-border/50 bg-secondary/20 focus:bg-background transition-colors">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-secondary/95 backdrop-blur-xl border-border/50">
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.id} className="focus:bg-primary/20 cursor-pointer">
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price" className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                                            Price
                                        </Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            placeholder="1200"
                                            className="h-10 border-border/50 bg-secondary/20 focus:bg-background transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discount" className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-muted-foreground" />
                                            Discount %
                                        </Label>
                                        <Input
                                            id="discount"
                                            name="discount"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            placeholder="10"
                                            className="h-10 border-border/50 bg-secondary/20 focus:bg-background transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock" className="flex items-center gap-2">
                                        <Box className="w-4 h-4 text-muted-foreground" />
                                        Stock Quantity
                                    </Label>
                                    <Input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        placeholder="50"
                                        className="h-10 border-border/50 bg-secondary/20 focus:bg-background transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="sizes" className="">Sizes (comma-separated)</Label>
                                <Input
                                    id="sizes"
                                    name="sizes"
                                    value={formData.sizes}
                                    onChange={handleChange}
                                    required
                                    placeholder="38, 39, 40, 41, 42"
                                    className="h-10 border-border/50 bg-secondary/20 focus:bg-background transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="colors" className="">Colors (comma-separated)</Label>
                                <Input
                                    id="colors"
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleChange}
                                    required
                                    placeholder="Black, White, Red"
                                    className="h-10 border-border/50 bg-secondary/20 focus:bg-background transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Product description..."
                                className="min-h-[100px] border-border/50 bg-secondary/20 focus:bg-background transition-colors resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image" className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                Image URL
                            </Label>
                            <div className="flex gap-4 items-end">
                                <Input
                                    id="image"
                                    name="image"
                                    type="url"
                                    value={formData.image}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://example.com/image.jpg"
                                    className="h-10 border-border/50 bg-secondary/20 focus:bg-background transition-colors"
                                />
                                {formData.image && (
                                    <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted">
                                        <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-border/50 bg-secondary/10">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="shadow-lg shadow-primary/20">
                            {defaultData && Object.keys(defaultData).length > 0 ? "Update Product" : "Create Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
