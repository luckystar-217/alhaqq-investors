import { env } from "./env"

export const config = {
  app: {
    name: env.APP_NAME,
    env: env.APP_ENV,
    url: env.APP_URL || "http://localhost:3000",
    port: process.env.PORT || 3000,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL || "http://localhost:3000",
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  },
  stackAuth: {
    projectId: env.NEXT_PUBLIC_STACK_PROJECT_ID,
    publishableClientKey: env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    secretServerKey: env.STACK_SECRET_SERVER_KEY,
    jwksUrl: `https://api.stack-auth.com/api/v1/projects/${env.NEXT_PUBLIC_STACK_PROJECT_ID}/.well-known/jwks.json`,
  },
  database: {
    url: env.DATABASE_URL,
    maxConnections: 10,
    connectionTimeout: 30000,
    idleTimeout: 600000,
  },
  redis: {
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD,
    maxRetries: 3,
    retryDelay: 1000,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.FROM_EMAIL || "noreply@alhaqq.com",
    fromName: env.FROM_NAME,
  },
  storage: {
    uploadthing: {
      secret: env.UPLOADTHING_SECRET,
      appId: env.UPLOADTHING_APP_ID,
    },
    aws: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      bucket: env.AWS_S3_BUCKET,
    },
  },
  apis: {
    financial: {
      apiKey: env.FINANCIAL_DATA_API_KEY,
    },
    market: {
      apiUrl: env.MARKET_DATA_API_URL,
      apiKey: env.INVESTMENT_API_KEY,
    },
    crypto: {
      apiKey: env.CRYPTO_API_KEY,
    },
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
  security: {
    jwtSecret: env.JWT_SECRET,
    encryptionKey: env.ENCRYPTION_KEY,
    corsOrigin: env.CORS_ORIGIN,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  fileUpload: {
    maxSize: env.MAX_FILE_SIZE,
    allowedTypes: env.ALLOWED_FILE_TYPES.split(",").map((type) => type.trim()),
  },
  features: {
    socialLogin: env.ENABLE_SOCIAL_LOGIN,
    emailVerification: env.ENABLE_EMAIL_VERIFICATION,
    twoFactorAuth: env.ENABLE_TWO_FACTOR_AUTH,
    investmentTracking: env.ENABLE_INVESTMENT_TRACKING,
    realTimeUpdates: env.ENABLE_REAL_TIME_UPDATES,
    maintenanceMode: env.MAINTENANCE_MODE,
  },
  webhooks: {
    stripe: {
      secret: env.STRIPE_WEBHOOK_SECRET,
    },
    payment: {
      url: env.PAYMENT_WEBHOOK_URL,
    },
  },
}

export default config
