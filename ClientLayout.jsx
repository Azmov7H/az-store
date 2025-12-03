"use client"


import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()
const LanguageContext = createContext()
export const CartContext = createContext()

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}

function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved) {
      setIsDark(saved === "dark")
      document.documentElement.classList.toggle("dark", saved === "dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDark(prefersDark)
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }, [])

  const toggle = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem("theme", newDark ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newDark)
  }

  return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>
}

function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en")

  useEffect(() => {
    const saved = localStorage.getItem("language")
    if (saved) setLang(saved)
  }, [])

  const toggle = () => {
    const newLang = lang === "en" ? "ar" : "en"
    setLang(newLang)
    localStorage.setItem("language", newLang)
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = newLang
  }

  return <LanguageContext.Provider value={{ lang, toggle }}>{children}</LanguageContext.Provider>
}

function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setItems(JSON.parse(saved))
  }, [])

  const addItem = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize,
      )

      const updated = existing
        ? prev.map((item) => (item === existing ? { ...item, quantity: item.quantity + quantity } : item))
        : [...prev, { ...product, quantity, selectedColor, selectedSize }]

      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  const removeItem = (id, selectedColor, selectedSize) => {
    setItems((prev) => {
      const updated = prev.filter(
        (item) => !(item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize),
      )
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  const updateQuantity = (id, quantity, selectedColor, selectedSize) => {
    setItems((prev) => {
      const updated =
        quantity <= 0
          ? prev.filter(
              (item) => !(item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize),
            )
          : prev.map((item) =>
              item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
                ? { ...item, quantity }
                : item,
            )
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  const clear = () => {
    setItems([])
    localStorage.setItem("cart", JSON.stringify([]))
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export default function ClientLayout({ children }) {
  return (
    <>

          <CartProvider>
            {children}
          </CartProvider>

    </>
  )
}
