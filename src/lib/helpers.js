export function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
}

export function generateId(prefix = "ID") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function formatPrice(price) {
  return Number.parseFloat(price).toFixed(2)
}

export function calculateDiscount(price, discountPercent) {
  return formatPrice((price * discountPercent) / 100)
}

export function calculateFinalPrice(price, discountPercent = 0) {
  const discount = (price * discountPercent) / 100
  return formatPrice(price - discount)
}

export function calculateOrderTotal(products) {
  let total = 0
  products.forEach((product) => {
    const finalPrice = calculateFinalPrice(product.price, product.discount || 0)
    total += finalPrice * product.quantity
  })
  return formatPrice(total)
}

export function formatDate(date = new Date()) {
  return new Date(date).toISOString().split("T")[0]
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function paginate(array, page = 1, limit = 10) {
  const start = (page - 1) * limit
  const end = start + limit
  return {
    data: array.slice(start, end),
    total: array.length,
    page,
    limit,
    pages: Math.ceil(array.length / limit),
  }
}

export function search(items, searchTerm, searchFields) {
  if (!searchTerm) return items
  const term = searchTerm.toLowerCase()
  return items.filter((item) => searchFields.some((field) => String(item[field]).toLowerCase().includes(term)))
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
