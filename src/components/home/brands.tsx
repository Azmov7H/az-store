import { getTranslations } from "next-intl/server";
import { getBrands } from "@/lib/services/brand-service";

export default async function Brands() {
    const t = await getTranslations("Brands");
    const brands = await getBrands();

    return (
        <section className="w-full py-16 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3">
                        {t("heading")}
                    </h2>
                    <p className="text-muted-foreground">
                        {t("description")}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className="group cursor-pointer transition-all duration-300 hover:scale-110"
                        >
                            <h3
                                className={`text-3xl md:text-4xl font-black tracking-wider bg-gradient-to-r ${brand.gradient} bg-clip-text text-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                            >
                                {brand.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
