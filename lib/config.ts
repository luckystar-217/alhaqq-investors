import { env } from "./env"

export const config = {
  app: {
    name: env.APP_NAME,
    url: env.APP_URL || "http://localhost:3000",
    env: env.APP_ENV,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL || "http://localhost:3000",
  },
  database: {
    url: env.DATABASE_URL,
    maxConnections: 10,
    connectionTimeout: 30000,
  },
  stackAuth: {
    projectId: env.NEXT_PUBLIC_STACK_PROJECT_ID,
    publishableClientKey: env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    secretServerKey: env.STACK_SECRET_SERVER_KEY,
  },
  redis: {
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.FROM_EMAIL,
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
    financialData: {
      apiKey: env.FINANCIAL_DATA_API_KEY,
    },
    marketData: {
      url: env.MARKET_DATA_API_URL,
    },
    investment: {
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
  rateLimit: {
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  },
  security: {
    encryptionKey: env.ENCRYPTION_KEY,
    jwtSecret: env.JWT_SECRET,
    corsOrigin: env.CORS_ORIGIN,
  },
  features: {
    socialLogin: env.ENABLE_SOCIAL_LOGIN,
    emailVerification: env.ENABLE_EMAIL_VERIFICATION,
    twoFactorAuth: env.ENABLE_TWO_FACTOR_AUTH,
    investmentTracking: env.ENABLE_INVESTMENT_TRACKING,
    realTimeUpdates: env.ENABLE_REAL_TIME_UPDATES,
    maintenanceMode: env.MAINTENANCE_MODE,
  },
  files: {
    maxSize: env.MAX_FILE_SIZE,
    allowedTypes: env.ALLOWED_FILE_TYPES.split(",").map((type) => type.trim()),
  },
}
