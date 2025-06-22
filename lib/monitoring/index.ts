/**
 * @fileoverview Monitoring module exports.
 *
 * This file exports all monitoring-related utilities and types
 * for error tracking, logging, analytics, and performance monitoring.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Error tracking exports
export {
  trackError,
  trackErrorWithContext,
  initializeErrorTracking,
  getErrorTrackingStats,
  resetErrorTracking,
  type ErrorSeverity,
  type ErrorContext,
  type ErrorInfo,
  type ErrorTrackingConfig,
  type ErrorTrackingResult,
} from './error-tracker';

// Logger exports
export {
  Logger,
  getLogger,
  createLogger,
  logLevels,
  type LogLevel,
  type LogEntry,
  type LoggerConfig,
} from './logger';

// Backward compatibility exports
export { getLogger as logger } from './logger'; 