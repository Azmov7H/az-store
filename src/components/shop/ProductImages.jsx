import Image from "next/image"

export default function ProductImages({ image, name }) {
  return (
    <div className="w-full flex items-center justify-center">
      <Image
        src={image}
        alt={name}
        width={600}
        height={600}
        loading="lazy"
        className="rounded-xl object-cover shadow"
      />
    </div>
  )
}
