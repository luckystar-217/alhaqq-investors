import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbolsParam = searchParams.get("symbols")
    const symbols = symbolsParam ? symbolsParam.split(",") : undefined

    const marketData = await Database.getMarketData(symbols)

    return NextResponse.json({ data: marketData })
  } catch (error) {
    logger.error("Market data fetch failed", {}, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
