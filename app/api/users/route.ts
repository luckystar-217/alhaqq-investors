import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { Database } from "@/lib/database"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, username, password } = body

    // Validate required fields
    if (!email || !name || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await Database.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create user
    const user = await Database.createUser({
      email,
      name,
      username,
      password_hash,
    })

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    logger.info("User created successfully", { userId: user.id, email })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
      },
    })
  } catch (error) {
    logger.error("User creation failed", {}, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const id = searchParams.get("id")

    if (email) {
      const user = await Database.getUserByEmail(email)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      return NextResponse.json({ user })
    }

    if (id) {
      const user = await Database.getUserById(id)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      return NextResponse.json({ user })
    }

    return NextResponse.json({ error: "Email or ID parameter required" }, { status: 400 })
  } catch (error) {
    logger.error("User fetch failed", {}, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
