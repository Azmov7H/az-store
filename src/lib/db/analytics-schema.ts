import mongoose, { Schema, Model } from "mongoose";

interface EventMetadata {
    productId?: string;
    productName?: string;
    price?: number;
    currency?: string;
    cartId?: string;
    orderId?: string;
    value?: number;
    details?: Record<string, unknown>;
}

interface AnalyticsEvent {
    type: "page_view" | "product_view" | "add_to_cart" | "remove_from_cart" | "checkout_start" | "checkout_success";
    url?: string;
    path?: string;
    referrer?: string;
    metadata?: EventMetadata;
    timestamp: Date;
}

interface Location {
    country?: string;
    city?: string;
    region?: string;
}

export interface IAnalyticsSession {
    sessionId: string;
    userId?: string;
    device: string;
    browser?: string;
    os?: string;
    ip?: string;
    location?: Location;
    events: AnalyticsEvent[];
    startTime: Date;
    lastActive: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const eventSchema = new Schema<AnalyticsEvent>({
    type: {
        type: String,
        required: true,
        enum: [
            "page_view",
            "product_view",
            "add_to_cart",
            "remove_from_cart",
            "checkout_start",
            "checkout_success",
        ],
    },
    url: String,
    path: String,
    referrer: String,
    metadata: {
        productId: String,
        productName: String,
        price: Number,
        currency: String,
        cartId: String,
        orderId: String,
        value: Number,
        details: Schema.Types.Mixed,
    },
    timestamp: { type: Date, default: Date.now },
});

const sessionSchema = new Schema<IAnalyticsSession>(
    {
        sessionId: { type: String, required: true, unique: true },
        userId: String,
        device: {
            type: String,
            default: "desktop",
        },
        browser: String,
        os: String,
        ip: String,
        location: {
            country: String,
            city: String,
            region: String,
        },
        events: [eventSchema],
        startTime: { type: Date, default: Date.now },
        lastActive: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Indexes for faster queries
sessionSchema.index({ "events.type": 1 });
sessionSchema.index({ "events.timestamp": 1 });
sessionSchema.index({ createdAt: 1 });
sessionSchema.index({ sessionId: 1 });

export const AnalyticsSession: Model<IAnalyticsSession> =
    (mongoose.models.AnalyticsSession as Model<IAnalyticsSession>) ||
    mongoose.model<IAnalyticsSession>("AnalyticsSession", sessionSchema);
