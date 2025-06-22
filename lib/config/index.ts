/**
 * @fileoverview Configuration module exports.
 *
 * This file exports all configuration-related utilities and types
 * for environment validation, health checks, and configuration management.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Environment validation exports
export {
  validateEnvironmentVariables,
  getEnvironmentConfig,
  validateFirebaseConfig,
  validateEmulatorConfig,
  validateAppConfig,
  validateMonitoringConfig,
  isEnvironmentConfigured,
  getEnvironmentSummary,
  type EnvironmentValidationResult,
  type EnvironmentValidationError,
} from './env-validation';

// Environment schema exports
export {
  environmentSchema,
  firebaseConfigSchema,
  emulatorConfigSchema,
  appConfigSchema,
  monitoringConfigSchema,
  developmentDefaults,
  productionDefaults,
  type EnvironmentConfig,
  type FirebaseConfig,
  type EmulatorConfig,
  type AppConfig,
  type MonitoringConfig,
} from './env-schema';

// Health check exports
export {
  checkEnvironmentHealth,
  checkFirebaseHealth,
  checkSystemHealth,
  performHealthCheck,
  quickHealthCheck,
  type HealthCheckResult,
  type HealthStatus,
} from './health-check'; 