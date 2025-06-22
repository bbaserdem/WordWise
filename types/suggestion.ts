/**
 * @fileoverview Suggestion type definitions for the WordWise application.
 *
 * This file defines TypeScript interfaces and types related to writing suggestions,
 * including grammar, spelling, and style suggestions with their metadata
 * and management operations.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Represents a writing suggestion in the WordWise application.
 *
 * This interface defines the structure of suggestion data stored in Firestore,
 * including grammar, spelling, and style suggestions with their metadata.
 *
 * @since 1.0.0
 */
export interface Suggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** ID of the document this suggestion belongs to */
  documentId: string;
  /** ID of the user who owns the suggestion */
  userId: string;
  /** Type of suggestion */
  type: SuggestionType;
  /** Original text that needs correction */
  original: string;
  /** Suggested correction or improvement */
  suggestion: string;
  /** Detailed explanation of the suggestion */
  explanation: string;
  /** Confidence level of the suggestion (0-1) */
  confidence: number;
  /** Position in the document (start and end indices) */
  position: {
    start: number;
    end: number;
  };
  /** Current status of the suggestion */
  status: SuggestionStatus;
  /** Severity level of the issue */
  severity: SuggestionSeverity;
  /** Rule ID from the grammar checking service */
  ruleId?: string;
  /** Category of the suggestion */
  category?: string;
  /** Whether this suggestion has been processed by the user */
  isProcessed: boolean;
  /** When the suggestion was created */
  createdAt: Timestamp;
  /** When the suggestion was last updated */
  updatedAt: Timestamp;
}

/**
 * Types of writing suggestions.
 *
 * @since 1.0.0
 */
export type SuggestionType = 
  | 'spelling'
  | 'grammar'
  | 'style'
  | 'punctuation'
  | 'ai';

/**
 * Status of a suggestion.
 *
 * @since 1.0.0
 */
export type SuggestionStatus = 
  | 'active'
  | 'accepted'
  | 'ignored'
  | 'dismissed';

/**
 * Severity level of a suggestion.
 *
 * @since 1.0.0
 */
export type SuggestionSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

/**
 * Raw suggestion data from grammar checking service.
 *
 * @since 1.0.0
 */
export interface RawSuggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** Type of suggestion */
  type: 'spelling' | 'grammar' | 'style';
  /** Original text that needs correction */
  original: string;
  /** Suggested correction or improvement */
  suggestion: string;
  /** Detailed explanation of the suggestion */
  explanation: string;
  /** Short message for display */
  shortMessage: string;
  /** Position in the document (start and end indices) */
  position: {
    start: number;
    end: number;
  };
  /** Confidence level of the suggestion (0-1) */
  confidence: number;
  /** Severity level of the issue */
  severity: SuggestionSeverity;
  /** Rule information from the grammar checking service */
  rule: {
    id: string;
    name: string;
    category: string;
    issueType: string;
  };
  /** Context information */
  context: {
    text: string;
    sentence: string;
  };
  /** Available replacement suggestions */
  replacements: string[];
}

/**
 * Processed suggestions organized by category.
 *
 * @since 1.0.0
 */
export interface ProcessedSuggestions {
  /** Spelling suggestions */
  spelling: Suggestion[];
  /** Grammar suggestions */
  grammar: Suggestion[];
  /** Style suggestions */
  style: Suggestion[];
  /** Punctuation suggestions */
  punctuation: Suggestion[];
  /** AI-powered suggestions */
  ai: Suggestion[];
  /** All suggestions combined */
  all: Suggestion[];
  /** Statistics about suggestions */
  stats: SuggestionStats;
}

/**
 * Statistics about suggestions.
 *
 * @since 1.0.0
 */
export interface SuggestionStats {
  /** Total number of suggestions */
  total: number;
  /** Number of spelling suggestions */
  spelling: number;
  /** Number of grammar suggestions */
  grammar: number;
  /** Number of style suggestions */
  style: number;
  /** Number of punctuation suggestions */
  punctuation: number;
  /** Number of AI suggestions */
  ai: number;
  /** Number of high severity suggestions */
  highSeverity: number;
  /** Number of medium severity suggestions */
  mediumSeverity: number;
  /** Number of low severity suggestions */
  lowSeverity: number;
}

/**
 * Suggestion creation form data.
 *
 * @since 1.0.0
 */
export interface CreateSuggestionFormData {
  /** Document ID */
  documentId: string;
  /** User ID */
  userId: string;
  /** Suggestion type */
  type: SuggestionType;
  /** Original text */
  original: string;
  /** Suggested correction */
  suggestion: string;
  /** Explanation */
  explanation: string;
  /** Confidence level */
  confidence: number;
  /** Position in document */
  position: {
    start: number;
    end: number;
  };
  /** Severity level */
  severity: SuggestionSeverity;
  /** Rule ID */
  ruleId?: string;
  /** Category */
  category?: string;
}

/**
 * Suggestion update form data.
 *
 * @since 1.0.0
 */
export interface UpdateSuggestionFormData {
  /** New status */
  status?: SuggestionStatus;
  /** Whether suggestion is processed */
  isProcessed?: boolean;
  /** Updated explanation */
  explanation?: string;
  /** Updated confidence */
  confidence?: number;
  /** Updated severity */
  severity?: SuggestionSeverity;
}

/**
 * Suggestion filters for querying.
 *
 * @since 1.0.0
 */
export interface SuggestionFilters {
  /** Filter by suggestion type */
  type?: SuggestionType;
  /** Filter by status */
  status?: SuggestionStatus;
  /** Filter by severity */
  severity?: SuggestionSeverity;
  /** Filter by category */
  category?: string;
  /** Filter by rule ID */
  ruleId?: string;
  /** Filter by processed status */
  isProcessed?: boolean;
  /** Search term for explanation */
  search?: string;
  /** Sort field */
  sortBy?: 'createdAt' | 'confidence' | 'severity' | 'type';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Page number for pagination */
  page?: number;
  /** Number of items per page */
  limit?: number;
}

/**
 * Suggestion list response.
 *
 * @since 1.0.0
 */
export interface SuggestionListResponse {
  /** List of suggestions */
  suggestions: Suggestion[];
  /** Total number of suggestions matching filters */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages */
  hasMore: boolean;
  /** Statistics about the suggestions */
  stats: SuggestionStats;
}

/**
 * Bulk action request for suggestions.
 *
 * @since 1.0.0
 */
export interface BulkSuggestionAction {
  /** Action to perform */
  action: 'accept' | 'ignore' | 'dismiss';
  /** Array of suggestion IDs to process */
  suggestionIds: string[];
  /** Optional reason for the action */
  reason?: string;
}

/**
 * Grammar checking request.
 *
 * @since 1.0.0
 */
export interface GrammarCheckRequest {
  /** Text to check */
  text: string;
  /** Language code */
  language: string;
  /** Document ID for context */
  documentId?: string;
  /** Whether this is a manual check (bypasses length limits) */
  manual?: boolean;
  /** User preferences */
  preferences?: {
    /** Enable spelling check */
    enableSpellCheck?: boolean;
    /** Enable grammar check */
    enableGrammarCheck?: boolean;
    /** Enable style check */
    enableStyleCheck?: boolean;
    /** Custom dictionary words */
    customDictionary?: string[];
    /** Minimum confidence threshold */
    minConfidence?: number;
    /** Specific rules to enable */
    enabledRules?: string[];
    /** Specific rules to disable */
    disabledRules?: string[];
  };
}

/**
 * Grammar checking response.
 *
 * @since 1.0.0
 */
export interface GrammarCheckResponse {
  /** Whether the check was successful */
  success: boolean;
  /** Error message if check failed */
  error?: string;
  /** Array of raw suggestions */
  suggestions: RawSuggestion[];
  /** Language used for checking */
  language: string;
  /** Detected language information */
  detectedLanguage?: {
    name: string;
    code: string;
    confidence: number;
  };
  /** Statistics about the suggestions */
  stats?: {
    total: number;
    spelling: number;
    grammar: number;
    style: number;
    highSeverity: number;
  };
}

/**
 * Suggestion processing options.
 *
 * @since 1.0.0
 */
export interface SuggestionProcessingOptions {
  /** Whether to include AI suggestions */
  includeAI?: boolean;
  /** Minimum confidence threshold */
  minConfidence?: number;
  /** Maximum suggestions to return */
  maxSuggestions?: number;
  /** Whether to filter by severity */
  filterBySeverity?: SuggestionSeverity[];
  /** Custom processing rules */
  customRules?: {
    /** Words to ignore */
    ignoreWords?: string[];
    /** Rules to disable */
    disableRules?: string[];
  };
}

/**
 * Real-time suggestion checking options.
 *
 * @since 1.0.0
 */
export interface RealtimeCheckOptions {
  /** Whether to enable real-time checking */
  enabled: boolean;
  /** Debounce delay in milliseconds */
  debounceDelay: number;
  /** Minimum text length to trigger checking */
  minTextLength: number;
  /** Maximum text length to check */
  maxTextLength: number;
  /** Whether to check on content change */
  checkOnChange: boolean;
  /** Whether to check on blur */
  checkOnBlur: boolean;
  /** Whether to check on focus */
  checkOnFocus: boolean;
}

/**
 * Suggestion highlighting information for UI.
 *
 * @since 1.0.0
 */
export interface SuggestionHighlight {
  /** Suggestion ID */
  suggestionId: string;
  /** Type of suggestion */
  type: SuggestionType;
  /** Severity level */
  severity: SuggestionSeverity;
  /** Position in text */
  position: {
    start: number;
    end: number;
  };
  /** CSS class for highlighting */
  cssClass: string;
  /** Whether this suggestion is currently focused */
  isFocused: boolean;
  /** Whether this suggestion is being hovered */
  isHovered: boolean;
}

/**
 * Suggestion tooltip data for UI display.
 *
 * @since 1.0.0
 */
export interface SuggestionTooltip {
  /** Suggestion ID */
  suggestionId: string;
  /** Tooltip title */
  title: string;
  /** Tooltip description */
  description: string;
  /** Suggested correction */
  suggestion: string;
  /** Confidence level */
  confidence: number;
  /** Available actions */
  actions: Array<{
    /** Action type */
    type: 'accept' | 'ignore' | 'dismiss' | 'learn';
    /** Action label */
    label: string;
    /** Action icon */
    icon?: string;
    /** Whether action is primary */
    primary?: boolean;
  }>;
}

/**
 * Suggestion batch operation result.
 *
 * @since 1.0.0
 */
export interface SuggestionBatchResult {
  /** Number of suggestions processed */
  processed: number;
  /** Number of suggestions accepted */
  accepted: number;
  /** Number of suggestions ignored */
  ignored: number;
  /** Number of suggestions dismissed */
  dismissed: number;
  /** Array of suggestion IDs that were processed */
  suggestionIds: string[];
  /** Any errors that occurred during processing */
  errors: Array<{
    suggestionId: string;
    error: string;
  }>;
}

/**
 * Suggestion performance metrics.
 *
 * @since 1.0.0
 */
export interface SuggestionMetrics {
  /** Average response time for grammar checking */
  averageResponseTime: number;
  /** Number of grammar checks performed */
  totalChecks: number;
  /** Number of suggestions generated */
  totalSuggestions: number;
  /** Suggestion acceptance rate */
  acceptanceRate: number;
  /** Suggestion ignore rate */
  ignoreRate: number;
  /** Last check timestamp */
  lastCheckAt?: Timestamp;
  /** Performance over time */
  performanceHistory: Array<{
    timestamp: Timestamp;
    responseTime: number;
    suggestionCount: number;
  }>;
} 