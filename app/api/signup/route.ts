import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Mock user database - In production, use a real database
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      image: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Return success response (don't include password)
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
