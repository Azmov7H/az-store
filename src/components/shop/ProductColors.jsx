export default function ProductColors({ colors }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold text-lg">Available Colors:</h3>

      <div className="flex gap-3">
        {colors.map((color) => (
          <span
            key={color}
            className="px-3 py-1 border rounded-md text-sm  hover:bg-gray-100"
          >
            {color}
          </span>
        ))}
      </div>
    </div>
  )
}
