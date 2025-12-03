"use client";

import { Button } from "@/components/ui/button";
import Logo from "../layout/Logo";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
<section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
  {/* Background Image */}
 

  

  {/* Content */}
  <div className="relative z-10 text-center max-w-3xl">
    <h1 className="text-5xl md:text-6xl font-extrabold  leading-tight mb-4">
      {t.rich("title", {
        brand: (chunks) => (
          <span className=" inline-flex items-center gap-2">
            {chunks} <Logo />
          </span>
        )
      })}
    </h1>

    <p className="text-lg md:text-xl  mb-8">
      {t.rich("subtitle", {
        discount: (chunks) => (
          <span className="font-semibold text-orange-500">{chunks} 50% OFF</span>
        )
      })}
    </p>

    <div className="flex flex-col md:flex-row justify-center gap-4">
      <Button className="px-8 py-4  font-bold rounded-xl hover:scale-105 hover:bg-yellow-400 transition-all">
        <Link href={"/shop"}>
        {t("shopNow")}
        </Link>
      </Button>
    </div>
  </div>

  <style>{`
    @keyframes bgSlide {
      0% { background-position: center top; }
      50% { background-position: center bottom; }
      100% { background-position: center top; }
    }
    .animate-bgSlide {
      animation: bgSlide 20s linear infinite;
    }
  `}</style>
</section>

  );
}
