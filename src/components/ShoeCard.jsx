"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function ProductCard({ shoe, onEdit, onDelete }) {
  return (
    <Card className="rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={shoe.image}
            alt={shoe.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-1">
        <CardTitle className="text-lg">{shoe.title}</CardTitle>
        <p className="text-muted-foreground text-sm">{shoe.description}</p>

        <div className="flex items-center justify-between pt-2">
          <p className="font-semibold">${shoe.price}</p>
          <Badge>{shoe.category}</Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4">
        <Button variant="outline" onClick={() => onEdit(shoe)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(shoe._id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
