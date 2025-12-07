import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Quote, Star, BadgeCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getCommits } from "@/lib/services/commit-service";

export default async function Testimonials() {
    const t = await getTranslations("Testimonials");
    const commits = await getCommits();

    // Map commits to testimonials, or use fallback if empty
    const testimonials = commits.length > 0
        ? commits.map((commit: any) => ({
            name: commit.username,
            role: "Verified Customer",
            text: commit.commit,
            rating: commit.rating || 5,
        }))
        : [
            {
                name: t("client1_name"),
                role: t("client1_role"),
                text: t("client1_text"),
                rating: 5,
            },
            {
                name: t("client2_name"),
                role: t("client2_role"),
                text: t("client2_text"),
                rating: 5,
            },
            {
                name: t("client3_name"),
                role: t("client3_role"),
                text: t("client3_text"),
                rating: 5,
            },
        ];

    return (
        <section className="w-full py-24 bg-neutral-50/50 dark:bg-neutral-900/50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <Star className="w-3 h-3 fill-primary" />
                        {t("badge")}
                    </div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight">{t("heading")}</h2>
                    <p className="text-xl text-muted-foreground font-light">{t("description")}</p>
                </div>

                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.slice(0, 3).map((testimonial, i) => (
                        <Card
                            key={i}
                            className="relative group border-none shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-visible"
                        >
                            <div className="absolute -top-6 left-8 bg-background p-3 rounded-2xl shadow-md border border-border group-hover:scale-110 transition-transform duration-300">
                                <Quote className="w-6 h-6 text-primary" aria-hidden="true" />
                            </div>

                            <CardContent className="pt-12 pb-8 px-8 flex flex-col h-full">
                                <div className="flex gap-1 mb-6">
                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <Star
                                            key={starIndex}
                                            className={`w-4 h-4 ${starIndex < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-lg leading-relaxed text-foreground/90 italic mb-8 flex-grow">
                                    "{testimonial.text}"
                                </p>

                                <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                                    <div className="relative">
                                        <Avatar className="w-14 h-14 ring-4 ring-background shadow-md">
                                            <AvatarImage
                                                src={`https://ui-avatars.com/api/?name=${testimonial.name}&background=random`}
                                                alt={`${testimonial.name}'s avatar`}
                                                className="object-cover"
                                            />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-background" title="Verified Buyer">
                                            <BadgeCheck className="w-3 h-3 text-white" />
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-lg text-foreground">
                                            {testimonial.name}
                                        </h4>
                                        <span className="text-sm text-primary font-medium">
                                            {testimonial.role}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
