type LogLevel = "error" | "warn" | "info" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
}

class Logger {
  private level: LogLevel

  constructor(level: LogLevel = "info") {
    this.level = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    }
    return levels[level] <= levels[this.level]
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`

    if (context && Object.keys(context).length > 0) {
      log += ` | Context: ${JSON.stringify(context)}`
    }

    if (error) {
      log += ` | Error: ${error.message}`
      if (error.stack) {
        log += `\nStack: ${error.stack}`
      }
    }

    return log
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
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
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log("error", message, context, error)
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("warn", message, context)
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("info", message, context)
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("debug", message, context)
  }
}

// Create and export logger instance
const logLevel = (process.env.LOG_LEVEL as LogLevel) || "info"
export const logger = new Logger(logLevel)

// Export types for use in other modules
export type { LogLevel, LogEntry }
