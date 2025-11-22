"use client";

import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t mt-16 py-10 bg-background">
      <div className="w-11/12 mx-auto grid md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold mb-3">{t("brand")}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{t("about")}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">{t("quickLinks")}</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary transition">{t("home")}</li>
            <li className="hover:text-primary transition">{t("allProducts")}</li>
            <li className="hover:text-primary transition">{t("aboutUs")}</li>
            <li className="hover:text-primary transition">{t("contactUs")}</li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-4">{t("categories")}</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary transition">{t("men")}</li>
            <li className="hover:text-primary transition">{t("women")}</li>
            <li className="hover:text-primary transition">{t("kids")}</li>
            <li className="hover:text-primary transition">{t("accessories")}</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4">{t("contact")}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> {t("phone")}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> {t("email")}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> {t("address")}
            </li>
          </ul>

          <div className="flex gap-4 mt-6">
            <Facebook className="w-5 h-5 hover:text-primary cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-primary cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-primary cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("brand")}. {t("copyright")}
      </div>
    </footer>
  );
}
