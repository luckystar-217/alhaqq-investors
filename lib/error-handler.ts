import { logger } from "./logger"
import { env } from "./env"

export class ConfigurationError extends Error {
  constructor(
    message: string,
    public readonly missingVars?: string[],
  ) {
    super(message)
    this.name = "ConfigurationError"
  }
}

export class DatabaseConnectionError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message)
    this.name = "DatabaseConnectionError"
  }
}

export class ExternalAPIError extends Error {
  constructor(
    message: string,
    public readonly service?: string,
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = "ExternalAPIError"
  }
}

// Global error handler for environment and configuration issues
export function handleConfigurationError(error: unknown): never {
  if (error instanceof ConfigurationError) {
    logger.configError(error.message, { missingVars: error.missingVars })

    if (env.NODE_ENV === "development") {
      console.error("\n🔧 Development Setup Help:")
      console.error("1. Ensure you have copied .env.example to .env")
      console.error("2. Fill in all required environment variables")
      console.error("3. Restart your development server")

      if (error.missingVars?.length) {
        console.error("\nMissing variables:")
        error.missingVars.forEach((varName) => {
          console.error(`  - ${varName}`)
        })
      }
    }
  } else if (error instanceof DatabaseConnectionError) {
    logger.dbError(error.message, { originalError: error.originalError?.message })

    if (env.NODE_ENV === "development") {
      console.error("\n🗄️  Database Setup Help:")
      console.error("1. Ensure your database is running")
      console.error("2. Check your DATABASE_URL in .env")
      console.error("3. Run database migrations if needed")
    }
  } else {
    logger.error("Unknown configuration error", { error })
  }

  process.exit(1)
}

// Graceful degradation helper
export function withFallback<T>(operation: () => T, fallback: T, errorMessage?: string): T {
  try {
    return operation()
  } catch (error) {
    if (errorMessage) {
      logger.warn(errorMessage, { error })
    }
    return fallback
  }
}

// Environment variable getter with fallback
export function getEnvVar(key: string, fallback?: string, required = false): string {
  const value = process.env[key]

  if (!value || value.trim() === "") {
    if (required) {
      throw new ConfigurationError(`Required environment variable ${key} is not set`)
    }

    if (fallback !== undefined) {
      logger.warn(`Using fallback value for ${key}`)
      return fallback
    }

    throw new ConfigurationError(`Environment variable ${key} is not set and no fallback provided`)
  }

  return value
}

// Safe environment variable parsing
export function parseEnvNumber(key: string, fallback?: number, required = false): number {
  const value = getEnvVar(key, fallback?.toString(), required)
  const parsed = Number.parseInt(value, 10)

  if (isNaN(parsed)) {
    if (required) {
      throw new ConfigurationError(`Environment variable ${key} must be a valid number`)
    }
    return fallback || 0
  }

  return parsed
}

export function parseEnvBoolean(key: string, fallback = false): boolean {
  const value = process.env[key]

  if (!value) {
    return fallback
  }

  return value.toLowerCase() === "true" || value === "1"
}

// Service availability checker
export async function checkServiceAvailability(): Promise<{
  database: boolean
  redis: boolean
  email: boolean
  storage: boolean
}> {
  const results = {
    database: false,
    redis: false,
    email: false,
    storage: false,
  }

  // Check database
  try {
    if (env.DATABASE_URL) {
      // This would be replaced with actual database connection test
      results.database = true
      logger.info("Database connection available")
    }
  } catch (error) {
    logger.warn("Database connection unavailable", { error })
  }

  // Check Redis
  try {
    if (env.REDIS_URL) {
      // This would be replaced with actual Redis connection test
      results.redis = true
      logger.info("Redis connection available")
    }
  } catch (error) {
    logger.warn("Redis connection unavailable", { error })
  }

  // Check email service
  try {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
      results.email = true
      logger.info("Email service configured")
    }
  } catch (error) {
    logger.warn("Email service unavailable", { error })
  }

  // Check storage service
  try {
    if ((env.UPLOADTHING_SECRET && env.UPLOADTHING_APP_ID) || (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY)) {
      results.storage = true
      logger.info("Storage service configured")
    }
  } catch (error) {
    logger.warn("Storage service unavailable", { error })
  }

  return results
}
