// app/comments/page.jsx
import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

async function fetchComments() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch comments")
  return await res.json()
}

export default async function CommentsPage() {
  const comments = await fetchComments()

  return (
    <div className="w-full max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {comments.map((c) => (
        <Card
          key={c._id}
          className=" rounded-3xl shadow-lg hover:shadow-2xl transition-shadow border  overflow-hidden"
        >
          {/* Header */}
          <CardHeader className="flex items-center gap-3 p-4">
            <Image
            width={300}
            height={300}
            loading="lazy"
              src={`https://ui-avatars.com/api/?name=${c.username}&background=random&color=fff&size=64`}
              alt={c.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <CardTitle className="text-sm font-semibold ">{c.username}</CardTitle>
              <span className="text-xs ">{new Date(c.createdAt).toLocaleString()}</span>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="px-4 pb-4 pt-0">
            <p className="text-sm ">{c.commit}</p>
            <p className="text-xs  mt-2">{c.email}</p>
          </CardContent>

          {/* Footer - Interactions */}
          <CardFooter className="px-4 py-2 flex justify-between border-t border-gray-100">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">Like</Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">Comment</Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">Share</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
