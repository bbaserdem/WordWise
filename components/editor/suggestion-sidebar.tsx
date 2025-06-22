/**
 * @fileoverview Suggestion sidebar component for comprehensive suggestion management.
 *
 * This component provides a collapsible sidebar that displays all writing suggestions
 * with categorization, filtering, bulk actions, and detailed suggestion information.
 * It serves as a central hub for managing all suggestions in the document.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  AlertCircle, 
  BookOpen, 
  Sparkles, 
  Zap,
  Filter,
  CheckSquare,
  Square,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  getSuggestionTypeColor, 
  getSuggestionTypeBgColor,
  getSuggestionTypeDotColor,
  formatConfidence,
  getConfidenceLevel 
} from '@/lib/utils/suggestion-utils';
import { cn } from '@/lib/utils/cn';
import type { Suggestion, SuggestionType, SuggestionSeverity } from '@/types/suggestion';

/**
 * Suggestion sidebar component props interface.
 *
 * @since 1.0.0
 */
interface SuggestionSidebarProps {
  /** Array of all suggestions */
  suggestions: Suggestion[];
  /** Callback when a suggestion is accepted */
  onAcceptSuggestion: (suggestionId: string) => void;
  /** Callback when a suggestion is ignored */
  onIgnoreSuggestion: (suggestionId: string) => void;
  /** Callback when bulk action is performed */
  onBulkAction: (action: 'accept' | 'ignore', suggestionIds: string[]) => void;
  /** Callback when suggestion is clicked (for navigation) */
  onSuggestionClick?: (suggestion: Suggestion) => void;
  /** Whether the sidebar is collapsed */
  isCollapsed?: boolean;
  /** Callback when collapse state changes */
  onToggleCollapse?: () => void;
  /** Additional CSS classes */
  className?: string;
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
 * Suggestion type labels.
 *
 * @since 1.0.0
 */
const SUGGESTION_LABELS: Record<SuggestionType, string> = {
  spelling: 'Spelling',
  grammar: 'Grammar',
  style: 'Style',
  punctuation: 'Punctuation',
  ai: 'AI Suggestions',
};

/**
 * Filter options interface.
 *
 * @since 1.0.0
 */
interface FilterOptions {
  types: SuggestionType[];
  severities: SuggestionSeverity[];
  showAccepted: boolean;
  showIgnored: boolean;
  searchTerm: string;
}

/**
 * Suggestion sidebar component.
 *
 * This component provides a comprehensive sidebar for managing writing suggestions
 * with filtering, categorization, bulk actions, and detailed suggestion information.
 *
 * @param suggestions - Array of all suggestions
 * @param onAcceptSuggestion - Callback when a suggestion is accepted
 * @param onIgnoreSuggestion - Callback when a suggestion is ignored
 * @param onBulkAction - Callback when bulk action is performed
 * @param onSuggestionClick - Callback when suggestion is clicked
 * @param isCollapsed - Whether the sidebar is collapsed
 * @param onToggleCollapse - Callback when collapse state changes
 * @param className - Additional CSS classes
 * @returns The suggestion sidebar component
 *
 * @example
 * ```tsx
 * <SuggestionSidebar
 *   suggestions={allSuggestions}
 *   onAcceptSuggestion={handleAccept}
 *   onIgnoreSuggestion={handleIgnore}
 *   onBulkAction={handleBulkAction}
 *   onSuggestionClick={handleSuggestionClick}
 *   isCollapsed={false}
 *   onToggleCollapse={handleToggleCollapse}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function SuggestionSidebar({
  suggestions,
  onAcceptSuggestion,
  onIgnoreSuggestion,
  onBulkAction,
  onSuggestionClick,
  isCollapsed = false,
  onToggleCollapse,
  className,
}: SuggestionSidebarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    types: ['spelling', 'grammar', 'style', 'punctuation', 'ai'],
    severities: ['low', 'medium', 'high', 'critical'],
    showAccepted: false,
    showIgnored: false,
    searchTerm: '',
  });

  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Filter suggestions based on current filter options.
   *
   * @returns Filtered suggestions
   * @since 1.0.0
   */
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(suggestion => {
      // Filter by type
      if (!filters.types.includes(suggestion.type)) return false;
      
      // Filter by severity
      if (!filters.severities.includes(suggestion.severity)) return false;
      
      // Filter by status
      if (suggestion.status === 'accepted' && !filters.showAccepted) return false;
      if (suggestion.status === 'ignored' && !filters.showIgnored) return false;
      
      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          suggestion.original.toLowerCase().includes(searchLower) ||
          suggestion.suggestion.toLowerCase().includes(searchLower) ||
          suggestion.explanation.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [suggestions, filters]);

  /**
   * Group suggestions by type.
   *
   * @returns Suggestions grouped by type
   * @since 1.0.0
   */
  const groupedSuggestions = useMemo(() => {
    const grouped: Record<SuggestionType, Suggestion[]> = {
      spelling: [],
      grammar: [],
      style: [],
      punctuation: [],
      ai: [],
    };

    filteredSuggestions.forEach(suggestion => {
      grouped[suggestion.type].push(suggestion);
    });

    return grouped;
  }, [filteredSuggestions]);

  /**
   * Get suggestion statistics.
   *
   * @returns Statistics about suggestions
   * @since 1.0.0
   */
  const suggestionStats = useMemo(() => {
    const stats = {
      total: filteredSuggestions.length,
      byType: {
        spelling: groupedSuggestions.spelling.length,
        grammar: groupedSuggestions.grammar.length,
        style: groupedSuggestions.style.length,
        punctuation: groupedSuggestions.punctuation.length,
        ai: groupedSuggestions.ai.length,
      },
      bySeverity: {
        low: filteredSuggestions.filter(s => s.severity === 'low').length,
        medium: filteredSuggestions.filter(s => s.severity === 'medium').length,
        high: filteredSuggestions.filter(s => s.severity === 'high').length,
        critical: filteredSuggestions.filter(s => s.severity === 'critical').length,
      },
    };

    return stats;
  }, [filteredSuggestions, groupedSuggestions]);

  /**
   * Handle suggestion selection.
   *
   * @param suggestionId - ID of the suggestion to toggle
   * @since 1.0.0
   */
  const handleSuggestionToggle = (suggestionId: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId);
    } else {
      newSelected.add(suggestionId);
    }
    setSelectedSuggestions(newSelected);
  };

  /**
   * Handle select all suggestions.
   *
   * @since 1.0.0
   */
  const handleSelectAll = () => {
    if (selectedSuggestions.size === filteredSuggestions.length) {
      setSelectedSuggestions(new Set());
    } else {
      setSelectedSuggestions(new Set(filteredSuggestions.map(s => s.id)));
    }
  };

  /**
   * Handle bulk action.
   *
   * @param action - Action to perform
   * @since 1.0.0
   */
  const handleBulkAction = (action: 'accept' | 'ignore') => {
    if (selectedSuggestions.size === 0) return;
    
    onBulkAction(action, Array.from(selectedSuggestions));
    setSelectedSuggestions(new Set());
  };

  /**
   * Handle filter change.
   *
   * @param key - Filter key to update
   * @param value - New filter value
   * @since 1.0.0
   */
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isCollapsed) {
    return (
      <div className={cn(
        'w-12 bg-background-secondary border-l border-primary-200 flex flex-col items-center py-4',
        className
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">
            {suggestions.length}
          </div>
          <div className="text-xs text-text-secondary">Issues</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'w-80 bg-background-secondary border-l border-primary-200 flex flex-col',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-primary-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">
            Writing Suggestions
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center p-2 bg-background-primary rounded">
            <div className="font-semibold text-text-primary">{suggestionStats.total}</div>
            <div className="text-text-secondary">Total</div>
          </div>
          <div className="text-center p-2 bg-background-primary rounded">
            <div className="font-semibold text-text-primary">
              {suggestionStats.bySeverity.high + suggestionStats.bySeverity.critical}
            </div>
            <div className="text-text-secondary">Important</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-primary-200 space-y-3">
          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              Types
            </label>
            <div className="space-y-1">
              {Object.entries(SUGGESTION_LABELS).map(([type, label]) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type as SuggestionType)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.types, type as SuggestionType]
                        : filters.types.filter(t => t !== type);
                      handleFilterChange('types', newTypes);
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-text-secondary">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              Status
            </label>
            <div className="space-y-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showAccepted}
                  onChange={(e) => handleFilterChange('showAccepted', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-text-secondary">Show Accepted</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showIgnored}
                  onChange={(e) => handleFilterChange('showIgnored', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-text-secondary">Show Ignored</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary mb-2 block">
              Search
            </label>
            <input
              type="text"
              placeholder="Search suggestions..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full px-3 py-1 text-sm border border-primary-200 rounded bg-background-primary"
            />
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedSuggestions.size > 0 && (
        <div className="p-4 border-b border-primary-200 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              {selectedSuggestions.size} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSuggestions(new Set())}
            >
              Clear
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleBulkAction('accept')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-3 h-3 mr-1" />
              Accept All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('ignore')}
              className="flex-1"
            >
              <X className="w-3 h-3 mr-1" />
              Ignore All
            </Button>
          </div>
        </div>
      )}

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => {
          if (typeSuggestions.length === 0) return null;

          const IconComponent = SUGGESTION_ICONS[type as SuggestionType];
          const label = SUGGESTION_LABELS[type as SuggestionType];

          return (
            <div key={type} className="border-b border-primary-200 last:border-b-0">
              {/* Type Header */}
              <div className="p-3 bg-background-primary border-b border-primary-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={cn(
                      'w-4 h-4',
                      getSuggestionTypeColor(type as SuggestionType)
                    )} />
                    <span className="text-sm font-medium text-text-primary">
                      {label}
                    </span>
                    <span className="text-xs text-text-secondary">
                      ({typeSuggestions.length})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const allTypeIds = typeSuggestions.map(s => s.id);
                      const allSelected = allTypeIds.every(id => selectedSuggestions.has(id));
                      if (allSelected) {
                        const newSelected = new Set(selectedSuggestions);
                        allTypeIds.forEach(id => newSelected.delete(id));
                        setSelectedSuggestions(newSelected);
                      } else {
                        const newSelected = new Set(selectedSuggestions);
                        allTypeIds.forEach(id => newSelected.add(id));
                        setSelectedSuggestions(newSelected);
                      }
                    }}
                  >
                    {typeSuggestions.every(s => selectedSuggestions.has(s.id)) ? (
                      <CheckSquare className="w-3 h-3" />
                    ) : (
                      <Square className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Type Suggestions */}
              <div className="space-y-1">
                {typeSuggestions.map(suggestion => (
                  <div
                    key={suggestion.id}
                    className={cn(
                      'p-3 hover:bg-background-primary cursor-pointer transition-colors',
                      suggestion.status === 'accepted' && 'bg-green-50 dark:bg-green-900/20',
                      suggestion.status === 'ignored' && 'bg-gray-50 dark:bg-gray-900/20'
                    )}
                    onClick={() => onSuggestionClick?.(suggestion)}
                  >
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSuggestions.has(suggestion.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSuggestionToggle(suggestion.id);
                        }}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full',
                                getSuggestionTypeDotColor(suggestion.type)
                              )}
                            />
                            <span className="text-xs text-text-secondary">
                              {formatConfidence(suggestion.confidence)}
                            </span>
                          </div>
                          {suggestion.status === 'accepted' && (
                            <Check className="w-3 h-3 text-green-600" />
                          )}
                          {suggestion.status === 'ignored' && (
                            <X className="w-3 h-3 text-gray-600" />
                          )}
                        </div>
                        
                        <div className="text-sm text-text-primary mb-1">
                          <span className="text-red-600 font-medium">{suggestion.original}</span>
                          <span className="text-text-secondary mx-1">→</span>
                          <span className="text-green-600 font-medium">{suggestion.suggestion}</span>
                        </div>
                        
                        <p className="text-xs text-text-secondary line-clamp-2">
                          {suggestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredSuggestions.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-text-secondary mb-2">
              {suggestions.length === 0 ? (
                <>
                  <Check className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm">No writing issues found!</p>
                </>
              ) : (
                <>
                  <Filter className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No suggestions match your filters</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 