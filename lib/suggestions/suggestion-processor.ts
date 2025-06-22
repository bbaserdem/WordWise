/**
 * @fileoverview Suggestion processing service for the WordWise application.
 *
 * This service processes raw suggestions from grammar checking services
 * and converts them into structured suggestions that can be displayed
 * and managed in the application UI.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { 
  RawSuggestion, 
  Suggestion, 
  ProcessedSuggestions, 
  SuggestionStats,
  SuggestionType,
  SuggestionSeverity,
  CreateSuggestionFormData,
  SuggestionProcessingOptions
} from '@/types/suggestion';

/**
 * Process raw suggestions into structured suggestions.
 *
 * This function takes raw suggestions from the grammar checking service
 * and converts them into structured suggestions that can be stored in
 * the database and displayed in the UI. It categorizes suggestions by
 * type and applies confidence scoring.
 *
 * @param rawSuggestions - Array of raw suggestions from grammar checker
 * @param documentId - ID of the document being checked
 * @param userId - ID of the user who owns the document
 * @param options - Processing options for filtering and customization
 * @returns Processed suggestions organized by category with statistics
 *
 * @example
 * ```typescript
 * const processed = processSuggestions(
 *   rawSuggestions,
 *   'doc-123',
 *   'user-456',
 *   { minConfidence: 0.7 }
 * );
 * console.log(processed.spelling.length); // Number of spelling suggestions
 * ```
 *
 * @since 1.0.0
 */
export function processSuggestions(
  rawSuggestions: RawSuggestion[],
  documentId: string,
  userId: string,
  options: SuggestionProcessingOptions = {}
): ProcessedSuggestions {
  const {
    minConfidence = 0.5,
    maxSuggestions = 100,
    filterBySeverity = ['low', 'medium', 'high', 'critical'],
    customRules = {}
  } = options;

  // Convert raw suggestions to structured suggestions
  const suggestions: Suggestion[] = rawSuggestions
    .filter(rawSuggestion => {
      // Apply confidence filter
      const confidence = rawSuggestion.confidence ?? 0.5;
      if (confidence < minConfidence) {
        return false;
      }

      // Apply severity filter
      const severity = rawSuggestion.severity;
      if (!filterBySeverity.includes(severity)) {
        return false;
      }

      // Apply custom rules
      if (customRules.ignoreWords?.includes(rawSuggestion.original)) {
        return false;
      }
      if (customRules.disableRules?.includes(rawSuggestion.rule?.id)) {
        return false;
      }

      return true;
    })
    .slice(0, maxSuggestions)
    .map(rawSuggestion => createSuggestionFromRaw(rawSuggestion, documentId, userId));

  // Organize suggestions by type
  const spelling = suggestions.filter(s => s.type === 'spelling');
  const grammar = suggestions.filter(s => s.type === 'grammar');
  const style = suggestions.filter(s => s.type === 'style');
  const punctuation = suggestions.filter(s => s.type === 'punctuation');
  const ai = suggestions.filter(s => s.type === 'ai');

  // Calculate statistics
  const stats = calculateSuggestionStats(suggestions);

  return {
    spelling,
    grammar,
    style,
    punctuation,
    ai,
    all: suggestions,
    stats,
  };
}

/**
 * Create a structured suggestion from raw suggestion data.
 *
 * This function converts a raw suggestion from the grammar checking service
 * into a structured suggestion that can be stored in the database and
 * displayed in the UI.
 *
 * @param rawSuggestion - Raw suggestion from grammar checker
 * @param documentId - ID of the document
 * @param userId - ID of the user
 * @returns Structured suggestion object
 *
 * @since 1.0.0
 */
function createSuggestionFromRaw(
  rawSuggestion: RawSuggestion,
  documentId: string,
  userId: string
): Suggestion {
  const now = Timestamp.now();
  const type = rawSuggestion.type as SuggestionType;
  const severity = rawSuggestion.severity as SuggestionSeverity;
  const confidence = rawSuggestion.confidence ?? 0.5;
  const original = rawSuggestion.original;
  const suggestion = rawSuggestion.suggestion || original;

  return {
    id: uuidv4(),
    documentId,
    userId,
    type,
    original,
    suggestion,
    explanation: rawSuggestion.explanation,
    confidence,
    position: rawSuggestion.position,
    status: 'active',
    severity,
    ruleId: rawSuggestion.rule?.id,
    category: rawSuggestion.rule?.category,
    isProcessed: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Calculate statistics for a collection of suggestions.
 *
 * This function analyzes a collection of suggestions and returns
 * statistics about their distribution by type and severity.
 *
 * @param suggestions - Array of suggestions to analyze
 * @returns Statistics about the suggestions
 *
 * @since 1.0.0
 */
function calculateSuggestionStats(suggestions: Suggestion[]): SuggestionStats {
  const stats: SuggestionStats = {
    total: suggestions.length,
    spelling: 0,
    grammar: 0,
    style: 0,
    punctuation: 0,
    ai: 0,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 0,
  };

  suggestions.forEach(suggestion => {
    // Count by type
    switch (suggestion.type) {
      case 'spelling':
        stats.spelling++;
        break;
      case 'grammar':
        stats.grammar++;
        break;
      case 'style':
        stats.style++;
        break;
      case 'punctuation':
        stats.punctuation++;
        break;
      case 'ai':
        stats.ai++;
        break;
    }

    // Count by severity
    switch (suggestion.severity) {
      case 'high':
      case 'critical':
        stats.highSeverity++;
        break;
      case 'medium':
        stats.mediumSeverity++;
        break;
      case 'low':
        stats.lowSeverity++;
        break;
    }
  });

  return stats;
}

/**
 * Create a suggestion from form data.
 *
 * This function creates a new suggestion object from form data,
 * typically used when creating custom suggestions or importing
 * suggestions from external sources.
 *
 * @param formData - Suggestion creation form data
 * @returns New suggestion object
 *
 * @since 1.0.0
 */
export function createSuggestionFromFormData(
  formData: CreateSuggestionFormData
): Suggestion {
  const now = Timestamp.now();

  return {
    id: uuidv4(),
    documentId: formData.documentId,
    userId: formData.userId,
    type: formData.type,
    original: formData.original,
    suggestion: formData.suggestion,
    explanation: formData.explanation,
    confidence: formData.confidence,
    position: formData.position,
    status: 'active',
    severity: formData.severity,
    ruleId: formData.ruleId,
    category: formData.category,
    isProcessed: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Filter suggestions based on criteria.
 *
 * This function filters a collection of suggestions based on
 * various criteria such as type, status, severity, and search terms.
 *
 * @param suggestions - Array of suggestions to filter
 * @param filters - Filter criteria
 * @returns Filtered array of suggestions
 *
 * @since 1.0.0
 */
export function filterSuggestions(
  suggestions: Suggestion[],
  filters: {
    type?: SuggestionType;
    status?: string;
    severity?: SuggestionSeverity;
    search?: string;
    isProcessed?: boolean;
  }
): Suggestion[] {
  return suggestions.filter(suggestion => {
    // Filter by type
    if (filters.type && suggestion.type !== filters.type) {
      return false;
    }

    // Filter by status
    if (filters.status && suggestion.status !== filters.status) {
      return false;
    }

    // Filter by severity
    if (filters.severity && suggestion.severity !== filters.severity) {
      return false;
    }

    // Filter by processed status
    if (filters.isProcessed !== undefined && suggestion.isProcessed !== filters.isProcessed) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesOriginal = suggestion.original.toLowerCase().includes(searchLower);
      const matchesSuggestion = suggestion.suggestion.toLowerCase().includes(searchLower);
      const matchesExplanation = suggestion.explanation.toLowerCase().includes(searchLower);
      
      if (!matchesOriginal && !matchesSuggestion && !matchesExplanation) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort suggestions by various criteria.
 *
 * This function sorts a collection of suggestions based on
 * specified criteria and direction.
 *
 * @param suggestions - Array of suggestions to sort
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction
 * @returns Sorted array of suggestions
 *
 * @since 1.0.0
 */
export function sortSuggestions(
  suggestions: Suggestion[],
  sortBy: 'createdAt' | 'confidence' | 'severity' | 'type' = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Suggestion[] {
  const sorted = [...suggestions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'createdAt':
        comparison = a.createdAt.toMillis() - b.createdAt.toMillis();
        break;
      case 'confidence':
        comparison = a.confidence - b.confidence;
        break;
      case 'severity':
        const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
} 