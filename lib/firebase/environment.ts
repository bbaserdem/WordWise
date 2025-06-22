/**
 * @fileoverview Firebase environment configuration and project management.
 *
 * This file provides utilities for managing multiple Firebase environments
 * (development and production) and automatically selecting the appropriate
 * project based on the current environment.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

/**
 * Supported Firebase environments.
 *
 * @since 1.0.0
 */
export type FirebaseEnvironment = 'development' | 'production';

/**
 * Firebase project configuration.
 *
 * @since 1.0.0
 */
export interface FirebaseProjectConfig {
  /** Project ID */
  projectId: string;
  /** Environment name */
  environment: FirebaseEnvironment;
  /** Whether this is the default project */
  isDefault: boolean;
}

/**
 * Firebase project configurations for different environments.
 *
 * @since 1.0.0
 */
export const FIREBASE_PROJECTS: Record<FirebaseEnvironment, FirebaseProjectConfig> = {
  development: {
    projectId: 'wordwise-thesis-dev',
    environment: 'development',
    isDefault: true,
  },
  production: {
    projectId: 'wordwise-thesis-prod',
    environment: 'production',
    isDefault: false,
  },
} as const;

/**
 * Get the current Firebase environment.
 *
 * Determines the environment based on NODE_ENV and FIREBASE_ENV.
 * Falls back to development if not specified.
 *
 * @returns The current Firebase environment
 *
 * @since 1.0.0
 */
export function getCurrentFirebaseEnvironment(): FirebaseEnvironment {
  // Check for explicit Firebase environment
  const firebaseEnv = process.env.FIREBASE_ENV as FirebaseEnvironment;
  if (firebaseEnv && (firebaseEnv === 'development' || firebaseEnv === 'production')) {
    return firebaseEnv;
  }

  // Fall back to NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    return 'production';
  }

  // Default to development
  return 'development';
}

/**
 * Get the current Firebase project configuration.
 *
 * @returns The current Firebase project configuration
 *
 * @since 1.0.0
 */
export function getCurrentFirebaseProject(): FirebaseProjectConfig {
  const environment = getCurrentFirebaseEnvironment();
  return FIREBASE_PROJECTS[environment];
}

/**
 * Get Firebase project configuration by environment.
 *
 * @param environment - The Firebase environment
 * @returns The Firebase project configuration for the specified environment
 *
 * @since 1.0.0
 */
export function getFirebaseProject(environment: FirebaseEnvironment): FirebaseProjectConfig {
  return FIREBASE_PROJECTS[environment];
}

/**
 * Get all Firebase project configurations.
 *
 * @returns All Firebase project configurations
 *
 * @since 1.0.0
 */
export function getAllFirebaseProjects(): Record<FirebaseEnvironment, FirebaseProjectConfig> {
  return FIREBASE_PROJECTS;
}

/**
 * Check if the current environment is production.
 *
 * @returns True if the current environment is production
 *
 * @since 1.0.0
 */
export function isProductionEnvironment(): boolean {
  return getCurrentFirebaseEnvironment() === 'production';
}

/**
 * Check if the current environment is development.
 *
 * @returns True if the current environment is development
 *
 * @since 1.0.0
 */
export function isDevelopmentEnvironment(): boolean {
  return getCurrentFirebaseEnvironment() === 'development';
}

/**
 * Get environment-specific Firebase configuration.
 *
 * This function returns the appropriate Firebase configuration
 * based on the current environment, ensuring proper project
 * selection for different deployment targets.
 *
 * @returns Environment-specific Firebase configuration object
 *
 * @since 1.0.0
 */
export function getEnvironmentFirebaseConfig() {
  const project = getCurrentFirebaseProject();
  
  // For development, use hardcoded values since environment variables
  // are not being exposed to the client-side code properly
  if (process.env.NODE_ENV === 'development') {
    return {
      apiKey: 'AIzaSyCQRHifuGl2m2saEdrmPLGNMVYFSyt-a8I',
      authDomain: 'wordwise-thesis-dev.firebaseapp.com',
      projectId: project.projectId,
      storageBucket: 'wordwise-thesis-dev.appspot.com',
      messagingSenderId: '912818082421',
      appId: '1:912818082421:web:6f23299e4bc9ca4f8f1e3c',
      measurementId: 'G-HT4GW4B9Q5',
    };
  }
  
  // For production, use environment variables
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: project.projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

/**
 * Validate Firebase project configuration.
 *
 * Checks if the current project configuration is valid
 * and all required environment variables are set.
 *
 * @returns Validation result with success status and any errors
 *
 * @since 1.0.0
 */
export function validateFirebaseProjectConfig(): {
  isValid: boolean;
  errors: string[];
  project: FirebaseProjectConfig;
  environment: FirebaseEnvironment;
} {
  const errors: string[] = [];
  const environment = getCurrentFirebaseEnvironment();
  const project = getCurrentFirebaseProject();

  // Check required environment variables
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // Validate project ID
  if (!project.projectId) {
    errors.push('Firebase project ID is not configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
    project,
    environment,
  };
}

/**
 * Get Firebase CLI project selection command.
 *
 * Returns the appropriate Firebase CLI command to select
 * the current project for deployment or other operations.
 *
 * @returns Firebase CLI project selection command
 *
 * @since 1.0.0
 */
export function getFirebaseProjectCommand(): string {
  const project = getCurrentFirebaseProject();
  return `firebase use ${project.projectId}`;
}

/**
 * Get Firebase CLI deployment command.
 *
 * Returns the appropriate Firebase CLI command for deploying
 * to the current environment.
 *
 * @param target - Optional deployment target (hosting, firestore, etc.)
 * @returns Firebase CLI deployment command
 *
 * @since 1.0.0
 */
export function getFirebaseDeployCommand(target?: string): string {
  const project = getCurrentFirebaseProject();
  const targetFlag = target ? ` --only ${target}` : '';
  return `firebase deploy --project ${project.projectId}${targetFlag}`;
} 