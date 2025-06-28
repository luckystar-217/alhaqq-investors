import { env, features, dbConfig, stackAuthConfig, emailConfig, storageConfig, apiConfig } from "./env"

export const config = {
  app: {
    name: env.APP_NAME,
    env: env.APP_ENV,
    url: env.APP_URL,
    logLevel: env.LOG_LEVEL,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
    jwtSecret: env.JWT_SECRET,
    encryptionKey: env.ENCRYPTION_KEY,
  },
  database: dbConfig,
  stackAuth: stackAuthConfig,
  email: emailConfig,
  storage: storageConfig,
  api: apiConfig,
  features,
  security: {
    corsOrigin: env.CORS_ORIGIN,
    rateLimit: {
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
      windowMs: env.RATE_LIMIT_WINDOW_MS,
    },
  },
  upload: {
    maxSize: env.MAX_FILE_SIZE,
    allowedTypes: env.ALLOWED_FILE_TYPES.split(",").map((type) => type.trim()),
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
    stripe: env.STRIPE_WEBHOOK_SECRET,
    payment: env.PAYMENT_WEBHOOK_URL,
  },
} as const

export type Config = typeof config
