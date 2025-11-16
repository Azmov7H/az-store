export default function ProductSizes({ sizes }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-lg">Available Sizes:</h3>

      <div className="flex gap-3 flex-wrap">
        {sizes.map((size) => (
          <span
            key={size}
            className="px-3 py-1 border rounded-md text-sm  hover:bg-gray-100"
          >
            {size}
          </span>
        ))}
      </div>
    </div>
  )
}
