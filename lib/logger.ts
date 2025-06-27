import { env } from "./env"

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

const logLevelMap: Record<string, LogLevel> = {
  error: LogLevel.ERROR,
  warn: LogLevel.WARN,
  info: LogLevel.INFO,
  debug: LogLevel.DEBUG,
}

class Logger {
  private level: LogLevel

  constructor() {
    this.level = logLevelMap[env.LOG_LEVEL] ?? LogLevel.INFO
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : ""
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage("error", message, meta))
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage("warn", message, meta))
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage("info", message, meta))
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage("debug", message, meta))
    }
  }

  // Convenience methods for common use cases
  auth(message: string, meta?: any): void {
    this.info(`[AUTH] ${message}`, meta)
  }

  db(message: string, meta?: any): void {
    this.info(`[DB] ${message}`, meta)
  }

  api(message: string, meta?: any): void {
    this.info(`[API] ${message}`, meta)
  }

  security(message: string, meta?: any): void {
    this.warn(`[SECURITY] ${message}`, meta)
  }
}

export const logger = new Logger()

// Export convenience functions
export const log = {
  error: (message: string, meta?: any) => logger.error(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  info: (message: string, meta?: any) => logger.info(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  auth: (message: string, meta?: any) => logger.auth(message, meta),
  db: (message: string, meta?: any) => logger.db(message, meta),
  api: (message: string, meta?: any) => logger.api(message, meta),
  security: (message: string, meta?: any) => logger.security(message, meta),
}
