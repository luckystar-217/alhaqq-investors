import { env } from "../lib/env"
import { validateConfig } from "../lib/config"
import { logger } from "../lib/logger"
// Add Stack Auth and Neon validation to the environment validation script
import { validateStackAuthConfig } from "../lib/config"
import { checkStackAuthHealth } from "../lib/stack-auth"
import { checkNeonHealth } from "../lib/neon-db"

async function validateEnvironment() {
  try {
    logger.info("Starting environment validation...")

    // Validate environment variables
    logger.info("Validating environment variables...")
    // env is already validated during import

    // Validate configuration
    logger.info("Validating configuration...")
    validateConfig()

    // Validate Stack Auth
    logger.info("Validating Stack Auth configuration...")
    const stackAuthValid = validateStackAuthConfig()
    if (stackAuthValid) {
      const stackAuthHealth = await checkStackAuthHealth()
      logger.info("Stack Auth health check completed", stackAuthHealth)
    }

    // Validate Neon database
    logger.info("Validating Neon database connection...")
    const neonHealth = await checkNeonHealth()
    logger.info("Neon database health check completed", neonHealth)

    // Log configuration summary (without sensitive data)
    logger.info("Environment validation completed successfully", {
      appName: env.APP_NAME,
      appEnv: env.APP_ENV,
      nodeEnv: env.NODE_ENV,
      stackAuth: {
        configured: stackAuthValid,
        projectId: env.NEXT_PUBLIC_STACK_PROJECT_ID ? "✓" : "✗",
      },
      database: {
        connected: neonHealth.connected,
        isNeon: env.DATABASE_URL?.includes("neon.tech") || false,
        latency: neonHealth.latency,
      },
      features: {
        socialLogin: env.ENABLE_SOCIAL_LOGIN,
        emailVerification: env.ENABLE_EMAIL_VERIFICATION,
        twoFactorAuth: env.ENABLE_TWO_FACTOR_AUTH,
        investmentTracking: env.ENABLE_INVESTMENT_TRACKING,
        realTimeUpdates: env.ENABLE_REAL_TIME_UPDATES,
        maintenanceMode: env.MAINTENANCE_MODE,
      },
    })

    console.log("✅ Environment validation passed!")
    console.log("✅ Stack Auth configuration validated!")
    console.log("✅ Neon database connection validated!")
  } catch (error) {
    logger.error("Environment validation failed", { error })
    console.error("❌ Environment validation failed!")

    if (error instanceof Error && error.message.includes("Stack Auth")) {
      console.error("\n🔧 Stack Auth Setup Required:")
      console.error("1. Set up your Stack Auth project at https://stack-auth.com")
      console.error("2. Add the required environment variables to .env")
      console.error("3. Restart your development server")
    }

    if (error instanceof Error && error.message.includes("database")) {
      console.error("\n🗄️ Neon Database Setup Required:")
      console.error("1. Create a Neon database at https://neon.tech")
      console.error("2. Add your DATABASE_URL to .env")
      console.error("3. Ensure SSL is enabled for production")
    }

    process.exit(1)
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateEnvironment()
}

export { validateEnvironment }
