/**
 * @fileoverview Grammar checking service using LanguageTool HTTP API.
 *
 * This service provides grammar, spelling, and style checking functionality
 * by making HTTP requests to the LanguageTool API. It's designed for
 * serverless environments and provides real-time writing assistance.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { GrammarCheckRequest, GrammarCheckResponse, RawSuggestion } from '@/types/suggestion';

/**
 * LanguageTool API configuration and endpoints.
 *
 * @since 1.0.0
 */
const LANGUAGETOOL_CONFIG = {
  // Use the public LanguageTool API endpoint
  baseUrl: 'https://api.languagetool.org/v2/check',
  // Fallback to local server if available (for development)
  localUrl: 'http://localhost:8010/v2/check',
  // Default language
  defaultLanguage: 'en-US',
  // Request timeout in milliseconds (increased for manual checks)
  timeout: 30000, // 30 seconds for larger documents
  // Maximum text length for API requests
  maxTextLength: 10000,
} as const;

/**
 * LanguageTool API request parameters.
 *
 * @since 1.0.0
 */
interface LanguageToolRequest {
  text: string;
  language: string;
  enabledOnly?: boolean;
  level?: 'picky' | 'default';
  enabledRules?: string[];
  disabledRules?: string[];
}

/**
 * LanguageTool API response structure.
 *
 * @since 1.0.0
 */
interface LanguageToolResponse {
  software: {
    name: string;
    version: string;
    buildDate: string;
    apiVersion: number;
    status: string;
  };
  warnings: {
    incompleteResults: boolean;
  };
  language: {
    name: string;
    code: string;
    detectedLanguage: {
      name: string;
      code: string;
      confidence: number;
    };
  };
  matches: Array<{
    message: string;
    shortMessage: string;
    replacements: Array<{
      value: string;
    }>;
    offset: number;
    length: number;
    context: {
      text: string;
      offset: number;
      length: number;
    };
    sentence: string;
    type: {
      typeName: string;
    };
    rule: {
      id: string;
      name: string;
      description: string;
      issueType: string;
      category: {
        id: string;
        name: string;
      };
    };
    ignoreForIncompleteSentence: boolean;
    contextForSureMatch: number;
  }>;
}

/**
 * Convert LanguageTool API response to our internal format.
 *
 * @param ltResponse - Raw response from LanguageTool API
 * @param originalText - Original text that was checked
 * @returns Array of processed suggestions
 * @since 1.0.0
 */
function convertLanguageToolResponse(
  ltResponse: LanguageToolResponse,
  originalText: string
): RawSuggestion[] {
  return ltResponse.matches.map((match, index) => {
    // Determine suggestion type based on rule category
    let type: 'spelling' | 'grammar' | 'style' = 'grammar';
    if (match.rule.category.id === 'TYPOS') {
      type = 'spelling';
    } else if (match.rule.category.id === 'STYLE') {
      type = 'style';
    }

    // Calculate confidence based on rule type and context
    let confidence = 0.7; // Default confidence
    if (type === 'spelling') {
      confidence = 0.9; // Spelling errors are usually more certain
    } else if (match.rule.issueType === 'misspelling') {
      confidence = 0.95;
    } else if (match.rule.issueType === 'grammar') {
      confidence = 0.8;
    } else if (match.rule.issueType === 'style') {
      confidence = 0.6; // Style suggestions are more subjective
    }

    // Get the best replacement suggestion
    const bestReplacement = match.replacements.length > 0 
      ? match.replacements[0].value 
      : '';

    // Extract the original text that needs correction
    const original = originalText.substring(match.offset, match.offset + match.length);

    return {
      id: `lt_${match.rule.id}_${match.offset}_${index}`,
      type,
      original,
      suggestion: bestReplacement,
      explanation: match.message,
      shortMessage: match.shortMessage,
      position: {
        start: match.offset,
        end: match.offset + match.length,
      },
      confidence,
      severity: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low',
      rule: {
        id: match.rule.id,
        name: match.rule.name,
        category: match.rule.category.name,
        issueType: match.rule.issueType,
      },
      context: {
        text: match.context.text,
        sentence: match.sentence,
      },
      replacements: match.replacements.map(r => r.value),
    };
  });
}

/**
 * Make HTTP request to LanguageTool API with timeout and error handling.
 *
 * @param url - API endpoint URL
 * @param data - Request data
 * @param timeout - Request timeout in milliseconds (optional)
 * @returns Promise with API response
 * @since 1.0.0
 */
async function makeLanguageToolRequest(
  url: string,
  data: LanguageToolRequest,
  timeout?: number
): Promise<LanguageToolResponse> {
  const requestTimeout = timeout || LANGUAGETOOL_CONFIG.timeout;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

  try {
    // Create form data for the request
    const formData = new URLSearchParams();
    formData.append('text', data.text);
    formData.append('language', data.language);
    
    if (data.enabledOnly !== undefined) {
      formData.append('enabledOnly', data.enabledOnly.toString());
    }
    
    if (data.level) {
      formData.append('level', data.level);
    }
    
    if (data.enabledRules && data.enabledRules.length > 0) {
      formData.append('enabledRules', data.enabledRules.join(','));
    }
    
    if (data.disabledRules && data.disabledRules.length > 0) {
      formData.append('disabledRules', data.disabledRules.join(','));
    }

    console.log('[LanguageTool] Making request to:', url);
    console.log('[LanguageTool] Request data:', {
      text: data.text.substring(0, 50) + '...',
      language: data.language,
      enabledOnly: data.enabledOnly,
      level: data.level
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[LanguageTool] Response status:', response.status);
    console.log('[LanguageTool] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[LanguageTool] Error response body:', errorText);
      throw new Error(`LanguageTool API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('[LanguageTool] Response data keys:', Object.keys(responseData));
    
    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('LanguageTool API request timed out');
      }
      throw error;
    }
    
    throw new Error('Unknown error occurred while checking grammar');
  }
}

/**
 * Check grammar using LanguageTool HTTP API.
 *
 * This function sends text to the LanguageTool API for grammar, spelling,
 * and style checking. It handles both public and local API endpoints
 * with proper error handling and response processing.
 *
 * @param request - Grammar check request with text and preferences
 * @returns Promise with grammar check results
 *
 * @example
 * ```typescript
 * const result = await checkGrammar({
 *   text: 'This is a test sentence with some errors.',
 *   language: 'en-US',
 *   preferences: {
 *     enableSpellCheck: true,
 *     enableGrammarCheck: true
 *   }
 * });
 * ```
 *
 * @throws {Error} When API request fails or response is invalid
 * @since 1.0.0
 */
export async function checkGrammar(request: GrammarCheckRequest): Promise<GrammarCheckResponse> {
  try {
    const { text, language, preferences, manual } = request;

    // Validate input
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        error: 'Text is required for grammar checking',
        suggestions: [],
        language: language || LANGUAGETOOL_CONFIG.defaultLanguage,
      };
    }

    // For manual checks, allow longer texts (up to 50,000 characters)
    const maxLength = manual ? 50000 : LANGUAGETOOL_CONFIG.maxTextLength;
    if (text.length > maxLength) {
      return {
        success: false,
        error: `Text too long. Maximum ${maxLength.toLocaleString()} characters allowed for ${manual ? 'manual' : 'real-time'} checking`,
        suggestions: [],
        language: language || LANGUAGETOOL_CONFIG.defaultLanguage,
      };
    }

    // Prepare API request
    const apiRequest: LanguageToolRequest = {
      text: text.trim(),
      language: language || LANGUAGETOOL_CONFIG.defaultLanguage,
      enabledOnly: false,
      level: 'default',
    };

    // Add rule preferences if specified
    if (preferences?.enabledRules && preferences.enabledRules.length > 0) {
      apiRequest.enabledRules = preferences.enabledRules;
    }

    if (preferences?.disabledRules && preferences.disabledRules.length > 0) {
      apiRequest.disabledRules = preferences.disabledRules;
    }

    // Use public API directly (no local server)
    // Use longer timeout for manual checks with large documents
    const timeout = manual ? 60000 : LANGUAGETOOL_CONFIG.timeout; // 60 seconds for manual, 30 for real-time
    const ltResponse = await makeLanguageToolRequest(LANGUAGETOOL_CONFIG.baseUrl, apiRequest, timeout);

    // Convert response to our internal format
    const suggestions = convertLanguageToolResponse(ltResponse, text);

    // Filter suggestions based on preferences
    const filteredSuggestions = suggestions.filter(suggestion => {
      if (preferences?.enableSpellCheck === false && suggestion.type === 'spelling') {
        return false;
      }
      if (preferences?.enableGrammarCheck === false && suggestion.type === 'grammar') {
        return false;
      }
      if (preferences?.enableStyleCheck === false && suggestion.type === 'style') {
        return false;
      }
      if (preferences?.minConfidence && suggestion.confidence < preferences.minConfidence) {
        return false;
      }
      return true;
    });

    return {
      success: true,
      suggestions: filteredSuggestions,
      language: ltResponse.language.code,
      detectedLanguage: ltResponse.language.detectedLanguage,
      stats: {
        total: filteredSuggestions.length,
        spelling: filteredSuggestions.filter(s => s.type === 'spelling').length,
        grammar: filteredSuggestions.filter(s => s.type === 'grammar').length,
        style: filteredSuggestions.filter(s => s.type === 'style').length,
        highSeverity: filteredSuggestions.filter(s => s.severity === 'high').length,
      },
    };

  } catch (error) {
    console.error('Grammar check error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      suggestions: [],
      language: request.language || LANGUAGETOOL_CONFIG.defaultLanguage,
    };
  }
}

/**
 * Get LanguageTool service status and health information.
 *
 * @returns Promise with service status
 * @since 1.0.0
 */
export async function getLanguageToolStatus(): Promise<{
  success: boolean;
  status: 'healthy' | 'unhealthy' | 'unknown';
  message: string;
  timestamp: string;
}> {
  try {
    const response = await fetch(`${LANGUAGETOOL_CONFIG.baseUrl}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: 'test',
        language: 'en-US',
      }),
    });

    if (response.ok) {
      return {
        success: true,
        status: 'healthy',
        message: 'LanguageTool API is responding correctly',
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        success: false,
        status: 'unhealthy',
        message: `LanguageTool API returned status ${response.status}`,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
} 