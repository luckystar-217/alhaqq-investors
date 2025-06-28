import { type NextRequest, NextResponse } from "next/server"
import { getMarketData, updateMarketData } from "@/lib/database"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbolsParam = searchParams.get("symbols")
    const symbols = symbolsParam ? symbolsParam.split(",") : undefined

    const marketData = await getMarketData(symbols)

    return NextResponse.json({ marketData })
  } catch (error) {
    logger.error("Error fetching market data", { error })
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      symbol,
      name,
      currentPrice,
      change24h,
      changePercentage24h,
      marketCap,
      volume24h,
      high24h,
      low24h,
      assetType,
    } = body

    if (!symbol || !currentPrice) {
      return NextResponse.json({ error: "Symbol and current price are required" }, { status: 400 })
    }

    await updateMarketData({
      symbol,
      name,
      currentPrice,
      change24h,
      changePercentage24h,
      marketCap,
      volume24h,
      high24h,
      low24h,
      assetType,
    })

    logger.info("Market data updated successfully", { symbol })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Error updating market data", { error })
    return NextResponse.json({ error: "Failed to update market data" }, { status: 500 })
  }
}
