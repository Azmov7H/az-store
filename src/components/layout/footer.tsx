"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("Footer");

    const socialLinks = [
        {
            id: "facebook",
            icon: <Facebook className="w-5 h-5" />,
            link: "https://www.facebook.com/profile.php?id=61584102225161",
            label: "Facebook",
        },
        {
            id: "instagram",
            icon: <Instagram className="w-5 h-5" />,
            link: "#",
            label: "Instagram",
        },
        {
            id: "twitter",
            icon: <Twitter className="w-5 h-5" />,
            link: "#",
            label: "Twitter",
        },
    ];

    const quickLinks = [
        { key: "home", href: "/" },
        { key: "allProducts", href: "/shop" },
        { key: "aboutUs", href: "/about" },
        { key: "contactUs", href: "/contact" },
    ];

    return (
        <footer className="relative shadow shadow-accent pt-16 pb-4 overflow-hidden bg-background">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 relative z-10">
                {/* Brand Section */}
                <div>
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                        {t("brand")}
                    </h2>
                    <p className="text-sm leading-relaxed">{t("about")}</p>
                </div>

                {/* Quick Links Section */}
                <nav aria-label="Footer navigation">
                    <h3 className="font-semibold text-lg mb-4">{t("quickLinks")}</h3>
                    <ul className="space-y-2">
                        {quickLinks.map((link) => (
                            <li key={link.key}>
                                <Link
                                    href={link.href}
                                    className="hover:text-yellow-400 cursor-pointer transition-colors duration-300"
                                >
                                    {t(link.key)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Contact & Social Section */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">{t("contact")}</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                            <span>{t("phone")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                            <span>{t("email")}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                            <span>{t("address")}</span>
                        </li>
                    </ul>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-6" role="list" aria-label="Social media links">
                        {socialLinks.map((social) => (
                            <a
                                key={social.id}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-yellow-400 hover:text-yellow-500 transition-colors"
                                aria-label={social.label}
                            >
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
