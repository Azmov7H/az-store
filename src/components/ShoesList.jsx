"use client"

import React, { useEffect, useState } from "react"
import { getShoes, deleteShoe } from "@/lib/api"
import ShoeCard from "./ShoeCard"
import ShoeForm from "./ShoeForm"
import { Button } from "@/components/ui/button"

export default function ShoesList() {
  const [shoes, setShoes] = useState([])
  const [editing, setEditing] = useState(null)

  async function loadData() {
    const data = await getShoes()
    setShoes(data)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleDelete(id) {
    await deleteShoe(id)
    loadData()
  }

  return (
    <div className="grid gap-6">
      <ShoeForm editData={editing} onSuccess={() => { setEditing(null); loadData() }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {shoes.map((shoe) => (
          <ShoeCard
            key={shoe._id}
            shoe={shoe}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
