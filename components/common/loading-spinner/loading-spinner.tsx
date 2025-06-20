/**
 * @fileoverview Loading spinner component for the WordWise application.
 *
 * This component provides a customizable loading spinner with different
 * sizes and variants for use throughout the application.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import React from 'react';

/**
 * Props for the LoadingSpinner component.
 */
export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant of the spinner */
  variant?: 'primary' | 'secondary' | 'white';
  /** Optional custom styling */
  className?: string;
  /** Whether to show loading text */
  showText?: boolean;
  /** Custom loading text */
  text?: string;
}

/**
 * Loading spinner component.
 *
 * Provides a customizable loading spinner with different sizes and
 * variants. Can be used for loading states throughout the application.
 *
 * @param size - Size of the spinner
 * @param variant - Color variant of the spinner
 * @param className - Optional custom styling
 * @param showText - Whether to show loading text
 * @param text - Custom loading text
 * @returns The loading spinner component
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="lg" variant="primary" showText={true} />
 * ```
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  className = '',
  showText = false,
  text = 'Loading...',
}: LoadingSpinnerProps) {
  /**
   * Get size classes based on the size prop.
   */
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  /**
   * Get color classes based on the variant prop.
   */
  const getColorClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-primary-600';
      case 'secondary':
        return 'border-text-secondary';
      case 'white':
        return 'border-white';
      default:
        return 'border-primary-600';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${getSizeClasses()} ${getColorClasses()} border-2 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {showText && (
        <p className="mt-2 text-sm text-text-secondary">{text}</p>
      )}
    </div>
  );
} 