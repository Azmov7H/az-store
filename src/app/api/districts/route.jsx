import { createSuccessResponse } from "@/lib/api-response"

const DISTRICTS_DATA = {
  Cairo: ["Downtown", "Giza Plateau", "Zamalek", "Heliopolis", "Nasr City", "Maadi", "New Cairo"],
  Giza: ["Mohandessin", "Dokki", "Agouza", "6th of October", "Sheikh Zayed", "Haram"],
  Alexandria: ["Downtown", "Borg al-Arab", "Montaza", "Stanley", "Miami"],
  Mansoura: ["Downtown", "Gharbia", "New Mansoura"],
  Tanta: ["Downtown", "North", "South"],
  Ismailia: ["Downtown", "Port Said Road", "Suez Road"],
}

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const city = url.searchParams.get("city")

    if (city && DISTRICTS_DATA[city]) {
      return createSuccessResponse({
        city,
        districts: DISTRICTS_DATA[city],
      })
    }

    return createSuccessResponse(DISTRICTS_DATA)
  } catch (error) {
    console.error("[v0] GET /api/districts error:", error)
    return createSuccessResponse(DISTRICTS_DATA)
  }
}
