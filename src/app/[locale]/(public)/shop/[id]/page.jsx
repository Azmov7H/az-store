import ProductPage from "@/components/ProductPage";
import { getShoeById } from "@/lib/api";


export async function generateMetadata({ params }) {
  const { id } =await params;
  const product = await getShoeById(id);

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      url: `https://ali-store-sh.vercel.app/en/shop/${id}`,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.title
        }
      ],
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.image]
    }
  };
}


export default async function ProductSSRPage({ params }) {

  const { id } = await params


  const product = await getShoeById(id)

  return <ProductPage product={product} />;
}
