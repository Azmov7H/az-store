"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${className || ""}`} aria-label="Ali Store Home">
            <Avatar className="w-10 h-10">
                <AvatarImage src="/logo.png" alt="Ali Store Logo" />
                <AvatarFallback className="bg-yellow-400 text-black font-bold">
                    AS
                </AvatarFallback>
            </Avatar>
            {showText && <span className="hidden sm:block font-bold text-lg">Ali Store</span>}
        </Link>
    );
}
