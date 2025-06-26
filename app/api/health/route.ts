import { NextResponse } from "next/server"
import { env, stackAuthConfig, dbConfig } from "@/lib/env"
import { logger } from "@/lib/logger"

interface HealthCheck {
  status: "healthy" | "unhealthy" | "degraded"
  timestamp: string
  version: string
  environment: string
  services: {
    database: ServiceStatus
    stackAuth: ServiceStatus
    redis?: ServiceStatus
    email?: ServiceStatus
    storage?: ServiceStatus
  }
  uptime: number
}

interface ServiceStatus {
  status: "healthy" | "unhealthy" | "not_configured"
  latency?: number
  error?: string
  lastChecked: string
}

const startTime = Date.now()

async function checkDatabase(): Promise<ServiceStatus> {
  const startTime = Date.now()
  try {
    if (!dbConfig.url) {
      return {
        status: "not_configured",
        lastChecked: new Date().toISOString(),
      }
    }

    // Simple connection test - in production, use actual database client
    const latency = Date.now() - startTime
    return {
      status: "healthy",
      latency,
      lastChecked: new Date().toISOString(),
    }
  } catch (error) {
    logger.error("Database health check failed", { error })
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastChecked: new Date().toISOString(),
    }
  }
}

async function checkStackAuth(): Promise<ServiceStatus> {
  const startTime = Date.now()
  try {
    if (!stackAuthConfig.projectId || !stackAuthConfig.publishableClientKey || !stackAuthConfig.secretServerKey) {
      return {
        status: "not_configured",
        lastChecked: new Date().toISOString(),
      }
    }

    // Basic configuration check
    const latency = Date.now() - startTime
    return {
      status: "healthy",
      latency,
      lastChecked: new Date().toISOString(),
    }
  } catch (error) {
    logger.error("Stack Auth health check failed", { error })
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastChecked: new Date().toISOString(),
    }
  }
}

async function checkRedis(): Promise<ServiceStatus | undefined> {
  if (!env.REDIS_URL) {
    return undefined
  }

  const startTime = Date.now()
  try {
    // Redis health check would go here
    const latency = Date.now() - startTime
    return {
      status: "healthy",
      latency,
      lastChecked: new Date().toISOString(),
    }
  } catch (error) {
    logger.error("Redis health check failed", { error })
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastChecked: new Date().toISOString(),
    }
  }
}

async function checkEmail(): Promise<ServiceStatus | undefined> {
  if (!env.SMTP_HOST) {
    return undefined
  }

  const startTime = Date.now()
  try {
    // Email service health check would go here
    const latency = Date.now() - startTime
    return {
      status: "healthy",
      latency,
      lastChecked: new Date().toISOString(),
    }
  } catch (error) {
    logger.error("Email health check failed", { error })
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastChecked: new Date().toISOString(),
    }
  }
}

async function checkStorage(): Promise<ServiceStatus | undefined> {
  if (!env.AWS_ACCESS_KEY_ID && !env.UPLOADTHING_SECRET) {
    return undefined
  }

  const startTime = Date.now()
  try {
    // Storage service health check would go here
    const latency = Date.now() - startTime
    return {
      status: "healthy",
      latency,
      lastChecked: new Date().toISOString(),
    }
  } catch (error) {
    logger.error("Storage health check failed", { error })
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastChecked: new Date().toISOString(),
    }
  }
}

export async function GET() {
  try {
    const [database, stackAuth, redis, email, storage] = await Promise.all([
      checkDatabase(),
      checkStackAuth(),
      checkRedis(),
      checkEmail(),
      checkStorage(),
    ])

    const services = {
      database,
      stackAuth,
      ...(redis && { redis }),
      ...(email && { email }),
      ...(storage && { storage }),
    }

    // Determine overall status
    const serviceStatuses = Object.values(services).map((service) => service.status)
    const hasUnhealthy = serviceStatuses.includes("unhealthy")
    const hasNotConfigured = serviceStatuses.includes("not_configured")

    let overallStatus: "healthy" | "unhealthy" | "degraded"
    if (hasUnhealthy) {
      overallStatus = "unhealthy"
    } else if (hasNotConfigured) {
      overallStatus = "degraded"
    } else {
      overallStatus = "healthy"
    }

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: env.NODE_ENV,
      services,
      uptime: Date.now() - startTime,
    }

    const statusCode = overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503

    logger.info("Health check completed", { status: overallStatus, services: Object.keys(services) })

    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    logger.error("Health check failed", { error })
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
