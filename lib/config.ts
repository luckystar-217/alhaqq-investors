import { env } from "./env"

export const config = {
  app: {
    name: env.APP_NAME,
    url: env.APP_URL || "http://localhost:3000",
    env: env.APP_ENV,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET!,
    url: env.NEXTAUTH_URL || "http://localhost:3000",
  },
  stackAuth: {
    projectId: env.NEXT_PUBLIC_STACK_PROJECT_ID,
    publishableClientKey: env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    secretServerKey: env.STACK_SECRET_SERVER_KEY,
  },
  database: {
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
  },
  redis: {
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD,
  },
  storage: {
    uploadthingSecret: env.UPLOADTHING_SECRET,
    uploadthingAppId: env.UPLOADTHING_APP_ID,
    awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    awsRegion: env.AWS_REGION,
    awsS3Bucket: env.AWS_S3_BUCKET,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.FROM_EMAIL,
    fromName: env.FROM_NAME,
  },
  apis: {
    financialDataApiKey: env.FINANCIAL_DATA_API_KEY,
    marketDataApiUrl: env.MARKET_DATA_API_URL,
    investmentApiKey: env.INVESTMENT_API_KEY,
    cryptoApiKey: env.CRYPTO_API_KEY,
  },
  social: {
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    facebookClientId: env.FACEBOOK_CLIENT_ID,
    facebookClientSecret: env.FACEBOOK_CLIENT_SECRET,
    twitterClientId: env.TWITTER_CLIENT_ID,
    twitterClientSecret: env.TWITTER_CLIENT_SECRET,
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
    encryptionKey: env.ENCRYPTION_KEY!,
    jwtSecret: env.JWT_SECRET!,
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
  webhooks: {
    stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
    paymentWebhookUrl: env.PAYMENT_WEBHOOK_URL,
  },
}
