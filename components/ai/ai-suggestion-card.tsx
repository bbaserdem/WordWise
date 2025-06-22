/**
 * @fileoverview AI suggestion card component for displaying AI-powered writing suggestions.
 *
 * This component provides a specialized interface for AI suggestions with enhanced
 * styling, detailed explanations, and confidence indicators. It's designed to
 * showcase the advanced capabilities of AI-powered writing assistance.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  AlertCircle, 
  BookOpen, 
  Zap,
  ChevronDown,
  ChevronUp,
  Brain,
  Target,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import type { Suggestion } from '@/types/suggestion';

/**
 * AI suggestion card props interface.
 *
 * @since 1.0.0
 */
interface AISuggestionCardProps {
  /** AI suggestion to display */
  suggestion: Suggestion;
  /** Callback when suggestion is accepted */
  onAccept: (suggestionId: string) => void;
  /** Callback when suggestion is ignored */
  onIgnore: (suggestionId: string) => void;
  /** Callback when suggestion is clicked */
  onClick?: (suggestion: Suggestion) => void;
  /** Whether the card is currently focused */
  isFocused?: boolean;
  /** Whether the card is currently selected */
  isSelected?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AI suggestion type icon mapping.
 *
 * @since 1.0.0
 */
const AI_SUGGESTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  style: Sparkles,
  content: BookOpen,
  structure: Target,
  improvement: Lightbulb,
  clarity: Brain,
  default: Sparkles,
};

/**
 * AI suggestion type labels.
 *
 * @since 1.0.0
 */
const AI_SUGGESTION_LABELS: Record<string, string> = {
  style: 'Style Enhancement',
  content: 'Content Improvement',
  structure: 'Structure Optimization',
  improvement: 'General Improvement',
  clarity: 'Clarity Enhancement',
  default: 'AI Suggestion',
};

/**
 * Get AI suggestion type from rule ID.
 *
 * @param ruleId - Rule ID from the suggestion
 * @returns AI suggestion type
 * @since 1.0.0
 */
function getAISuggestionType(ruleId?: string): string {
  if (!ruleId) return 'default';
  
  // Extract type from rule ID (e.g., "ai_style" -> "style")
  const typeMatch = ruleId.match(/^ai_(.+)$/);
  return typeMatch ? typeMatch[1] : 'default';
}

/**
 * Get confidence level description.
 *
 * @param confidence - Confidence score (0-1)
 * @returns Confidence level description
 * @since 1.0.0
 */
function getConfidenceLevel(confidence: number): {
  level: 'high' | 'medium' | 'low';
  label: string;
  color: string;
} {
  if (confidence >= 0.8) {
    return { level: 'high', label: 'High Confidence', color: 'text-green-600' };
  } else if (confidence >= 0.6) {
    return { level: 'medium', label: 'Medium Confidence', color: 'text-yellow-600' };
  } else {
    return { level: 'low', label: 'Low Confidence', color: 'text-orange-600' };
  }
}

/**
 * AI suggestion card component.
 *
 * This component displays AI-powered writing suggestions with enhanced
 * styling and detailed information about the suggestion type, confidence,
 * and reasoning.
 *
 * @param suggestion - AI suggestion to display
 * @param onAccept - Callback when suggestion is accepted
 * @param onIgnore - Callback when suggestion is ignored
 * @param onClick - Callback when suggestion is clicked
 * @param isFocused - Whether the card is currently focused
 * @param isSelected - Whether the card is currently selected
 * @param className - Additional CSS classes
 * @returns The AI suggestion card component
 *
 * @example
 * ```tsx
 * <AISuggestionCard
 *   suggestion={aiSuggestion}
 *   onAccept={handleAccept}
 *   onIgnore={handleIgnore}
 *   onClick={handleClick}
 *   isFocused={true}
 *   className="mb-2"
 * />
 * ```
 *
 * @since 1.0.0
 */
export function AISuggestionCard({
  suggestion,
  onAccept,
  onIgnore,
  onClick,
  isFocused = false,
  isSelected = false,
  className,
}: AISuggestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const aiType = getAISuggestionType(suggestion.ruleId);
  const IconComponent = AI_SUGGESTION_ICONS[aiType] || AI_SUGGESTION_ICONS.default;
  const typeLabel = AI_SUGGESTION_LABELS[aiType] || AI_SUGGESTION_LABELS.default;
  const confidence = getConfidenceLevel(suggestion.confidence);

  const handleAccept = () => {
    onAccept(suggestion.id);
  };

  const handleIgnore = () => {
    onIgnore(suggestion.id);
  };

  const handleClick = () => {
    onClick?.(suggestion);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={cn(
        'group relative rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md',
        isFocused && 'ring-2 ring-blue-500 ring-offset-2',
        isSelected && 'bg-blue-50 border-blue-200',
        suggestion.status === 'accepted' && 'bg-green-50 border-green-200',
        suggestion.status === 'ignored' && 'bg-gray-50 border-gray-200 opacity-60',
        className
      )}
      onClick={handleClick}
    >
      {/* AI Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200">
            <IconComponent className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-700">{typeLabel}</span>
          </div>
          <div className={cn('text-xs font-medium', confidence.color)}>
            {confidence.label}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAccept}
            className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Accept suggestion"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleIgnore}
            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Ignore suggestion"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Original Text */}
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-1">Original:</div>
        <div className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 border-l-4 border-gray-300">
          "{suggestion.original}"
        </div>
      </div>

      {/* Suggested Improvement */}
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-1">Suggestion:</div>
        <div className="text-sm text-gray-800 bg-blue-50 rounded px-3 py-2 border-l-4 border-blue-400">
          "{suggestion.suggestion}"
        </div>
      </div>

      {/* Explanation */}
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-1">Why this helps:</div>
        <div className="text-sm text-gray-600 leading-relaxed">
          {suggestion.explanation}
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Confidence</span>
          <span>{Math.round(suggestion.confidence * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              confidence.level === 'high' && 'bg-green-500',
              confidence.level === 'medium' && 'bg-yellow-500',
              confidence.level === 'low' && 'bg-orange-500'
            )}
            style={{ width: `${suggestion.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Additional Details (Expandable) */}
      {suggestion.category && (
        <div className="border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="w-full justify-between text-xs text-gray-500 hover:text-gray-700"
          >
            <span>Additional Details</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          
          {isExpanded && (
            <div className="mt-2 space-y-2 text-xs text-gray-600">
              {suggestion.category && (
                <div>
                  <span className="font-medium">Category:</span> {suggestion.category}
                </div>
              )}
              {suggestion.ruleId && (
                <div>
                  <span className="font-medium">Rule ID:</span> {suggestion.ruleId}
                </div>
              )}
              <div>
                <span className="font-medium">Severity:</span> {suggestion.severity}
              </div>
              <div>
                <span className="font-medium">Position:</span> {suggestion.position.start}-{suggestion.position.end}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Indicator */}
      {suggestion.status !== 'active' && (
        <div className="absolute top-2 right-2">
          {suggestion.status === 'accepted' && (
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
              <Check className="w-3 h-3" />
              <span>Accepted</span>
            </div>
          )}
          {suggestion.status === 'ignored' && (
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
              <X className="w-3 h-3" />
              <span>Ignored</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 