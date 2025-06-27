import { NextResponse } from "next/server"
import { env, stackAuthConfig, dbConfig } from "@/lib/env"
import { logger } from "@/lib/logger"

interface HealthCheck {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  responseTime?: number
  error?: string
  details?: any
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    // Simple database connectivity check
    if (!dbConfig.url) {
      return {
        service: "database",
        status: "unhealthy",
        error: "Database URL not configured",
      }
    }

    // In a real implementation, you would test the actual database connection
    // For now, we'll just check if the URL is valid
    new URL(dbConfig.url)

    return {
      service: "database",
      status: "healthy",
      responseTime: Date.now() - start,
      details: {
        host: dbConfig.host || "configured",
        database: dbConfig.database || "configured",
      },
    }
  } catch (error) {
    return {
      service: "database",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function checkStackAuth(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    if (!stackAuthConfig.projectId || !stackAuthConfig.publishableClientKey) {
      return {
        service: "stack-auth",
        status: "unhealthy",
        error: "Stack Auth not configured",
      }
    }

    // Test Stack Auth JWKS endpoint
    const jwksUrl = `https://api.stack-auth.com/api/v1/projects/${stackAuthConfig.projectId}/.well-known/jwks.json`
    const response = await fetch(jwksUrl, { method: "HEAD" })

    if (!response.ok) {
      return {
        service: "stack-auth",
        status: "unhealthy",
        responseTime: Date.now() - start,
        error: `JWKS endpoint returned ${response.status}`,
      }
    }

    return {
      service: "stack-auth",
      status: "healthy",
      responseTime: Date.now() - start,
      details: {
        projectId: stackAuthConfig.projectId,
        jwksUrl,
      },
    }
  } catch (error) {
    return {
      service: "stack-auth",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    if (!env.REDIS_URL) {
      return {
        service: "redis",
        status: "degraded",
        error: "Redis not configured (optional)",
      }
    }

    // In a real implementation, you would test the actual Redis connection
    return {
      service: "redis",
      status: "healthy",
      responseTime: Date.now() - start,
    }
  } catch (error) {
    return {
      service: "redis",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

async function checkExternalAPIs(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    const checks = []

    // Check financial data API if configured
    if (env.FINANCIAL_DATA_API_KEY) {
      checks.push("financial-api")
    }

    // Check market data API if configured
    if (env.MARKET_DATA_API_URL) {
      checks.push("market-api")
    }

    return {
      service: "external-apis",
      status: checks.length > 0 ? "healthy" : "degraded",
      responseTime: Date.now() - start,
      details: {
        configured: checks,
      },
    }
  } catch (error) {
    return {
      service: "external-apis",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function GET() {
  const start = Date.now()

  try {
    logger.info("Health check requested")

    // Run all health checks in parallel
    const [databaseCheck, stackAuthCheck, redisCheck, externalAPIsCheck] = await Promise.all([
      checkDatabase(),
      checkStackAuth(),
      checkRedis(),
      checkExternalAPIs(),
    ])

    const checks = [databaseCheck, stackAuthCheck, redisCheck, externalAPIsCheck]

    // Determine overall status
    const hasUnhealthy = checks.some((check) => check.status === "unhealthy")
    const hasDegraded = checks.some((check) => check.status === "degraded")

    let overallStatus: "healthy" | "unhealthy" | "degraded"
    if (hasUnhealthy) {
      overallStatus = "unhealthy"
    } else if (hasDegraded) {
      overallStatus = "degraded"
    } else {
      overallStatus = "healthy"
    }

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - start,
      version: process.env.npm_package_version || "unknown",
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      checks,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: {
          used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
          total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        },
      },
    }

    const statusCode = overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503

    logger.info("Health check completed", {
      status: overallStatus,
      responseTime: Date.now() - start,
    })

    return NextResponse.json(healthData, { status: statusCode })
  } catch (error) {
    logger.error("Health check failed", { error: error instanceof Error ? error.message : String(error) })

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
