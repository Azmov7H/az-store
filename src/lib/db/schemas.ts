import mongoose, { Schema, Model } from "mongoose";
import { AnalyticsSession, IAnalyticsSession } from "./analytics-schema";

// ==================== INTERFACES ====================

export interface IShoe {
    id: string;
    title: string;
    description: string;
    price: number;
    discount: number;
    image: string;
    category: "running" | "casual" | "formal" | "sports" | "sandals" | "boots";
    gender: "men" | "women" | "kids" | "unisex";
    availableColors: string[];
    availableSizes: string[];
    stock: number;
    rating: number;
    reviews: number;
    isNew: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IOrderProduct {
    shoeId: string;
    title: string;
    price: number;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
}

export interface IOrder {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCity: string;
    customerDistrict: string;
    customerStreet: string;
    products: IOrderProduct[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IContact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: "new" | "read" | "resolved";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICommit {
    id: string;
    username: string;
    email: string;
    commit: string;
    rating: number;
    verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// ==================== SCHEMAS ====================

// Shoe Schema
const shoeSchema = new Schema<IShoe>(
    {
        id: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        image: { type: String, required: true },
        category: {
            type: String,
            enum: ["running", "casual", "formal", "sports", "sandals", "boots"],
            required: true,
        },
        gender: {
            type: String,
            enum: ["men", "women", "kids", "unisex"],
            required: true,
            default: "unisex"
        },
        availableColors: [{ type: String }],
        availableSizes: [{ type: String }],
        stock: { type: Number, required: true, default: 0 },
        rating: { type: Number, default: 4.5 },
        reviews: { type: Number, default: 0 },
        isNew: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Indexes for performance
shoeSchema.index({ id: 1 });
shoeSchema.index({ category: 1 });
shoeSchema.index({ price: 1 });
shoeSchema.index({ isNew: 1 });

// Order Schema
const orderSchema = new Schema<IOrder>(
    {
        orderId: { type: String, required: true, unique: true },
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true },
        customerPhone: { type: String, required: true },
        customerCity: { type: String, required: true },
        customerDistrict: { type: String, required: true },
        customerStreet: { type: String, required: true },
        products: [
            {
                shoeId: String,
                title: String,
                price: Number,
                quantity: Number,
                selectedColor: String,
                selectedSize: String,
            },
        ],
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        shipping: { type: Number, default: 0 },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        notes: String,
    },
    { timestamps: true }
);

// Indexes for performance
orderSchema.index({ orderId: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Contact Schema
const contactSchema = new Schema<IContact>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        message: { type: String, required: true },
        status: { type: String, enum: ["new", "read", "resolved"], default: "new" },
    },
    { timestamps: true }
);

// Indexes for performance
contactSchema.index({ id: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

// Commit/Review Schema
const commitSchema = new Schema<ICommit>(
    {
        id: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        commit: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, default: 5 },
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Indexes for performance
commitSchema.index({ id: 1 });
commitSchema.index({ verified: 1 });
commitSchema.index({ rating: -1 });

// ==================== MODELS ====================

export const Shoe: Model<IShoe> =
    (mongoose.models.Shoe as Model<IShoe>) || mongoose.model<IShoe>("Shoe", shoeSchema);

export const Order: Model<IOrder> =
    (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>("Order", orderSchema);

export const Contact: Model<IContact> =
    (mongoose.models.Contact as Model<IContact>) || mongoose.model<IContact>("Contact", contactSchema);

export const Commit: Model<ICommit> =
    (mongoose.models.Commit as Model<ICommit>) || mongoose.model<ICommit>("Commit", commitSchema);

export { AnalyticsSession, type IAnalyticsSession };
