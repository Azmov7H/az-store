"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export default function Testimonials() {
  const data = [
    {
      name: "Mohamed Ali",
      role: "عميل مميز",
      img: "https://i.pravatar.cc/150?img=32",
      text: "أفضل متجر جربته، جودة ممتازة وسرعة في التوصيل. أنصح الجميع بالشراء بدون تردد."
    },
    {
      name: "Sara Ahmed",
      role: "عميلة موثوقة",
      img: "https://i.pravatar.cc/150?img=15",
      text: "تصاميم احترافية وخدمة عملاء راقية. كانت تجربة رائعة وسأكررها بالتأكيد."
    },
    {
      name: "Hassan Youssef",
      role: "عميل دائم",
      img: "https://i.pravatar.cc/150?img=22",
      text: "السعر مقابل القيمة ممتاز جدًا. استلمت المنتج في نفس اليوم وبجودة فوق المتوقعة."
    },
  ]

  return (
    <section className="w-full py-16">
      <div className=" text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">ماذا قال العملاء</h2>
        <p className="text-muted-foreground">آراء حقيقية من عملائنا الذين جربوا منتجاتنا.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-11/12 mx-auto">
        {data.map((item, i) => (
          <Card key={i} className="p-4 shadow-lg border rounded-2xl hover:shadow-xl transition-all">
            <CardContent className="flex flex-col gap-4">
              <Quote className="w-8 h-8 text-primary opacity-70" />

              <p className="text-sm leading-relaxed text-foreground/80">
                {item.text}
              </p>

              <div className="flex items-center gap-3 mt-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={item.img} />
                  <AvatarFallback>{item.name[0]}</AvatarFallback>
                </Avatar>

                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <span className="text-xs text-muted-foreground">{item.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
