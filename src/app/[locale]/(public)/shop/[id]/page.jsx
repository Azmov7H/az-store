import OrderForm from "@/components/shop/OrderForm";
import Image from "next/image";

export default async function Page({ params }) {
  const { id } =await params; // بدون await

  const BASE_HOST = process.env.NEXT_PUBLIC_API_URL ?? "";

  // جلب المنتج SSR
  const productRes = await fetch(`${BASE_HOST}/api/shoe/${id}`, { cache: "no-store" });
  if (!productRes.ok) return <div>Product not found</div>;
  const product = await productRes.json();

  // جلب القوائم SSR
  const locationsRes = await fetch(`${BASE_HOST}/api/order/locations`, { cache: "no-store" });
  const locations = locationsRes.ok ? await locationsRes.json() : {};

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* صورة المنتج */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
          {product.image && (
            <Image
              src={product.image}
              alt={product.title}
              width={800}
              height={600}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          )}
        </div>

        {/* تفاصيل المنتج + OrderForm */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{product.title}</h1>
            <p className="mt-3 text-gray-700 dark:text-gray-300">{product.description}</p>
            <p className="mt-5 text-2xl font-semibold text-primary">{product.price} EGP</p>
          </div>

          <div className="mt-8">
            <OrderForm product={product} initialLocations={locations} />
          </div>
        </div>
      </div>
    </main>
  );
}
