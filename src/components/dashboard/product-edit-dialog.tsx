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
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import {
    Upload,
    Sparkles,
    Tag,
    Layers,
    DollarSign,
    Box,
    ImageIcon
} from "lucide-react";
import type { Product } from "@/types/product";
import type { Category } from "@/lib/services/category-service";

// Shape sent to the create/update endpoints after form assembly
// (partial when creating: server generates the rest).
export type ProductEditPayload = Partial<Product> & {
    availableColors: string[];
    availableSizes: string[];
};

interface ProductEditDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSubmit: (data: ProductEditPayload) => void;
    defaultData?: Product | null;
}

const EMPTY_FORM = {
    title: "",
    price: "",
    discount: "",
    stock: "",
    category: "",
    gender: "unisex",
    sizes: "",
    colors: "",
    description: "",
    image: "",
};

type ProductForm = typeof EMPTY_FORM;

function buildFormData(data?: Product | null): ProductForm {
    if (!data || Object.keys(data).length === 0) return EMPTY_FORM;
    return {
        title: data.title || "",
        price: data.price?.toString() || "",
        discount: data.discount?.toString() || "",
        stock: data.stock?.toString() || "",
        category: data.category || "",
        gender: data.gender || "unisex",
        sizes: data.availableSizes?.join(", ") || "",
        colors: data.availableColors?.join(", ") || "",
        description: data.description || "",
        image: data.image || "",
    };
}

export default function ProductEditDialog({
    open,
    setOpen,
    onSubmit,
    defaultData,
}: ProductEditDialogProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    // Initialize once from defaultData (parent remounts the dialog per selection via `key`)
    const [formData, setFormData] = useState(() => buildFormData(defaultData));

    // Fetch categories
    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => {
                if (data?.success && Array.isArray(data.data)) {
                    setCategories(data.data as Category[]);
                }
            })
            .catch(() => {});
    }, []);

    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create: payload composed from the form (server fills identity/default fields)
        // Edit: defaultData spread first, so immutable fields (id, rating...) ride along
        const productData: ProductEditPayload = {
            ...defaultData,
            title: formData.title,
            price: parseFloat(formData.price) || 0,
            discount: parseFloat(formData.discount) || 0,
            stock: parseInt(formData.stock) || 0,
            category: formData.category as Product["category"],
            gender: formData.gender as Product["gender"],
            availableSizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
            availableColors: formData.colors.split(",").map((c) => c.trim()).filter(Boolean),
            description: formData.description,
            image: formData.image,
        };

        onSubmit(productData);
        setOpen(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add size ranges
    const addRange = (start: number, end: number) => {
        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        const current = formData.sizes
            ? formData.sizes.split(",").map((s) => s.trim())
            : [];
        const newSizes = [
            ...new Set([...current, ...range.map(String)]),
        ].sort((a, b) => Number(a) - Number(b));
        setFormData({ ...formData, sizes: newSizes.join(", ") });
    };

    // Toggle color selection
    const toggleColor = (color: string) => {
        const current = formData.colors
            ? formData.colors.split(",").map((c) => c.trim().toLowerCase())
            : [];

        if (current.includes(color.toLowerCase())) {
            setFormData({
                ...formData,
                colors: current
                    .filter((c) => c !== color.toLowerCase())
                    .join(", "),
            });
        } else {
            setFormData({
                ...formData,
                colors: [...current, color.toLowerCase()].join(", "),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="
                max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0
                bg-background/95 backdrop-blur-xl 
                border-border/40 shadow-2xl rounded-xl
            "
            >
                <DialogHeader className="p-6 border-b border-border/40 bg-secondary/20">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                        <Sparkles className="w-5 h-5 text-primary" />
                        {defaultData && Object.keys(defaultData).length > 0
                            ? "Edit Product"
                            : "Add New Product"}
                    </DialogTitle>
                </DialogHeader>

                {/* FORM */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-8">
                        {/* Main Layout */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">

                                {/* Product Name */}
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
                                        className="glass-input"
                                    />
                                </div>

                                {/* Category + Gender */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-muted-foreground" />
                                            Category
                                        </Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(category) =>
                                                setFormData({ ...formData, category })
                                            }
                                        >
                                            <SelectTrigger className="glass-input">
                                                <SelectValue placeholder="Choose category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-muted-foreground" />
                                            Target
                                        </Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(gender) =>
                                                setFormData({ ...formData, gender })
                                            }
                                        >
                                            <SelectTrigger className="glass-input">
                                                <SelectValue placeholder="Choose target" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="men">Men</SelectItem>
                                                <SelectItem value="women">Women</SelectItem>
                                                <SelectItem value="kids">Kids</SelectItem>
                                                <SelectItem value="unisex">Unisex</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Price + Discount */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                                            Price
                                        </Label>
                                        <Input
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            placeholder="1200"
                                            className="glass-input"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-muted-foreground" />
                                            Discount %
                                        </Label>
                                        <Input
                                            name="discount"
                                            type="number"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            placeholder="10"
                                            className="glass-input"
                                        />
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Box className="w-4 h-4 text-muted-foreground" />
                                        Stock Quantity
                                    </Label>
                                    <Input
                                        name="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        placeholder="50"
                                        className="glass-input"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Sizes */}
                                <div className="space-y-2">
                                    <Label>Sizes (comma separated)</Label>
                                    <Input
                                        name="sizes"
                                        value={formData.sizes}
                                        onChange={handleChange}
                                        placeholder="38, 39, 40"
                                        required
                                        className="glass-input"
                                    />

                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {[ [37,41], [41,45], [45,48] ].map(([a,b]) => (
                                            <Button
                                                key={`${a}-${b}`}
                                                type="button"
                                                variant="outline"
                                                className="h-8 text-xs"
                                                onClick={() => addRange(a,b)}
                                            >
                                                {a}-{b}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="space-y-2">
                                    <Label>Colors</Label>
                                    <Input
                                        name="colors"
                                        value={formData.colors}
                                        onChange={handleChange}
                                        placeholder="Black, White"
                                        required
                                        className="glass-input"
                                    />

                                    <div className="flex flex-wrap gap-3 mt-2">
                                        {["Black","White","Red","Blue","Green","Yellow","Orange","Grey"].map((c) => {
                                            const active = formData.colors
                                                .toLowerCase()
                                                .includes(c.toLowerCase());
                                            return (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => toggleColor(c)}
                                                    title={c}
                                                    className={`
                                                        w-7 h-7 rounded-full border 
                                                        hover:scale-110 transition
                                                        ${active ? "ring-2 ring-primary ring-offset-2" : ""}
                                                    `}
                                                    style={{ backgroundColor: c.toLowerCase() }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Write a detailed product description..."
                                className="glass-input resize-none"
                            />
                        </div>

                        {/* Image */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                Product Image
                            </Label>

                            <div className="flex gap-4 items-center">
                                <Input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    required
                                    className="glass-input flex-1"
                                />

                                <CldUploadWidget
                                    uploadPreset="unsigned_upload"
                                    onSuccess={(res: CloudinaryUploadWidgetResults) => {
                                        const info = res?.info as
                                            | { secure_url?: string }
                                            | undefined;
                                        const url = info?.secure_url;
                                        if (url) {
                                            setFormData({
                                                ...formData,
                                                image: url,
                                            });
                                        }
                                    }}
                                >
                                    {({ open }) => (
                                        <Button type="button" variant="secondary" onClick={() => open()}>
                                            <Upload className="w-4 h-4 mr-1" />
                                            Upload
                                        </Button>
                                    )}
                                </CldUploadWidget>
                            </div>

                            {formData.image && (
                                // Dialog preview of an arbitrary admin-entered URL:
                                // not eligible for next/image remote optimization.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full rounded-lg shadow-lg mt-3 object-cover max-h-56"
                                />
                            )}
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-border/40 bg-secondary/10">
                        <Button type="submit" className="w-full md:w-auto px-8">
                            Save Product
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
