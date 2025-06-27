#!/usr/bin/env node

import { z } from "zod"
import chalk from "chalk"

// Environment validation schema (same as in lib/env.ts)
const envSchema = z.object({
  // Authentication
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").optional(),

  // Stack Auth Configuration
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1, "NEXT_PUBLIC_STACK_PROJECT_ID is required for Stack Auth"),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is required for Stack Auth"),
  STACK_SECRET_SERVER_KEY: z.string().min(1, "STACK_SECRET_SERVER_KEY is required for Stack Auth"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Security
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required").optional(),
  ENCRYPTION_KEY: z.string().min(32, "ENCRYPTION_KEY must be at least 32 characters").optional(),

  // Node Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

function validateEnvironment() {
  console.log(chalk.blue("🔍 Validating environment variables...\n"))

  try {
    // Load environment variables
    require("dotenv").config()

    const result = envSchema.safeParse(process.env)

    if (result.success) {
      console.log(chalk.green("✅ Environment validation passed!"))
      console.log(chalk.gray("All required environment variables are properly configured.\n"))

      // Show configuration summary
      console.log(chalk.blue("📋 Configuration Summary:"))
      console.log(chalk.gray("─".repeat(50)))
      console.log(`${chalk.cyan("Environment:")} ${result.data.NODE_ENV}`)
      console.log(`${chalk.cyan("NextAuth Secret:")} ${result.data.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing"}`)
      console.log(`${chalk.cyan("Stack Auth Project:")} ${result.data.NEXT_PUBLIC_STACK_PROJECT_ID}`)
      console.log(`${chalk.cyan("Database:")} ${result.data.DATABASE_URL ? "✅ Configured" : "❌ Missing"}`)
      console.log(`${chalk.cyan("JWT Secret:")} ${result.data.JWT_SECRET ? "✅ Set" : "⚠️  Using fallback"}`)
      console.log(`${chalk.cyan("Encryption Key:")} ${result.data.ENCRYPTION_KEY ? "✅ Set" : "⚠️  Using fallback"}`)

      return true
    } else {
      console.log(chalk.red("❌ Environment validation failed!"))
      console.log(chalk.gray("The following issues were found:\n"))

      result.error.errors.forEach((error, index) => {
        console.log(`${chalk.red(`${index + 1}.`)} ${chalk.yellow(error.path.join("."))}`)
        console.log(`   ${chalk.gray("→")} ${error.message}\n`)
      })

      console.log(chalk.blue("💡 Suggestions:"))
      console.log(chalk.gray("─".repeat(50)))

      result.error.errors.forEach((error) => {
        const field = error.path.join(".")
        switch (field) {
          case "NEXTAUTH_SECRET":
            console.log(`• Generate a secret: ${chalk.cyan("openssl rand -base64 32")}`)
            break
          case "DATABASE_URL":
            console.log(`• Set up your Neon database and copy the connection string`)
            break
          case "NEXT_PUBLIC_STACK_PROJECT_ID":
            console.log(`• Copy from your Stack Auth dashboard`)
            break
          case "JWT_SECRET":
            console.log(`• Generate a JWT secret: ${chalk.cyan("openssl rand -base64 32")}`)
            break
          case "ENCRYPTION_KEY":
            console.log(`• Generate a 32+ character encryption key`)
            break
          default:
            console.log(`• Check the .env.example file for ${field} format`)
        }
      })

      return false
    }
  } catch (error) {
    console.log(chalk.red("❌ Failed to validate environment:"))
    console.log(chalk.gray(error instanceof Error ? error.message : String(error)))
    return false
  }
}

function checkStackAuthConfiguration() {
  console.log(chalk.blue("\n🔐 Checking Stack Auth configuration..."))

  const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
  const clientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
  const serverKey = process.env.STACK_SECRET_SERVER_KEY

  if (!projectId || !clientKey || !serverKey) {
    console.log(chalk.yellow("⚠️  Stack Auth not fully configured"))
    return false
  }

  console.log(chalk.green("✅ Stack Auth configuration looks good"))
  console.log(`${chalk.cyan("Project ID:")} ${projectId}`)
  console.log(`${chalk.cyan("Client Key:")} ${clientKey.substring(0, 20)}...`)
  console.log(`${chalk.cyan("Server Key:")} ${serverKey.substring(0, 20)}...`)

  return true
}

function checkDatabaseConfiguration() {
  console.log(chalk.blue("\n🗄️  Checking database configuration..."))

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.log(chalk.red("❌ DATABASE_URL not configured"))
    return false
  }

  try {
    const url = new URL(databaseUrl)
    console.log(chalk.green("✅ Database URL format is valid"))
    console.log(`${chalk.cyan("Host:")} ${url.hostname}`)
    console.log(`${chalk.cyan("Database:")} ${url.pathname.substring(1)}`)
    console.log(`${chalk.cyan("SSL Mode:")} ${url.searchParams.get("sslmode") || "default"}`)
    return true
  } catch (error) {
    console.log(chalk.red("❌ Invalid database URL format"))
    return false
  }
}

function main() {
  console.log(chalk.bold.blue("🚀 AlHaqq Investors - Environment Validation"))
  console.log(chalk.gray("=".repeat(60)))

  const validationPassed = validateEnvironment()
  const stackAuthOk = checkStackAuthConfiguration()
  const databaseOk = checkDatabaseConfiguration()

  console.log(chalk.blue("\n📊 Validation Summary:"))
  console.log(chalk.gray("─".repeat(50)))
  console.log(`${chalk.cyan("Environment Variables:")} ${validationPassed ? "✅ Pass" : "❌ Fail"}`)
  console.log(`${chalk.cyan("Stack Auth Setup:")} ${stackAuthOk ? "✅ Pass" : "⚠️  Incomplete"}`)
  console.log(`${chalk.cyan("Database Setup:")} ${databaseOk ? "✅ Pass" : "❌ Fail"}`)

  if (validationPassed && stackAuthOk && databaseOk) {
    console.log(chalk.green("\n🎉 All checks passed! Your environment is ready."))
    process.exit(0)
  } else {
    console.log(chalk.yellow("\n⚠️  Some issues found. Please review and fix before deployment."))
    process.exit(1)
  }
}

// Run the validation
main()
