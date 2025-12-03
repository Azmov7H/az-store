export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-+()]+$/
  return phoneRegex.test(phone) && phone.length >= 10
}

export function validateOrder(data) {
  const errors = []

  if (!data.customerName?.trim()) errors.push("Customer name is required")
  if (!data.email?.trim() || !validateEmail(data.email)) errors.push("Valid email is required")
  if (!data.phone?.trim() || !validatePhone(data.phone)) errors.push("Valid phone number is required")
  if (!data.city?.trim()) errors.push("City is required")
  if (!data.district?.trim()) errors.push("District is required")
  if (!data.street?.trim()) errors.push("Street address is required")
  if (!Array.isArray(data.products) || data.products.length === 0) errors.push("At least one product is required")

  return { isValid: errors.length === 0, errors }
}

export function createErrorResponse(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export function createSuccessResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
