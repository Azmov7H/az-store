import Logo from '@/components/layout/Logo'

import { Card, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

// Server Action – SSR fetch with revalidation
async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/shoes`,
    { next: { revalidate: 60 } } // SSR + cache hữu–friendly
  )

  if (!res.ok) return []

  return res.json()
}

export default async function Page() {
  const products = await getProducts()

  return (
    <section className="w-full p-4 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">
        <Logo />
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {products.map((product) => (
          <Card
            key={product._id}
            className="overflow-hidden border rounded-xl p-0 shadow-sm hover:shadow-lg transition"
          >
            <Image
              src={product.image}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-64 object-cover"
            />

            <CardFooter className="flex flex-col items-start gap-2 p-4">
              <CardTitle className="text-lg font-semibold">
                <Link href={`/shop/${product._id}`}>{product.title}</Link>
              </CardTitle>

              <CardDescription className="text-sm line-clamp-2">
                {product.description}
              </CardDescription>

              <p className="font-bold text-primary text-base">
                {product.price} EGP
              </p>
              
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
