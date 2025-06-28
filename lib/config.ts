import { env, features, dbConfig, emailConfig, storageConfig, apiConfig } from "./env"

// Application configuration object
export const config = {
  app: {
    name: env.APP_NAME,
    url: env.APP_URL || "http://localhost:3000",
    env: env.APP_ENV,
    logLevel: env.LOG_LEVEL,
  },

  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL || env.APP_URL || "http://localhost:3000",
  },

  stackAuth: {
    projectId: env.NEXT_PUBLIC_STACK_PROJECT_ID,
    publishableClientKey: env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    secretServerKey: env.STACK_SECRET_SERVER_KEY,
  },

  database: {
    ...dbConfig,
    // Neon-specific configuration
    isNeon: dbConfig.url?.includes("neon.tech") || false,
    requireSSL: dbConfig.url?.includes("sslmode=require") || false,
  },

  email: emailConfig,

  storage: storageConfig,

  apis: apiConfig,

  features,

  security: {
    encryptionKey: env.ENCRYPTION_KEY,
    jwtSecret: env.JWT_SECRET,
    corsOrigin: env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || ["http://localhost:3000"],
  },

  redis: {
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD,
  },

  social: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    },
    twitter: {
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
    },
  },

  analytics: {
    googleAnalyticsId: env.GOOGLE_ANALYTICS_ID,
    sentryDsn: env.SENTRY_DSN,
    mixpanelToken: env.MIXPANEL_TOKEN,
  },

  webhooks: {
    stripeSecret: env.STRIPE_WEBHOOK_SECRET,
    paymentUrl: env.PAYMENT_WEBHOOK_URL,
  },

  rateLimit: {
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  },

  files: {
    maxSize: env.MAX_FILE_SIZE,
    allowedTypes: env.ALLOWED_FILE_TYPES.split(",").map((type) => type.trim()),
  },
} as const

// Stack Auth configuration validator
export function validateStackAuthConfig(): boolean {
  return !!(config.stackAuth.projectId && config.stackAuth.publishableClientKey && config.stackAuth.secretServerKey)
}

// Configuration validation helper
export function validateConfig() {
  const errors: string[] = []

  // Check critical configurations
  if (!config.auth.secret) {
    errors.push("NEXTAUTH_SECRET is required for authentication")
  }

  if (!config.database.url) {
    errors.push("DATABASE_URL is required for database connection")
  }

  // Validate Stack Auth configuration
  if (!validateStackAuthConfig()) {
    errors.push(
      "Stack Auth configuration is incomplete. Required: NEXT_PUBLIC_STACK_PROJECT_ID, NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY, STACK_SECRET_SERVER_KEY",
    )
  }

  // Neon-specific validations
  if (config.database.isNeon) {
    if (!config.database.requireSSL && config.app.env === "production") {
      errors.push("SSL is required for Neon database connections in production")
    }
    console.log("✅ Neon database configuration detected")
  }

  if (config.features.emailVerification && !config.email.host) {
    errors.push("SMTP configuration is required when email verification is enabled")
  }

  if (config.features.socialLogin) {
    if (!config.social.google.clientId && !config.social.facebook.clientId && !config.social.twitter.clientId) {
      errors.push("At least one social login provider must be configured when social login is enabled")
    }
  }

  if (errors.length > 0) {
    console.error("❌ Configuration validation failed:")
    errors.forEach((error) => console.error(`  - ${error}`))
    throw new Error("Configuration validation failed")
  }

  console.log("✅ Configuration validated successfully")
  console.log("✅ Stack Auth configuration validated")
  if (config.database.isNeon) {
    console.log("✅ Neon database configuration validated")
  }
}

// Environment-specific configurations
export const isDev = config.app.env === "development"
export const isProd = config.app.env === "production"
export const isStaging = config.app.env === "staging"

// Helper to get configuration with fallbacks
export function getConfigValue<T>(key: string, fallback: T): T {
  const value = process.env[key]
  if (value === undefined || value === "") {
    return fallback
  }
  return value as unknown as T
}

// Database connection helper with error handling
export function getDatabaseUrl(): string {
  if (config.database.url) {
    return config.database.url
  }

  if (config.database.postgresUrl) {
    return config.database.postgresUrl
  }

  throw new Error("No database URL configured. Please set DATABASE_URL or POSTGRES_URL")
}

// Email configuration validator
export function validateEmailConfig(): boolean {
  return !!(config.email.host && config.email.port && config.email.user && config.email.password)
}

// Storage configuration validator
export function validateStorageConfig(): boolean {
  return !!(
    (config.storage.uploadthingSecret && config.storage.uploadthingAppId) ||
    (config.storage.awsAccessKeyId && config.storage.awsSecretAccessKey && config.storage.awsS3Bucket)
  )
}
