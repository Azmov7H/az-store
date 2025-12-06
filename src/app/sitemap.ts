import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/services/product-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://ali-store-sh.vercel.app";

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/en`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/ar`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/en/shop`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/ar/shop`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/en/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/ar/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/en/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/ar/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Dynamic product pages
    try {
        const data = await getProducts({ limit: 1000 });
        const productPages: MetadataRoute.Sitemap = data.shoes.flatMap((product) => [
            {
                url: `${baseUrl}/en/shop/${product.id}`,
                lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.8,
            },
            {
                url: `${baseUrl}/ar/shop/${product.id}`,
                lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
                changeFrequency: "weekly" as const,
                priority: 0.8,
            },
        ]);

        return [...staticPages, ...productPages];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return staticPages;
    }
}
