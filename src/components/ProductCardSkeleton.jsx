export default function ProductCardSkeleton() {
  return (
    <div className="border rounded-md p-4 shadow animate-pulse flex flex-col gap-3">
      <div className="bg-gray-300 h-40 w-full rounded-md"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-8 bg-gray-300 rounded w-full mt-auto"></div>
    </div>
  )
}
