import type { Product } from "@/types/product";

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
}

/**
 * Validate product data
 */
export function validateProduct(product: Partial<Product>): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!product.title || product.title.trim().length < 3) {
        errors.push("Title must be at least 3 characters");
    }

    if (!product.description || product.description.trim().length < 10) {
        errors.push("Description must be at least 10 characters");
    }

    if (!product.price || product.price <= 0) {
        errors.push("Price must be greater than 0");
    }

    if (product.discount && (product.discount < 0 || product.discount > 100)) {
        errors.push("Discount must be between 0 and 100");
    }

    if (!product.image) {
        errors.push("Image is required");
    }

    if (!product.category) {
        errors.push("Category is required");
    }

    if (!product.stock || product.stock < 0) {
        errors.push("Stock must be 0 or greater");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
