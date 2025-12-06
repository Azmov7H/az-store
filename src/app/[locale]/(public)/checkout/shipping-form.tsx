"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface FormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCity: string;
    customerDistrict: string;
    customerStreet: string;
}

interface ShippingFormProps {
    formData: FormData;
    setFormData: (data: FormData) => void;
    onNext: () => void;
}

const CITIES: Record<string, string[]> = {
    القاهرة: [
        "مدينة نصر",
        "المعادى",
        "التجمع الخامس",
        "المقطم",
        "القاهرة الجديدة",
        "وسط البلد",
        "الزمالك",
        "شبرا",
        "السلام",
        "حدائق القبة",
        "عين شمس",
        "العباسية",
        "حلوان",
        "منشية ناصر",
        "روض الفرج",
        "الوايلى",
        "بولاق",
        "المطرية",
        "المعصرة",
        "المرج",
    ],
    الجيزة: [
        "المهندسين",
        "الدقي",
        "الهرم",
        "الجيزة الجديدة",
        "6 أكتوبر",
        "العمرانية",
        "الشيخ زايد",
        "منشأة القناطر",
        "الوراق",
        "بولاق الدكرور",
        "الصف",
        "حدائق أهرامات",
        "الجيزة الغربية",
    ],
};

export default function ShippingForm({
    formData,
    setFormData,
    onNext,
}: ShippingFormProps) {
    const t = useTranslations("ShippingForm");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCityChange = (value: string) => {
        setFormData({
            ...formData,
            customerCity: value,
            customerDistrict: CITIES[value]?.[0] || "",
        });
    };

    const handleDistrictChange = (value: string) => {
        setFormData({
            ...formData,
            customerDistrict: value,
        });
    };

    const isValid =
        formData.customerName &&
        formData.customerEmail &&
        formData.customerPhone &&
        formData.customerStreet;

    return (
        <Card className="">
            <CardHeader className="">
                <CardTitle className="">{t("title")}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label className="" htmlFor="customerName">{t("fullName")}</Label>
                        <Input
                            className=""
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label className="" htmlFor="customerEmail">{t("email")}</Label>
                        <Input
                            className=""
                            id="customerEmail"
                            name="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label className="" htmlFor="customerPhone">{t("phone")}</Label>
                        <Input
                            className=""
                            id="customerPhone"
                            name="customerPhone"
                            type="tel"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label className="" htmlFor="customerCity">{t("city")}</Label>
                        <Select value={formData.customerCity} onValueChange={handleCityChange}>
                            <SelectTrigger className="" id="customerCity">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="">
                                {Object.keys(CITIES).map((city) => (
                                    <SelectItem className="" key={city} value={city}>
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="" htmlFor="customerDistrict">{t("district")}</Label>
                        <Select
                            value={formData.customerDistrict}
                            onValueChange={handleDistrictChange}
                        >
                            <SelectTrigger className="" id="customerDistrict">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="">
                                {(CITIES[formData.customerCity] || []).map((district) => (
                                    <SelectItem className="" key={district} value={district}>
                                        {district}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="" htmlFor="customerStreet">{t("street")}</Label>
                        <Input
                            className=""
                            type="text"
                            id="customerStreet"
                            name="customerStreet"
                            value={formData.customerStreet}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <Button className="" onClick={onNext} disabled={!isValid} className="w-full md:w-auto">
                    {t("continue")}
                </Button>
            </CardContent>
        </Card>
    );
}
