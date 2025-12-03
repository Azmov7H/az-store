
import {getShoes} from "@/lib/api"

import ProductCard from '@/components/product-card'
// Server Action – SSR fetch with revalidation


export default async function Page() {
  const products = await getShoes()

  return (
    <section className="w-full p-4 flex flex-col items-center gap-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {products.shoes.map((product) => (
          <ProductCard key={product._id} product={product}/>
        ))}
      </div>
    </section>
  )
}
