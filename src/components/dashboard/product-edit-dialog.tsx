"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {defaultData && Object.keys(defaultData).length > 0
                            ? "Edit Product"
                            : "Add New Product"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="title">Product Name *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Nike Air Max 90"
                            />
                        </div>
                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <Input
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                placeholder="Running Shoes"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="price">Price (EGP) *</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="1200"
                            />
                        </div>
                        <div>
                            <Label htmlFor="discount">Discount (%)</Label>
                            <Input
                                id="discount"
                                name="discount"
                                type="number"
                                min="0"
                                max="100"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="10"
                            />
                        </div>
                        <div>
                            <Label htmlFor="stock">Stock *</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                placeholder="50"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="sizes">Sizes (comma-separated) *</Label>
                            <Input
                                id="sizes"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleChange}
                                required
                                placeholder="38, 39, 40, 41, 42"
                            />
                        </div>
                        <div>
                            <Label htmlFor="colors">Colors (comma-separated) *</Label>
                            <Input
                                id="colors"
                                name="colors"
                                value={formData.colors}
                                onChange={handleChange}
                                required
                                placeholder="Black, White, Red"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Product description..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="image">Image URL *</Label>
                        <Input
                            id="image"
                            name="image"
                            type="url"
                            value={formData.image}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {defaultData && Object.keys(defaultData).length > 0 ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
