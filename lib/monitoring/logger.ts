/**
 * @fileoverview Structured logging system for the WordWise application.
 *
 * This file provides a comprehensive logging system with configurable
 * log levels, structured formatting, and environment-specific logging
 * strategies.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { getEnvironmentConfig } from '@/lib/config';

/**
 * Log levels in order of severity.
 *
 * @since 1.0.0
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry structure.
 *
 * @since 1.0.0
 */
export interface LogEntry {
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Timestamp */
  timestamp: string;
  /** Additional context data */
  context?: Record<string, any>;
  /** Error object if logging an error */
  error?: Error;
  /** Component or module name */
  component?: string;
  /** User ID if available */
  userId?: string;
  /** Request ID for tracing */
  requestId?: string;
}

/**
 * Logger configuration.
 *
 * @since 1.0.0
 */
export interface LoggerConfig {
  /** Minimum log level to output */
  level: LogLevel;
  /** Whether to enable console logging */
  consoleEnabled: boolean;
  /** Whether to enable structured JSON logging */
  jsonEnabled: boolean;
  /** Whether to include timestamps */
  includeTimestamp: boolean;
  /** Whether to include context data */
  includeContext: boolean;
  /** Maximum context object depth */
  maxContextDepth: number;
  /** Whether to truncate long messages */
  truncateMessages: boolean;
  /** Maximum message length */
  maxMessageLength: number;
}

/**
 * Default logger configuration.
 *
 * @since 1.0.0
 */
const defaultConfig: LoggerConfig = {
  level: 'info',
  consoleEnabled: true,
  jsonEnabled: false,
  includeTimestamp: true,
  includeContext: true,
  maxContextDepth: 3,
  truncateMessages: false,
  maxMessageLength: 1000,
};

/**
 * Log level numeric values for comparison.
 *
 * @since 1.0.0
 */
const logLevelValues: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Logger class for structured logging.
 *
 * Provides configurable logging with different levels,
 * formatting options, and environment-specific behavior.
 *
 * @since 1.0.0
 */
export class Logger {
  private config: LoggerConfig;
  private component?: string;

  /**
   * Create a new logger instance.
   *
   * @param component - Component or module name
   * @param config - Logger configuration
   *
   * @since 1.0.0
   */
  constructor(component?: string, config?: Partial<LoggerConfig>) {
    this.component = component;
    this.config = { ...defaultConfig, ...config };
    
    // Initialize configuration from environment
    this.initializeFromEnvironment();
  }

  /**
   * Initialize logger configuration from environment.
   *
   * @since 1.0.0
   */
  private initializeFromEnvironment(): void {
    try {
      // Only try to get environment config if we're on the server or if window is defined (client)
      if (typeof window === 'undefined' || typeof window !== 'undefined') {
        const envConfig = getEnvironmentConfig();
        
        this.config = {
          ...this.config,
          level: (envConfig.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info',
          consoleEnabled: process.env.NODE_ENV === 'development',
          jsonEnabled: process.env.NODE_ENV === 'production',
        };
      }
    } catch (error) {
      // Fall back to default configuration
      console.warn('Failed to initialize logger from environment:', error);
    }
  }

  /**
   * Check if a log level should be output.
   *
   * @param level - Log level to check
   * @returns True if the level should be logged
   *
   * @since 1.0.0
   */
  private shouldLog(level: LogLevel): boolean {
    return logLevelValues[level] >= logLevelValues[this.config.level];
  }

  /**
   * Truncate message if needed.
   *
   * @param message - Message to truncate
   * @returns Truncated message
   *
   * @since 1.0.0
   */
  private truncateMessage(message: string): string {
    if (!this.config.truncateMessages || message.length <= this.config.maxMessageLength) {
      return message;
    }
    
    return message.substring(0, this.config.maxMessageLength) + '...';
  }

  /**
   * Truncate context object to prevent circular references.
   *
   * @param obj - Object to truncate
   * @param depth - Current depth
   * @returns Truncated object
   *
   * @since 1.0.0
   */
  private truncateContext(obj: any, depth: number = 0): any {
    if (depth >= this.config.maxContextDepth) {
      return '[Max Depth Reached]';
    }
    
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }
    
    if (obj instanceof Error) {
      return {
        name: obj.name,
        message: obj.message,
        stack: obj.stack,
      };
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.truncateContext(item, depth + 1));
    }
    
    if (typeof obj === 'object') {
      const truncated: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        truncated[key] = this.truncateContext(value, depth + 1);
      }
      return truncated;
    }
    
    return obj;
  }

  /**
   * Format log entry for console output.
   *
   * @param entry - Log entry to format
   * @returns Formatted log string
   *
   * @since 1.0.0
   */
  private formatForConsole(entry: LogEntry): string {
    const parts: string[] = [];
    
    // Add timestamp
    if (this.config.includeTimestamp) {
      parts.push(`[${entry.timestamp}]`);
    }
    
    // Add level
    parts.push(`[${entry.level.toUpperCase()}]`);
    
    // Add component
    if (entry.component) {
      parts.push(`[${entry.component}]`);
    }
    
    // Add message
    parts.push(entry.message);
    
    return parts.join(' ');
  }

  /**
   * Format log entry for JSON output.
   *
   * @param entry - Log entry to format
   * @returns JSON string
   *
   * @since 1.0.0
   */
  private formatForJson(entry: LogEntry): string {
    const jsonEntry: any = {
      level: entry.level,
      message: entry.message,
      timestamp: entry.timestamp,
    };
    
    if (entry.component) {
      jsonEntry.component = entry.component;
    }
    
    if (entry.userId) {
      jsonEntry.userId = entry.userId;
    }
    
    if (entry.requestId) {
      jsonEntry.requestId = entry.requestId;
    }
    
    if (this.config.includeContext && entry.context) {
      jsonEntry.context = this.truncateContext(entry.context);
    }
    
    if (entry.error) {
      jsonEntry.error = {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack,
      };
    }
    
    return JSON.stringify(jsonEntry);
  }

  /**
   * Output log entry.
   *
   * @param entry - Log entry to output
   *
   * @since 1.0.0
   */
  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }
    
    // Console output
    if (this.config.consoleEnabled) {
      const consoleMethod = entry.level === 'error' ? 'error' : 
                           entry.level === 'warn' ? 'warn' : 
                           entry.level === 'debug' ? 'debug' : 'log';
      
      console[consoleMethod](this.formatForConsole(entry));
      
      // Log context separately if present
      if (this.config.includeContext && entry.context) {
        console[consoleMethod]('Context:', this.truncateContext(entry.context));
      }
      
      // Log error separately if present
      if (entry.error) {
        console[consoleMethod]('Error:', entry.error);
      }
    }
    
    // JSON output
    if (this.config.jsonEnabled) {
      console.log(this.formatForJson(entry));
    }
  }

  /**
   * Create log entry.
   *
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context
   * @param error - Error object
   * @returns Log entry
   *
   * @since 1.0.0
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message: this.truncateMessage(message),
      timestamp: new Date().toISOString(),
      component: this.component,
      context: context ? this.truncateContext(context) : undefined,
      error,
    };
  }

  /**
   * Log debug message.
   *
   * @param message - Debug message
   * @param context - Additional context
   *
   * @since 1.0.0
   */
  debug(message: string, context?: Record<string, any>): void {
    this.output(this.createEntry('debug', message, context));
  }

  /**
   * Log info message.
   *
   * @param message - Info message
   * @param context - Additional context
   *
   * @since 1.0.0
   */
  info(message: string, context?: Record<string, any>): void {
    this.output(this.createEntry('info', message, context));
  }

  /**
   * Log warning message.
   *
   * @param message - Warning message
   * @param context - Additional context
   *
   * @since 1.0.0
   */
  warn(message: string, context?: Record<string, any>): void {
    this.output(this.createEntry('warn', message, context));
  }

  /**
   * Log error message.
   *
   * @param message - Error message
   * @param error - Error object
   * @param context - Additional context
   *
   * @since 1.0.0
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.output(this.createEntry('error', message, context, error));
  }

  /**
   * Create a child logger with additional context.
   *
   * @param component - Child component name
   * @returns Child logger instance
   *
   * @since 1.0.0
   */
  child(component: string): Logger {
    const childComponent = this.component ? `${this.component}:${component}` : component;
    return new Logger(childComponent, this.config);
  }

  /**
   * Get logger configuration.
   *
   * @returns Current logger configuration
   *
   * @since 1.0.0
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

// Lazy logger instance - only create when needed
let _logger: Logger | null = null;

/**
 * Get the global logger instance.
 *
 * Creates the logger lazily to avoid initialization issues
 * with environment variables.
 *
 * @returns The global logger instance
 *
 * @since 1.0.0
 */
export function getLogger(): Logger {
  if (!_logger) {
    _logger = new Logger();
  }
  return _logger;
}

/**
 * Create a new logger instance for a specific component.
 *
 * @param component - Component name for the logger
 * @returns New logger instance
 *
 * @since 1.0.0
 */
export function createLogger(component: string): Logger {
  return new Logger(component);
}

/**
 * Log levels utility functions.
 *
 * @since 1.0.0
 */
export const logLevels = {
  debug: (message: string, context?: Record<string, any>) => getLogger().debug(message, context),
  info: (message: string, context?: Record<string, any>) => getLogger().info(message, context),
  warn: (message: string, context?: Record<string, any>) => getLogger().warn(message, context),
  error: (message: string, error?: Error, context?: Record<string, any>) => getLogger().error(message, error, context),
}; 