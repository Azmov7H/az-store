import { NextRequest } from "next/server";
import { createSuccessResponse } from "@/lib/api-response";

interface DistrictsData {
    [city: string]: string[];
}

const DISTRICTS_DATA: DistrictsData = {
  Cairo: [
    "وسط البلد",
    "الزمالك",
    "جاردن سيتي",
    "مصر الجديدة",
    "مدينة نصر",
    "هليوبوليس",
    "المعادى",
    "القاهرة الجديدة",
    "التجمع الأول",
    "التجمع الثالث",
    "التجمع الخامس",
    "الشروق",
    "الرحاب",
    "مدينتي",
    "عين شمس",
    "المطرية",
    "المرج",
    "الزيتون",
    "حدائق القبة",
    "روض الفرج",
    "الساحل",
    "الشرابية",
    "شبرا",
    "العباسية",
    "مدينة السلام",
    "دار السلام",
    "البساتين",
    "حلوان",
    "15 مايو",
    "التبين",
    "المعصرة",
    "المقطم",
    "القلعة",
    "الفسطاط",
    "السيدة زينب",
    "السيدة عائشة",
    "الخليفة"
  ],

  Giza: [
    "المهندسين",
    "الدقي",
    "العجوزة",
    "الهرم",
    "فيصل",
    "بين السرايات",
    "ميت عقبة",
    "أرض اللواء",
    "بولاق الدكرور",
    "سقارة",
    "البدرشين",
    "الحوامدية",
    "أبو النمرس",
    "المنيب",
    "إمبابة",
    "الكيت كات",
    "أرض الجمعية",
    "6 أكتوبر",
    "حدائق أكتوبر",
    "الشيخ زايد",
    "واحة أكتوبر",
    "العياط",
    "الصف",
    "أطفيح"
  ]
};

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const city = url.searchParams.get("city");

        if (city && DISTRICTS_DATA[city]) {
            return createSuccessResponse({
                city,
                districts: DISTRICTS_DATA[city],
            });
        }

        return createSuccessResponse(DISTRICTS_DATA);
    } catch (error) {
        // Fallback to returning all districts data
        return createSuccessResponse(DISTRICTS_DATA);
    }
}
