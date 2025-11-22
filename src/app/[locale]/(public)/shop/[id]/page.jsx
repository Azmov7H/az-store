import React from 'react'
import ProductImages from '@/components/shop/ProductImages'
import ProductInfo from '@/components/shop/ProductInfo'
import ProductColors from '@/components/shop/ProductColors'
import ProductActions from '@/components/shop/ProductActions'
import { Card } from '@/components/ui/card'
import ProductSizes from '@/components/shop/ProductSizes'


async function GetProductByid(id) {
  const res =await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shoes/${id}`)
  const data = await res.json()
  return data
}
export const generateMetadata = async ({ params }) => {
  const {id}  = await params
  const product = await GetProductByid(id)
  return {
    title: product.title,
    description: product.description,

  }
}
export default async function page({params}) {
  const {id}  = await params
  const product = await GetProductByid(id)
  return (
    <div className='w-full grid grid-cols-1 p-2 gap-3 items-center justify-center mt-3 md:grid-cols-2'>
      <ProductImages image={product.image} name={product.title} />
      <Card className='flex flex-col justify-center gap-8 p-3'>
        <ProductInfo {...product} />
        <ProductColors colors={product.availableColors} />
        <ProductSizes sizes={product.availableSizes} />
        <ProductActions product={product} />
      </Card>

    </div>
  )
}
