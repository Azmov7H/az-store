"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/logo";

export default function Hero() {
    const t = useTranslations("Hero");

    return (
        <section
            className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-cover bg-center animate-bgSlide dark:brightness-90"
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
            aria-label="Hero section"
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-white">
                    {t.rich("title", {
                        brand: (chunks) => (
                            <span className="inline-flex items-center gap-2">
                                {chunks} <Logo />
                            </span>
                        ),
                    })}
                </h1>

                <p className="text-lg md:text-xl mb-8 text-white/90">
                    {t.rich("subtitle", {
                        discount: (chunks) => (
                            <span className="font-semibold text-orange-400">
                                {chunks} 50% OFF
                            </span>
                        ),
                    })}
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <Button
                        asChild
                        className="px-8 py-4 font-bold rounded-xl hover:scale-105 hover:bg-yellow-400 transition-all w-full md:w-auto"
                    >
                        <Link href="/shop">{t("shopNow")}</Link>
                    </Button>
                </div>
            </div>

            {/* Background animation */}
            <style jsx>{`
        @keyframes bgSlide {
          0% {
            background-position: center 0%;
          }
          50% {
            background-position: center 100%;
          }
          100% {
            background-position: center 0%;
          }
        }
        .animate-bgSlide {
          animation: bgSlide 25s linear infinite;
        }
      `}</style>
        </section>
    );
}
