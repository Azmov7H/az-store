"use client";

import React from "react";
import ProductCard from "../SealCard";
import { useTranslations } from "next-intl";

const shoesData = [
  {
    id: 1,
    title: "Nike Air Max 270",
    price: 150,
    description: "Comfortable running shoe with modern design.",
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0",
    availableColors: ["Black", "White", "Red"],
    availableSizes: ["38", "39", "40", "41", "42", "43"],
  },
  {
    id: 2,
    title: "Adidas Ultraboost 23",
    price: 180,
    description: "High-performance running shoe for everyday comfort.",
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0",
    availableColors: ["White", "Blue", "Grey"],
    availableSizes: ["39", "40", "41", "42", "43", "44"],
  },
  {
    id: 3,
    title: "Puma RS-X",
    price: 120,
    description: "Stylish sneaker with retro design and bold colors.",
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0",
    availableColors: ["Pink", "White", "Black"],
    availableSizes: ["36", "37", "38", "39", "40", "41"],
  },
];

export default function Fetcher() {
  const t = useTranslations("HomePage"); // namespace HomePage

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6">{t("featuredTitle")}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {shoesData.map((shoe) => (
          <ProductCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </section>
  );
}
