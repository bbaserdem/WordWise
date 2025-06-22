/**
 * @fileoverview Runtime environment variable validation and configuration.
 *
 * This file provides functions to validate environment variables at runtime,
 * apply environment-specific defaults, and provide type-safe access to
 * configuration values.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { z } from 'zod';
import {
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

/**
 * Environment validation error with detailed information.
 *
 * @since 1.0.0
 */
export interface EnvironmentValidationError {
  /** Error message */
  message: string;
  /** Validation errors from Zod */
  errors: z.ZodError;
  /** Environment that was being validated */
  environment: string;
  /** Missing variables */
  missing: string[];
  /** Invalid variables */
  invalid: string[];
}

/**
 * Environment configuration result.
 *
 * @since 1.0.0
 */
export interface EnvironmentValidationResult {
  /** Whether validation was successful */
  success: boolean;
  /** Validated configuration (if successful) */
  config?: EnvironmentConfig;
  /** Validation error (if failed) */
  error?: EnvironmentValidationError;
}

/**
 * Get environment-specific default values.
 *
 * @param environment - Target environment
 * @returns Default values for the environment
 *
 * @since 1.0.0
 */
function getEnvironmentDefaults(environment: string): Record<string, string> {
  switch (environment) {
    case 'development':
      return developmentDefaults;
    case 'production':
      return productionDefaults;
    default:
      return {};
  }
}

/**
 * Prepare environment variables for validation.
 *
 * Merges process.env with environment-specific defaults
 * and filters to only include relevant variables.
 *
 * @param environment - Target environment
 * @returns Prepared environment variables
 *
 * @since 1.0.0
 */
function prepareEnvironmentVariables(environment: string): Record<string, string> {
  const defaults = getEnvironmentDefaults(environment);
  const envVars: Record<string, string> = {};
  
  // Copy process.env, filtering out undefined values
  Object.entries(process.env).forEach(([key, value]) => {
    if (value !== undefined) {
      envVars[key] = value;
    }
  });
  
  // Apply defaults for missing optional variables
  Object.entries(defaults).forEach(([key, value]) => {
    if (!envVars[key]) {
      envVars[key] = value;
    }
  });

  return envVars;
}

/**
 * Validate environment variables using Zod schemas.
 *
 * This function validates all environment variables against the
 * defined schemas and returns a structured result with either
 * the validated configuration or detailed error information.
 *
 * @param environment - Target environment (defaults to NODE_ENV)
 * @returns Validation result with config or error
 *
 * @example
 * ```typescript
 * const result = validateEnvironmentVariables();
 * if (result.success) {
 *   console.log('Config:', result.config);
 * } else {
 *   console.error('Validation failed:', result.error);
 * }
 * ```
 *
 * @since 1.0.0
 */
export function validateEnvironmentVariables(
  environment: string = process.env.NODE_ENV || 'development'
): EnvironmentValidationResult {
  try {
    const envVars = prepareEnvironmentVariables(environment);
    
    // Validate using the complete schema
    const validatedConfig = environmentSchema.parse(envVars);
    
    return {
      success: true,
      config: validatedConfig,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing: string[] = [];
      const invalid: string[] = [];
      
      error.errors.forEach((err) => {
        const field = err.path.join('.');
        if (err.code === 'invalid_type' && err.received === 'undefined') {
          missing.push(field);
        } else {
          invalid.push(field);
        }
      });

      const validationError: EnvironmentValidationError = {
        message: 'Environment validation failed',
        errors: error,
        environment,
        missing,
        invalid,
      };

      return {
        success: false,
        error: validationError,
      };
    }

    // Handle unexpected errors
    const unexpectedError: EnvironmentValidationError = {
      message: error instanceof Error ? error.message : 'Unknown validation error',
      errors: new z.ZodError([]),
      environment,
      missing: [],
      invalid: [],
    };

    return {
      success: false,
      error: unexpectedError,
    };
  }
}

/**
 * Get validated environment configuration.
 *
 * This function validates environment variables and returns the
 * configuration, throwing an error if validation fails.
 *
 * @param environment - Target environment (defaults to NODE_ENV)
 * @returns Validated environment configuration
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const config = getEnvironmentConfig();
 *   console.log('Firebase project:', config.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
 * } catch (error) {
 *   console.error('Configuration error:', error.message);
 * }
 * ```
 *
 * @since 1.0.0
 */
export function getEnvironmentConfig(
  environment: string = process.env.NODE_ENV || 'development'
): EnvironmentConfig {
  const result = validateEnvironmentVariables(environment);
  
  if (!result.success || !result.config) {
    const error = result.error;
    const message = error 
      ? `Environment validation failed: ${error.message}\nMissing: ${error.missing.join(', ')}\nInvalid: ${error.invalid.join(', ')}`
      : 'Environment validation failed with unknown error';
    
    throw new Error(message);
  }
  
  return result.config;
}

/**
 * Validate specific configuration sections.
 *
 * These functions validate individual parts of the configuration
 * and are useful for partial validation or testing.
 *
 * @since 1.0.0
 */
export const validateFirebaseConfig = (envVars: Record<string, string>): FirebaseConfig => {
  return firebaseConfigSchema.parse(envVars);
};

export const validateEmulatorConfig = (envVars: Record<string, string>): EmulatorConfig => {
  return emulatorConfigSchema.parse(envVars);
};

export const validateAppConfig = (envVars: Record<string, string>): AppConfig => {
  return appConfigSchema.parse(envVars);
};

export const validateMonitoringConfig = (envVars: Record<string, string>): MonitoringConfig => {
  return monitoringConfigSchema.parse(envVars);
};

/**
 * Check if environment is properly configured.
 *
 * This function performs a quick check to see if the environment
 * is properly configured without throwing errors.
 *
 * @param environment - Target environment (defaults to NODE_ENV)
 * @returns True if environment is properly configured
 *
 * @since 1.0.0
 */
export function isEnvironmentConfigured(
  environment: string = process.env.NODE_ENV || 'development'
): boolean {
  const result = validateEnvironmentVariables(environment);
  return result.success;
}

/**
 * Get environment configuration summary.
 *
 * Returns a summary of the current environment configuration
 * without sensitive information.
 *
 * @param environment - Target environment (defaults to NODE_ENV)
 * @returns Configuration summary
 *
 * @since 1.0.0
 */
export function getEnvironmentSummary(
  environment: string = process.env.NODE_ENV || 'development'
): {
  environment: string;
  isConfigured: boolean;
  firebase: {
    projectId: string;
    authDomain: string;
    isConfigured: boolean;
  };
  emulators: {
    auth: boolean;
    firestore: boolean;
    storage: boolean;
  };
  monitoring: {
    analytics: boolean;
    errorTracking: boolean;
    performanceMonitoring: boolean;
    logLevel: string;
  };
} {
  const result = validateEnvironmentVariables(environment);
  
  if (!result.success || !result.config) {
    return {
      environment,
      isConfigured: false,
      firebase: {
        projectId: 'unknown',
        authDomain: 'unknown',
        isConfigured: false,
      },
      emulators: {
        auth: false,
        firestore: false,
        storage: false,
      },
      monitoring: {
        analytics: false,
        errorTracking: false,
        performanceMonitoring: false,
        logLevel: 'error',
      },
    };
  }

  const config = result.config;
  
  return {
    environment,
    isConfigured: true,
    firebase: {
      projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      authDomain: config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      isConfigured: true,
    },
    emulators: {
      auth: config.NEXT_PUBLIC_USE_AUTH_EMULATOR,
      firestore: config.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR,
      storage: config.NEXT_PUBLIC_USE_STORAGE_EMULATOR,
    },
    monitoring: {
      analytics: config.NEXT_PUBLIC_ENABLE_ANALYTICS,
      errorTracking: config.NEXT_PUBLIC_ENABLE_ERROR_TRACKING,
      performanceMonitoring: config.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING,
      logLevel: config.NEXT_PUBLIC_LOG_LEVEL,
    },
  };
} 