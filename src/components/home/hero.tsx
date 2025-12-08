"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/logo";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
    const t = useTranslations("Hero");

    const trustIndicators = [
        t("trust_shipping"),
        t("trust_support"),
        t("trust_returns"),
        t("trust_payment")
    ];

    return (
        <section
            className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('https://res.cloudinary.com/do15wh7gm/image/upload/v1765213408/Gemini_Generated_Image_9v9yne9v9yne9v9y_ukilak.png')" }}
            aria-label={t("heroSection")}
        >
            {/* Dark Overlay for less brightness */}
            <div className="absolute  bg-black/30 dark:bg-black/50" />
            <div className="absolute   from-transparent via-transparent to-background/90" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col items-center text-center">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fadeIn">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-white/80 tracking-wide uppercase">
                        {t("newCollection")}
                    </span>
                </div>

                {/* Logo with animation */}
                <Logo className="h-24 w-auto border-2 border-orange-600 p-2 rounded-md mb-6 animate-logoBounce" />

                {/* Buttons with animation */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:w-auto">
                    <Button
                        asChild
                        size="lg"
                        className="h-14 px-8 text-lg font-bold rounded-full bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-buttonPop"
                    >
                        <Link href="/shop" className="flex items-center gap-2">
                            {t("shopNow")} <ArrowRight className="w-5 h-5" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-14 px-8 text-lg font-bold rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 transition-all animate-buttonPop"
                    >
                        <Link href="/about">
                            {t("learnMore")}
                        </Link>
                    </Button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 justify-center max-w-3xl">
                    {trustIndicators.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-white/70 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {item}
                        </div>
                    ))}
                </div>

                {/* Payment indicator */}
                <div className="mt-6 flex items-center gap-2 text-green-400">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h2l1 9h12l1-9h2M5 6h14l-1 4H6L5 6z"
                        />
                    </svg>
                    <span>{t("cashOnDelivery")}</span>
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes bgSlide {
                    0% { background-position: center 0%; }
                    50% { background-position: center 100%; }
                    100% { background-position: center 0%; }
                }
                section {
                    animation: bgSlide 60s ease-in-out infinite alternate;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 1s ease-out forwards;
                }
                @keyframes logoBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-logoBounce {
                    animation: logoBounce 2s ease-in-out infinite;
                }
                @keyframes buttonPop {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-buttonPop {
                    animation: buttonPop 2s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
