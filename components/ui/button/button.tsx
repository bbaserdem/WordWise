/**
 * @fileoverview Reusable Button component for the WordWise application.
 *
 * This component provides a consistent button interface with multiple
 * variants, sizes, and states. It follows the design system and
 * includes proper accessibility features.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

/**
 * Button variant styles using class-variance-authority.
 *
 * @since 1.0.0
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background-primary',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        destructive: 'bg-accent-error text-white hover:bg-red-600',
        outline:
          'border border-primary-200 bg-background-primary hover:bg-background-secondary hover:text-text-primary',
        secondary:
          'bg-background-secondary text-text-primary border border-primary-200 hover:bg-background-tertiary',
        ghost: 'hover:bg-background-secondary hover:text-text-primary',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Button component props interface.
 *
 * @since 1.0.0
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Loading text to display when isLoading is true */
  loadingText?: string;
}

/**
 * Button component with variants and loading states.
 *
 * This component provides a consistent button interface with multiple
 * visual variants, sizes, and states including loading and disabled states.
 * It follows accessibility best practices and integrates with the design system.
 *
 * @param variant - Visual variant of the button
 * @param size - Size variant of the button
 * @param isLoading - Whether the button is in a loading state
 * @param loadingText - Text to display when loading
 * @param className - Additional CSS classes
 * @param children - Button content
 * @param disabled - Whether the button is disabled
 * @param type - Button type (button, submit, reset)
 * @param props - Additional button props
 * @param ref - Forwarded ref
 * @returns Button component
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" isLoading>
 *   Save Document
 * </Button>
 * ```
 *
 * @since 1.0.0
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        type={type}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
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
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
