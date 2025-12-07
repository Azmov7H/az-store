import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Award, Users, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";



export default async function AboutPage() {
    const t = await getTranslations("About");

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("hero_title")}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("hero_subtitle")}
                    </p>
                </div>

                {/* Our Story */}
                <Card className="mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-3xl font-bold mb-6">{t("story_title")}</h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-muted-foreground mb-4">
                                {t("story_p1")}
                            </p>
                            <p className="text-muted-foreground mb-4">
                                {t("story_p2")}
                            </p>
                            <p className="text-muted-foreground">
                                {t("story_p3")}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <Card className="">
                        <CardContent className="p-6 text-center">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-3xl font-bold mb-2">10,000+</h3>
                            <p className="text-muted-foreground">{t("stats_sold")}</p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent className="p-6 text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-3xl font-bold mb-2">5,000+</h3>
                            <p className="text-muted-foreground">{t("stats_customers")}</p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent className="p-6 text-center">
                            <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-3xl font-bold mb-2">4.8/5</h3>
                            <p className="text-muted-foreground">{t("stats_rating")}</p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent className="p-6 text-center">
                            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-3xl font-bold mb-2">4 Years</h3>
                            <p className="text-muted-foreground">{t("stats_years")}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Our Values */}
                <Card className="mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-3xl font-bold mb-6">{t("values_title")}</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <Badge variant="default" className="mb-3">{t("val_q_badge")}</Badge>
                                <h3 className="text-xl font-semibold mb-2">{t("val_q_title")}</h3>
                                <p className="text-muted-foreground">
                                    {t("val_q_desc")}
                                </p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-3">{t("val_c_badge")}</Badge>
                                <h3 className="text-xl font-semibold mb-2">{t("val_c_title")}</h3>
                                <p className="text-muted-foreground">
                                    {t("val_c_desc")}
                                </p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-3">{t("val_p_badge")}</Badge>
                                <h3 className="text-xl font-semibold mb-2">{t("val_p_title")}</h3>
                                <p className="text-muted-foreground">
                                    {t("val_p_desc")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="my-12" />

                {/* Why Choose Us */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-6">{t("why_title")}</h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <Card className="">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">✓ {t("why_shipping")}</h3>
                                <p className="text-muted-foreground">
                                    {t("why_shipping_desc")}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">✓ {t("why_cod")}</h3>
                                <p className="text-muted-foreground">
                                    {t("why_cod_desc")}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">✓ {t("why_returns")}</h3>
                                <p className="text-muted-foreground">
                                    {t("why_returns_desc")}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-2">✓ {t("why_secure")}</h3>
                                <p className="text-muted-foreground">
                                    {t("why_secure_desc")}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
