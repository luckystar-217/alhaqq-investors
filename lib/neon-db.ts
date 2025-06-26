import { neon } from "@neondatabase/serverless"
import { dbConfig } from "./env"
import { logger } from "./logger"
import { DatabaseConnectionError } from "./error-handler"

// Validate Neon database configuration
function validateNeonConfig() {
  const errors: string[] = []

  if (!dbConfig.url) {
    errors.push("DATABASE_URL is required for Neon database connection")
  }

  // Check if the URL looks like a Neon URL
  if (dbConfig.url && !dbConfig.url.includes("neon.tech")) {
    logger.warn("DATABASE_URL does not appear to be a Neon database URL")
  }

  // Ensure SSL is enabled for Neon (required for production)
  if (dbConfig.url && !dbConfig.url.includes("sslmode=require") && process.env.NODE_ENV === "production") {
    errors.push("SSL mode is required for Neon database connections in production")
  }

  if (errors.length > 0) {
    const errorMessage = `Neon database configuration validation failed:\n${errors.join("\n")}`
    logger.error(errorMessage)
    throw new DatabaseConnectionError(errorMessage)
  }

  logger.info("Neon database configuration validated successfully")
}

// Initialize Neon SQL client with error handling
let sql: ReturnType<typeof neon> | null = null

try {
  validateNeonConfig()
  sql = neon(dbConfig.url!)
  logger.info("Neon database client initialized successfully")
} catch (error) {
  logger.error("Failed to initialize Neon database client", { error })

  if (process.env.NODE_ENV === "development") {
    console.error("\n🗄️ Neon Database Setup Help:")
    console.error("1. Ensure you have created a Neon database")
    console.error("2. Add your DATABASE_URL to the .env file")
    console.error("3. Ensure the URL includes sslmode=require")
    console.error("4. Example: postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require")
    console.error("5. Restart your development server")
  }

  if (process.env.NODE_ENV === "production") {
    throw error
  }
}

// Export SQL client with null check
export function getNeonSQL() {
  if (!sql) {
    throw new DatabaseConnectionError("Neon SQL client is not initialized. Check your database configuration.")
  }
  return sql
}

// Safe getter that returns null if not initialized
export function getNeonSQLSafe() {
  return sql
}

// Database health check
export async function checkNeonHealth(): Promise<{
  connected: boolean
  latency?: number
  error?: string
}> {
  if (!sql) {
    return {
      connected: false,
      error: "SQL client not initialized",
    }
  }

  try {
    const startTime = Date.now()
    await sql`SELECT 1 as health_check`
    const latency = Date.now() - startTime

    logger.info("Neon database health check passed", { latency })
    return {
      connected: true,
      latency,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown database error"
    logger.error("Neon database health check failed", { error: errorMessage })
    return {
      connected: false,
      error: errorMessage,
    }
  }
}

// Database connection retry logic
export async function connectWithRetry(maxRetries = 3, retryDelay = 1000): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const health = await checkNeonHealth()
      if (health.connected) {
        logger.info(`Database connected successfully on attempt ${attempt}`)
        return true
      }
    } catch (error) {
      logger.warn(`Database connection attempt ${attempt} failed`, { error })
    }

    if (attempt < maxRetries) {
      logger.info(`Retrying database connection in ${retryDelay}ms...`)
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
      retryDelay *= 2 // Exponential backoff
    }
  }

  logger.error(`Failed to connect to database after ${maxRetries} attempts`)
  return false
}

// Common database operations with error handling
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  const sqlClient = getNeonSQL()

  try {
    logger.debug("Executing database query", { query: query.substring(0, 100) })
    const result = await sqlClient(query, params)
    logger.debug("Database query executed successfully")
    return result as T[]
  } catch (error) {
    logger.error("Database query failed", { error, query: query.substring(0, 100) })
    throw new DatabaseConnectionError(
      `Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      error instanceof Error ? error : undefined,
    )
  }
}

// Transaction wrapper
export async function withTransaction<T>(callback: (sql: ReturnType<typeof neon>) => Promise<T>): Promise<T> {
  const sqlClient = getNeonSQL()

  try {
    await sqlClient`BEGIN`
    logger.debug("Database transaction started")

    const result = await callback(sqlClient)

    await sqlClient`COMMIT`
    logger.debug("Database transaction committed")

    return result
  } catch (error) {
    await sqlClient`ROLLBACK`
    logger.error("Database transaction rolled back", { error })
    throw error
  }
}

// Database migration helper
export async function runMigration(migrationSQL: string, migrationName: string): Promise<void> {
  try {
    logger.info(`Running migration: ${migrationName}`)
    await executeQuery(migrationSQL)
    logger.info(`Migration completed: ${migrationName}`)
  } catch (error) {
    logger.error(`Migration failed: ${migrationName}`, { error })
    throw new DatabaseConnectionError(`Migration ${migrationName} failed`, error instanceof Error ? error : undefined)
  }
}
