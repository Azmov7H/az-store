import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/context/theme-provider";

import { NextIntlClientProvider } from 'next-intl';
import requestConfig from '../../i18n/request';
export const metadata = {
  title: "Ali-store",
  description: "Ali-store e-commerce store for all your needs Nike, Adidas, Puma and many more",
  icons: { icon: "/favicon.ico" },
  robots: { follow: true, index: true },
  openGraph: {
    title: "Ali-store",
    description: "Ali-store e-commerce store for all your needs Nike, Adidas, Puma and many more",
    url: "https://ali-store-sh.vercel.app",
    siteName: "Ali-store",
    locale: "en_US",
    image: "https://res.cloudinary.com/do15wh7gm/image/upload/v1764809161/e4293e74-e1a7-4857-9c83-81ac3a27162d_wgjcjk.jpg", // استخدم رابط ثابت
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ali-store",
    description: "Ali-store e-commerce store for all your needs Nike, Adidas, Puma and many more",
    image: "https://res.cloudinary.com/do15wh7gm/image/upload/v1764809161/e4293e74-e1a7-4857-9c83-81ac3a27162d_wgjcjk.jpg",
  },
  keywords: [
    "ali-store",
    "e-commerce store",
    "Nike, Adidas, Puma",
    "online shopping"
  ],
  authors: [{ name: "Ali Store", url: "https://ali-store-sh.vercel.app" }],
  creator: "Ali Nagy",
  publisher: "Ali-store",
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
