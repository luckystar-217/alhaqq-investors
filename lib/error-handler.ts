import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { logger } from "./logger"

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409)
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429)
  }
}

export function handleError(error: unknown): NextResponse {
  logger.error("Error occurred", { error: error instanceof Error ? error.message : String(error) })

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }))

    return NextResponse.json(
      {
        error: "Validation failed",
        details: validationErrors,
      },
      { status: 400 },
    )
  }

  // Handle custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: error.statusCode },
    )
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
      },
      { status: 500 },
    )
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: "An unexpected error occurred",
    },
    { status: 500 },
  )
}

export function withErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
): (...args: T) => Promise<R | NextResponse> {
  return async (...args: T) => {
    try {
      return await fn(...args)
    } catch (error) {
      return handleError(error)
    }
  }
}

// Global error handler for unhandled promise rejections
if (typeof window === "undefined") {
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", { promise, reason })
  })

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", { error: error.message, stack: error.stack })
    process.exit(1)
  })
}
