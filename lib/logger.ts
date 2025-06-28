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

  // Environment-specific logging
  envError(message: string, meta?: any): void {
    this.error(`[ENV] ${message}`, meta)
  }

  configError(message: string, meta?: any): void {
    this.error(`[CONFIG] ${message}`, meta)
  }

  dbError(message: string, meta?: any): void {
    this.error(`[DATABASE] ${message}`, meta)
  }

  apiError(message: string, meta?: any): void {
    this.error(`[API] ${message}`, meta)
  }
}

export const logger = new Logger()
