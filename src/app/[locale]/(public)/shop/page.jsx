import { getShoes } from "@/lib/api"
import ProductCard from "@/components/product-card"
import ProductCardSkeleton from "@/components/ProductCardSkeleton"

export const revalidate = 60  // ISR كل 60 ثانية

export const metadata = {
  title: "Ali-store | جميع المنتجات",
  description: "تصفح جميع منتجات Ali-store من أحذية وملابس وإكسسوارات.",
}

export default async function Page() {
  const products = await getShoes()

  return (
    <section className="w-full p-4 flex flex-col items-center gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl justify-center">
        {products?.shoes?.length > 0 ? (
          products.shoes.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          // لو مفيش منتجات هنعرض skeleton كـ placeholder
          Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
        )}
      </div>
    </section>
  )
}
