export function createSuccessResponse(data, message = "Success", statusCode = 200) {
  return new Response(
    JSON.stringify({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    }),
    {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    },
  )
}

export function createErrorResponse(message = "Error", statusCode = 500, errors = null) {
  return new Response(
    JSON.stringify({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    }),
    {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    },
  )
}
