#!/usr/bin/env node

import { env, stackAuthConfig, dbConfig, features } from "../lib/env"
import { logger } from "../lib/logger"

interface ValidationResult {
  category: string
  status: "valid" | "missing" | "invalid"
  message: string
  required: boolean
}

function validateEnvironment(): ValidationResult[] {
  const results: ValidationResult[] = []

  // Core Authentication
  results.push({
    category: "Authentication",
    status: env.NEXTAUTH_SECRET ? "valid" : "missing",
    message: env.NEXTAUTH_SECRET ? "NextAuth secret configured" : "NEXTAUTH_SECRET is required",
    required: true,
  })

  results.push({
    category: "Authentication",
    status: env.NEXTAUTH_URL ? "valid" : "missing",
    message: env.NEXTAUTH_URL ? `NextAuth URL: ${env.NEXTAUTH_URL}` : "NEXTAUTH_URL recommended for production",
    required: false,
  })

  // Stack Auth
  results.push({
    category: "Stack Auth",
    status: stackAuthConfig.projectId ? "valid" : "missing",
    message: stackAuthConfig.projectId
      ? `Stack Auth Project ID: ${stackAuthConfig.projectId}`
      : "NEXT_PUBLIC_STACK_PROJECT_ID is required",
    required: true,
  })

  results.push({
    category: "Stack Auth",
    status: stackAuthConfig.publishableClientKey ? "valid" : "missing",
    message: stackAuthConfig.publishableClientKey
      ? "Stack Auth publishable client key configured"
      : "NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is required",
    required: true,
  })

  results.push({
    category: "Stack Auth",
    status: stackAuthConfig.secretServerKey ? "valid" : "missing",
    message: stackAuthConfig.secretServerKey
      ? "Stack Auth secret server key configured"
      : "STACK_SECRET_SERVER_KEY is required",
    required: true,
  })

  // Database
  results.push({
    category: "Database",
    status: dbConfig.url ? "valid" : "missing",
    message: dbConfig.url ? "Database URL configured" : "DATABASE_URL is required",
    required: true,
  })

  // Optional Services
  results.push({
    category: "Redis",
    status: env.REDIS_URL ? "valid" : "missing",
    message: env.REDIS_URL ? "Redis configured" : "Redis not configured (optional)",
    required: false,
  })

  results.push({
    category: "Email",
    status: env.SMTP_HOST ? "valid" : "missing",
    message: env.SMTP_HOST ? "Email service configured" : "Email service not configured (optional)",
    required: false,
  })

  results.push({
    category: "Storage",
    status: env.AWS_ACCESS_KEY_ID || env.UPLOADTHING_SECRET ? "valid" : "missing",
    message:
      env.AWS_ACCESS_KEY_ID || env.UPLOADTHING_SECRET
        ? "File storage configured"
        : "File storage not configured (optional)",
    required: false,
  })

  return results
}

function printValidationResults(results: ValidationResult[]) {
  console.log("\n🔍 Environment Validation Results\n")
  console.log("=".repeat(50))

  const categories = [...new Set(results.map((r) => r.category))]

  categories.forEach((category) => {
    console.log(`\n📁 ${category}`)
    console.log("-".repeat(category.length + 3))

    const categoryResults = results.filter((r) => r.category === category)
    categoryResults.forEach((result) => {
      const icon = result.status === "valid" ? "✅" : result.required ? "❌" : "⚠️"
      const status = result.status === "valid" ? "VALID" : result.status === "missing" ? "MISSING" : "INVALID"

      console.log(`  ${icon} ${status.padEnd(8)} ${result.message}`)
    })
  })

  // Summary
  const validCount = results.filter((r) => r.status === "valid").length
  const missingRequired = results.filter((r) => r.status !== "valid" && r.required).length
  const missingOptional = results.filter((r) => r.status !== "valid" && !r.required).length

  console.log("\n📊 Summary")
  console.log("-".repeat(10))
  console.log(`✅ Valid configurations: ${validCount}`)
  console.log(`❌ Missing required: ${missingRequired}`)
  console.log(`⚠️  Missing optional: ${missingOptional}`)

  // Feature Status
  console.log("\n🚀 Feature Status")
  console.log("-".repeat(15))
  console.log(`🔐 Social Login: ${features.socialLogin ? "Enabled" : "Disabled"}`)
  console.log(`📧 Email Verification: ${features.emailVerification ? "Enabled" : "Disabled"}`)
  console.log(`🔒 Two-Factor Auth: ${features.twoFactorAuth ? "Enabled" : "Disabled"}`)
  console.log(`📈 Investment Tracking: ${features.investmentTracking ? "Enabled" : "Disabled"}`)
  console.log(`🔄 Real-time Updates: ${features.realTimeUpdates ? "Enabled" : "Disabled"}`)
  console.log(`🚧 Maintenance Mode: ${features.maintenanceMode ? "Enabled" : "Disabled"}`)

  if (missingRequired > 0) {
    console.log("\n❌ Validation Failed")
    console.log("Please configure the missing required environment variables.")
    console.log("Copy .env.example to .env and fill in the required values.")
    process.exit(1)
  } else {
    console.log("\n✅ Validation Passed")
    console.log("All required environment variables are configured.")
  }
}

// Run validation
try {
  logger.info("Starting environment validation...")
  const results = validateEnvironment()
  printValidationResults(results)
} catch (error) {
  logger.error("Environment validation failed", { error })
  console.error("\n❌ Environment validation failed with error:")
  console.error(error)
  process.exit(1)
}
