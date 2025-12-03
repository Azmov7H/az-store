// Centralized error handling for API routes

export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.name = "ApiError"
  }
}

export const errorHandler = {
  // Handle different error types
  handle: (error, res) => {
    console.error("[API Error]", error)

    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        timestamp: new Date().toISOString(),
      })
    } else if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation failed",
        errors: error.errors,
        timestamp: new Date().toISOString(),
      })
    } else {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
        timestamp: new Date().toISOString(),
      })
    }
  },

  // Common errors
  notFound: (resource = "Resource") => {
    return new ApiError(`${resource} not found`, 404)
  },

  badRequest: (message, errors = null) => {
    return new ApiError(message, 400, errors)
  },

  unauthorized: () => {
    return new ApiError("Unauthorized access", 401)
  },

  forbidden: () => {
    return new ApiError("Forbidden", 403)
  },

  conflict: (message) => {
    return new ApiError(message, 409)
  },
}
