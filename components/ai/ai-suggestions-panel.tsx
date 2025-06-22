/**
 * @fileoverview AI suggestions panel component for displaying AI-powered writing suggestions.
 *
 * This component provides a dedicated panel for AI suggestions with enhanced
 * features like filtering, sorting, and detailed analytics. It showcases
 * the advanced capabilities of AI-powered writing assistance.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Brain,
  Target,
  Lightbulb,
  BookOpen,
  Zap,
  Settings,
  RefreshCw,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AISuggestionCard } from './ai-suggestion-card';
import { cn } from '@/lib/utils/cn';
import type { Suggestion } from '@/types/suggestion';

/**
 * AI suggestions panel props interface.
 *
 * @since 1.0.0
 */
interface AISuggestionsPanelProps {
  /** Array of AI suggestions */
  suggestions: Suggestion[];
  /** Callback when a suggestion is accepted */
  onAcceptSuggestion: (suggestionId: string) => void;
  /** Callback when a suggestion is ignored */
  onIgnoreSuggestion: (suggestionId: string) => void;
  /** Callback when suggestion is clicked */
  onSuggestionClick?: (suggestion: Suggestion) => void;
  /** Callback when refresh is requested */
  onRefresh?: () => void;
  /** Whether the panel is loading */
  isLoading?: boolean;
  /** AI service statistics */
  aiStats?: {
    totalAISuggestions: number;
    aiProcessingTime: number;
    aiModel: string;
    tokenUsage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
  /** Additional CSS classes */
  className?: string;
}

/**
 * AI suggestion type filter options.
 *
 * @since 1.0.0
 */
type AISuggestionType = 'style' | 'content' | 'structure' | 'improvement' | 'clarity';

/**
 * Sort options for AI suggestions.
 *
 * @since 1.0.0
 */
type SortOption = 'confidence' | 'type' | 'severity' | 'createdAt';

/**
 * AI suggestion type information.
 *
 * @since 1.0.0
 */
const AI_SUGGESTION_TYPES: Record<AISuggestionType, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}> = {
  style: {
    label: 'Style Enhancement',
    icon: Sparkles,
    color: 'text-purple-600',
    description: 'Improves writing style and tone',
  },
  content: {
    label: 'Content Improvement',
    icon: BookOpen,
    color: 'text-blue-600',
    description: 'Enhances content quality and clarity',
  },
  structure: {
    label: 'Structure Optimization',
    icon: Target,
    color: 'text-green-600',
    description: 'Improves document structure and flow',
  },
  improvement: {
    label: 'General Improvement',
    icon: Lightbulb,
    color: 'text-yellow-600',
    description: 'General writing improvements',
  },
  clarity: {
    label: 'Clarity Enhancement',
    icon: Brain,
    color: 'text-indigo-600',
    description: 'Enhances clarity and readability',
  },
};

/**
 * AI suggestions panel component.
 *
 * This component provides a comprehensive interface for managing AI-powered
 * writing suggestions with advanced filtering, sorting, and analytics features.
 *
 * @param suggestions - Array of AI suggestions
 * @param onAcceptSuggestion - Callback when a suggestion is accepted
 * @param onIgnoreSuggestion - Callback when a suggestion is ignored
 * @param onSuggestionClick - Callback when suggestion is clicked
 * @param onRefresh - Callback when refresh is requested
 * @param isLoading - Whether the panel is loading
 * @param aiStats - AI service statistics
 * @param className - Additional CSS classes
 * @returns The AI suggestions panel component
 *
 * @example
 * ```tsx
 * <AISuggestionsPanel
 *   suggestions={aiSuggestions}
 *   onAcceptSuggestion={handleAccept}
 *   onIgnoreSuggestion={handleIgnore}
 *   onSuggestionClick={handleClick}
 *   onRefresh={handleRefresh}
 *   isLoading={false}
 *   aiStats={aiStats}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function AISuggestionsPanel({
  suggestions,
  onAcceptSuggestion,
  onIgnoreSuggestion,
  onSuggestionClick,
  onRefresh,
  isLoading = false,
  aiStats,
  className,
}: AISuggestionsPanelProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<AISuggestionType>>(new Set(['style', 'content', 'structure', 'improvement', 'clarity']));
  const [sortBy, setSortBy] = useState<SortOption>('confidence');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showStats, setShowStats] = useState(false);

  /**
   * Get AI suggestion type from rule ID.
   *
   * @param ruleId - Rule ID from the suggestion
   * @returns AI suggestion type
   * @since 1.0.0
   */
  const getAISuggestionType = (ruleId?: string): AISuggestionType => {
    if (!ruleId) return 'improvement';
    
    const typeMatch = ruleId.match(/^ai_(.+)$/);
    return (typeMatch ? typeMatch[1] : 'improvement') as AISuggestionType;
  };

  /**
   * Filter and sort suggestions.
   *
   * @returns Filtered and sorted suggestions
   * @since 1.0.0
   */
  const filteredAndSortedSuggestions = useMemo(() => {
    // Filter by selected types
    const filtered = suggestions.filter(suggestion => {
      const type = getAISuggestionType(suggestion.ruleId);
      return selectedTypes.has(type);
    });

    // Sort suggestions
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'confidence':
          comparison = a.confidence - b.confidence;
          break;
        case 'type':
          comparison = getAISuggestionType(a.ruleId).localeCompare(getAISuggestionType(b.ruleId));
          break;
        case 'severity':
          const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
        case 'createdAt':
          comparison = a.createdAt.toMillis() - b.createdAt.toMillis();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [suggestions, selectedTypes, sortBy, sortOrder]);

  /**
   * Calculate suggestion statistics.
   *
   * @returns Suggestion statistics
   * @since 1.0.0
   */
  const suggestionStats = useMemo(() => {
    const stats = {
      total: suggestions.length,
      byType: {} as Record<AISuggestionType, number>,
      byConfidence: { high: 0, medium: 0, low: 0 },
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      averageConfidence: 0,
    };

    suggestions.forEach(suggestion => {
      const type = getAISuggestionType(suggestion.ruleId);
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      if (suggestion.confidence >= 0.8) stats.byConfidence.high++;
      else if (suggestion.confidence >= 0.6) stats.byConfidence.medium++;
      else stats.byConfidence.low++;

      stats.bySeverity[suggestion.severity]++;

      stats.averageConfidence += suggestion.confidence;
    });

    if (suggestions.length > 0) {
      stats.averageConfidence /= suggestions.length;
    }

    return stats;
  }, [suggestions]);

  /**
   * Toggle suggestion type filter.
   *
   * @param type - Suggestion type to toggle
   * @since 1.0.0
   */
  const toggleTypeFilter = (type: AISuggestionType) => {
    const newSelectedTypes = new Set(selectedTypes);
    if (newSelectedTypes.has(type)) {
      newSelectedTypes.delete(type);
    } else {
      newSelectedTypes.add(type);
    }
    setSelectedTypes(newSelectedTypes);
  };

  /**
   * Handle sort change.
   *
   * @param newSortBy - New sort field
   * @since 1.0.0
   */
  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div className={cn('bg-white rounded-lg border shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-700">AI Suggestions</span>
          </div>
          <span className="text-sm text-gray-500">
            {filteredAndSortedSuggestions.length} of {suggestions.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="text-gray-600 hover:text-gray-800"
            title="Toggle statistics"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-800"
              title="Refresh suggestions"
            >
              <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && (
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{suggestionStats.total}</div>
              <div className="text-xs text-gray-500">Total Suggestions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(suggestionStats.averageConfidence * 100)}%
              </div>
              <div className="text-xs text-gray-500">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{suggestionStats.byConfidence.high}</div>
              <div className="text-xs text-gray-500">High Confidence</div>
            </div>
            {aiStats && (
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{aiStats.aiModel}</div>
                <div className="text-xs text-gray-500">AI Model</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="p-4 border-b bg-gray-50">
        {/* Type Filters */}
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Filter by Type:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AI_SUGGESTION_TYPES).map(([type, info]) => {
              const IconComponent = info.icon;
              const isSelected = selectedTypes.has(type as AISuggestionType);
              
              return (
                <Button
                  key={type}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTypeFilter(type as AISuggestionType)}
                  className={cn(
                    'text-xs',
                    isSelected && 'bg-purple-600 hover:bg-purple-700'
                  )}
                >
                  <IconComponent className="w-3 h-3 mr-1" />
                  {info.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange('confidence')}
            className={cn(
              'text-xs',
              sortBy === 'confidence' && 'bg-blue-100 text-blue-700'
            )}
          >
            Confidence
            {sortBy === 'confidence' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange('type')}
            className={cn(
              'text-xs',
              sortBy === 'type' && 'bg-blue-100 text-blue-700'
            )}
          >
            Type
            {sortBy === 'type' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange('severity')}
            className={cn(
              'text-xs',
              sortBy === 'severity' && 'bg-blue-100 text-blue-700'
            )}
          >
            Severity
            {sortBy === 'severity' && (
              sortOrder === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Generating AI suggestions...</span>
          </div>
        ) : filteredAndSortedSuggestions.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No AI suggestions available</p>
            <p className="text-sm text-gray-400">Try writing more text to get AI-powered suggestions</p>
          </div>
        ) : (
          filteredAndSortedSuggestions.map((suggestion) => (
            <AISuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAccept={onAcceptSuggestion}
              onIgnore={onIgnoreSuggestion}
              onClick={onSuggestionClick}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {aiStats && (
        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>AI Model: {aiStats.aiModel}</span>
            <span>Processing: {aiStats.aiProcessingTime}ms</span>
            {aiStats.tokenUsage && (
              <span>Tokens: {aiStats.tokenUsage.totalTokens}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 