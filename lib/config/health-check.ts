/**
 * @fileoverview Health check utilities for environment and system validation.
 *
 * This file provides utilities to check the health of the application
 * environment, Firebase connections, and system resources.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { getEnvironmentConfig, getEnvironmentSummary, isEnvironmentConfigured } from './env-validation';

/**
 * Health check result for a specific component.
 *
 * @since 1.0.0
 */
export interface HealthCheckResult {
  /** Component name */
  component: string;
  /** Whether the component is healthy */
  healthy: boolean;
  /** Status message */
  message: string;
  /** Response time in milliseconds */
  responseTime?: number;
  /** Additional details */
  details?: Record<string, any>;
  /** Error information if unhealthy */
  error?: string;
}

/**
 * Overall health check status.
 *
 * @since 1.0.0
 */
export interface HealthStatus {
  /** Overall health status */
  healthy: boolean;
  /** Timestamp of the health check */
  timestamp: string;
  /** Environment information */
  environment: string;
  /** Individual component results */
  components: HealthCheckResult[];
  /** Summary statistics */
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
  };
}

/**
 * Check environment configuration health.
 *
 * Validates that all required environment variables are properly
 * configured and accessible.
 *
 * @returns Health check result for environment configuration
 *
 * @since 1.0.0
 */
export async function checkEnvironmentHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const isConfigured = isEnvironmentConfigured();
    const summary = getEnvironmentSummary();
    
    const responseTime = Date.now() - startTime;
    
    if (isConfigured) {
      return {
        component: 'environment',
        healthy: true,
        message: 'Environment configuration is valid',
        responseTime,
        details: {
          environment: summary.environment,
          firebaseConfigured: summary.firebase.isConfigured,
          emulatorsEnabled: summary.emulators,
          monitoringEnabled: summary.monitoring,
        },
      };
    } else {
      return {
        component: 'environment',
        healthy: false,
        message: 'Environment configuration is invalid',
        responseTime,
        error: 'Missing or invalid environment variables',
        details: {
          environment: summary.environment,
        },
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      component: 'environment',
      healthy: false,
      message: 'Environment health check failed',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check Firebase connection health.
 *
 * Validates that Firebase services are accessible and responding.
 *
 * @returns Health check result for Firebase connection
 *
 * @since 1.0.0
 */
export async function checkFirebaseHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const config = getEnvironmentConfig();
    const summary = getEnvironmentSummary();
    
    // Basic validation of Firebase configuration
    if (!config.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !config.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const responseTime = Date.now() - startTime;
      
      return {
        component: 'firebase',
        healthy: false,
        message: 'Firebase configuration is incomplete',
        responseTime,
        error: 'Missing required Firebase configuration',
        details: {
          projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'missing',
          apiKeyConfigured: !!config.NEXT_PUBLIC_FIREBASE_API_KEY,
        },
      };
    }

    // Try to initialize Firebase to test connection
    try {
      const { getFirebaseApp } = await import('@/lib/firebase/config');
      const app = getFirebaseApp();
      
      const responseTime = Date.now() - startTime;
      
      return {
        component: 'firebase',
        healthy: true,
        message: 'Firebase connection is healthy',
        responseTime,
        details: {
          projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          authDomain: config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          emulatorsEnabled: summary.emulators,
        },
      };
    } catch (firebaseError) {
      const responseTime = Date.now() - startTime;
      
      return {
        component: 'firebase',
        healthy: false,
        message: 'Firebase initialization failed',
        responseTime,
        error: firebaseError instanceof Error ? firebaseError.message : 'Firebase error',
        details: {
          projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        },
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      component: 'firebase',
      healthy: false,
      message: 'Firebase health check failed',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check system resources health.
 *
 * Validates basic system resources and performance metrics.
 *
 * @returns Health check result for system resources
 *
 * @since 1.0.0
 */
export async function checkSystemHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Basic system checks
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    const responseTime = Date.now() - startTime;
    
    // Consider system healthy if memory usage is reasonable
    const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
    const isHealthy = memoryUsageMB < 500; // Less than 500MB
    
    return {
      component: 'system',
      healthy: isHealthy,
      message: isHealthy ? 'System resources are healthy' : 'System resources are under pressure',
      responseTime,
      details: {
        memoryUsageMB: Math.round(memoryUsageMB * 100) / 100,
        uptimeSeconds: Math.round(uptime),
        nodeVersion: process.version,
        platform: process.platform,
      },
      ...(isHealthy ? {} : { error: 'High memory usage detected' }),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      component: 'system',
      healthy: false,
      message: 'System health check failed',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Perform comprehensive health check.
 *
 * Runs all health checks and returns a comprehensive status report.
 *
 * @returns Complete health status for the application
 *
 * @since 1.0.0
 */
export async function performHealthCheck(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  // Run all health checks in parallel
  const healthChecks = await Promise.all([
    checkEnvironmentHealth(),
    checkFirebaseHealth(),
    checkSystemHealth(),
  ]);
  
  const totalResponseTime = Date.now() - startTime;
  
  // Calculate summary statistics
  const total = healthChecks.length;
  const healthy = healthChecks.filter(check => check.healthy).length;
  const unhealthy = total - healthy;
  
  // Overall health is true only if all components are healthy
  const overallHealthy = healthy === total;
  
  return {
    healthy: overallHealthy,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    components: healthChecks,
    summary: {
      total,
      healthy,
      unhealthy,
    },
  };
}

/**
 * Quick health check for basic validation.
 *
 * Performs a minimal health check for quick validation
 * without detailed component analysis.
 *
 * @returns Basic health status
 *
 * @since 1.0.0
 */
export async function quickHealthCheck(): Promise<{ healthy: boolean; message: string }> {
  try {
    // Check if environment is configured
    if (!isEnvironmentConfigured()) {
      return {
        healthy: false,
        message: 'Environment not properly configured',
      };
    }
    
    // Check if Firebase can be initialized
    try {
      const { getFirebaseApp } = await import('@/lib/firebase/config');
      getFirebaseApp();
    } catch {
      return {
        healthy: false,
        message: 'Firebase not accessible',
      };
    }
    
    return {
      healthy: true,
      message: 'Application is healthy',
    };
  } catch (error) {
    return {
      healthy: false,
      message: error instanceof Error ? error.message : 'Health check failed',
    };
  }
} 