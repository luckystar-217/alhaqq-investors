import { logger } from "./logger"
import { env } from "./env"

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
  constructor(message = "Authentication failed") {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
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

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500)
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = "External service unavailable") {
    super(message, 503)
  }
}

export function handleError(error: Error): {
  message: string
  statusCode: number
  stack?: string
} {
  logger.error("Application error occurred", { error: error.message }, error)

  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      ...(env.NODE_ENV === "development" && { stack: error.stack }),
    }
  }

  // Handle specific error types
  if (error.name === "ValidationError") {
    return {
      message: "Validation failed",
      statusCode: 400,
      ...(env.NODE_ENV === "development" && { stack: error.stack }),
    }
  }

  if (error.name === "CastError") {
    return {
      message: "Invalid data format",
      statusCode: 400,
      ...(env.NODE_ENV === "development" && { stack: error.stack }),
    }
  }

  if (error.name === "JsonWebTokenError") {
    return {
      message: "Invalid token",
      statusCode: 401,
      ...(env.NODE_ENV === "development" && { stack: error.stack }),
    }
  }

  if (error.name === "TokenExpiredError") {
    return {
      message: "Token expired",
      statusCode: 401,
      ...(env.NODE_ENV === "development" && { stack: error.stack }),
    }
  }

  // Default error response
  return {
    message: env.NODE_ENV === "production" ? "Internal server error" : error.message,
    statusCode: 500,
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  }
}

export function asyncHandler<T extends any[], R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      logger.error("Async handler error", { error: error instanceof Error ? error.message : String(error) })
      throw error
    }
  }
}

// Global error handler for unhandled promise rejections
process.on("unhandledRejection", (reason: unknown, promise: Promise<any>) => {
  logger.error("Unhandled Promise Rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
    promise: promise.toString(),
  })

  if (env.NODE_ENV === "production") {
    // Gracefully close the server
    process.exit(1)
  }
})

// Global error handler for uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", { error: error.message }, error)

  if (env.NODE_ENV === "production") {
    // Gracefully close the server
    process.exit(1)
  }
})
