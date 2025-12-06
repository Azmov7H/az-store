import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/context/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://ali-store-sh.vercel.app"),
    title: {
        default: "Ali Store | Premium Shoes Store",
        template: "%s | Ali Store",
    },
    description:
        "Ali Store is an advanced e-commerce store offering top brands like Nike, Adidas, and Puma. Fast checkout, multi-language support, and high-quality customer experience.",
    keywords: [
        "Ali Store",
        "e-commerce",
        "Nike shoes",
        "Adidas shoes",
        "Puma shoes",
        "online shoe shop",
        "sports shoes",
        "running shoes",
        "best online store",
       "احذية رجالي",
       "اسعار احذية",
       "سنيكرز رجالي"

    ],
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    authors: [{ name: "Ali Nagy", url: "https://ali-store-sh.vercel.app" }],
    creator: "Ali Nagy",
    publisher: "Ali Store",
    alternates: {
        canonical: "/",
        languages: {
            en: "https://ali-store-sh.vercel.app/en",
            ar: "https://ali-store-sh.vercel.app/ar",
        },
    },
    openGraph: {
        title: "Ali Store | Premium Shoes Store",
        description:
            "Premium e-commerce store for Nike, Adidas, Puma and more. Fast delivery and multilingual support.",
        url: "https://ali-store-sh.vercel.app",
        siteName: "Ali Store",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://res.cloudinary.com/do15wh7gm/image/upload/v1764809161/e4293e74-e1a7-4857-9c83-81ac3a27162d_wgjcjk.jpg",
                width: 1200,
                height: 630,
                alt: "Ali Store main banner",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Ali Store | Premium Shoes Store",
        description:
            "Buy Nike, Adidas, and Puma shoes with a premium shopping experience.",
        images: [
            "https://res.cloudinary.com/do15wh7gm/image/upload/v1764809161/e4293e74-e1a7-4857-9c83-81ac3a27162d_wgjcjk.jpg",
        ],
        creator: "@AliStore",
    },
    category: "ecommerce",
};

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Store",
                            name: "Ali Store",
                            url: "https://ali-store-sh.vercel.app",
                            logo: "https://ali-store-sh.vercel.app/logo.png",
                            description:
                                "Premium online shoe store offering Nike, Adidas, Puma and more.",
                            sameAs: [
                                "https://twitter.com/AliStore",
                                "https://instagram.com/AliStore",
                                "https://www.facebook.com/profile.php?id=61584102225161",
                            ],
                        }),
                    }}
                />
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Toaster position="top-right" richColors />
                        {children}
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
