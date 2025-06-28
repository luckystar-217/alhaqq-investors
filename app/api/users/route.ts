import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "@/lib/auth"
import { createUser, getUserByEmail } from "@/lib/database"
import { logger } from "@/lib/logger"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive data
    const { password_hash, ...safeUser } = user

    return NextResponse.json({ user: safeUser })
  } catch (error) {
    logger.error("Error fetching user", { error })
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, fullName } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await createUser({
      email,
      username,
      passwordHash,
      fullName,
    })

    logger.info("User created successfully", { userId: user.id, email })

    // Remove sensitive data from response
    const { password_hash, ...safeUser } = user

    return NextResponse.json(safeUser, { status: 201 })
  } catch (error) {
    logger.error("Error creating user", { error })
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
