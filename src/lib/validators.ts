// Validation utilities with TypeScript types

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
    return emailRegex.test(email);
}

interface ValidationResult {
    valid: boolean;
    error: string | null;
}

interface ShoeData {
    title: string;
    description: string;
    price: number;
    discount?: number;
    category: string;
    gender: string;
    availableColors: string[];
    availableSizes: string[];
    stock: number;
    image: string;
}

export function validateShoeData(data: Partial<ShoeData>): ValidationResult {
    const errors: string[] = [];

    if (!data.title || data.title.length < 3 || data.title.length > 100) {
        errors.push("Title must be 3-100 characters");
    }
    if (!data.description || data.description.length < 10) {
        errors.push("Description is required and must be at least 10 characters");
    }
    if (data.price === undefined || data.price <= 0) {
        errors.push("Price must be a positive number");
    }
    if (data.discount !== undefined && (data.discount < 0 || data.discount > 100)) {
        errors.push("Discount must be between 0-100");
    }
    if (!data.category) {
        errors.push("Category is required");
    }
    if (!data.gender) {
        errors.push("Gender/Target is required");
    }
    if (!Array.isArray(data.availableColors)) {
        errors.push("Available colors must be an array");
    }
    if (!Array.isArray(data.availableSizes)) {
        errors.push("Available sizes must be an array");
    }
    if (!data.stock || data.stock <= 0) {
        errors.push("Stock must be a positive number");
    }
    if (!data.image) {
        errors.push("Image is required");
    }

    return {
        valid: errors.length === 0,
        error: errors[0] || null,
    };
}
