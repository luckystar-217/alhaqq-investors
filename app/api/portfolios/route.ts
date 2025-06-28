import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "@/lib/auth"
import { getUserPortfolios, createPortfolio, getUserByEmail } from "@/lib/database"
import { logger } from "@/lib/logger"

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

    const portfolios = await getUserPortfolios(user.id)

    return NextResponse.json({ portfolios })
  } catch (error) {
    logger.error("Error fetching portfolios", { error })
    return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, portfolioType, riskLevel, isPublic } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: "Portfolio name is required" }, { status: 400 })
    }

    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const portfolio = await createPortfolio({
      userId: user.id,
      name: name.trim(),
      description,
      portfolioType,
      riskLevel,
      isPublic,
    })

    logger.info("Portfolio created successfully", { portfolioId: portfolio.id, userId: user.id })

    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    logger.error("Error creating portfolio", { error })
    return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 })
  }
}
