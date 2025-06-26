import { signIn, signOut, getSession } from "next-auth/react"
import { logger } from "./logger"

export interface SignInOptions {
  email: string
  password: string
  redirect?: boolean
  callbackUrl?: string
}

export interface SignInResult {
  error?: string
  status: number
  ok: boolean
  url?: string
}

// Enhanced sign-in with better error handling
export async function signInWithCredentials(options: SignInOptions): Promise<SignInResult> {
  try {
    logger.info("Attempting sign in", { email: options.email })

    const result = await signIn("credentials", {
      email: options.email,
      password: options.password,
      redirect: options.redirect ?? false,
      callbackUrl: options.callbackUrl ?? "/feed",
    })

    if (result?.error) {
      logger.warn("Sign in failed", { error: result.error, email: options.email })
      return {
        error: result.error,
        status: 401,
        ok: false,
      }
    }

    logger.info("Sign in successful", { email: options.email })
    return {
      status: 200,
      ok: true,
      url: result?.url,
    }
  } catch (error) {
    logger.error("Sign in error", { error, email: options.email })
    return {
      error: "CLIENT_FETCH_ERROR",
      status: 500,
      ok: false,
    }
  }
}

// Enhanced sign-out with error handling
export async function signOutUser(callbackUrl?: string): Promise<void> {
  try {
    logger.info("Attempting sign out")
    await signOut({ callbackUrl: callbackUrl ?? "/" })
    logger.info("Sign out successful")
  } catch (error) {
    logger.error("Sign out error", { error })
    // Force redirect on error
    window.location.href = callbackUrl ?? "/"
  }
}

// Enhanced session retrieval with error handling
export async function getCurrentSession() {
  try {
    const session = await getSession()
    if (session) {
      logger.debug("Session retrieved", { userId: session.user?.id })
    }
    return session
  } catch (error) {
    logger.error("Error getting session", { error })
    return null
  }
}

// Retry mechanism for failed requests
export async function retrySignIn(options: SignInOptions, maxRetries = 3): Promise<SignInResult> {
  let lastError: SignInResult | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    logger.info("Sign in attempt", { attempt, maxRetries, email: options.email })

    const result = await signInWithCredentials(options)

    if (result.ok) {
      return result
    }

    lastError = result

    // Don't retry on credential errors
    if (result.error === "CredentialsSignin") {
      break
    }

    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      logger.info("Retrying sign in", { delay, attempt })
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return (
    lastError || {
      error: "MAX_RETRIES_EXCEEDED",
      status: 500,
      ok: false,
    }
  )
}
