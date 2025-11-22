"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductCard({ shoe }) {
  return (
    <Card
      className="
        rounded-2xl overflow-hidden border border-neutral-300 
        dark:border-neutral-800 shadow-sm hover:shadow-xl
        transition duration-300 cursor-pointer group
      "
    >
      {/* Image */}
      <div className="relative w-full h-60 overflow-hidden">
        <img
          src={shoe.image}
          alt={shoe.title}
          className="
            w-full h-full object-cover 
            group-hover:scale-110 transition-all duration-500
          "
        />

        <span
          className="
            absolute top-3 left-3 
            bg-black/70 text-white text-xs 
            px-3 py-1 rounded-full
          "
        >
          {shoe.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold">{shoe.title}</h3>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 h-12 line-clamp-2">
          {shoe.description}
        </p>

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-5">
          <span className="text-xl font-bold text-yellow-500">
            ${shoe.price}
          </span>

          <Button
            className="
              bg-yellow-300 text-black font-semibold rounded-xl 
              hover:bg-yellow-400 transition-all
            "
          >
            Buy Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
