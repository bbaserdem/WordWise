/**
 * @fileoverview Global error component for the WordWise application.
 *
 * This component handles errors that occur at the root level of the application
 * and provides a fallback UI when the app crashes.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { trackError } from '@/lib/monitoring';

/**
 * Props for the GlobalError component.
 */
interface GlobalErrorProps {
  /** The error that occurred */
  error: Error & { digest?: string };
  /** Function to reset the error */
  reset: () => void;
}

/**
 * Global error component for the application.
 *
 * Displays an error message when the application crashes
 * and provides options to retry or navigate to safety.
 *
 * @param error - The error that occurred
 * @param reset - Function to reset the error
 * @returns The global error component
 */
export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  useEffect(() => {
    // Track the error for monitoring
    trackError(error, {
      location: 'global-error',
      metadata: {
        digest: error.digest,
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      },
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
          <div className="max-w-md w-full bg-background-primary rounded-lg shadow-soft p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Application Error
            </h2>
            
            <p className="text-text-secondary mb-4">
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            
            <div className="space-y-2">
              <Button
                onClick={reset}
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
                  Error Details (Development)
                </summary>
                <div className="mt-2 space-y-2">
                  <pre className="p-2 bg-gray-100 rounded text-xs text-text-secondary overflow-auto">
                    <strong>Error:</strong> {error.message}
                  </pre>
                  {error.digest && (
                    <pre className="p-2 bg-gray-100 rounded text-xs text-text-secondary overflow-auto">
                      <strong>Digest:</strong> {error.digest}
                    </pre>
                  )}
                  {error.stack && (
                    <pre className="p-2 bg-gray-100 rounded text-xs text-text-secondary overflow-auto">
                      <strong>Stack:</strong> {error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
} 