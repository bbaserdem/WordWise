/**
 * @fileoverview Error tracking and reporting system for the WordWise application.
 *
 * This file provides comprehensive error tracking capabilities including
 * structured error logging, Firebase Analytics integration, and error
 * reporting utilities.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { getEnvironmentConfig } from '@/lib/config';

/**
 * Error severity levels.
 *
 * @since 1.0.0
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error context information.
 *
 * @since 1.0.0
 */
export interface ErrorContext {
  /** User ID if available */
  userId?: string;
  /** Current page or component */
  location?: string;
  /** Additional context data */
  metadata?: Record<string, any>;
  /** Browser information */
  userAgent?: string;
  /** Timestamp of the error */
  timestamp?: string;
}

/**
 * Structured error information.
 *
 * @since 1.0.0
 */
export interface ErrorInfo {
  /** Error message */
  message: string;
  /** Error stack trace */
  stack?: string;
  /** Error name/type */
  name?: string;
  /** Error severity level */
  severity: ErrorSeverity;
  /** Error context */
  context: ErrorContext;
  /** Error code if available */
  code?: string;
  /** Additional error data */
  data?: Record<string, any>;
}

/**
 * Error tracking configuration.
 *
 * @since 1.0.0
 */
export interface ErrorTrackingConfig {
  /** Whether error tracking is enabled */
  enabled: boolean;
  /** Whether to log to console in development */
  consoleLogging: boolean;
  /** Whether to send to Firebase Analytics */
  firebaseAnalytics: boolean;
  /** Minimum severity level to track */
  minSeverity: ErrorSeverity;
  /** Maximum errors to track per session */
  maxErrorsPerSession: number;
}

/**
 * Error tracking result.
 *
 * @since 1.0.0
 */
export interface ErrorTrackingResult {
  /** Whether error was successfully tracked */
  success: boolean;
  /** Error ID if generated */
  errorId?: string;
  /** Error message */
  message: string;
  /** Additional details */
  details?: Record<string, any>;
}

/**
 * Default error tracking configuration.
 *
 * @since 1.0.0
 */
const defaultConfig: ErrorTrackingConfig = {
  enabled: true,
  consoleLogging: process.env.NODE_ENV === 'development',
  firebaseAnalytics: true,
  minSeverity: 'medium',
  maxErrorsPerSession: 100,
};

/**
 * Error tracking session state.
 *
 * @since 1.0.0
 */
let sessionState = {
  errorCount: 0,
  config: defaultConfig,
  initialized: false,
};

/**
 * Initialize error tracking system.
 *
 * Sets up the error tracking configuration and prepares
 * the system for error monitoring.
 *
 * @param config - Error tracking configuration
 * @since 1.0.0
 */
export function initializeErrorTracking(config?: Partial<ErrorTrackingConfig>): void {
  try {
    // Try to get environment config, but don't fail if it's not available yet
    let envConfig;
    try {
      envConfig = getEnvironmentConfig();
    } catch (error) {
      console.warn('Environment config not available yet, using defaults:', error);
      envConfig = {
        NEXT_PUBLIC_ENABLE_ERROR_TRACKING: 'true',
        NEXT_PUBLIC_ENABLE_ANALYTICS: 'false',
      };
    }
    
    sessionState.config = {
      ...defaultConfig,
      enabled: envConfig.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true',
      consoleLogging: process.env.NODE_ENV === 'development',
      firebaseAnalytics: envConfig.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
      ...config,
    };
    
    sessionState.initialized = true;
    
    if (sessionState.config.consoleLogging) {
      console.log('Error tracking initialized:', sessionState.config);
    }
  } catch (error) {
    console.warn('Failed to initialize error tracking:', error);
    // Fall back to basic configuration
    sessionState.config = { ...defaultConfig, ...config };
    sessionState.initialized = true;
  }
}

/**
 * Determine error severity based on error type and context.
 *
 * @param error - Error object
 * @param context - Error context
 * @returns Error severity level
 *
 * @since 1.0.0
 */
function determineErrorSeverity(error: Error, context: ErrorContext): ErrorSeverity {
  // Critical errors
  if (error.name === 'NetworkError' || error.message.includes('network')) {
    return 'critical';
  }
  
  // High severity errors
  if (error.name === 'FirebaseError' || error.message.includes('firebase')) {
    return 'high';
  }
  
  // Medium severity errors
  if (error.name === 'ValidationError' || error.message.includes('validation')) {
    return 'medium';
  }
  
  // Default to low severity
  return 'low';
}

/**
 * Generate unique error ID.
 *
 * @returns Unique error identifier
 *
 * @since 1.0.0
 */
function generateErrorId(): string {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log error to console in development.
 *
 * @param errorInfo - Error information to log
 *
 * @since 1.0.0
 */
function logToConsole(errorInfo: ErrorInfo): void {
  if (!sessionState.config.consoleLogging) return;
  
  const { message, stack, severity, context } = errorInfo;
  
  console.group(`🚨 Error (${severity}): ${message}`);
  console.error('Stack:', stack);
  console.error('Context:', context);
  console.error('Timestamp:', context.timestamp);
  console.groupEnd();
}

/**
 * Send error to Firebase Analytics.
 *
 * @param errorInfo - Error information to send
 * @returns Promise that resolves when error is sent
 *
 * @since 1.0.0
 */
async function sendToFirebaseAnalytics(errorInfo: ErrorInfo): Promise<void> {
  if (!sessionState.config.firebaseAnalytics) return;
  
  try {
    const { getAnalytics, logEvent } = await import('firebase/analytics');
    const { getFirebaseApp } = await import('@/lib/firebase/config');
    
    const app = getFirebaseApp();
    const analytics = getAnalytics(app);
    
    await logEvent(analytics, 'error', {
      error_message: errorInfo.message,
      error_name: errorInfo.name,
      error_severity: errorInfo.severity,
      error_location: errorInfo.context.location,
      error_code: errorInfo.code,
      user_id: errorInfo.context.userId,
      timestamp: errorInfo.context.timestamp,
    });
  } catch (error) {
    // Silently fail if Firebase Analytics is not available
    console.warn('Failed to send error to Firebase Analytics:', error);
  }
}

/**
 * Track an error with structured information.
 *
 * This is the main function for tracking errors in the application.
 * It provides structured error logging, severity determination,
 * and integration with monitoring services.
 *
 * @param error - Error object to track
 * @param context - Additional context information
 * @param severity - Optional severity override
 * @returns Error tracking result
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation that might fail
 * } catch (error) {
 *   const result = await trackError(error, {
 *     location: 'user-profile',
 *     userId: user.id,
 *   });
 *   console.log('Error tracked:', result);
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function trackError(
  error: Error,
  context: Partial<ErrorContext> = {},
  severity?: ErrorSeverity
): Promise<ErrorTrackingResult> {
  // Initialize if not already done
  if (!sessionState.initialized) {
    initializeErrorTracking();
  }
  
  // Check if error tracking is enabled
  if (!sessionState.config.enabled) {
    return {
      success: false,
      message: 'Error tracking is disabled',
    };
  }
  
  // Check error count limit
  if (sessionState.errorCount >= sessionState.config.maxErrorsPerSession) {
    return {
      success: false,
      message: 'Maximum error count reached for this session',
    };
  }
  
  try {
    // Determine severity if not provided
    const errorSeverity = severity || determineErrorSeverity(error, context);
    
    // Check minimum severity threshold
    const severityLevels: ErrorSeverity[] = ['low', 'medium', 'high', 'critical'];
    const minSeverityIndex = severityLevels.indexOf(sessionState.config.minSeverity);
    const errorSeverityIndex = severityLevels.indexOf(errorSeverity);
    
    if (errorSeverityIndex < minSeverityIndex) {
      return {
        success: false,
        message: 'Error severity below minimum threshold',
      };
    }
    
    // Prepare error information
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      severity: errorSeverity,
      context: {
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        ...context,
      },
    };
    
    // Generate error ID
    const errorId = generateErrorId();
    
    // Log to console in development
    logToConsole(errorInfo);
    
    // Send to Firebase Analytics
    await sendToFirebaseAnalytics(errorInfo);
    
    // Increment error count
    sessionState.errorCount++;
    
    return {
      success: true,
      errorId,
      message: 'Error tracked successfully',
      details: {
        severity: errorSeverity,
        location: context.location,
        timestamp: errorInfo.context.timestamp,
      },
    };
  } catch (trackingError) {
    console.error('Failed to track error:', trackingError);
    
    return {
      success: false,
      message: 'Failed to track error',
      details: {
        originalError: error.message,
        trackingError: trackingError instanceof Error ? trackingError.message : 'Unknown',
      },
    };
  }
}

/**
 * Track error with automatic context extraction.
 *
 * Convenience function that automatically extracts context
 * from the current environment and tracks the error.
 *
 * @param error - Error object to track
 * @param additionalContext - Additional context to include
 * @returns Error tracking result
 *
 * @since 1.0.0
 */
export async function trackErrorWithContext(
  error: Error,
  additionalContext: Partial<ErrorContext> = {}
): Promise<ErrorTrackingResult> {
  const context: Partial<ErrorContext> = {
    location: typeof window !== 'undefined' ? window.location.pathname : 'server',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    ...additionalContext,
  };
  
  return trackError(error, context);
}

/**
 * Get error tracking statistics.
 *
 * @returns Current error tracking statistics
 *
 * @since 1.0.0
 */
export function getErrorTrackingStats(): {
  errorCount: number;
  maxErrorsPerSession: number;
  config: ErrorTrackingConfig;
  initialized: boolean;
} {
  return {
    errorCount: sessionState.errorCount,
    maxErrorsPerSession: sessionState.config.maxErrorsPerSession,
    config: sessionState.config,
    initialized: sessionState.initialized,
  };
}

/**
 * Reset error tracking session.
 *
 * Clears the error count and resets session state.
 * Useful for testing or when starting a new session.
 *
 * @since 1.0.0
 */
export function resetErrorTracking(): void {
  sessionState.errorCount = 0;
  console.log('Error tracking session reset');
} 