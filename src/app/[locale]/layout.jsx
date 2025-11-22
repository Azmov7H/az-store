import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/context/theme-provider";

import { NextIntlClientProvider } from 'next-intl';
import requestConfig from '../../i18n/request';
export const metadata = {
  title: "Az-store",
  description:
    "az-store e-commerce store for all your needs Nike, Adidas, Puma and many more",
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    title: "Az-store",
    description:
      "az-store e-commerce store for all your needs Nike, Adidas, Puma and many more",
    url: "https://az-store.vercel.app",
    siteName: "Az-store",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Az-store",
    description:
      "az-store e-commerce store for all your needs Nike, Adidas, Puma and many more",
  },
  keywords: [
    "az-store",
    "az-store e-commerce",
    "az-store e-commerce store",
    "az-store e-commerce store for all your needs",
    "az-store e-commerce store for all your needs Nike",
    "az-store e-commerce store for all your needs Nike, Adidas",
    "az-store e-commerce store for all your needs Nike, Adidas, Puma",
    "az-store e-commerce store for all your needs Nike, Adidas, Puma and many more",
  ],
  authors: [
    {
      name: "Az-store",
      url: "https://az-store.vercel.app",
    },
  ],
  creator: "ali nagy",
  publisher: "az-store",
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
            <Toaster  />
          {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
