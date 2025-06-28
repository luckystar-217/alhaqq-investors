import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, name, description } = body

    // Validate required fields
    if (!user_id || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create portfolio
    const portfolio = await Database.createPortfolio({
      user_id,
      name,
      description,
    })

    if (!portfolio) {
      return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 })
    }

    logger.info("Portfolio created successfully", { portfolioId: portfolio.id, userId: user_id })

    return NextResponse.json({ portfolio })
  } catch (error) {
    logger.error("Portfolio creation failed", {}, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID parameter required" }, { status: 400 })
    }

    const portfolios = await Database.getUserPortfolios(userId)

    return NextResponse.json({ portfolios })
  } catch (error) {
    logger.error("Portfolios fetch failed", {}, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
