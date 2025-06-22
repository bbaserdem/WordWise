/**
 * @fileoverview Example usage of the monitoring system.
 *
 * This file demonstrates how to use the error tracking and logging
 * features in components and utilities throughout the application.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { trackError, trackErrorWithContext, getLogger, createLogger } from '@/lib/monitoring';

/**
 * Example: Using error tracking in a component.
 *
 * @since 1.0.0
 */
export async function exampleComponentErrorHandling() {
  try {
    // Some operation that might fail
    const result = await someRiskyOperation();
    return result;
  } catch (error) {
    // Track the error with context
    await trackError(error as Error, {
      location: 'example-component',
      userId: 'user123',
      metadata: {
        operation: 'someRiskyOperation',
        timestamp: new Date().toISOString(),
      },
    });
    
    // Re-throw or handle the error
    throw error;
  }
}

/**
 * Example: Using automatic context extraction.
 *
 * @since 1.0.0
 */
export async function exampleAutomaticContext() {
  try {
    // Some operation that might fail
    const result = await anotherRiskyOperation();
    return result;
  } catch (error) {
    // Automatically extracts context from current environment
    await trackErrorWithContext(error as Error, {
      userId: 'user123',
      metadata: {
        operation: 'anotherRiskyOperation',
      },
    });
    
    throw error;
  }
}

/**
 * Example: Using structured logging.
 *
 * @since 1.0.0
 */
export function exampleStructuredLogging() {
  // Create a logger for a specific component
  const componentLogger = createLogger('UserProfile');
  
  // Log different levels with context
  componentLogger.debug('Loading user profile', { userId: 'user123' });
  componentLogger.info('User profile loaded successfully', { 
    userId: 'user123',
    profileData: { name: 'John Doe', email: 'john@example.com' }
  });
  componentLogger.warn('Profile data incomplete', { 
    userId: 'user123',
    missingFields: ['avatar', 'bio']
  });
  
  // Log errors with error objects
  try {
    throw new Error('Failed to update profile');
  } catch (error) {
    componentLogger.error('Profile update failed', error as Error, {
      userId: 'user123',
      updateData: { name: 'John Smith' }
    });
  }
}

/**
 * Example: Using child loggers for sub-components.
 *
 * @since 1.0.0
 */
export function exampleChildLoggers() {
  const mainLogger = createLogger('UserProfile');
  const avatarLogger = mainLogger.child('Avatar');
  const bioLogger = mainLogger.child('Bio');
  
  avatarLogger.info('Loading avatar');
  bioLogger.info('Loading bio');
  
  // This will log as: [INFO] [UserProfile:Avatar] Loading avatar
  // This will log as: [INFO] [UserProfile:Bio] Loading bio
}

/**
 * Example: Error boundary integration.
 *
 * @since 1.0.0
 */
export const exampleErrorBoundaryProps = {
  componentName: 'UserProfile',
  errorContext: {
    userId: 'user123',
    page: 'profile',
  },
  onError: async (error: Error, errorInfo: any) => {
    // Additional error handling if needed
    console.log('Error boundary caught error:', error);
  },
};

/**
 * Example: API route error handling.
 *
 * @since 1.0.0
 */
export async function exampleApiErrorHandling(request: Request) {
  const apiLogger = createLogger('API:UserProfile');
  
  try {
    apiLogger.info('Processing user profile request', {
      method: request.method,
      url: request.url,
    });
    
    // Process the request
    const result = await processUserProfileRequest(request);
    
    apiLogger.info('User profile request completed successfully', {
      userId: result.userId,
      processingTime: result.processingTime,
    });
    
    return result;
  } catch (error) {
    apiLogger.error('User profile request failed', error as Error, {
      method: request.method,
      url: request.url,
    });
    
    // Track the error for analytics
    await trackError(error as Error, {
      location: 'api:user-profile',
      metadata: {
        method: request.method,
        url: request.url,
      },
    });
    
    throw error;
  }
}

// Mock functions for examples
async function someRiskyOperation(): Promise<any> {
  throw new Error('Operation failed');
}

async function anotherRiskyOperation(): Promise<any> {
  throw new Error('Another operation failed');
}

async function processUserProfileRequest(request: Request): Promise<any> {
  return { userId: 'user123', processingTime: 150 };
} 