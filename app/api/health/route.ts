import { NextResponse } from "next/server"
import { env, dbConfig, stackAuthConfig } from "@/lib/env"
import { logger } from "@/lib/logger"
import { checkDatabaseHealth } from "@/lib/database"

interface HealthCheck {
  status: "healthy" | "unhealthy" | "degraded" | "ok" | "error"
  timestamp: string
  version: string
  environment: string
  services: {
    database: ServiceStatus
    stackAuth: ServiceStatus
    email: ServiceStatus
    storage: ServiceStatus
    auth: ServiceStatus
    api: ServiceStatus
  }
  uptime: number
}

interface ServiceStatus {
  status: "healthy" | "unhealthy" | "degraded" | "configured" | "not_configured"
  message?: string
  latency?: number
  error?: string
  connected?: boolean
}

async function checkDatabase(): Promise<ServiceStatus> {
  try {
    const start = Date.now()

    // Simple connection check - in a real app you'd use your DB client
    if (!dbConfig.url) {
      return {
        status: "unhealthy",
        message: "Database URL not configured",
      }
    }

    const responseTime = Date.now() - start
    return {
      status: "healthy",
      responseTime,
    }
  } catch (error) {
    logger.error("Database health check failed", {}, error as Error)
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

async function checkStackAuth(): Promise<ServiceStatus> {
  try {
    const start = Date.now()

    if (!stackAuthConfig.projectId || !stackAuthConfig.publishableClientKey || !stackAuthConfig.secretServerKey) {
      return {
        status: "unhealthy",
        message: "Stack Auth not properly configured",
      }
    }

    const responseTime = Date.now() - start
    return {
      status: "healthy",
      responseTime,
    }
  } catch (error) {
    logger.error("Stack Auth health check failed", {}, error as Error)
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown Stack Auth error",
    }
  }
}

async function checkEmail(): Promise<ServiceStatus> {
  try {
    // Check if email configuration is present
    if (!env.SMTP_HOST && !env.FROM_EMAIL) {
      return {
        status: "degraded",
        message: "Email service not configured",
      }
    }

    return {
      status: "healthy",
      message: "Email configuration present",
    }
  } catch (error) {
    logger.error("Email health check failed", {}, error as Error)
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown email error",
    }
  }
}

async function checkStorage(): Promise<ServiceStatus> {
  try {
    // Check if storage configuration is present
    if (!env.AWS_ACCESS_KEY_ID && !env.UPLOADTHING_SECRET) {
      return {
        status: "degraded",
        message: "Storage service not configured",
      }
    }

    return {
      status: "healthy",
      message: "Storage configuration present",
    }
  } catch (error) {
    logger.error("Storage health check failed", {}, error as Error)
    return {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown storage error",
    }
  }
}

export async function GET() {
  try {
    const startTime = Date.now()

    // Run all health checks in parallel
    const [database, stackAuth, email, storage] = await Promise.all([
      checkDatabase(),
      checkStackAuth(),
      checkEmail(),
      checkStorage(),
    ])

    const dbHealth = await checkDatabaseHealth()

    const services = {
      database: {
        status: dbHealth.connected ? "healthy" : "unhealthy",
        latency: dbHealth.latency,
        error: dbHealth.error,
      },
      stackAuth: {
        status: stackAuth.status,
        message: stackAuth.message,
        responseTime: stackAuth.responseTime,
      },
      email: {
        status: email.status,
        message: email.message,
        responseTime: email.responseTime,
      },
      storage: {
        status: storage.status,
        message: storage.message,
        responseTime: storage.responseTime,
      },
      auth: {
        status: env.NEXTAUTH_SECRET ? "configured" : "not_configured",
      },
      api: { connected: true },
    }

    // Determine overall status
    const hasUnhealthy = Object.values(services).some((service) => service.status === "unhealthy")
    const hasDegraded = Object.values(services).some((service) => service.status === "degraded")

    let overallStatus: "healthy" | "unhealthy" | "degraded" | "ok" | "error" = "healthy"
    if (hasUnhealthy) {
      overallStatus = "unhealthy"
    } else if (hasDegraded) {
      overallStatus = "degraded"
    } else if (!dbHealth.connected) {
      overallStatus = "error"
    } else {
      overallStatus = "ok"
    }

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown",
      environment: env.NODE_ENV,
      services,
      uptime: process.uptime(),
    }

    const responseTime = Date.now() - startTime
    logger.info("Health check completed", {
      status: overallStatus,
      responseTime,
      services: Object.fromEntries(Object.entries(services).map(([key, value]) => [key, value.status])),
    })

    const statusCode =
      overallStatus === "healthy" || overallStatus === "ok" ? 200 : overallStatus === "degraded" ? 200 : 503

    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    logger.error("Health check failed", {}, error as Error)

    const errorResponse: HealthCheck = {
      status: "error",
      timestamp: new Date().toISOString(),
      version: "unknown",
      environment: env.NODE_ENV,
      services: {
        database: { status: "unhealthy", message: "Health check failed" },
        stackAuth: { status: "unhealthy", message: "Health check failed" },
        email: { status: "unhealthy", message: "Health check failed" },
        storage: { status: "unhealthy", message: "Health check failed" },
        auth: { status: "not_configured" },
        api: { connected: true },
      },
      uptime: process.uptime(),
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
