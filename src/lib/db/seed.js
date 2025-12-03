// Database seeding script for initial data
import { connectDB, Shoe } from "./index"

const sampleShoes = [
  {
    id: "1",
    title: "Adidas Ultraboost 22",
    description: "Premium running shoes with boost technology",
    price: 180,
    discount: 20,
    image: "/adidas-running-shoe.jpg",
    category: "running",
    availableColors: ["black", "white", "blue"],
    availableSizes: ["38", "39", "40", "41", "42", "43"],
    stock: 45,
    rating: 4.8,
    reviews: 234,
    isNew: true,
  },
  {
    id: "2",
    title: "Nike Air Force 1",
    description: "Classic casual shoe for everyday wear",
    price: 120,
    discount: 10,
    image: "/nike-air-force-white.jpg",
    category: "casual",
    availableColors: ["white", "black", "red"],
    availableSizes: ["36", "37", "38", "39", "40", "41", "42"],
    stock: 78,
    rating: 4.6,
    reviews: 512,
    isNew: false,
  },
  {
    id: "3",
    title: "Puma RS-X",
    description: "Stylish retro-inspired sneaker",
    price: 95,
    discount: 15,
    image: "/puma-retro-sneaker.jpg",
    category: "casual",
    availableColors: ["black", "blue", "gray"],
    availableSizes: ["37", "38", "39", "40", "41", "42", "43"],
    stock: 32,
    rating: 4.4,
    reviews: 189,
    isNew: false,
  },
  {
    id: "4",
    title: "Salomon Speedcross 5",
    description: "Trail running shoes for outdoor adventures",
    price: 150,
    discount: 25,
    image: "/salomon-trail-running.jpg",
    category: "running",
    availableColors: ["black", "gray", "green"],
    availableSizes: ["39", "40", "41", "42", "43", "44", "45"],
    stock: 28,
    rating: 4.7,
    reviews: 145,
    isNew: true,
  },
  {
    id: "5",
    title: "Clarks Desert Boot",
    description: "Timeless formal boots for professional look",
    price: 140,
    discount: 0,
    image: "/clarks-desert-boot-brown.jpg",
    category: "formal",
    availableColors: ["brown", "black"],
    availableSizes: ["38", "39", "40", "41", "42", "43", "44"],
    stock: 22,
    rating: 4.5,
    reviews: 98,
    isNew: false,
  },
  {
    id: "6",
    title: "New Balance 990v5",
    description: "Comfortable everyday training shoe",
    price: 175,
    discount: 10,
    image: "/new-balance-990-running.jpg",
    category: "sports",
    availableColors: ["navy", "gray", "black"],
    availableSizes: ["37", "38", "39", "40", "41", "42", "43", "44"],
    stock: 55,
    rating: 4.7,
    reviews: 267,
    isNew: false,
  },
  {
    id: "7",
    title: "Birkenstock Arizona",
    description: "Comfortable sandals for casual wear",
    price: 85,
    discount: 12,
    image: "/classic-birkenstock-sandals.png",
    category: "sandals",
    availableColors: ["white", "black", "blue"],
    availableSizes: ["36", "37", "38", "39", "40", "41", "42"],
    stock: 40,
    rating: 4.3,
    reviews: 156,
    isNew: false,
  },
  {
    id: "8",
    title: "Timberland 6 Inch",
    description: "Durable waterproof work boots",
    price: 195,
    discount: 15,
    image: "/timberland-boots-yellow.jpg",
    category: "boots",
    availableColors: ["brown", "black", "tan"],
    availableSizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
    stock: 35,
    rating: 4.6,
    reviews: 203,
    isNew: true,
  },
]

export async function seedDatabase() {
  try {
    await connectDB()

    // Clear existing data
    await Shoe.deleteMany({})
    console.log("[Seed] Cleared existing shoes")

    // Insert sample shoes
    await Shoe.insertMany(sampleShoes)
    console.log("[Seed] Inserted sample shoes")

    console.log("[Seed] Database seeding completed successfully")
  } catch (error) {
    console.error("[Seed] Error seeding database:", error)
    throw error
  }
}
