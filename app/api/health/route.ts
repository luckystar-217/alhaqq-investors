import { NextResponse } from "next/server"
import { env } from "@/lib/env"
import { logger } from "@/lib/logger"

interface HealthCheck {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  message?: string
  responseTime?: number
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    // Simple database connectivity check
    // In a real app, you'd use your database client here
    if (!env.DATABASE_URL) {
      return {
        service: "database",
        status: "unhealthy",
        message: "Database URL not configured",
        responseTime: Date.now() - start,
      }
    }

    return {
      service: "database",
      status: "healthy",
      message: "Database connection configured",
      responseTime: Date.now() - start,
    }
  } catch (error) {
    return {
      service: "database",
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown database error",
      responseTime: Date.now() - start,
    }
  }
}

async function checkStackAuth(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    if (!env.NEXT_PUBLIC_STACK_PROJECT_ID || !env.STACK_SECRET_SERVER_KEY) {
      return {
        service: "stack-auth",
        status: "unhealthy",
        message: "Stack Auth not configured",
        responseTime: Date.now() - start,
      }
    }

    return {
      service: "stack-auth",
      status: "healthy",
      message: "Stack Auth configured",
      responseTime: Date.now() - start,
    }
  } catch (error) {
    return {
      service: "stack-auth",
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown Stack Auth error",
      responseTime: Date.now() - start,
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
        message: "Redis not configured (optional)",
        responseTime: Date.now() - start,
      }
    }

    return {
      service: "redis",
      status: "healthy",
      message: "Redis configured",
      responseTime: Date.now() - start,
    }
  } catch (error) {
    return {
      service: "redis",
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown Redis error",
      responseTime: Date.now() - start,
    }
  }
}

export async function GET() {
  try {
    const startTime = Date.now()

    // Run health checks in parallel
    const [databaseCheck, stackAuthCheck, redisCheck] = await Promise.all([
      checkDatabase(),
      checkStackAuth(),
      checkRedis(),
    ])

    const checks = [databaseCheck, stackAuthCheck, redisCheck]
    const totalResponseTime = Date.now() - startTime

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

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || "unknown",
      uptime: process.uptime(),
      responseTime: totalResponseTime,
      checks,
      features: {
        socialLogin: env.ENABLE_SOCIAL_LOGIN,
        emailVerification: env.ENABLE_EMAIL_VERIFICATION,
        twoFactorAuth: env.ENABLE_TWO_FACTOR_AUTH,
        investmentTracking: env.ENABLE_INVESTMENT_TRACKING,
        realTimeUpdates: env.ENABLE_REAL_TIME_UPDATES,
        maintenanceMode: env.MAINTENANCE_MODE,
      },
    }

    logger.info("Health check completed", {
      status: overallStatus,
      responseTime: totalResponseTime,
    })

    // Return appropriate HTTP status code
    const httpStatus = overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503

    return NextResponse.json(response, { status: httpStatus })
  } catch (error) {
    logger.error("Health check failed", { error: error instanceof Error ? error.message : String(error) })

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
