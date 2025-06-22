/**
 * @fileoverview Suggestion highlighter component for visual feedback in text editor.
 *
 * This component provides color-coded underlines and highlights for writing suggestions
 * directly in the text editor, with interactive tooltips and hover states for
 * suggestion details and actions.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Check, X, AlertCircle, BookOpen, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getSuggestionTypeColor, 
  formatConfidence
} from '@/lib/utils/suggestion-utils';
import { cn } from '@/lib/utils/cn';
import type { Suggestion, SuggestionType } from '@/types/suggestion';

/**
 * Suggestion highlighter component props interface.
 *
 * @since 1.0.0
 */
interface SuggestionHighlighterProps {
  /** Text content to highlight */
  text: string;
  /** Array of suggestions to highlight */
  suggestions: Suggestion[];
  /** Callback when a suggestion is accepted */
  onAcceptSuggestion: (suggestionId: string) => void;
  /** Callback when a suggestion is ignored */
  onIgnoreSuggestion: (suggestionId: string) => void;
  /** Whether highlighting is enabled */
  enabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the component should be editable */
  isEditable?: boolean;
  /** Callback when content changes (for editable mode) */
  onContentChange?: (newContent: string) => void;
  /** Reference to the textarea (for cursor positioning) */
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  /** Callback for keyboard events (for editable mode) */
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

/**
 * Highlighted text segment interface.
 *
 * @since 1.0.0
 */
interface HighlightedSegment {
  /** Text content of the segment */
  text: string;
  /** Whether this segment has a suggestion */
  hasSuggestion: boolean;
  /** Associated suggestion if any */
  suggestion?: Suggestion;
  /** Position in the original text */
  start: number;
  end: number;
}

/**
 * Suggestion type icon mapping.
 *
 * @since 1.0.0
 */
const SUGGESTION_ICONS: Record<SuggestionType, React.ComponentType<{ className?: string }>> = {
  spelling: AlertCircle,
  grammar: BookOpen,
  style: Sparkles,
  punctuation: Zap,
  ai: Sparkles,
};

/**
 * Interactive tooltip component for suggestions.
 *
 * @since 1.0.0
 */
interface InteractiveTooltipProps {
  /** Tooltip content */
  children: React.ReactNode;
  /** Whether the tooltip is visible */
  isVisible: boolean;
  /** Position of the tooltip */
  position: { top: number; left: number };
  /** Additional CSS classes */
  className?: string;
}

function InteractiveTooltip({ children, isVisible, position, className }: InteractiveTooltipProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm p-0 border-0 shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        className
      )}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Suggestion highlighter component.
 *
 * This component renders text with color-coded underlines and highlights
 * for writing suggestions, providing interactive tooltips with suggestion
 * details and action buttons.
 *
 * @param text - Text content to highlight
 * @param suggestions - Array of suggestions to highlight
 * @param onAcceptSuggestion - Callback when a suggestion is accepted
 * @param onIgnoreSuggestion - Callback when a suggestion is ignored
 * @param enabled - Whether highlighting is enabled
 * @param className - Additional CSS classes
 * @returns The suggestion highlighter component
 *
 * @example
 * ```tsx
 * <SuggestionHighlighter
 *   text="This is a test sentence with errors."
 *   suggestions={[suggestion1, suggestion2]}
 *   onAcceptSuggestion={handleAccept}
 *   onIgnoreSuggestion={handleIgnore}
 *   enabled={true}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function SuggestionHighlighter({
  text,
  suggestions,
  onAcceptSuggestion,
  onIgnoreSuggestion,
  enabled = true,
  className,
  isEditable = false,
  onContentChange,
  textareaRef,
  onKeyDown,
}: SuggestionHighlighterProps) {
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /**
   * Process text and suggestions into highlighted segments.
   *
   * @returns Array of text segments with highlighting information
   * @since 1.0.0
   */
  const processHighlightedSegments = (): HighlightedSegment[] => {
    if (!enabled || suggestions.length === 0) {
      return [{ text, hasSuggestion: false, start: 0, end: text.length }];
    }

    const segments: HighlightedSegment[] = [];
    let currentPosition = 0;

    // Sort suggestions by position
    const sortedSuggestions = [...suggestions].sort((a, b) => a.position.start - b.position.start);

    sortedSuggestions.forEach((suggestion) => {
      // Add text before suggestion
      if (suggestion.position.start > currentPosition) {
        segments.push({
          text: text.slice(currentPosition, suggestion.position.start),
          hasSuggestion: false,
          start: currentPosition,
          end: suggestion.position.start,
        });
      }

      // Add suggestion text
      segments.push({
        text: text.slice(suggestion.position.start, suggestion.position.end),
        hasSuggestion: true,
        suggestion,
        start: suggestion.position.start,
        end: suggestion.position.end,
      });

      currentPosition = suggestion.position.end;
    });

    // Add remaining text
    if (currentPosition < text.length) {
      segments.push({
        text: text.slice(currentPosition),
        hasSuggestion: false,
        start: currentPosition,
        end: text.length,
      });
    }

    return segments;
  };

  /**
   * Get CSS classes for suggestion highlighting.
   *
   * @param suggestion - The suggestion to get classes for
   * @param isHovered - Whether the suggestion is being hovered
   * @returns CSS classes for highlighting
   * @since 1.0.0
   */
  const getHighlightClasses = (suggestion: Suggestion, isHovered: boolean): string => {
    const baseClasses = 'relative cursor-pointer transition-all duration-200';
    
    const underlineClasses = {
      spelling: 'border-b-2 border-red-500',
      grammar: 'border-b-2 border-blue-500',
      style: 'border-b-2 border-green-500',
      punctuation: 'border-b-2 border-purple-500',
      ai: 'border-b-2 border-orange-500',
    };

    const highlightClasses = {
      spelling: 'bg-red-100',
      grammar: 'bg-blue-100',
      style: 'bg-green-100',
      punctuation: 'bg-purple-100',
      ai: 'bg-orange-100',
    };

    return cn(
      baseClasses,
      underlineClasses[suggestion.type],
      isHovered && highlightClasses[suggestion.type],
      isHovered && 'shadow-sm'
    );
  };

  /**
   * Calculate tooltip position based on trigger element.
   *
   * @param triggerElement - The element that triggered the tooltip
   * @since 1.0.0
   */
  const calculateTooltipPosition = (triggerElement: HTMLElement) => {
    const rect = triggerElement.getBoundingClientRect();
    const tooltipHeight = 200; // Approximate tooltip height
    const tooltipWidth = 320; // Approximate tooltip width
    
    let top = rect.top - tooltipHeight - 8;
    let left = rect.left + (rect.width - tooltipWidth) / 2;

    // Ensure tooltip stays within viewport
    if (top < 0) {
      top = rect.bottom + 8;
    }
    if (left < 0) {
      left = 8;
    }
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - 8;
    }

    setTooltipPosition({ top, left });
  };

  /**
   * Handle suggestion hover.
   *
   * @param suggestionId - ID of the hovered suggestion
   * @param event - Mouse event
   * @since 1.0.0
   */
  const handleSuggestionHover = (suggestionId: string, event: React.MouseEvent) => {
    setHoveredSuggestion(suggestionId);
    setIsTooltipVisible(true);
    calculateTooltipPosition(event.currentTarget as HTMLElement);
  };

  /**
   * Handle suggestion leave.
   *
   * @since 1.0.0
   */
  const handleSuggestionLeave = () => {
    // Don't hide immediately, let the tooltip handle its own visibility
    // This allows moving mouse to tooltip without hiding it
  };

  /**
   * Handle tooltip hover.
   *
   * @since 1.0.0
   */
  const handleTooltipMouseEnter = () => {
    // Keep tooltip visible when hovering over it
    setIsTooltipVisible(true);
  };

  /**
   * Handle tooltip leave.
   *
   * @since 1.0.0
   */
  const handleTooltipMouseLeave = () => {
    setIsTooltipVisible(false);
    setHoveredSuggestion(null);
  };

  /**
   * Handle suggestion action.
   *
   * @param suggestionId - ID of the suggestion
   * @param action - Action to perform
   * @since 1.0.0
   */
  const handleSuggestionAction = (suggestionId: string, action: 'accept' | 'ignore') => {
    if (action === 'accept') {
      onAcceptSuggestion(suggestionId);
    } else {
      onIgnoreSuggestion(suggestionId);
    }
    setIsTooltipVisible(false);
    setHoveredSuggestion(null);
  };

  /**
   * Create tooltip content for a suggestion.
   *
   * @param suggestion - The suggestion to create tooltip for
   * @returns Tooltip content JSX
   * @since 1.0.0
   */
  const createTooltipContent = (suggestion: Suggestion) => {
    const IconComponent = SUGGESTION_ICONS[suggestion.type];
    
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      >
        {/* Suggestion header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <IconComponent className={cn(
              'w-4 h-4',
              getSuggestionTypeColor(suggestion.type)
            )} />
            <span className="text-sm font-semibold capitalize text-gray-900 dark:text-gray-100">
              {suggestion.type} Issue
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {formatConfidence(suggestion.confidence)} confidence
          </div>
        </div>

        {/* Suggestion content */}
        <div className="space-y-2 mb-3">
          <div className="text-sm">
            <span className="text-red-600 font-medium">{suggestion.original}</span>
            <span className="text-gray-500 mx-2">→</span>
            <span className="text-green-600 font-medium">{suggestion.suggestion}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {suggestion.explanation}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => handleSuggestionAction(suggestion.id, 'accept')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-3 h-3 mr-1" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSuggestionAction(suggestion.id, 'ignore')}
            className="flex-1"
          >
            <X className="w-3 h-3 mr-1" />
            Ignore
          </Button>
        </div>
      </div>
    );
  };

  /**
   * Handle content changes in editable mode.
   *
   * @param event - Input event
   * @since 1.0.0
   */
  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isEditable || !onContentChange) {
      return;
    }
    
    const newContent = event.target.value;
    onContentChange(newContent);
  };

  /**
   * Handle key events in editable mode.
   *
   * @param event - Keyboard event
   * @since 1.0.0
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isEditable) {
      return;
    }

    // Handle special keys
    if (event.key === 'Tab') {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = target.value.substring(0, start) + '  ' + target.value.substring(end);
      target.value = newValue;
      target.selectionStart = target.selectionEnd = start + 2;
      onContentChange?.(newValue);
    }
  };

  /**
   * Handle scroll synchronization between textarea and overlay.
   *
   * @param event - Scroll event
   * @since 1.0.0
   */
  const handleScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    if (isEditable && overlayRef.current) {
      overlayRef.current.scrollTop = event.currentTarget.scrollTop;
      overlayRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
  };

  /**
   * Focus the textarea when switching to editable mode.
   *
   * @since 1.0.0
   */
  const focusTextarea = useCallback(() => {
    if (isEditable && textareaRef?.current) {
      textareaRef.current.focus();
    }
  }, [isEditable, textareaRef]);

  // Focus when switching to editable mode
  useEffect(() => {
    if (isEditable) {
      focusTextarea();
    }
  }, [isEditable, focusTextarea]);

  // Sync scroll position when textarea scrolls
  useEffect(() => {
    if (isEditable && textareaRef?.current && overlayRef.current) {
      const textarea = textareaRef.current;
      const handleTextareaScroll = () => {
        if (overlayRef.current) {
          overlayRef.current.scrollTop = textarea.scrollTop;
          overlayRef.current.scrollLeft = textarea.scrollLeft;
        }
      };
      
      textarea.addEventListener('scroll', handleTextareaScroll);
      return () => textarea.removeEventListener('scroll', handleTextareaScroll);
    }
  }, [isEditable, textareaRef]);

  const segments = processHighlightedSegments();

  // If in editable mode, render textarea + overlay
  if (isEditable) {
    return (
      <div className="relative w-full h-full">
        {/* Hidden textarea for editing */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleContentChange}
          onKeyDown={onKeyDown || handleKeyDown}
          onScroll={handleScroll}
          placeholder="Start writing your document..."
          className={cn(
            'absolute inset-0 w-full h-full p-6 resize-none border-none outline-none',
            'bg-transparent text-transparent caret-text-primary',
            'font-serif text-lg leading-relaxed z-10'
          )}
          style={{
            fontFamily: 'Georgia, serif',
            lineHeight: '1.8',
          }}
        />
        
        {/* Highlighted overlay */}
        <div 
          ref={overlayRef}
          className={cn(
            'absolute inset-0 w-full h-full p-6 pointer-events-none',
            'whitespace-pre-wrap font-serif text-lg leading-relaxed',
            'text-text-primary overflow-auto z-20',
            className
          )}
          style={{
            fontFamily: 'Georgia, serif',
            lineHeight: '1.8',
          }}
        >
          {segments.map((segment, index) => {
            if (!segment.hasSuggestion || !segment.suggestion) {
              return (
                <span key={`segment-${index}`}>
                  {segment.text}
                </span>
              );
            }

            const suggestion = segment.suggestion;
            const isHovered = hoveredSuggestion === suggestion.id;
            const IconComponent = SUGGESTION_ICONS[suggestion.type];

            return (
              <span
                key={`suggestion-${suggestion.id}`}
                className={getHighlightClasses(suggestion, isHovered)}
                onMouseEnter={(e) => handleSuggestionHover(suggestion.id, e)}
                onMouseLeave={handleSuggestionLeave}
              >
                {segment.text}
                {isHovered && (
                  <IconComponent 
                    className={cn(
                      'absolute -top-1 -right-1 w-3 h-3',
                      getSuggestionTypeColor(suggestion.type)
                    )} 
                  />
                )}
              </span>
            );
          })}
        </div>

        {/* Interactive Tooltip */}
        {hoveredSuggestion && (
          <InteractiveTooltip
            isVisible={isTooltipVisible}
            position={tooltipPosition}
          >
            {(() => {
              const suggestion = suggestions.find(s => s.id === hoveredSuggestion);
              return suggestion ? createTooltipContent(suggestion) : null;
            })()}
          </InteractiveTooltip>
        )}
      </div>
    );
  }

  // Non-editable mode (original implementation)
  return (
    <div 
      ref={containerRef}
      className={cn(
        'whitespace-pre-wrap font-serif text-lg leading-relaxed',
        'text-text-primary',
        className
      )}
      style={{
        fontFamily: 'Georgia, serif',
        lineHeight: '1.8',
      }}
    >
      {segments.map((segment, index) => {
        if (!segment.hasSuggestion || !segment.suggestion) {
          return (
            <span key={`segment-${index}`}>
              {segment.text}
            </span>
          );
        }

        const suggestion = segment.suggestion;
        const isHovered = hoveredSuggestion === suggestion.id;
        const IconComponent = SUGGESTION_ICONS[suggestion.type];

        return (
          <span
            key={`suggestion-${suggestion.id}`}
            className={getHighlightClasses(suggestion, isHovered)}
            onMouseEnter={(e) => handleSuggestionHover(suggestion.id, e)}
            onMouseLeave={handleSuggestionLeave}
          >
            {segment.text}
            {isHovered && (
              <IconComponent 
                className={cn(
                  'absolute -top-1 -right-1 w-3 h-3',
                  getSuggestionTypeColor(suggestion.type)
                )} 
              />
            )}
          </span>
        );
      })}

      {/* Interactive Tooltip */}
      {hoveredSuggestion && (
        <InteractiveTooltip
          isVisible={isTooltipVisible}
          position={tooltipPosition}
        >
          {(() => {
            const suggestion = suggestions.find(s => s.id === hoveredSuggestion);
            return suggestion ? createTooltipContent(suggestion) : null;
          })()}
        </InteractiveTooltip>
      )}
    </div>
  );
} 