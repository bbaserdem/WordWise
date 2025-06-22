/**
 * @fileoverview AI-powered suggestion generator for writing assistance.
 *
 * This module integrates AI-powered writing suggestions with the existing
 * suggestion system, providing context-aware improvements and intelligent
 * writing assistance. It coordinates between AI services and the standard
 * suggestion pipeline.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { 
  generateWritingSuggestions, 
  convertAISuggestionsToRaw,
  convertAISuggestionsToStandard,
  type WritingContext,
  type WritingAssistantRequest 
} from '@/lib/ai/writing-assistant';
import { processSuggestions } from './suggestion-processor';
import type { 
  GrammarCheckRequest, 
  GrammarCheckResponse, 
  RawSuggestion, 
  ProcessedSuggestions,
  SuggestionProcessingOptions 
} from '@/types/suggestion';

/**
 * AI suggestion generation request interface.
 *
 * @since 1.0.0
 */
export interface AISuggestionGenerationRequest extends GrammarCheckRequest {
  /** Writing context for AI suggestions */
  writingContext?: WritingContext;
  /** User's writing goals */
  userGoals?: string[];
  /** Types of AI suggestions to generate */
  aiSuggestionTypes?: Array<'style' | 'content' | 'structure' | 'improvement' | 'clarity'>;
  /** Whether to include AI suggestions */
  includeAI?: boolean;
  /** Minimum confidence for AI suggestions */
  aiMinConfidence?: number;
  /** Maximum AI suggestions per type */
  maxAISuggestionsPerType?: number;
}

/**
 * AI suggestion generation response interface.
 *
 * @since 1.0.0
 */
export interface AISuggestionGenerationResponse {
  /** Whether the generation was successful */
  success: boolean;
  /** Error message if generation failed */
  error?: string;
  /** Processed suggestions including AI suggestions */
  suggestions: ProcessedSuggestions;
  /** AI-specific statistics */
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
  /** Service status information */
  serviceStatus: {
    grammarServiceAvailable: boolean;
    aiServiceAvailable: boolean;
    fallbackUsed: boolean;
  };
}

/**
 * Generate AI-powered writing suggestions.
 *
 * This function generates AI suggestions for the given text and integrates
 * them with the existing grammar checking system. It provides comprehensive
 * writing assistance by combining rule-based and AI-powered suggestions.
 *
 * @param request - AI suggestion generation request
 * @returns Promise resolving to AI suggestion generation response
 *
 * @example
 * ```typescript
 * const response = await generateAISuggestions({
 *   text: "The research findings indicate...",
 *   language: 'en-US',
 *   documentId: 'doc123',
 *   writingContext: {
 *     documentType: 'research-paper',
 *     subject: 'Computer Science',
 *     academicLevel: 'phd'
 *   },
 *   userGoals: ['improve clarity', 'enhance academic tone'],
 *   aiSuggestionTypes: ['style', 'clarity'],
 *   includeAI: true
 * });
 * ```
 *
 * @since 1.0.0
 */
export async function generateAISuggestions(
  request: AISuggestionGenerationRequest
): Promise<AISuggestionGenerationResponse> {
  const startTime = Date.now();

  try {
    const {
      text,
      language,
      documentId,
      writingContext,
      userGoals = [],
      aiSuggestionTypes = ['style', 'clarity'],
      includeAI = true,
      aiMinConfidence = 0.6,
      maxAISuggestionsPerType = 3,
      preferences,
    } = request;

    // Initialize response structure
    const allRawSuggestions: RawSuggestion[] = [];
    let aiStats: AISuggestionGenerationResponse['aiStats'] | undefined;
    let aiServiceAvailable = false;
    let fallbackUsed = false;

    // Generate AI suggestions if requested and context is available
    if (includeAI && writingContext && text.length > 10) {
      try {
        const aiRequest: WritingAssistantRequest = {
          text,
          context: writingContext,
          userGoals: userGoals.length > 0 ? userGoals : getDefaultWritingGoals(writingContext),
          suggestionTypes: aiSuggestionTypes,
          maxSuggestionsPerType: maxAISuggestionsPerType,
          minConfidence: aiMinConfidence,
          includeExplanations: true,
          documentId,
          userId: 'system', // Will be replaced with actual user ID in production
        };

        const aiResponse = await generateWritingSuggestions(aiRequest);

        if (aiResponse.success && aiResponse.suggestions.all.length > 0) {
          // Convert AI suggestions to raw format
          const aiRawSuggestions = convertAISuggestionsToRaw(aiResponse.suggestions.all);
          allRawSuggestions.push(...aiRawSuggestions);

          // Set AI statistics
          aiStats = {
            totalAISuggestions: aiResponse.suggestions.all.length,
            aiProcessingTime: aiResponse.stats.processingTime,
            aiModel: aiResponse.stats.model,
            tokenUsage: aiResponse.stats.tokenUsage,
          };

          aiServiceAvailable = true;
        } else {
          console.warn('[AI Suggestions] AI service returned no suggestions:', aiResponse.error);
          fallbackUsed = true;
        }
      } catch (error) {
        console.error('[AI Suggestions] Error generating AI suggestions:', error);
        fallbackUsed = true;
      }
    }

    // Process all suggestions through the standard pipeline
    const processingOptions: SuggestionProcessingOptions = {
      includeAI: true, // AI suggestions are already included in raw suggestions
      minConfidence: Math.min(aiMinConfidence, preferences?.minConfidence || 0.5),
      maxSuggestions: 50 + (aiStats?.totalAISuggestions || 0), // Use default 50 + AI suggestions
      filterBySeverity: ['low', 'medium', 'high', 'critical'],
    };

    const processedSuggestions = processSuggestions(
      allRawSuggestions,
      documentId || 'temp',
      'system', // Will be replaced with actual user ID in production
      processingOptions
    );

    const totalProcessingTime = Date.now() - startTime;

    return {
      success: true,
      suggestions: processedSuggestions,
      aiStats,
      serviceStatus: {
        grammarServiceAvailable: true, // Grammar service is always available
        aiServiceAvailable,
        fallbackUsed,
      },
    };

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('[AI Suggestions] Error in suggestion generation:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
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
      serviceStatus: {
        grammarServiceAvailable: false,
        aiServiceAvailable: false,
        fallbackUsed: true,
      },
    };
  }
}

/**
 * Get default writing goals based on context.
 *
 * @param context - Writing context
 * @returns Array of default writing goals
 * @since 1.0.0
 */
function getDefaultWritingGoals(context: WritingContext): string[] {
  const goals: string[] = [];

  // Add context-specific goals
  switch (context.documentType) {
    case 'research-paper':
      goals.push('enhance academic rigor', 'improve clarity of methodology', 'strengthen evidence presentation');
      break;
    case 'dissertation':
      goals.push('strengthen argument structure', 'enhance scholarly tone', 'improve logical flow');
      break;
    case 'thesis':
      goals.push('improve logical flow', 'enhance critical analysis', 'strengthen conclusions');
      break;
    case 'article':
      goals.push('improve readability', 'enhance engagement', 'clarify key points');
      break;
    default:
      goals.push('improve clarity', 'enhance writing quality', 'strengthen arguments');
  }

  // Add academic level specific goals
  if (context.academicLevel === 'phd' || context.academicLevel === 'postdoc') {
    goals.push('enhance scholarly sophistication', 'improve theoretical framework');
  } else if (context.academicLevel === 'graduate') {
    goals.push('improve academic writing skills', 'enhance analytical depth');
  }

  return goals;
}

/**
 * Generate context-aware AI suggestions for a specific text segment.
 *
 * This function generates AI suggestions for a specific part of the text,
 * taking into account the surrounding context and document structure.
 *
 * @param text - Text to analyze
 * @param context - Writing context
 * @param segment - Specific text segment to focus on
 * @param userGoals - User's writing goals
 * @returns Promise resolving to AI suggestions for the segment
 * @since 1.0.0
 */
export async function generateSegmentAISuggestions(
  text: string,
  context: WritingContext,
  segment: string,
  userGoals: string[] = []
): Promise<AISuggestionGenerationResponse> {
  // Find the segment in the full text
  const segmentStart = text.indexOf(segment);
  if (segmentStart === -1) {
    return {
      success: false,
      error: 'Text segment not found in the provided text',
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
      serviceStatus: {
        grammarServiceAvailable: false,
        aiServiceAvailable: false,
        fallbackUsed: false,
      },
    };
  }

  // Create context with segment information
  const enhancedContext: WritingContext = {
    ...context,
    previousContext: text.substring(Math.max(0, segmentStart - 200), segmentStart),
  };

  // Generate suggestions for the segment
  return generateAISuggestions({
    text: segment,
    language: 'en-US',
    writingContext: enhancedContext,
    userGoals: userGoals.length > 0 ? userGoals : getDefaultWritingGoals(enhancedContext),
    aiSuggestionTypes: ['style', 'clarity', 'improvement'],
    includeAI: true,
    aiMinConfidence: 0.7,
    maxAISuggestionsPerType: 2,
  });
}

/**
 * Check if AI suggestion generation is available.
 *
 * @returns Promise resolving to service availability
 * @since 1.0.0
 */
export async function isAISuggestionGenerationAvailable(): Promise<{
  available: boolean;
  error?: string;
  model: string;
}> {
  try {
    const { isWritingAssistantAvailable } = await import('@/lib/ai/writing-assistant');
    return await isWritingAssistantAvailable();
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      model: 'unknown',
    };
  }
}

/**
 * Get AI suggestion generation statistics.
 *
 * @returns Promise resolving to generation statistics
 * @since 1.0.0
 */
export async function getAISuggestionGenerationStats(): Promise<{
  totalGenerations: number;
  averageProcessingTime: number;
  successRate: number;
  mostCommonSuggestionTypes: string[];
  model: string;
}> {
  // This would typically fetch from a database or analytics service
  // For now, return mock data
  return {
    totalGenerations: 0,
    averageProcessingTime: 0,
    successRate: 0,
    mostCommonSuggestionTypes: [],
    model: 'gpt-4',
  };
} 