/**
 * @fileoverview Error component for dashboard pages.
 *
 * This component provides an error state for dashboard pages
 * when errors occur during rendering.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

/**
 * Props for the DashboardError component.
 */
interface DashboardErrorProps {
  /** The error that occurred */
  error: Error & { digest?: string };
  /** Function to reset the error */
  reset: () => void;
}

/**
 * Error component for dashboard pages.
 *
 * Displays an error message when dashboard content fails to load
 * and provides options to retry or navigate away.
 *
 * @param error - The error that occurred
 * @param reset - Function to reset the error
 * @returns The error component
 */
export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-secondary p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-soft p-6 text-center">
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
          Dashboard Error
        </h2>
        
        <p className="text-text-secondary mb-4">
          We encountered an error while loading the dashboard. Please try again
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
            onClick={() => window.location.href = '/dashboard'}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs text-text-secondary overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
} 