import React from "react"

export default function Logo() {
  return (
    <div className="flex items-center gap-2 w-max">
      {/* Sneaker Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d="M3 14s1-.5 4 1 5 3 9 3 5-2 5-2v-3l-4-2-3-4-3 2-4-1-1 6z" />
        <path d="M3 14v3c0 .6.4 1 1 1h2" />
      </svg>

      {/* Brand Name */}
      <h3 className="text-xl font-bold tracking-wide">
        Az Store
      </h3>
    </div>
  )
}
