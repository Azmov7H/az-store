const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(\+?20|0)?1[0-2]\d{8}$/

export function validateEmail(email) {
  return emailRegex.test(email)
}

export function validatePhone(phone) {
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

export function validateShoeData(data) {
  const errors = []
  if (!data.title || data.title.length < 3 || data.title.length > 100) {
    errors.push("Title must be 3-100 characters")
  }
  if (!data.description || data.description.length < 10) {
    errors.push("Description is required and must be at least 10 characters")
  }
  if (data.price === undefined || data.price <= 0) {
    errors.push("Price must be a positive number")
  }
  if (data.discount && (data.discount < 0 || data.discount > 100)) {
    errors.push("Discount must be between 0-100")
  }
  if (!Array.isArray(data.availableColors)) {
    errors.push("Available colors must be an array")
  }
  if (!Array.isArray(data.availableSizes)) {
    errors.push("Available sizes must be an array")
  }
  if (!data.stock || data.stock <= 0) {
    errors.push("Stock must be a positive number")
  }
  if (!data.image) {
    errors.push("Image is required")
  }

  return {
    valid: errors.length === 0,
    error: errors[0] || null,
  }
}

export function validateOrder(data) {
  const errors = []
  if (!data.customerName || data.customerName.length < 2) {
    errors.push("Customer name is required")
  }
  if (!validateEmail(data.customerEmail)) {
    errors.push("Valid email is required")
  }
  if (!validatePhone(data.customerPhone)) {
    errors.push("Valid phone number is required")
  }
  if (!data.customerCity) {
    errors.push("City is required")
  }
  if (!data.customerDistrict) {
    errors.push("District is required")
  }
  if (!data.customerStreet) {
    errors.push("Street address is required")
  }
  if (!Array.isArray(data.products) || data.products.length === 0) {
    errors.push("At least one product is required")
  }
  if (data.total === undefined || data.total <= 0) {
    errors.push("Valid total is required")
  }

  return {
    valid: errors.length === 0,
    error: errors[0] || null,
  }
}

export function validateContact(data) {
  const errors = []
  if (!data.name || data.name.length < 2) {
    errors.push("Name is required")
  }
  if (!validateEmail(data.email)) {
    errors.push("Valid email is required")
  }
  if (!data.message || data.message.length < 10) {
    errors.push("Message must be at least 10 characters")
  }

  return {
    valid: errors.length === 0,
    error: errors[0] || null,
  }
}
