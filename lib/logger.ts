type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: any
}

class Logger {
  private logLevel: LogLevel

  constructor(logLevel: LogLevel = "info") {
    this.logLevel = logLevel
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }
    return levels[level] >= levels[this.logLevel]
  }

  private formatLog(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog("debug")) {
      const logEntry = this.formatLog("debug", message, data)
      console.debug(`[DEBUG] ${logEntry.timestamp} - ${message}`, data || "")
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog("info")) {
      const logEntry = this.formatLog("info", message, data)
      console.info(`[INFO] ${logEntry.timestamp} - ${message}`, data || "")
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog("warn")) {
      const logEntry = this.formatLog("warn", message, data)
      console.warn(`[WARN] ${logEntry.timestamp} - ${message}`, data || "")
    }
  }

  error(message: string, data?: any) {
    if (this.shouldLog("error")) {
      const logEntry = this.formatLog("error", message, data)
      console.error(`[ERROR] ${logEntry.timestamp} - ${message}`, data || "")
    }
  }
}

// Create and export logger instance
export const logger = new Logger((process.env.LOG_LEVEL as LogLevel) || "info")
