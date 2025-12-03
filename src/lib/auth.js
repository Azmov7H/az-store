// Admin authentication utilities

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  email: "admin@shoestore.com",
}

export const authUtils = {
  // Verify admin login
  verifyAdmin: (username, password) => {
    return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
  },

  // Check if admin token is valid (simple implementation)
  verifyAdminToken: (token) => {
    // In production, use JWT
    if (!token) return false
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8")
      const [user, pass] = decoded.split(":")
      return user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password
    } catch {
      return false
    }
  },

  // Generate basic auth token
  generateToken: (username, password) => {
    return Buffer.from(`${username}:${password}`).toString("base64")
  },

  // Verify request is from admin
  isAdminRequest: (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) return false
    const token = authHeader.substring(7)
    return authUtils.verifyAdminToken(token)
  },
}
