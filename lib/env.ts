import { z } from "zod"

// Define the schema for environment variables
const envSchema = z.object({
  // Authentication
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").optional(),

  // Stack Auth Configuration (Neon Auth)
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1, "NEXT_PUBLIC_STACK_PROJECT_ID is required for Stack Auth"),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is required for Stack Auth"),
  STACK_SECRET_SERVER_KEY: z.string().min(1, "STACK_SECRET_SERVER_KEY is required for Stack Auth"),

  // Database (Neon)
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  POSTGRES_URL: z.string().optional(),
  POSTGRES_PRISMA_URL: z.string().optional(),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  POSTGRES_URL_NON_POOLING: z.string().optional(),
  PGHOST: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),
  POSTGRES_DATABASE: z.string().optional(),
  PGPASSWORD: z.string().optional(),
  PGDATABASE: z.string().optional(),
  PGUSER: z.string().optional(),
  POSTGRES_URL_NO_SSL: z.string().optional(),
  POSTGRES_HOST: z.string().optional(),
  NEON_PROJECT_ID: z.string().optional(),

  // Redis
  REDIS_URL: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // File Upload & Storage
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_S3_BUCKET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  FROM_NAME: z.string().default("AlHaqq Investors"),

  // External APIs
  FINANCIAL_DATA_API_KEY: z.string().optional(),
  MARKET_DATA_API_URL: z.string().url().optional(),
  INVESTMENT_API_KEY: z.string().optional(),
  CRYPTO_API_KEY: z.string().optional(),

  // Social Media
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  TWITTER_CLIENT_ID: z.string().optional(),
  TWITTER_CLIENT_SECRET: z.string().optional(),

  // Analytics & Monitoring
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  MIXPANEL_TOKEN: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().int().positive()).default("100"),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().int().positive()).default("900000"),

  // Application Settings
  APP_NAME: z.string().default("AlHaqq Investors"),
  APP_URL: z.string().url().optional(),
  APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  MAX_FILE_SIZE: z.string().transform(Number).pipe(z.number().int().positive()).default("10485760"),
  ALLOWED_FILE_TYPES: z.string().default("image/jpeg,image/png,image/webp,application/pdf"),

  // Security
  ENCRYPTION_KEY: z.string().min(32, "ENCRYPTION_KEY must be at least 32 characters").optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required").optional(),
  CORS_ORIGIN: z.string().optional(),

  // Feature Flags
  ENABLE_SOCIAL_LOGIN: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_EMAIL_VERIFICATION: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_TWO_FACTOR_AUTH: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
  ENABLE_INVESTMENT_TRACKING: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  ENABLE_REAL_TIME_UPDATES: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  MAINTENANCE_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("false"),

  // Webhooks
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PAYMENT_WEBHOOK_URL: z.string().url().optional(),

  // Node Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

// Parse and validate environment variables with graceful fallbacks
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env)
    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n")

      console.error("❌ Environment validation failed:")
      console.error(missingVars)

      // In development, provide helpful guidance and fallbacks
      if (process.env.NODE_ENV !== "production") {
        console.warn("⚠️ Using development fallbacks for missing variables")

        // Create fallback environment
        const fallbackEnv = {
          ...process.env,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
          NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
          DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/alhaqq_dev",
          NEXT_PUBLIC_STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || "dev-project-id",
          NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY:
            process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || "dev-client-key",
          STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY || "dev-server-key",
        }

        return envSchema.parse(fallbackEnv)
      }

      throw new Error("Environment validation failed")
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Helper functions for common environment checks
export const isDevelopment = env.NODE_ENV === "development"
export const isProduction = env.NODE_ENV === "production"
export const isTest = env.NODE_ENV === "test"

// Feature flag helpers
export const features = {
  socialLogin: env.ENABLE_SOCIAL_LOGIN,
  emailVerification: env.ENABLE_EMAIL_VERIFICATION,
  twoFactorAuth: env.ENABLE_TWO_FACTOR_AUTH,
  investmentTracking: env.ENABLE_INVESTMENT_TRACKING,
  realTimeUpdates: env.ENABLE_REAL_TIME_UPDATES,
  maintenanceMode: env.MAINTENANCE_MODE,
}

// Stack Auth configuration helper
export const stackAuthConfig = {
  projectId: env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  secretServerKey: env.STACK_SECRET_SERVER_KEY,
}

// Enhanced database configuration helper with Neon-specific settings
export const dbConfig = {
  url: env.DATABASE_URL,
  postgresUrl: env.POSTGRES_URL,
  prismaUrl: env.POSTGRES_PRISMA_URL,
  unpooledUrl: env.DATABASE_URL_UNPOOLED,
  nonPoolingUrl: env.POSTGRES_URL_NON_POOLING,
  host: env.PGHOST || env.POSTGRES_HOST,
  user: env.POSTGRES_USER || env.PGUSER,
  password: env.POSTGRES_PASSWORD || env.PGPASSWORD,
  database: env.POSTGRES_DATABASE || env.PGDATABASE,
  noSslUrl: env.POSTGRES_URL_NO_SSL,
  neonProjectId: env.NEON_PROJECT_ID,
}

// Email configuration helper
export const emailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  password: env.SMTP_PASSWORD,
  from: env.FROM_EMAIL,
  fromName: env.FROM_NAME,
}

// Storage configuration helper
export const storageConfig = {
  uploadthingSecret: env.UPLOADTHING_SECRET,
  uploadthingAppId: env.UPLOADTHING_APP_ID,
  awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  awsRegion: env.AWS_REGION,
  awsS3Bucket: env.AWS_S3_BUCKET,
}

// API configuration helper
export const apiConfig = {
  financialDataApiKey: env.FINANCIAL_DATA_API_KEY,
  marketDataApiUrl: env.MARKET_DATA_API_URL,
  investmentApiKey: env.INVESTMENT_API_KEY,
  cryptoApiKey: env.CRYPTO_API_KEY,
}

// Rate limiting configuration
export const rateLimitConfig = {
  maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
}

// File upload configuration
export const fileConfig = {
  maxSize: env.MAX_FILE_SIZE,
  allowedTypes: env.ALLOWED_FILE_TYPES.split(",").map((type) => type.trim()),
}
