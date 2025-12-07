"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";
import type { Product } from "@/types/product";

export default function ProductViewTracker({ product }: { product: Product }) {
    useEffect(() => {
        analytics.productView(product);
    }, [product]);

    return null;
}
