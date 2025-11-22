import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 w-max">
      {/* Logo Background Shape */}
      <span className="hidden md:inline text-sm font-medium text-muted-foreground">
         Store
      </span>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
         
        <span className="text-black font-extrabold text-lg md:text-xl tracking-tight">
          AN
        </span>
      </div>

      {/* Optional Tagline */}
     
    </div>
  );
}
