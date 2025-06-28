import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { env } from "./lib/env"

// Rate limiting store (in-memory for development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Public routes that don't require authentication
const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/error", "/api/auth", "/api/signup", "/api/health"]

// API routes that should be excluded from middleware processing
const excludedApiRoutes = ["/api/auth", "/api/_next", "/_next", "/favicon.ico", "/public"]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route))
}

function shouldExcludeFromMiddleware(pathname: string): boolean {
  return excludedApiRoutes.some((route) => pathname.startsWith(route))
}

function rateLimit(request: NextRequest): boolean {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "anonymous"
  const now = Date.now()
  const windowMs = env.RATE_LIMIT_WINDOW_MS
  const maxRequests = env.RATE_LIMIT_MAX_REQUESTS

  const current = rateLimitStore.get(ip)

  if (!current || now > current.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for excluded routes
  if (shouldExcludeFromMiddleware(pathname)) {
    return NextResponse.next()
  }

  // Skip middleware for static files
  if (pathname.includes(".") && !pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Handle maintenance mode
  if (env.MAINTENANCE_MODE && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  // Rate limiting
  if (!rateLimit(request)) {
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  // Handle CORS for API routes
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", env.CORS_ORIGIN || "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: response.headers })
    }

    return response
  }

  // Skip auth check for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  try {
    const token = await getToken({
      req: request,
      secret: env.NEXTAUTH_SECRET,
    })

    if (!token) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware auth error:", error)
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
