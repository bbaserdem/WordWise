/**
 * @fileoverview Confidence indicator component for displaying suggestion confidence scores.
 *
 * This component provides visual representation of confidence scores with
 * color-coded indicators, progress bars, and tooltips showing detailed
 * confidence information.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  formatConfidence, 
  getConfidenceColor, 
  getConfidenceLevel,
  getConfidenceBgColor 
} from '@/lib/utils/suggestion-utils';
import { cn } from '@/lib/utils/cn';

/**
 * Confidence indicator component props interface.
 *
 * @since 1.0.0
 */
interface ConfidenceIndicatorProps {
  /** Confidence score between 0 and 1 */
  confidence: number;
  /** Display format for the confidence score */
  format?: 'percentage' | 'decimal' | 'stars';
  /** Whether to show the tooltip */
  showTooltip?: boolean;
  /** Whether to show the progress bar */
  showProgress?: boolean;
  /** Size of the indicator */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the confidence level text */
  showLevel?: boolean;
}

/**
 * Confidence indicator component.
 *
 * This component displays a confidence score with visual indicators
 * including color coding, progress bars, and optional tooltips with
 * detailed information.
 *
 * @param confidence - Confidence score between 0 and 1
 * @param format - Display format for the confidence score
 * @param showTooltip - Whether to show the tooltip
 * @param showProgress - Whether to show the progress bar
 * @param size - Size of the indicator
 * @param className - Additional CSS classes
 * @param showLevel - Whether to show the confidence level text
 * @returns The confidence indicator component
 *
 * @example
 * ```tsx
 * <ConfidenceIndicator 
 *   confidence={0.85} 
 *   format="percentage" 
 *   showTooltip={true}
 *   size="md"
 * />
 * ```
 *
 * @since 1.0.0
 */
export function ConfidenceIndicator({
  confidence,
  format = 'percentage',
  showTooltip = true,
  showProgress = false,
  size = 'md',
  className,
  showLevel = false,
}: ConfidenceIndicatorProps) {
  const clampedConfidence = Math.max(0, Math.min(1, confidence));
  const confidenceText = formatConfidence(clampedConfidence, format);
  const confidenceLevel = getConfidenceLevel(clampedConfidence);
  const confidenceColor = getConfidenceColor(clampedConfidence);
  const confidenceBgColor = getConfidenceBgColor(clampedConfidence);

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const progressSizeClasses = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  };

  const content = (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Confidence badge */}
      <div
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          confidenceBgColor,
          confidenceColor,
          sizeClasses[size]
        )}
      >
        <span className="font-semibold">{confidenceText}</span>
        {showLevel && (
          <span className="ml-1 text-xs opacity-75">({confidenceLevel})</span>
        )}
      </div>

      {/* Progress bar (optional) */}
      {showProgress && (
        <div className="flex-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'transition-all duration-300 ease-out',
              confidenceColor.replace('text-', 'bg-'),
              progressSizeClasses[size]
            )}
            style={{ width: `${clampedConfidence * 100}%` }}
          />
        </div>
      )}
    </div>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-semibold">Confidence Score</div>
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Score:</span>
                <span className="font-medium">{confidenceText}</span>
              </div>
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-medium">{confidenceLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>Decimal:</span>
                <span className="font-medium">{clampedConfidence.toFixed(3)}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {clampedConfidence >= 0.8 && 'This suggestion is highly reliable.'}
              {clampedConfidence >= 0.6 && clampedConfidence < 0.8 && 'This suggestion is likely correct.'}
              {clampedConfidence >= 0.4 && clampedConfidence < 0.6 && 'This suggestion should be reviewed carefully.'}
              {clampedConfidence < 0.4 && 'This suggestion has low confidence and may be incorrect.'}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact confidence indicator component.
 *
 * This is a simplified version of the confidence indicator that
 * shows only the essential information in a compact format.
 *
 * @param confidence - Confidence score between 0 and 1
 * @param className - Additional CSS classes
 * @returns The compact confidence indicator component
 *
 * @since 1.0.0
 */
export function CompactConfidenceIndicator({
  confidence,
  className,
}: {
  confidence: number;
  className?: string;
}) {
  const clampedConfidence = Math.max(0, Math.min(1, confidence));
  const confidenceColor = getConfidenceColor(clampedConfidence);
  const confidenceBgColor = getConfidenceBgColor(clampedConfidence);

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
        confidenceBgColor,
        confidenceColor,
        className
      )}
      title={`${Math.round(clampedConfidence * 100)}% confidence`}
    >
      {Math.round(clampedConfidence * 10)}
    </div>
  );
}

/**
 * Confidence bar component.
 *
 * This component displays a horizontal progress bar representing
 * the confidence score with color coding.
 *
 * @param confidence - Confidence score between 0 and 1
 * @param className - Additional CSS classes
 * @returns The confidence bar component
 *
 * @since 1.0.0
 */
export function ConfidenceBar({
  confidence,
  className,
}: {
  confidence: number;
  className?: string;
}) {
  const clampedConfidence = Math.max(0, Math.min(1, confidence));
  const confidenceColor = getConfidenceColor(clampedConfidence);

  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2 overflow-hidden', className)}>
      <div
        className={cn(
          'h-full transition-all duration-300 ease-out',
          confidenceColor.replace('text-', 'bg-')
        )}
        style={{ width: `${clampedConfidence * 100}%` }}
      />
    </div>
  );
} 