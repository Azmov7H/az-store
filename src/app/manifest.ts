import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Ali Store - Premium Shoes Store",
        short_name: "Ali Store",
        description:
            "Premium e-commerce store for Nike, Adidas, Puma and more. Fast delivery and multilingual support.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#facc15",
        icons: [
            {
                src: "/logo.png",
                sizes: "any",
                type: "image/png",
            },
        ],
    };
}
