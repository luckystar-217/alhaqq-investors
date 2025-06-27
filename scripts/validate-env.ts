import { env, isDevelopment, isProduction } from "../lib/env"
import { logger } from "../lib/logger"

function validateEnvironment() {
  logger.info("🔍 Validating environment configuration...")

  // Check critical variables
  const criticalVars = [
    { name: "NEXTAUTH_SECRET", value: env.NEXTAUTH_SECRET, required: true },
    { name: "DATABASE_URL", value: env.DATABASE_URL, required: true },
    { name: "NEXT_PUBLIC_STACK_PROJECT_ID", value: env.NEXT_PUBLIC_STACK_PROJECT_ID, required: true },
    { name: "STACK_SECRET_SERVER_KEY", value: env.STACK_SECRET_SERVER_KEY, required: true },
  ]

  const missingCritical = criticalVars.filter((v) => v.required && !v.value)
  if (missingCritical.length > 0) {
    logger.error("❌ Missing critical environment variables:")
    missingCritical.forEach((v) => logger.error(`  - ${v.name}`))
    if (isProduction) {
      process.exit(1)
    }
  }

  // Check optional but recommended variables
  const recommendedVars = [
    { name: "JWT_SECRET", value: env.JWT_SECRET },
    { name: "ENCRYPTION_KEY", value: env.ENCRYPTION_KEY },
    { name: "REDIS_URL", value: env.REDIS_URL },
    { name: "FROM_EMAIL", value: env.FROM_EMAIL },
  ]

  const missingRecommended = recommendedVars.filter((v) => !v.value)
  if (missingRecommended.length > 0) {
    logger.warn("⚠️ Missing recommended environment variables:")
    missingRecommended.forEach((v) => logger.warn(`  - ${v.name}`))
  }

  // Environment-specific checks
  if (isProduction) {
    logger.info("🚀 Production environment detected")
    if (env.NEXTAUTH_SECRET === "development-secret-change-in-production") {
      logger.error("❌ Using development NEXTAUTH_SECRET in production!")
      process.exit(1)
    }
  } else if (isDevelopment) {
    logger.info("🛠️ Development environment detected")
    logger.info("Using development fallbacks for missing variables")
  }

  // Feature flags status
  logger.info("🎛️ Feature flags:")
  logger.info(`  - Social Login: ${env.ENABLE_SOCIAL_LOGIN ? "✅" : "❌"}`)
  logger.info(`  - Email Verification: ${env.ENABLE_EMAIL_VERIFICATION ? "✅" : "❌"}`)
  logger.info(`  - Two Factor Auth: ${env.ENABLE_TWO_FACTOR_AUTH ? "✅" : "❌"}`)
  logger.info(`  - Investment Tracking: ${env.ENABLE_INVESTMENT_TRACKING ? "✅" : "❌"}`)
  logger.info(`  - Real Time Updates: ${env.ENABLE_REAL_TIME_UPDATES ? "✅" : "❌"}`)
  logger.info(`  - Maintenance Mode: ${env.MAINTENANCE_MODE ? "🚧" : "❌"}`)

  // Stack Auth configuration
  logger.info("🔐 Stack Auth configuration:")
  logger.info(`  - Project ID: ${env.NEXT_PUBLIC_STACK_PROJECT_ID}`)
  logger.info(`  - Client Key: ${env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ? "✅ Set" : "❌ Missing"}`)
  logger.info(`  - Server Key: ${env.STACK_SECRET_SERVER_KEY ? "✅ Set" : "❌ Missing"}`)

  // Database configuration
  logger.info("🗄️ Database configuration:")
  logger.info(`  - Primary URL: ${env.DATABASE_URL ? "✅ Set" : "❌ Missing"}`)
  logger.info(`  - Postgres URL: ${env.POSTGRES_URL ? "✅ Set" : "❌ Not set"}`)
  logger.info(`  - Prisma URL: ${env.POSTGRES_PRISMA_URL ? "✅ Set" : "❌ Not set"}`)

  logger.info("✅ Environment validation completed")
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnvironment()
}

export { validateEnvironment }
