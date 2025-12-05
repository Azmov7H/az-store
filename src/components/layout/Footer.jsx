"use client";

import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Footer component
 * Displays the website footer with brand info, quick links, contact details, and social icons
 */
export default function Footer() {
  const t = useTranslations("Footer");

  // Social media links
  const socialLinks = [
    { id: 1, icon: <Facebook className="w-5 h-5 text-yellow-400" />, link: "https://www.facebook.com/profile.php?id=61584102225161" },
    { id: 2, icon: <Instagram className="w-5 h-5 text-yellow-400" />, link: "" },
    { id: 3, icon: <Twitter className="w-5 h-5 text-yellow-400" />, link: "" }
  ];

  return (
    <footer className="relative shadow shadow-accent pt-16 pb-4 overflow-hidden bg-background">
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 relative z-10">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">{t("brand")}</h2>
          <p className="text-sm leading-relaxed">{t("about")}</p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">{t("quickLinks")}</h3>
          <ul className="space-y-2">
            {["home", "allProducts", "aboutUs", "contactUs"].map((link) => (
              <li
                key={link}
                className="hover:text-yellow-400 cursor-pointer transition-colors duration-300"
              >
                {t(link)}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">{t("contact")}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-yellow-400" /> {t("phone")}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-yellow-400" /> {t("email")}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-yellow-400" /> {t("address")}
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            {socialLinks.map((social) => (
              <a key={social.id} href={social.link} target="_blank" rel="noopener noreferrer">
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-10 text-xs text-gray-400 relative z-10">
        © {new Date().getFullYear()} {t("brand")}. {t("copyright")}
      </div>
    </footer>
  );
}
