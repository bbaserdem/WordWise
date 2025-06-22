/**
 * @fileoverview Environment variable validation schemas using Zod.
 *
 * This file defines Zod schemas for validating environment variables
 * at runtime, ensuring type safety and proper configuration.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { z } from 'zod';

/**
 * Firebase configuration schema.
 *
 * Validates all Firebase-related environment variables with proper
 * type checking and format validation.
 *
 * @since 1.0.0
 */
export const firebaseConfigSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

/**
 * Emulator configuration schema.
 *
 * Validates emulator-related environment variables for local development.
 *
 * @since 1.0.0
 */
export const emulatorConfigSchema = z.object({
  NEXT_PUBLIC_USE_AUTH_EMULATOR: z.string().optional(),
  NEXT_PUBLIC_USE_FIRESTORE_EMULATOR: z.string().optional(),
  NEXT_PUBLIC_USE_STORAGE_EMULATOR: z.string().optional(),
});

/**
 * Application configuration schema.
 *
 * Validates application-specific environment variables.
 *
 * @since 1.0.0
 */
export const appConfigSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().optional(),
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),
});

/**
 * Monitoring configuration schema.
 *
 * Validates monitoring and analytics environment variables.
 *
 * @since 1.0.0
 */
export const monitoringConfigSchema = z.object({
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().optional(),
  NEXT_PUBLIC_ENABLE_ERROR_TRACKING: z.string().optional(),
  NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: z.string().optional(),
  NEXT_PUBLIC_LOG_LEVEL: z.string().optional(),
});

/**
 * Firebase environment configuration schema.
 *
 * Validates Firebase environment-specific variables.
 *
 * @since 1.0.0
 */
export const firebaseEnvironmentSchema = z.object({
  FIREBASE_ENV: z.enum(['development', 'production']).optional(),
});

/**
 * Complete environment configuration schema.
 *
 * Combines all environment variable schemas into a single
 * validation schema for the entire application.
 *
 * @since 1.0.0
 */
export const environmentSchema = z.object({
  ...firebaseConfigSchema.shape,
  ...emulatorConfigSchema.shape,
  ...appConfigSchema.shape,
  ...monitoringConfigSchema.shape,
  ...firebaseEnvironmentSchema.shape,
});

/**
 * Type definitions derived from schemas.
 *
 * These types are automatically generated from the Zod schemas
 * and provide full type safety for environment configuration.
 *
 * @since 1.0.0
 */
export type FirebaseConfig = z.infer<typeof firebaseConfigSchema>;
export type EmulatorConfig = z.infer<typeof emulatorConfigSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;
export type MonitoringConfig = z.infer<typeof monitoringConfigSchema>;
export type FirebaseEnvironmentConfig = z.infer<typeof firebaseEnvironmentSchema>;
export type EnvironmentConfig = z.infer<typeof environmentSchema>;

/**
 * Development environment overrides.
 *
 * Default values for development environment when
 * certain variables are not set.
 *
 * @since 1.0.0
 */
export const developmentDefaults = {
  NEXT_PUBLIC_USE_AUTH_EMULATOR: 'true',
  NEXT_PUBLIC_USE_FIRESTORE_EMULATOR: 'true',
  NEXT_PUBLIC_USE_STORAGE_EMULATOR: 'true',
  NEXT_PUBLIC_ENABLE_ANALYTICS: 'false',
  NEXT_PUBLIC_ENABLE_ERROR_TRACKING: 'true',
  NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: 'false',
  NEXT_PUBLIC_LOG_LEVEL: 'debug',
  FIREBASE_ENV: 'development',
} as const;

/**
 * Production environment overrides.
 *
 * Default values for production environment when
 * certain variables are not set.
 *
 * @since 1.0.0
 */
export const productionDefaults = {
  NEXT_PUBLIC_USE_AUTH_EMULATOR: 'false',
  NEXT_PUBLIC_USE_FIRESTORE_EMULATOR: 'false',
  NEXT_PUBLIC_USE_STORAGE_EMULATOR: 'false',
  NEXT_PUBLIC_ENABLE_ANALYTICS: 'true',
  NEXT_PUBLIC_ENABLE_ERROR_TRACKING: 'true',
  NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: 'true',
  NEXT_PUBLIC_LOG_LEVEL: 'warn',
  FIREBASE_ENV: 'production',
} as const; 