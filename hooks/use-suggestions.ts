/**
 * @fileoverview React hook for managing real-time writing suggestions.
 *
 * This hook provides real-time grammar and spell checking functionality
 * with debouncing, caching, and performance optimization. It integrates
 * with the grammar checking API and manages suggestion state for the editor.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks';
import type { 
  ProcessedSuggestions, 
  Suggestion, 
  SuggestionStatus,
  RealtimeCheckOptions,
  SuggestionMetrics,
  GrammarCheckRequest
} from '@/types/suggestion';

/**
 * Default options for real-time suggestion checking.
 *
 * @since 1.0.0
 */
const DEFAULT_REALTIME_OPTIONS: RealtimeCheckOptions = {
  enabled: true,
  debounceDelay: 1000, // 1 second debounce
  minTextLength: 10, // Minimum text length to trigger checking
  maxTextLength: 10000, // Maximum text length for real-time checking
  checkOnChange: true,
  checkOnBlur: true,
  checkOnFocus: false,
};

/**
 * Suggestion hook state interface.
 *
 * @since 1.0.0
 */
interface UseSuggestionsState {
  /** Current suggestions organized by category */
  suggestions: ProcessedSuggestions;
  /** Whether suggestions are currently being loaded */
  isLoading: boolean;
  /** Error message if suggestion checking failed */
  error: string | null;
  /** Performance metrics for suggestion checking */
  metrics: SuggestionMetrics;
  /** Whether real-time checking is enabled */
  isRealtimeEnabled: boolean;
  /** Last check timestamp */
  lastCheckAt: Date | null;
}

/**
 * Suggestion hook return interface.
 *
 * @since 1.0.0
 */
interface UseSuggestionsReturn extends UseSuggestionsState {
  /** Check text for suggestions */
  checkText: (text: string, options?: Partial<GrammarCheckRequest>) => Promise<void>;
  /** Check text for suggestions (debounced for real-time use) */
  checkTextRealtime: (text: string, options?: Partial<GrammarCheckRequest>) => void;
  /** Check text for suggestions (manual mode - bypasses length limits) */
  checkTextManual: (text: string, options?: Partial<GrammarCheckRequest>) => Promise<void>;
  /** Accept a suggestion */
  acceptSuggestion: (suggestionId: string) => void;
  /** Ignore a suggestion */
  ignoreSuggestion: (suggestionId: string) => void;
  /** Dismiss a suggestion */
  dismissSuggestion: (suggestionId: string) => void;
  /** Clear all suggestions */
  clearSuggestions: () => void;
  /** Update real-time checking options */
  updateRealtimeOptions: (options: Partial<RealtimeCheckOptions>) => void;
  /** Get suggestion by ID */
  getSuggestion: (suggestionId: string) => Suggestion | undefined;
  /** Get suggestions by type */
  getSuggestionsByType: (type: string) => Suggestion[];
  /** Get suggestions by severity */
  getSuggestionsBySeverity: (severity: string) => Suggestion[];
}

/**
 * React hook for managing real-time writing suggestions.
 *
 * This hook provides comprehensive suggestion management functionality
 * including real-time grammar checking, suggestion state management,
 * and performance optimization. It uses debouncing to prevent excessive
 * API calls and caching to improve performance.
 *
 * @param documentId - ID of the document being checked
 * @param initialOptions - Initial real-time checking options
 * @returns Object with suggestion state and management functions
 *
 * @example
 * ```tsx
 * const {
 *   suggestions,
 *   isLoading,
 *   checkText,
 *   acceptSuggestion,
 *   ignoreSuggestion
 * } = useSuggestions('doc-123', {
 *   debounceDelay: 1500,
 *   minTextLength: 20
 * });
 * 
 * // Check text for suggestions
 * await checkText('This is a test sentence with errors.');
 * 
 * // Accept a suggestion
 * acceptSuggestion('suggestion-123');
 * ```
 *
 * @since 1.0.0
 */
export function useSuggestions(
  documentId: string,
  initialOptions: Partial<RealtimeCheckOptions> = {}
): UseSuggestionsReturn {
  const { user } = useAuth();
  const [state, setState] = useState<UseSuggestionsState>({
    suggestions: {
      spelling: [],
      grammar: [],
      style: [],
      punctuation: [],
      ai: [],
      all: [],
      stats: {
        total: 0,
        spelling: 0,
        grammar: 0,
        style: 0,
        punctuation: 0,
        ai: 0,
        highSeverity: 0,
        mediumSeverity: 0,
        lowSeverity: 0,
      },
    },
    isLoading: false,
    error: null,
    metrics: {
      averageResponseTime: 0,
      totalChecks: 0,
      totalSuggestions: 0,
      acceptanceRate: 0,
      ignoreRate: 0,
      performanceHistory: [],
    },
    isRealtimeEnabled: true,
    lastCheckAt: null,
  });

  // Refs for managing state
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const optionsRef = useRef<RealtimeCheckOptions>({
    ...DEFAULT_REALTIME_OPTIONS,
    ...initialOptions,
  });

  // Cache for storing previous results
  const cacheRef = useRef<Map<string, ProcessedSuggestions>>(new Map());

  /**
   * Generate cache key for text content.
   *
   * @param text - Text content to generate key for
   * @returns Cache key string
   * @since 1.0.0
   */
  const generateCacheKey = useCallback((text: string): string => {
    // Simple hash for cache key (in production, use a proper hash function)
    return `${text.length}-${text.substring(0, 100)}`;
  }, []);

  /**
   * Check text for grammar and spelling suggestions.
   *
   * @param text - Text to check for suggestions
   * @param options - Additional options for the check
   * @returns Promise that resolves when check is complete
   * @since 1.0.0
   */
  const checkText = useCallback(async (
    text: string,
    options: Partial<GrammarCheckRequest> = {}
  ): Promise<void> => {
    if (!user || !optionsRef.current.enabled) {
      return;
    }

    const { minTextLength, maxTextLength } = optionsRef.current;

    // Validate text length
    if (text.length < minTextLength) {
      setState(prev => ({ 
        ...prev, 
        suggestions: { ...prev.suggestions, all: [] },
        error: null 
      }));
      return;
    }

    if (text.length > maxTextLength) {
      setState(prev => ({ 
        ...prev, 
        error: `Text too long for real-time checking (${text.length} characters). Maximum ${maxTextLength} characters allowed. Consider checking smaller sections.`,
        suggestions: { ...prev.suggestions, all: [] }
      }));
      return;
    }

    // Check cache first
    const cacheKey = generateCacheKey(text);
    const cachedResult = cacheRef.current.get(cacheKey);
    if (cachedResult) {
      setState(prev => ({ 
        ...prev, 
        suggestions: cachedResult,
        lastCheckAt: new Date(),
        error: null
      }));
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const startTime = Date.now();

    try {
      const response = await fetch('/api/suggestions/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: 'en-US',
          documentId,
          preferences: {
            enableSpellCheck: true,
            enableGrammarCheck: true,
            enableStyleCheck: true,
          },
          ...options,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Grammar check failed');
      }

      const processingTime = Date.now() - startTime;

      // Update cache
      cacheRef.current.set(cacheKey, data.suggestions);

      // Update metrics
      const newMetrics = {
        ...state.metrics,
        totalChecks: state.metrics.totalChecks + 1,
        totalSuggestions: state.metrics.totalSuggestions + data.suggestions.stats.total,
        averageResponseTime: (state.metrics.averageResponseTime + processingTime) / 2,
        lastCheckAt: Timestamp.now(),
        performanceHistory: [
          ...state.metrics.performanceHistory,
          {
            timestamp: Timestamp.now(),
            responseTime: processingTime,
            suggestionCount: data.suggestions.stats.total,
          },
        ].slice(-10), // Keep last 10 entries
      };

      setState(prev => ({
        ...prev,
        suggestions: data.suggestions,
        isLoading: false,
        lastCheckAt: new Date(),
        metrics: newMetrics,
        error: null,
      }));

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      console.error('Suggestion check failed:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check suggestions',
      }));
    }
  }, [user, documentId, state.metrics, generateCacheKey]);

  /**
   * Debounced version of checkText for real-time checking.
   *
   * @param text - Text to check
   * @param options - Additional options
   * @since 1.0.0
   */
  const debouncedCheckText = useCallback((
    text: string,
    options: Partial<GrammarCheckRequest> = {}
  ): void => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      checkText(text, options);
    }, optionsRef.current.debounceDelay);
  }, [checkText]);

  /**
   * Accept a suggestion and update state.
   *
   * @param suggestionId - ID of the suggestion to accept
   * @since 1.0.0
   */
  const acceptSuggestion = useCallback((suggestionId: string): void => {
    setState(prev => {
      const updatedSuggestions = { ...prev.suggestions };
      
      // Update suggestion status in all categories
      Object.keys(updatedSuggestions).forEach(key => {
        if (key !== 'all' && key !== 'stats') {
          const category = key as keyof Omit<ProcessedSuggestions, 'all' | 'stats'>;
          updatedSuggestions[category] = updatedSuggestions[category].map(suggestion =>
            suggestion.id === suggestionId
              ? { ...suggestion, status: 'accepted' as SuggestionStatus, isProcessed: true }
              : suggestion
          );
        }
      });

      // Update all suggestions
      updatedSuggestions.all = updatedSuggestions.all.map(suggestion =>
        suggestion.id === suggestionId
          ? { ...suggestion, status: 'accepted' as SuggestionStatus, isProcessed: true }
          : suggestion
      );

      // Update stats
      updatedSuggestions.stats = {
        ...updatedSuggestions.stats,
        // Note: In a real implementation, you'd update these based on actual counts
      };

      return {
        ...prev,
        suggestions: updatedSuggestions,
      };
    });
  }, []);

  /**
   * Ignore a suggestion and update state.
   *
   * @param suggestionId - ID of the suggestion to ignore
   * @since 1.0.0
   */
  const ignoreSuggestion = useCallback((suggestionId: string): void => {
    setState(prev => {
      const updatedSuggestions = { ...prev.suggestions };
      
      // Update suggestion status in all categories
      Object.keys(updatedSuggestions).forEach(key => {
        if (key !== 'all' && key !== 'stats') {
          const category = key as keyof Omit<ProcessedSuggestions, 'all' | 'stats'>;
          updatedSuggestions[category] = updatedSuggestions[category].map(suggestion =>
            suggestion.id === suggestionId
              ? { ...suggestion, status: 'ignored' as SuggestionStatus, isProcessed: true }
              : suggestion
          );
        }
      });

      // Update all suggestions
      updatedSuggestions.all = updatedSuggestions.all.map(suggestion =>
        suggestion.id === suggestionId
          ? { ...suggestion, status: 'ignored' as SuggestionStatus, isProcessed: true }
          : suggestion
      );

      return {
        ...prev,
        suggestions: updatedSuggestions,
      };
    });
  }, []);

  /**
   * Dismiss a suggestion and update state.
   *
   * @param suggestionId - ID of the suggestion to dismiss
   * @since 1.0.0
   */
  const dismissSuggestion = useCallback((suggestionId: string): void => {
    setState(prev => {
      const updatedSuggestions = { ...prev.suggestions };
      
      // Update suggestion status in all categories
      Object.keys(updatedSuggestions).forEach(key => {
        if (key !== 'all' && key !== 'stats') {
          const category = key as keyof Omit<ProcessedSuggestions, 'all' | 'stats'>;
          updatedSuggestions[category] = updatedSuggestions[category].map(suggestion =>
            suggestion.id === suggestionId
              ? { ...suggestion, status: 'dismissed' as SuggestionStatus, isProcessed: true }
              : suggestion
          );
        }
      });

      // Update all suggestions
      updatedSuggestions.all = updatedSuggestions.all.map(suggestion =>
        suggestion.id === suggestionId
          ? { ...suggestion, status: 'dismissed' as SuggestionStatus, isProcessed: true }
          : suggestion
      );

      return {
        ...prev,
        suggestions: updatedSuggestions,
      };
    });
  }, []);

  /**
   * Clear all suggestions.
   *
   * @since 1.0.0
   */
  const clearSuggestions = useCallback((): void => {
    setState(prev => ({
      ...prev,
      suggestions: {
        spelling: [],
        grammar: [],
        style: [],
        punctuation: [],
        ai: [],
        all: [],
        stats: {
          total: 0,
          spelling: 0,
          grammar: 0,
          style: 0,
          punctuation: 0,
          ai: 0,
          highSeverity: 0,
          mediumSeverity: 0,
          lowSeverity: 0,
        },
      },
    }));
  }, []);

  /**
   * Update real-time checking options.
   *
   * @param newOptions - New options to merge with current options
   * @since 1.0.0
   */
  const updateRealtimeOptions = useCallback((newOptions: Partial<RealtimeCheckOptions>): void => {
    optionsRef.current = { ...optionsRef.current, ...newOptions };
    setState(prev => ({ ...prev, isRealtimeEnabled: optionsRef.current.enabled }));
  }, []);

  /**
   * Get suggestion by ID.
   *
   * @param suggestionId - ID of the suggestion to find
   * @returns Suggestion object or undefined if not found
   * @since 1.0.0
   */
  const getSuggestion = useCallback((suggestionId: string): Suggestion | undefined => {
    return state.suggestions.all.find(suggestion => suggestion.id === suggestionId);
  }, [state.suggestions.all]);

  /**
   * Get suggestions by type.
   *
   * @param type - Type of suggestions to get
   * @returns Array of suggestions of the specified type
   * @since 1.0.0
   */
  const getSuggestionsByType = useCallback((type: string): Suggestion[] => {
    const category = type as keyof Omit<ProcessedSuggestions, 'all' | 'stats'>;
    return state.suggestions[category] || [];
  }, [state.suggestions]);

  /**
   * Get suggestions by severity.
   *
   * @param severity - Severity level to filter by
   * @returns Array of suggestions with the specified severity
   * @since 1.0.0
   */
  const getSuggestionsBySeverity = useCallback((severity: string): Suggestion[] => {
    return state.suggestions.all.filter(suggestion => suggestion.severity === severity);
  }, [state.suggestions.all]);

  /**
   * Check text for grammar and spelling suggestions (manual mode - bypasses length limits).
   *
   * @param text - Text to check for suggestions
   * @param options - Additional options for the check
   * @returns Promise that resolves when check is complete
   * @since 1.0.0
   */
  const checkTextManual = useCallback(async (
    text: string,
    options: Partial<GrammarCheckRequest> = {}
  ): Promise<void> => {
    if (!user || !optionsRef.current.enabled) {
      return;
    }

    const { minTextLength } = optionsRef.current;

    // Validate minimum text length only
    if (text.length < minTextLength) {
      setState(prev => ({ 
        ...prev, 
        suggestions: { ...prev.suggestions, all: [] },
        error: null 
      }));
      return;
    }

    // Check cache first
    const cacheKey = generateCacheKey(text);
    const cachedResult = cacheRef.current.get(cacheKey);
    if (cachedResult) {
      setState(prev => ({ 
        ...prev, 
        suggestions: cachedResult,
        lastCheckAt: new Date(),
        error: null
      }));
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const startTime = Date.now();

    try {
      const response = await fetch('/api/suggestions/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: 'en-US',
          documentId,
          manual: true,
          preferences: {
            enableSpellCheck: true,
            enableGrammarCheck: true,
            enableStyleCheck: true,
          },
          ...options,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Grammar check failed');
      }

      const processingTime = Date.now() - startTime;

      // Update cache
      cacheRef.current.set(cacheKey, data.suggestions);

      // Update metrics
      const newMetrics = {
        ...state.metrics,
        totalChecks: state.metrics.totalChecks + 1,
        totalSuggestions: state.metrics.totalSuggestions + data.suggestions.stats.total,
        averageResponseTime: (state.metrics.averageResponseTime + processingTime) / 2,
        lastCheckAt: Timestamp.now(),
        performanceHistory: [
          ...state.metrics.performanceHistory,
          {
            timestamp: Timestamp.now(),
            responseTime: processingTime,
            suggestionCount: data.suggestions.stats.total,
          },
        ].slice(-10), // Keep last 10 entries
      };

      setState(prev => ({
        ...prev,
        suggestions: data.suggestions,
        isLoading: false,
        lastCheckAt: new Date(),
        metrics: newMetrics,
        error: null,
      }));

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      console.error('Manual suggestion check failed:', error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error detected - check API endpoint');
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check suggestions',
      }));
    }
  }, [user, documentId, state.metrics, generateCacheKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    checkText,
    checkTextRealtime: debouncedCheckText,
    checkTextManual,
    acceptSuggestion,
    ignoreSuggestion,
    dismissSuggestion,
    clearSuggestions,
    updateRealtimeOptions,
    getSuggestion,
    getSuggestionsByType,
    getSuggestionsBySeverity,
  };
} 