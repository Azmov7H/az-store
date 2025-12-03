import ProductPage from "@/components/ProductPage";
import { getShoeById } from "@/lib/api";


export async function generateMetadata({ params }) {
  const { id } = await params

  const product = await getShoeById(id)





  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
} 


export default async function ProductSSRPage({ params }) {

  const { id } = await params


  const product = await getShoeById(id)

  return <ProductPage product={product} />;
}
