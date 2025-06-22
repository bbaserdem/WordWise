/**
 * @fileoverview Tooltip component for displaying additional information on hover.
 *
 * This component provides a simple tooltip implementation for displaying
 * contextual information when users hover over elements.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Tooltip component props interface.
 *
 * @since 1.0.0
 */
interface TooltipProps {
  /** Content to display in the tooltip */
  content: React.ReactNode;
  /** Child element that triggers the tooltip */
  children: React.ReactElement;
  /** Position of the tooltip relative to the trigger */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Additional CSS classes */
  className?: string;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
}

/**
 * Tooltip component.
 *
 * This component displays additional information when users hover over
 * the child element. It handles positioning and visibility automatically.
 *
 * @param content - Content to display in the tooltip
 * @param children - Child element that triggers the tooltip
 * @param side - Position of the tooltip relative to the trigger
 * @param className - Additional CSS classes
 * @param disabled - Whether the tooltip is disabled
 * @returns The tooltip component
 *
 * @example
 * ```tsx
 * <Tooltip content="This is a helpful tip" side="top">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 *
 * @since 1.0.0
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  className,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
    }

    // Ensure tooltip stays within viewport
    if (top < 0) top = 8;
    if (left < 0) left = 8;
    if (top + tooltipRect.height > window.innerHeight) {
      top = window.innerHeight - tooltipRect.height - 8;
    }
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 8;
    }

    setPosition({ top, left });
  }, [isVisible, side]);

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg pointer-events-none',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            className
          )}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {content}
          <div
            className={cn(
              'absolute w-2 h-2 bg-gray-900 transform rotate-45',
              side === 'top' && 'top-full left-1/2 -translate-x-1/2 -translate-y-1',
              side === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 translate-y-1',
              side === 'left' && 'left-full top-1/2 -translate-y-1/2 -translate-x-1',
              side === 'right' && 'right-full top-1/2 -translate-y-1/2 translate-x-1'
            )}
          />
        </div>
      )}
    </>
  );
}

/**
 * TooltipProvider component.
 *
 * This component provides context for tooltip positioning and behavior.
 * Currently a simple wrapper, but can be extended for more complex tooltip management.
 *
 * @param children - Child components
 * @returns The tooltip provider component
 *
 * @since 1.0.0
 */
export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * TooltipTrigger component.
 *
 * This component wraps the trigger element for a tooltip.
 *
 * @param children - Child element that triggers the tooltip
 * @param asChild - Whether to render as child element
 * @returns The tooltip trigger component
 *
 * @since 1.0.0
 */
export function TooltipTrigger({ 
  children, 
  asChild = false 
}: { 
  children: React.ReactElement;
  asChild?: boolean;
}) {
  return children;
}

/**
 * TooltipContent component.
 *
 * This component defines the content and positioning of a tooltip.
 *
 * @param children - Tooltip content
 * @param side - Position of the tooltip
 * @param className - Additional CSS classes
 * @returns The tooltip content component
 *
 * @since 1.0.0
 */
export function TooltipContent({ 
  children, 
  side = 'top',
  className 
}: { 
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) {
  return (
    <div className={cn('px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg', className)}>
      {children}
    </div>
  );
} 