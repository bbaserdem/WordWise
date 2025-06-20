/**
 * @fileoverview Error boundary component for the WordWise application.
 *
 * This component catches JavaScript errors anywhere in the child component
 * tree and displays a fallback UI instead of the component tree that crashed.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props for the ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Callback when an error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error?: Error;
}

/**
 * Error boundary component.
 *
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of the component tree that crashed.
 * This prevents the entire app from crashing due to component errors.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={<div>Something went wrong</div>}
 *   onError={(error, errorInfo) => console.error(error, errorInfo)}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Update state when an error occurs.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Log error information when an error occurs.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error('Error caught by boundary:', error, errorInfo);

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Render the component.
   */
  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
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
              Something went wrong
            </h2>
            
            <p className="text-text-secondary mb-4">
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false })}
                className="w-full bg-gray-100 text-text-primary px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs text-text-secondary overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 