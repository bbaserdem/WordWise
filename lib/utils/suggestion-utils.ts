/**
 * @fileoverview Utility functions for suggestion display and formatting.
 *
 * This file contains utility functions for formatting suggestion data,
 * calculating confidence indicators, and generating visual representations
 * of suggestion metadata for the UI.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { SuggestionSeverity } from '@/types/suggestion';

/**
 * Format confidence score for display.
 *
 * This function converts a confidence score (0-1) into a human-readable
 * format with appropriate precision and units.
 *
 * @param confidence - Confidence score between 0 and 1
 * @param format - Display format ('percentage', 'decimal', 'stars')
 * @returns Formatted confidence string
 *
 * @example
 * ```typescript
 * formatConfidence(0.85) // "85%"
 * formatConfidence(0.85, 'decimal') // "0.85"
 * formatConfidence(0.85, 'stars') // "★★★★☆"
 * ```
 *
 * @since 1.0.0
 */
export function formatConfidence(
  confidence: number,
  format: 'percentage' | 'decimal' | 'stars' = 'percentage'
): string {
  const clampedConfidence = Math.max(0, Math.min(1, confidence));

  switch (format) {
    case 'percentage':
      return `${Math.round(clampedConfidence * 100)}%`;
    case 'decimal':
      return clampedConfidence.toFixed(2);
    case 'stars':
      const fullStars = Math.floor(clampedConfidence * 5);
      const hasHalfStar = (clampedConfidence * 5) % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
    default:
      return `${Math.round(clampedConfidence * 100)}%`;
  }
}

/**
 * Get confidence level description.
 *
 * This function converts a confidence score into a human-readable
 * description of the confidence level.
 *
 * @param confidence - Confidence score between 0 and 1
 * @returns Confidence level description
 *
 * @example
 * ```typescript
 * getConfidenceLevel(0.95) // "Very High"
 * getConfidenceLevel(0.75) // "High"
 * getConfidenceLevel(0.45) // "Low"
 * ```
 *
 * @since 1.0.0
 */
export function getConfidenceLevel(confidence: number): string {
  const clampedConfidence = Math.max(0, Math.min(1, confidence));

  if (clampedConfidence >= 0.9) return 'Very High';
  if (clampedConfidence >= 0.8) return 'High';
  if (clampedConfidence >= 0.7) return 'Good';
  if (clampedConfidence >= 0.6) return 'Moderate';
  if (clampedConfidence >= 0.5) return 'Fair';
  return 'Low';
}

/**
 * Get confidence color for UI display.
 *
 * This function returns the appropriate color class for displaying
 * confidence levels in the UI.
 *
 * @param confidence - Confidence score between 0 and 1
 * @returns CSS color class
 *
 * @example
 * ```typescript
 * getConfidenceColor(0.95) // "text-green-600"
 * getConfidenceColor(0.75) // "text-blue-600"
 * getConfidenceColor(0.45) // "text-yellow-600"
 * ```
 *
 * @since 1.0.0
 */
export function getConfidenceColor(confidence: number): string {
  const clampedConfidence = Math.max(0, Math.min(1, confidence));

  if (clampedConfidence >= 0.8) return 'text-green-600';
  if (clampedConfidence >= 0.6) return 'text-blue-600';
  if (clampedConfidence >= 0.4) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Get confidence background color for UI display.
 *
 * This function returns the appropriate background color class for
 * displaying confidence levels in the UI.
 *
 * @param confidence - Confidence score between 0 and 1
 * @returns CSS background color class
 *
 * @example
 * ```typescript
 * getConfidenceBgColor(0.95) // "bg-green-100"
 * getConfidenceBgColor(0.75) // "bg-blue-100"
 * getConfidenceBgColor(0.45) // "bg-yellow-100"
 * ```
 *
 * @since 1.0.0
 */
export function getConfidenceBgColor(confidence: number): string {
  const clampedConfidence = Math.max(0, Math.min(1, confidence));

  if (clampedConfidence >= 0.8) return 'bg-green-100';
  if (clampedConfidence >= 0.6) return 'bg-blue-100';
  if (clampedConfidence >= 0.4) return 'bg-yellow-100';
  return 'bg-red-100';
}

/**
 * Get confidence border color for UI display.
 *
 * This function returns the appropriate border color class for
 * displaying confidence levels in the UI.
 *
 * @param confidence - Confidence score between 0 and 1
 * @returns CSS border color class
 *
 * @example
 * ```typescript
 * getConfidenceBorderColor(0.95) // "border-green-200"
 * getConfidenceBorderColor(0.75) // "border-blue-200"
 * getConfidenceBorderColor(0.45) // "border-yellow-200"
 * ```
 *
 * @since 1.0.0
 */
export function getConfidenceBorderColor(confidence: number): string {
  const clampedConfidence = Math.max(0, Math.min(1, confidence));

  if (clampedConfidence >= 0.8) return 'border-green-200';
  if (clampedConfidence >= 0.6) return 'border-blue-200';
  if (clampedConfidence >= 0.4) return 'border-yellow-200';
  return 'border-red-200';
}

/**
 * Get severity color for UI display.
 *
 * This function returns the appropriate color class for displaying
 * severity levels in the UI.
 *
 * @param severity - Suggestion severity level
 * @returns CSS color class
 *
 * @example
 * ```typescript
 * getSeverityColor('high') // "text-red-600"
 * getSeverityColor('medium') // "text-yellow-600"
 * getSeverityColor('low') // "text-blue-600"
 * ```
 *
 * @since 1.0.0
 */
export function getSeverityColor(severity: SuggestionSeverity): string {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get severity background color for UI display.
 *
 * This function returns the appropriate background color class for
 * displaying severity levels in the UI.
 *
 * @param severity - Suggestion severity level
 * @returns CSS background color class
 *
 * @example
 * ```typescript
 * getSeverityBgColor('high') // "bg-red-100"
 * getSeverityBgColor('medium') // "bg-yellow-100"
 * getSeverityBgColor('low') // "bg-blue-100"
 * ```
 *
 * @since 1.0.0
 */
export function getSeverityBgColor(severity: SuggestionSeverity): string {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'bg-red-100';
    case 'medium':
      return 'bg-yellow-100';
    case 'low':
      return 'bg-blue-100';
    default:
      return 'bg-gray-100';
  }
}

/**
 * Get suggestion type color for UI display.
 *
 * This function returns the appropriate color class for displaying
 * suggestion types in the UI.
 *
 * @param type - Suggestion type
 * @returns CSS color class
 *
 * @example
 * ```typescript
 * getSuggestionTypeColor('spelling') // "text-red-600"
 * getSuggestionTypeColor('grammar') // "text-blue-600"
 * getSuggestionTypeColor('style') // "text-green-600"
 * ```
 *
 * @since 1.0.0
 */
export function getSuggestionTypeColor(type: string): string {
  switch (type) {
    case 'spelling':
      return 'text-red-600';
    case 'grammar':
      return 'text-blue-600';
    case 'style':
      return 'text-green-600';
    case 'punctuation':
      return 'text-purple-600';
    case 'ai':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get suggestion type background color for UI display.
 *
 * This function returns the appropriate background color class for
 * displaying suggestion types in the UI.
 *
 * @param type - Suggestion type
 * @returns CSS background color class
 *
 * @example
 * ```typescript
 * getSuggestionTypeBgColor('spelling') // "bg-red-100"
 * getSuggestionTypeBgColor('grammar') // "bg-blue-100"
 * getSuggestionTypeBgColor('style') // "bg-green-100"
 * ```
 *
 * @since 1.0.0
 */
export function getSuggestionTypeBgColor(type: string): string {
  switch (type) {
    case 'spelling':
      return 'bg-red-100';
    case 'grammar':
      return 'bg-blue-100';
    case 'style':
      return 'bg-green-100';
    case 'punctuation':
      return 'bg-purple-100';
    case 'ai':
      return 'bg-orange-100';
    default:
      return 'bg-gray-100';
  }
}

/**
 * Get suggestion type dot color for UI display.
 *
 * This function returns the appropriate background color class for
 * displaying suggestion type dots in the UI.
 *
 * @param type - Suggestion type
 * @returns CSS background color class
 *
 * @example
 * ```typescript
 * getSuggestionTypeDotColor('spelling') // "bg-red-500"
 * getSuggestionTypeDotColor('grammar') // "bg-blue-500"
 * getSuggestionTypeDotColor('style') // "bg-green-500"
 * ```
 *
 * @since 1.0.0
 */
export function getSuggestionTypeDotColor(type: string): string {
  switch (type) {
    case 'spelling':
      return 'bg-red-500';
    case 'grammar':
      return 'bg-blue-500';
    case 'style':
      return 'bg-green-500';
    case 'punctuation':
      return 'bg-purple-500';
    case 'ai':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
} 