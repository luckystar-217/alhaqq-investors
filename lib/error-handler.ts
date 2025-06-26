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

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    logger.error("Unhandled error", { message: error.message, stack: error.stack })
    return new AppError(error.message)
  }

  logger.error("Unknown error", { error })
  return new AppError("An unknown error occurred")
}

export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}
