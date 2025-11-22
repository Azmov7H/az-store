import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t mt-16 py-10 bg-background">
      <div className="w-11/12 mx-auto grid md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Az Store</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            متجر أحذية عصري يقدم أحدث الموديلات من نايك وأديداس وبوما وغيرها.
            هدفنا أن نقدم لك أفضل جودة بأفضل سعر.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary transition">الصفحة الرئيسية</li>
            <li className="hover:text-primary transition">جميع المنتجات</li>
            <li className="hover:text-primary transition">من نحن</li>
            <li className="hover:text-primary transition">تواصل معنا</li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-4">الأقسام</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary transition">رجالي</li>
            <li className="hover:text-primary transition">حريمي</li>
            <li className="hover:text-primary transition">أطفال</li>
            <li className="hover:text-primary transition">إكسسوارات</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-4">تواصل معنا</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> 01012345678
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> support@azstore.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> القاهرة، مصر
            </li>
          </ul>

          <div className="flex gap-4 mt-6">
            <Facebook className="w-5 h-5 hover:text-primary cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-primary cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-primary cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Az Store. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}
