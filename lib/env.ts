import { randomBytes } from "crypto"
import { z } from "zod"

// Helper ───────────────────────────────────────────────────────────────────────
const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v)

function randomSecret(bytes = 32) {
  return randomBytes(bytes).toString("hex")
}

// Schema ───────────────────────────────────────────────────────────────────────
const envSchema = z.object({
  /* Core */
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(emptyToUndefined, z.string().url()).optional(),

  /* Stack Auth */
  NEXT_PUBLIC_STACK_PROJECT_ID: z.string().min(1, "Missing STACK project id"),
  NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY: z.string().min(1, "Missing STACK publishable key"),
  STACK_SECRET_SERVER_KEY: z.string().min(1, "Missing STACK server key"),

  /* Database */
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  /* Security */
  JWT_SECRET: z.string().min(1).optional(),
  ENCRYPTION_KEY: z.string().min(32).optional(),

  /* Optional values (urls / emails). Blank = undefined */
  FROM_EMAIL: z.preprocess(emptyToUndefined, z.string().email()).optional(),
  MARKET_DATA_API_URL: z.preprocess(emptyToUndefined, z.string().url()).optional(),
  SENTRY_DSN: z.preprocess(emptyToUndefined, z.string().url()).optional(),
  PAYMENT_WEBHOOK_URL: z.preprocess(emptyToUndefined, z.string().url()).optional(),
})

// Validation ───────────────────────────────────────────────────────────────────
function validateEnv() {
  // First try strict validation
  const result = envSchema.safeParse(process.env)
  if (result.success) return result.data

  // ── If validation failed ──
  console.error("❌ Environment validation failed:")
  result.error.errors.forEach((e) => console.error(`  • ${e.path.join(".")}: ${e.message}`))

  // Create a patched object with minimal fall-backs
  const patched = {
    ...process.env,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || randomSecret(16), // 32-char hex
    JWT_SECRET: process.env.JWT_SECRET || randomSecret(16),
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || randomSecret(24), // 48-char hex
  }

  const secondTry = envSchema.safeParse(patched)
  if (!secondTry.success) {
    // Still invalid – abort in a clearly-logged way
    console.error("🚫 Unable to recover from invalid environment configuration.")
    secondTry.error.errors.forEach((e) => console.error(`  • ${e.path.join(".")}: ${e.message}`))
    throw new Error("Environment validation failed")
  }

  console.warn("⚠️ Using generated fall-back secrets for missing env vars.")
  return secondTry.data
}

export const env = validateEnv()

/* Convenience flags */
export const isDev = env.NODE_ENV === "development"
export const isProd = env.NODE_ENV === "production"
