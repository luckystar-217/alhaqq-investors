import { StackServerApp, StackClientApp } from "@stackframe/stack"
import { stackAuthConfig } from "./env"
import { logger } from "./logger"

// Validate Stack Auth configuration
function validateStackAuthConfig() {
  const errors: string[] = []

  if (!stackAuthConfig.projectId) {
    errors.push("NEXT_PUBLIC_STACK_PROJECT_ID is required")
  }

  if (!stackAuthConfig.publishableClientKey) {
    errors.push("NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY is required")
  }

  if (!stackAuthConfig.secretServerKey) {
    errors.push("STACK_SECRET_SERVER_KEY is required")
  }

  if (errors.length > 0) {
    const errorMessage = `Stack Auth configuration validation failed:\n${errors.join("\n")}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  logger.info("Stack Auth configuration validated successfully")
}

// Initialize Stack Auth with error handling
let stackServerApp: StackServerApp | null = null
let stackClientApp: StackClientApp | null = null

try {
  validateStackAuthConfig()

  // Initialize Stack Server App
  stackServerApp = new StackServerApp({
    tokenStore: "nextjs-cookie",
    urls: {
      signIn: "/auth/signin",
      signUp: "/auth/signup",
      emailVerification: "/auth/email-verification",
      passwordReset: "/auth/password-reset",
      home: "/",
      afterSignIn: "/feed",
      afterSignUp: "/feed",
      afterSignOut: "/",
    },
  })

  // Initialize Stack Client App
  stackClientApp = new StackClientApp({
    tokenStore: "nextjs-cookie",
    urls: {
      signIn: "/auth/signin",
      signUp: "/auth/signup",
      emailVerification: "/auth/email-verification",
      passwordReset: "/auth/password-reset",
      home: "/",
      afterSignIn: "/feed",
      afterSignUp: "/feed",
      afterSignOut: "/",
    },
  })

  logger.info("Stack Auth initialized successfully")
} catch (error) {
  logger.error("Failed to initialize Stack Auth", { error })

  // Provide fallback behavior in development
  if (process.env.NODE_ENV === "development") {
    console.error("\n🔧 Stack Auth Setup Help:")
    console.error("1. Ensure you have set up your Stack Auth project")
    console.error("2. Add the following variables to your .env file:")
    console.error("   - NEXT_PUBLIC_STACK_PROJECT_ID")
    console.error("   - NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY")
    console.error("   - STACK_SECRET_SERVER_KEY")
    console.error("3. Restart your development server")
  }

  // In production, this should fail fast
  if (process.env.NODE_ENV === "production") {
    throw error
  }
}

// Export with null checks
export function getStackServerApp(): StackServerApp {
  if (!stackServerApp) {
    throw new Error("Stack Server App is not initialized. Check your Stack Auth configuration.")
  }
  return stackServerApp
}

export function getStackClientApp(): StackClientApp {
  if (!stackClientApp) {
    throw new Error("Stack Client App is not initialized. Check your Stack Auth configuration.")
  }
  return stackClientApp
}

// Safe getters that return null if not initialized (for graceful degradation)
export function getStackServerAppSafe(): StackServerApp | null {
  return stackServerApp
}

export function getStackClientAppSafe(): StackClientApp | null {
  return stackClientApp
}

// Helper functions for common Stack Auth operations
export async function getCurrentUser() {
  try {
    const app = getStackServerApp()
    return await app.getUser()
  } catch (error) {
    logger.error("Failed to get current user", { error })
    return null
  }
}

export async function signOut() {
  try {
    const app = getStackClientApp()
    await app.signOut()
    logger.info("User signed out successfully")
  } catch (error) {
    logger.error("Failed to sign out user", { error })
    throw error
  }
}

// Stack Auth status checker
export function isStackAuthConfigured(): boolean {
  return !!(stackAuthConfig.projectId && stackAuthConfig.publishableClientKey && stackAuthConfig.secretServerKey)
}

// Stack Auth health check
export async function checkStackAuthHealth(): Promise<{
  configured: boolean
  serverAppInitialized: boolean
  clientAppInitialized: boolean
  canAuthenticate: boolean
}> {
  const configured = isStackAuthConfigured()
  const serverAppInitialized = stackServerApp !== null
  const clientAppInitialized = stackClientApp !== null

  let canAuthenticate = false
  if (configured && serverAppInitialized) {
    try {
      // Try to get user (this will work even if no user is signed in)
      await getCurrentUser()
      canAuthenticate = true
    } catch (error) {
      logger.warn("Stack Auth health check failed", { error })
    }
  }

  return {
    configured,
    serverAppInitialized,
    clientAppInitialized,
    canAuthenticate,
  }
}
