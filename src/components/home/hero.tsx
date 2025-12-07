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
            className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-cover bg-center animate-bgSlide dark:brightness-90"
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
            aria-label="Hero section"
        >
            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent dark:from-black/90 dark:to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col md:items-start items-center text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fadeIn">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
                        {t("newCollection")}
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 text-white tracking-tight drop-shadow-lg max-w-4xl">
                    {t.rich("title", {
                        brand: (chunks) => (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">
                                {chunks} <Logo className="inline-block h-12 w-auto md:h-20 ml-2 align-baseline border-2 p-1 border-white" />
                            </span>
                        ),
                    })}
                </h1>

                <p className="text-lg md:text-2xl mb-10 text-gray-200 max-w-2xl font-light leading-relaxed">
                    {t.rich("subtitle", {
                        discount: (chunks) => (
                            <span className="font-bold text-yellow-400 inline-block transform hover:scale-110 transition-transform cursor-default">
                                {chunks} 50% OFF
                            </span>
                        ),
                    })}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
                    <Button
                        asChild
                        size="lg"
                        className="h-14 px-8 text-lg font-bold rounded-full bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        <Link href="/shop" className="flex items-center gap-2">
                            {t("shopNow")} <ArrowRight className="w-5 h-5" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-14 px-8 text-lg font-bold rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 transition-all text-white"
                    >
                        <Link href="/about">
                            {t("learnMore")}
                        </Link>
                    </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-start pt-8 border-t border-white/10 w-full max-w-3xl">
                    {trustIndicators.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Background animation styles */}
            <style jsx>{`
                @keyframes bgSlide {
                    0% { background-position: center 0%; }
                    50% { background-position: center 100%; }
                    100% { background-position: center 0%; }
                }
                .animate-bgSlide {
                    animation: bgSlide 30s ease-in-out infinite alternate;
                }
                .animate-fadeIn {
                    animation: fadeIn 1s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
