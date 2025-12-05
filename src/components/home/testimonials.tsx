"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

interface Testimonial {
    name: string;
    role: string;
    text: string;
}

export default function Testimonials() {
    const t = useTranslations("Testimonials");

    const testimonials: Testimonial[] = [
        {
            name: t("client1_name"),
            role: t("client1_role"),
            text: t("client1_text"),
        },
        {
            name: t("client2_name"),
            role: t("client2_role"),
            text: t("client2_text"),
        },
        {
            name: t("client3_name"),
            role: t("client3_role"),
            text: t("client3_text"),
        },
    ];

    return (
        <section className="w-full py-16 bg-neutral-50 dark:bg-neutral-900">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">{t("heading")}</h2>
                <p className="text-muted-foreground">{t("description")}</p>
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 w-11/12 mx-auto">
                {testimonials.map((testimonial, i) => (
                    <Card
                        key={i}
                        className="p-6 shadow-lg border border-transparent rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    >
                        <CardContent className="flex flex-col gap-4">
                            <Quote className="w-10 h-10 text-yellow-300 opacity-80" aria-hidden="true" />
                            <p className="text-sm leading-relaxed text-foreground/80">
                                {testimonial.text}
                            </p>

                            <div className="flex items-center gap-3 mt-4">
                                <Avatar className="w-12 h-12 ring-2 ring-yellow-300">
                                    <AvatarImage
                                        src={`https://i.pravatar.cc/150?img=${i + 10}`}
                                        alt={`${testimonial.name}'s avatar`}
                                        loading="lazy"
                                    />
                                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                </Avatar>

                                <div>
                                    <h4 className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
                                        {testimonial.name}
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                        {testimonial.role}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
