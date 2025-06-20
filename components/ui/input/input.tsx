/**
 * @fileoverview Reusable Input component for the WordWise application.
 *
 * This component provides a consistent input interface with proper
 * styling, validation states, and accessibility features.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Input component props interface.
 *
 * @since 1.0.0
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Whether the input has an error state */
  hasError?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Helper text to display below the input */
  helperText?: string;
  /** Whether to show a loading state */
  isLoading?: boolean;
}

/**
 * Input component with validation states and accessibility features.
 *
 * This component provides a consistent input interface with proper
 * styling, validation states, and accessibility features. It integrates
 * with the design system and supports various input types.
 *
 * @param className - Additional CSS classes
 * @param hasError - Whether the input has an error state
 * @param errorMessage - Error message to display
 * @param helperText - Helper text to display below the input
 * @param isLoading - Whether to show a loading state
 * @param disabled - Whether the input is disabled
 * @param props - Additional input props
 * @param ref - Forwarded ref
 * @returns Input component
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   hasError={!!errors.email}
 *   errorMessage={errors.email?.message}
 * />
 * ```
 *
 * @since 1.0.0
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      hasError = false,
      errorMessage,
      helperText,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <div className="w-full">
        <div className="relative">
          <input
            className={cn(
              'flex h-10 w-full rounded-md border border-primary-200 bg-background-primary px-3 py-2 text-sm ring-offset-background-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              hasError && 'border-accent-error focus-visible:ring-accent-error',
              className
            )}
            ref={ref}
            disabled={isDisabled}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="h-4 w-4 animate-spin text-text-tertiary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>
        {(errorMessage || helperText) && (
          <div className="mt-1 text-xs">
            {errorMessage && (
              <p className="text-accent-error">{errorMessage}</p>
            )}
            {helperText && !errorMessage && (
              <p className="text-text-secondary">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
