"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CommentForm({ onAdded }) {
  const [form, setForm] = useState({ username: "", email: "", commit: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.commit) return toast.error("All fields required")
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:5000/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to submit comment")
      const newComment = await res.json()
      toast.success("Comment added!")
      setForm({ username: "", email: "", commit: "" })
      onAdded && onAdded(newComment)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <Input name="username" placeholder="Your Name" value={form.username} onChange={handleChange} />
      <Input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} />
      <Textarea name="commit" placeholder="Your Comment" value={form.commit} onChange={handleChange} />
      <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
    </form>
  )
}
