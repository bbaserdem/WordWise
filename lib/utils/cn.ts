/**
 * @fileoverview Utility function for merging class names.
 *
 * This function combines clsx and tailwind-merge to provide a robust
 * way to merge class names while properly handling Tailwind CSS
 * class conflicts and conditional classes.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names using clsx and tailwind-merge.
 *
 * This function takes multiple class name arguments (strings, objects, arrays)
 * and merges them together, resolving Tailwind CSS conflicts and
 * removing duplicate classes.
 *
 * @param inputs - Class name values to merge
 * @returns Merged class name string
 *
 * @example
 * ```typescript
 * cn('px-2 py-1', 'px-3', { 'bg-red-500': true, 'bg-blue-500': false })
 * // Returns: "py-1 px-3 bg-red-500"
 * ```
 *
 * @since 1.0.0
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
