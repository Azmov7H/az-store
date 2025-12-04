import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/context/theme-provider";

import { NextIntlClientProvider } from 'next-intl';
import requestConfig from '../../i18n/request';
export const metadata = {
  metadataBase: new URL("https://ali-store-sh.vercel.app"),
  title: {
    default: "Ali-store | Premium Shoes Store",
    template: "%s | Ali-store"
  },

  description:
    "Ali-store is an advanced e-commerce store offering top brands like Nike, Adidas, and Puma. Fast checkout, multi-language support, and high-quality customer experience.",

  keywords: [
    "Ali-store",
    "e-commerce",
    "Nike shoes",
    "Adidas shoes",
    "Puma shoes",
    "online shoe shop",
    "sports shoes",
    "running shoes",
    "best online store"
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1
    }
  },

  authors: [
    { name: "Ali Nagy", url: "https://ali-store-sh.vercel.app" }
  ],

  creator: "Ali Nagy",
  publisher: "Ali-store",

  alternates: {
    canonical: "/",
    languages: {
      en: "https://ali-store-sh.vercel.app/en",
      ar: "https://ali-store-sh.vercel.app/ar"
    }
  },

  openGraph: {
    title: "Ali-store | Premium Shoes Store",
    description:
      "Premium e-commerce store for Nike, Adidas, Puma and more. Fast delivery and multilingual support.",
    url: "https://ali-store-sh.vercel.app",
    siteName: "Ali-store",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/do15wh7gm/image/upload/v1764809161/e4293e74-e1a7-4857-9c83-81ac3a27162d_wgjcjk.jpg",
        width: 1200,
        height: 630,
        alt: "Ali-store main banner"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Ali-store | Premium Shoes Store",
    description:
      "Buy Nike, Adidas, and Puma shoes with a premium shopping experience.",
    images: [
      "https://res.cloudinary.com/do15wh7gm/image/upload/v1764809161/e4293e74-e1a7-4857-9c83-81ac3a27162d_wgjcjk.jpg"
    ],
    creator: "@AliStore"
  },

  category: "ecommerce"
};




export default async function LocaleLayout({ children, params }) {
 const { locale } = await params;
  const config = await requestConfig({ requestLocale: locale });
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>


        <NextIntlClientProvider messages={config.messages}>
          <ThemeProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Toaster   position="top-right" richColors/>
          {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
