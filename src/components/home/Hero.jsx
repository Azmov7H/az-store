"use client";

import { Button } from "@/components/ui/button";
import Logo from "../layout/Logo";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative w-full h-[75vh] rounded-2xl overflow-hidden flex items-center justify-start px-10">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl animate-fadeIn">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          {t.rich("title", {
            brand: (chunks) => <span className="text-yellow-300">{chunks}<Logo /></span>
          })}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-neutral-200 mt-4">
          {t.rich("subtitle", {
            discount: (chunks) => (
              <span className="font-semibold text-yellow-300">{chunks} 50% OFF</span>
            )
          })}
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <Button className="px-6 py-3 bg-yellow-300 text-black rounded-xl font-semibold hover:bg-yellow-400 transition-all">
            {t("shopNow")}
          </Button>

          <Button
            variant="outline"
            className="px-6 py-3 text-white border-white hover:bg-white hover:text-black transition-all rounded-xl"
          >
            {t("exploreMore")}
          </Button>
        </div>
      </div>

      {/* Fade-in Animation */}
      <style>{`
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn .9s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
