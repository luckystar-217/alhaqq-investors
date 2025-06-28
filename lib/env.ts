// lib/env.ts
//
// Centralised, type-safe environment handling that **never crashes** the build.
// Exports:
//  • env                   – parsed & validated variables
//  • isDevelopment         – boolean
//  • isProduction          – boolean
//  • stackAuthConfig       – { projectId, publishableClientKey, secretServerKey }
//  • dbConfig              – { url, … } helper object

import { randomBytes } from "crypto"
import { z } from "zod"

/* ───────── helpers ───────── */

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && (v.trim() === "" || v === "undefined" || v === "null") ? undefined : v

const randHex = (bytes = 32) => randomBytes(bytes).toString("hex")

/* ───────── schema ───────── */

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    // NextAuth core
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(emptyToUndefined, z.string().url()).optional(),

    // Stack Auth (required)
    NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1, "Missing Stack Auth project id"),
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string().min(1, "Missing Stack Auth publishable client key"),
    STACK_SECRET_SERVER_KEY: z.string().min(1, "Missing Stack Auth server key"),

    // DB (required)
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // Security
    JWT_SECRET: z.string().min(1).optional(),
    ENCRYPTION_KEY: z.string().min(32).optional(),

    // Optionals (blank accepted)
    FROM_EMAIL: z.preprocess(emptyToUndefined, z.string().email()).optional(),
    SENTRY_DSN: z.preprocess(emptyToUndefined, z.string().url()).optional(),
    MARKET_DATA_API_URL: z.preprocess(emptyToUndefined, z.string().url()).optional(),
    PAYMENT_WEBHOOK_URL: z.preprocess(emptyToUndefined, z.string().url()).optional(),

    // Additional environment variables
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
    SMTP_HOST: z.preprocess(emptyToUndefined, z.string()).optional(),
    SMTP_PORT: z
      .preprocess(emptyToUndefined, z.string().transform(Number).pipe(z.number().int().positive()))
      .optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    FROM_NAME: z.string().default("AlHaqq Investors"),

    // External APIs
    FINANCIAL_DATA_API_KEY: z.string().optional(),
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
  })
  .passthrough()

/* ───────── validation ───────── */

function validateEnv() {
  const first = EnvSchema.safeParse(process.env)
  if (first.success) return first.data

  console.error("❌  Environment validation failed:")
  first.error.errors.forEach((e) => console.error(`   • ${e.path.join(".")}: ${e.message}`))

  const patched = {
    ...process.env,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || randHex(16),
    JWT_SECRET: process.env.JWT_SECRET || randHex(16),
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || randHex(24),
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/alhaqq_dev",
    NEXT_PUBLIC_STACK_PROJECT_ID: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || "dev-stack-project-id",
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY:
      process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || "dev-stack-pub-key",
    STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY || "dev-stack-server-key",
  }

  const second = EnvSchema.safeParse(patched)
  if (!second.success) {
    console.error("🚫  Unable to recover from invalid environment configuration:")
    second.error.errors.forEach((e) => console.error(`   • ${e.path.join(".")}: ${e.message}`))
    throw new Error("Environment validation failed")
  }

  console.warn("⚠️  Using generated fallback secrets for missing env vars.")
  return second.data
}

export const env = validateEnv()

/* ───────── helper exports required by build ───────── */

export const isDevelopment = env.NODE_ENV === "development"
export const isProduction = env.NODE_ENV === "production"
export const isTest = env.NODE_ENV === "test"

export const stackAuthConfig = {
  projectId: env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  secretServerKey: env.STACK_SECRET_SERVER_KEY,
}

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

// Feature flag helpers
export const features = {
  socialLogin: env.ENABLE_SOCIAL_LOGIN,
  emailVerification: env.ENABLE_EMAIL_VERIFICATION,
  twoFactorAuth: env.ENABLE_TWO_FACTOR_AUTH,
  investmentTracking: env.ENABLE_INVESTMENT_TRACKING,
  realTimeUpdates: env.ENABLE_REAL_TIME_UPDATES,
  maintenanceMode: env.MAINTENANCE_MODE,
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
