import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { logger } from "@/lib/logger"
import { env } from "@/lib/env"

// Mock user database - In production, use a real database
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      logger.warn("Invalid content type for signup", { contentType })
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
    }

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      logger.error("Failed to parse JSON in signup", {
        error: parseError instanceof Error ? parseError.message : String(parseError),
        contentType,
      })
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
    }

    const { firstName, lastName, email, password } = body

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      logger.warn("Missing required fields in signup", {
        hasFirstName: !!firstName,
        hasLastName: !!lastName,
        hasEmail: !!email,
        hasPassword: !!password,
      })
      return NextResponse.json(
        { error: "All fields are required", fields: ["firstName", "lastName", "email", "password"] },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      logger.warn("Invalid email format in signup", { email })
      return NextResponse.json(
        { error: "Invalid email format" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      logger.warn("User already exists", { email })
      return NextResponse.json(
        { error: "User already exists with this email" },
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
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

    logger.info("User created successfully", { userId: newUser.id, email: newUser.email })

    // Return success response (don't include password)
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: userWithoutPassword,
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      },
    )
  } catch (error) {
    logger.error("Signup error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: "Internal server error",
        message: env.NODE_ENV === "development" ? String(error) : "Something went wrong",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      },
    )
  }
}
