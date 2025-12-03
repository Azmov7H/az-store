import { connectDB } from "@/lib/db/connection"
import { Shoe } from "@/lib/db/schemas"
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response"
import { validateShoeData } from "@/lib/validators"



///Cereat
export async function GET(request, { params }) {
  try {
    await connectDB()
    const { id } = await params   // مهم جداً

    const shoe = await Shoe.findOne({ id })
    if (!shoe) {
      return createErrorResponse("Shoe not found", 404)
    }

    return createSuccessResponse(shoe)
  } catch (error) {
    console.error("[v0] GET /api/shoes/[id] error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}


export async function PUT(request, { params }) {
  try {
    await connectDB()

    const { id } =await params
    const body = await request.json()

    // Validate
    const validation = validateShoeData(body)
    if (!validation.valid) {
      return createErrorResponse(validation.error, 400)
    }

    // Update using MongoDB _id
    const shoe = await Shoe.findByIdAndUpdate(id, body, { new: true })

    if (!shoe) {
      return createErrorResponse("Shoe not found", 404)
    }

    return createSuccessResponse(shoe)

  } catch (error) {
    console.error("[v0] PUT /api/shoes/[id] error:", error)
    return createErrorResponse("Failed to update shoe", 500)
  }
}


export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const { id } = await params   // تعديل هنا أيضاً

    const shoe = await Shoe.findOneAndDelete({ id })
    if (!shoe) {
      return createErrorResponse("Shoe not found", 404)
    }

    return createSuccessResponse({ message: "Shoe deleted successfully", shoe })
  } catch (error) {
    console.error("[v0] DELETE /api/shoes/[id] error:", error)
    return createErrorResponse("Failed to delete shoe", 500)
  }
}
