import ProductPage from "@/components/ProductPage";
import { getShoeById } from "@/lib/api";


export async function generateMetadata({ params }) {
  const { id } = await params;
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
      type: "article",
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

  return(
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          image: product.image,
          description: product.description,
          brand: "Ali-store",
          offers: {
            "@type": "Offer",
            url: `https://ali-store-sh.vercel.app/en/shop/${id}`,
            priceCurrency: "USD",
            price: product.price,
            availability: "https://schema.org/InStock"
          }
        })
      }}
    />
    <ProductPage product={product} />

  </>
  )
}
