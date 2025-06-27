import { env } from "./env"

type LogLevel = "error" | "warn" | "info" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
  error?: Error
}

class Logger {
  private logLevel: LogLevel

  constructor() {
    this.logLevel = env.LOG_LEVEL
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    }
    return levels[level] <= levels[this.logLevel]
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, data, error } = entry
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`

    if (data) {
      logMessage += ` | Data: ${JSON.stringify(data, null, 2)}`
    }

    if (error) {
      logMessage += ` | Error: ${error.message}`
      if (error.stack && env.NODE_ENV === "development") {
        logMessage += `\nStack: ${error.stack}`
      }
    }

    return logMessage
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      error,
    }

    const formattedLog = this.formatLog(entry)

    switch (level) {
      case "error":
        console.error(formattedLog)
        break
      case "warn":
        console.warn(formattedLog)
        break
      case "info":
        console.info(formattedLog)
        break
      case "debug":
        console.debug(formattedLog)
        break
    }

    // In production, you might want to send logs to an external service
    if (env.NODE_ENV === "production" && level === "error") {
      // Send to error tracking service (e.g., Sentry)
      this.sendToErrorTracking(entry)
    }
  }

  private sendToErrorTracking(entry: LogEntry): void {
    // Implement error tracking service integration
    // e.g., Sentry, LogRocket, etc.
    if (env.SENTRY_DSN) {
      // Send to Sentry
    }
  }

  error(message: string, data?: any, error?: Error): void {
    this.log("error", message, data, error)
  }

  warn(message: string, data?: any): void {
    this.log("warn", message, data)
  }

  info(message: string, data?: any): void {
    this.log("info", message, data)
  }

  debug(message: string, data?: any): void {
    this.log("debug", message, data)
  }
}

export const logger = new Logger()
