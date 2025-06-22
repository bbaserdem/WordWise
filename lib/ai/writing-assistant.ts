/**
 * @fileoverview AI-powered writing assistant service.
 *
 * This service coordinates AI-powered writing suggestions by managing context,
 * filtering suggestions, and integrating with the existing suggestion system.
 * It provides intelligent writing assistance tailored to academic writing needs.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { generateAISuggestions, checkOpenAIService, type AISuggestionRequest, type AISuggestion } from './openai-service';
import type { Suggestion, RawSuggestion } from '@/types/suggestion';

/**
 * Writing context interface for AI suggestions.
 *
 * @since 1.0.0
 */
export interface WritingContext {
  /** Document type */
  documentType: 'dissertation' | 'research-paper' | 'thesis' | 'article' | 'general';
  /** Subject area */
  subject?: string;
  /** Academic level */
  academicLevel?: 'undergraduate' | 'graduate' | 'phd' | 'postdoc';
  /** Target audience */
  targetAudience?: string;
  /** Document title */
  title?: string;
  /** Current section */
  section?: string;
  /** Previous context for continuity */
  previousContext?: string;
  /** User's writing style preferences */
  writingStyle?: {
    formality: 'formal' | 'semi-formal' | 'informal';
    complexity: 'simple' | 'moderate' | 'complex';
    tone: 'objective' | 'analytical' | 'persuasive';
  };
}

/**
 * AI writing assistant request interface.
 *
 * @since 1.0.0
 */
export interface WritingAssistantRequest {
  /** Text to analyze */
  text: string;
  /** Writing context */
  context: WritingContext;
  /** User's writing goals */
  userGoals: string[];
  /** Types of suggestions to generate */
  suggestionTypes: Array<'style' | 'content' | 'structure' | 'improvement' | 'clarity'>;
  /** Maximum suggestions per type */
  maxSuggestionsPerType?: number;
  /** Minimum confidence threshold */
  minConfidence?: number;
  /** Whether to include explanations */
  includeExplanations?: boolean;
  /** Document ID for tracking */
  documentId?: string;
  /** User ID for personalization */
  userId?: string;
}

/**
 * AI writing assistant response interface.
 *
 * @since 1.0.0
 */
export interface WritingAssistantResponse {
  /** Whether the request was successful */
  success: boolean;
  /** Error message if request failed */
  error?: string;
  /** Generated suggestions organized by type */
  suggestions: {
    style: AISuggestion[];
    content: AISuggestion[];
    structure: AISuggestion[];
    improvement: AISuggestion[];
    clarity: AISuggestion[];
    all: AISuggestion[];
  };
  /** Processing statistics */
  stats: {
    totalSuggestions: number;
    processingTime: number;
    model: string;
    tokenUsage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
  /** Service status */
  serviceStatus: {
    aiAvailable: boolean;
    fallbackUsed: boolean;
  };
}

/**
 * Generate comprehensive AI writing suggestions.
 *
 * This function coordinates the generation of multiple types of AI suggestions
 * and integrates them with the existing suggestion system.
 *
 * @param request - Writing assistant request parameters
 * @returns Promise resolving to writing assistant response
 *
 * @example
 * ```typescript
 * const response = await generateWritingSuggestions({
 *   text: "The research findings indicate...",
 *   context: {
 *     documentType: 'research-paper',
 *     subject: 'Computer Science',
 *     academicLevel: 'phd'
 *   },
 *   userGoals: ['improve clarity', 'enhance academic tone'],
 *   suggestionTypes: ['style', 'clarity']
 * });
 * ```
 *
 * @since 1.0.0
 */
export async function generateWritingSuggestions(
  request: WritingAssistantRequest
): Promise<WritingAssistantResponse> {
  const startTime = Date.now();

  try {
    // Check if AI service is available
    const aiStatus = await checkOpenAIService();
    
    if (!aiStatus.available) {
      return {
        success: false,
        error: `AI service unavailable: ${aiStatus.error}`,
        suggestions: {
          style: [],
          content: [],
          structure: [],
          improvement: [],
          clarity: [],
          all: [],
        },
        stats: {
          totalSuggestions: 0,
          processingTime: Date.now() - startTime,
          model: aiStatus.model,
        },
        serviceStatus: {
          aiAvailable: false,
          fallbackUsed: true,
        },
      };
    }

    const {
      text,
      context,
      userGoals,
      suggestionTypes,
      maxSuggestionsPerType = 3,
      minConfidence = 0.6,
      includeExplanations = true,
    } = request;

    // Generate suggestions for each requested type
    const allSuggestions: AISuggestion[] = [];
    const suggestionsByType: Record<string, AISuggestion[]> = {
      style: [],
      content: [],
      structure: [],
      improvement: [],
      clarity: [],
    };

    let totalTokenUsage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    // Generate suggestions for each type
    for (const suggestionType of suggestionTypes) {
      const aiRequest: AISuggestionRequest = {
        text,
        context: {
          documentType: context.documentType,
          subject: context.subject,
          academicLevel: context.academicLevel,
          targetAudience: context.targetAudience,
        },
        userGoals,
        suggestionType,
        maxSuggestions: maxSuggestionsPerType,
        includeExplanations,
      };

      const aiResponse = await generateAISuggestions(aiRequest);

      if (aiResponse.success && aiResponse.suggestions.length > 0) {
        // Filter suggestions by confidence threshold
        const filteredSuggestions = aiResponse.suggestions.filter(
          suggestion => suggestion.confidence >= minConfidence
        );

        suggestionsByType[suggestionType] = filteredSuggestions;
        allSuggestions.push(...filteredSuggestions);

        // Accumulate token usage
        if (aiResponse.usage) {
          totalTokenUsage.promptTokens += aiResponse.usage.promptTokens;
          totalTokenUsage.completionTokens += aiResponse.usage.completionTokens;
          totalTokenUsage.totalTokens += aiResponse.usage.totalTokens;
        }
      }
    }

    // Deduplicate suggestions that target the same text segments
    const deduplicatedSuggestions = deduplicateAISuggestions(allSuggestions);

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      suggestions: {
        style: deduplicatedSuggestions.filter((s: AISuggestion) => s.type === 'style'),
        content: deduplicatedSuggestions.filter((s: AISuggestion) => s.type === 'content'),
        structure: deduplicatedSuggestions.filter((s: AISuggestion) => s.type === 'structure'),
        improvement: deduplicatedSuggestions.filter((s: AISuggestion) => s.type === 'improvement'),
        clarity: deduplicatedSuggestions.filter((s: AISuggestion) => s.type === 'clarity'),
        all: deduplicatedSuggestions,
      },
      stats: {
        totalSuggestions: deduplicatedSuggestions.length,
        processingTime,
        model: aiStatus.model,
        tokenUsage: totalTokenUsage.totalTokens > 0 ? totalTokenUsage : undefined,
      },
      serviceStatus: {
        aiAvailable: true,
        fallbackUsed: false,
      },
    };

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('[Writing Assistant] Error generating suggestions:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      suggestions: {
        style: [],
        content: [],
        structure: [],
        improvement: [],
        clarity: [],
        all: [],
      },
      stats: {
        totalSuggestions: 0,
        processingTime,
        model: 'unknown',
      },
      serviceStatus: {
        aiAvailable: false,
        fallbackUsed: true,
      },
    };
  }
}

/**
 * Deduplicate AI suggestions that target the same text segments.
 *
 * @param suggestions - Array of AI suggestions to deduplicate
 * @returns Deduplicated array of suggestions
 * @since 1.0.0
 */
function deduplicateAISuggestions(suggestions: AISuggestion[]): AISuggestion[] {
  const seen = new Map<string, AISuggestion>();
  
  // Sort suggestions by confidence (highest first) so we keep the best ones
  const sortedSuggestions = [...suggestions].sort((a, b) => b.confidence - a.confidence);
  
  for (const suggestion of sortedSuggestions) {
    // Check if this suggestion overlaps with any existing suggestion
    let hasOverlap = false;
    
    for (const [key, existingSuggestion] of seen.entries()) {
      // Check if the text segments overlap
      const overlap = checkTextOverlap(
        suggestion.position.start, 
        suggestion.position.end,
        existingSuggestion.position.start, 
        existingSuggestion.position.end
      );
      
      if (overlap > 0.5) { // If more than 50% overlap, consider it a duplicate
        hasOverlap = true;
        break;
      }
    }
    
    if (!hasOverlap) {
      // No significant overlap, add this suggestion
      const key = `${suggestion.original}-${suggestion.position.start}-${suggestion.position.end}`;
      seen.set(key, suggestion);
    }
  }
  
  return Array.from(seen.values());
}

/**
 * Check if two text segments overlap significantly.
 *
 * @param start1 - Start position of first segment
 * @param end1 - End position of first segment
 * @param start2 - Start position of second segment
 * @param end2 - End position of second segment
 * @returns Overlap ratio (0-1)
 * @since 1.0.0
 */
function checkTextOverlap(start1: number, end1: number, start2: number, end2: number): number {
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);
  
  if (overlapEnd <= overlapStart) {
    return 0; // No overlap
  }
  
  const overlapLength = overlapEnd - overlapStart;
  const segment1Length = end1 - start1;
  const segment2Length = end2 - start2;
  
  // Return the ratio of overlap to the shorter segment
  return overlapLength / Math.min(segment1Length, segment2Length);
}

/**
 * Convert AI suggestions to the standard suggestion format.
 *
 * @param aiSuggestions - AI suggestions to convert
 * @param documentId - Document ID
 * @param userId - User ID
 * @returns Array of standard suggestions
 * @since 1.0.0
 */
export function convertAISuggestionsToStandard(
  aiSuggestions: AISuggestion[],
  documentId: string,
  userId: string
): Suggestion[] {
  return aiSuggestions.map(aiSuggestion => ({
    id: aiSuggestion.id,
    documentId,
    userId,
    type: 'ai' as const,
    original: aiSuggestion.original,
    suggestion: aiSuggestion.suggestion,
    explanation: aiSuggestion.explanation,
    confidence: aiSuggestion.confidence,
    position: aiSuggestion.position,
    status: 'active' as const,
    severity: aiSuggestion.confidence > 0.8 ? 'high' : aiSuggestion.confidence > 0.6 ? 'medium' : 'low',
    ruleId: `ai_${aiSuggestion.type}`,
    category: aiSuggestion.category,
    isProcessed: false,
    createdAt: new Date() as any, // Will be converted to Firestore Timestamp
    updatedAt: new Date() as any, // Will be converted to Firestore Timestamp
  }));
}

/**
 * Convert AI suggestions to raw suggestion format.
 *
 * @param aiSuggestions - AI suggestions to convert
 * @returns Array of raw suggestions
 * @since 1.0.0
 */
export function convertAISuggestionsToRaw(
  aiSuggestions: AISuggestion[]
): RawSuggestion[] {
  return aiSuggestions.map(aiSuggestion => ({
    id: aiSuggestion.id,
    type: 'style' as const, // Map AI suggestions to style type
    original: aiSuggestion.original,
    suggestion: aiSuggestion.suggestion,
    explanation: aiSuggestion.explanation,
    shortMessage: aiSuggestion.reasoning,
    position: aiSuggestion.position,
    confidence: aiSuggestion.confidence,
    severity: aiSuggestion.confidence > 0.8 ? 'high' : aiSuggestion.confidence > 0.6 ? 'medium' : 'low',
    rule: {
      id: `ai_${aiSuggestion.type}`,
      name: `AI ${aiSuggestion.type} suggestion`,
      category: aiSuggestion.category,
      issueType: 'ai_suggestion',
    },
    context: {
      text: aiSuggestion.original,
      sentence: aiSuggestion.original,
    },
    replacements: [aiSuggestion.suggestion],
  }));
}

/**
 * Analyze writing context and extract relevant information.
 *
 * @param text - Text to analyze
 * @param context - Writing context
 * @returns Enhanced context with extracted information
 * @since 1.0.0
 */
export function analyzeWritingContext(
  text: string,
  context: WritingContext
): WritingContext & {
  extractedInfo: {
    complexity: 'simple' | 'moderate' | 'complex';
    formality: 'formal' | 'semi-formal' | 'informal';
    tone: 'objective' | 'analytical' | 'persuasive';
    keyTopics: string[];
    sentenceCount: number;
    wordCount: number;
  };
} {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  
  // Simple complexity analysis based on sentence length and vocabulary
  const avgSentenceLength = words.length / sentences.length;
  const complexity = avgSentenceLength > 25 ? 'complex' : avgSentenceLength > 15 ? 'moderate' : 'simple';
  
  // Simple formality analysis based on contractions and informal words
  const hasContractions = /\b(?:don't|can't|won't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|didn't|wouldn't|couldn't|shouldn't|mightn't|mustn't)\b/i.test(text);
  const formality = hasContractions ? 'semi-formal' : 'formal';
  
  // Simple tone analysis based on keywords
  const analyticalKeywords = ['analysis', 'examine', 'investigate', 'study', 'research', 'findings', 'results'];
  const persuasiveKeywords = ['should', 'must', 'need', 'important', 'crucial', 'essential', 'recommend'];
  
  const analyticalCount = analyticalKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;
  const persuasiveCount = persuasiveKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).length;
  
  const tone = analyticalCount > persuasiveCount ? 'analytical' : 
               persuasiveCount > analyticalCount ? 'persuasive' : 'objective';
  
  // Extract key topics (simple keyword extraction)
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can'];
  const keyTopics = words
    .map(word => word.toLowerCase().replace(/[^\w]/g, ''))
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 5);

  return {
    ...context,
    extractedInfo: {
      complexity,
      formality,
      tone,
      keyTopics,
      sentenceCount: sentences.length,
      wordCount: words.length,
    },
  };
}

/**
 * Get writing goals based on context and text analysis.
 *
 * @param context - Writing context
 * @param text - Text to analyze
 * @returns Suggested writing goals
 * @since 1.0.0
 */
export function getSuggestedWritingGoals(
  context: WritingContext,
  text: string
): string[] {
  const goals: string[] = [];
  const analyzedContext = analyzeWritingContext(text, context);

  // Add context-specific goals
  if (context.documentType === 'research-paper') {
    goals.push('enhance academic rigor', 'improve clarity of methodology');
  } else if (context.documentType === 'dissertation') {
    goals.push('strengthen argument structure', 'enhance scholarly tone');
  } else if (context.documentType === 'thesis') {
    goals.push('improve logical flow', 'enhance critical analysis');
  }

  // Add analysis-based goals
  if (analyzedContext.extractedInfo.complexity === 'complex') {
    goals.push('simplify complex sentences', 'improve readability');
  } else if (analyzedContext.extractedInfo.complexity === 'simple') {
    goals.push('enhance sophistication', 'add academic depth');
  }

  if (analyzedContext.extractedInfo.formality === 'semi-formal') {
    goals.push('increase formality', 'enhance academic tone');
  }

  if (analyzedContext.extractedInfo.tone === 'persuasive') {
    goals.push('strengthen evidence', 'improve argument structure');
  } else if (analyzedContext.extractedInfo.tone === 'objective') {
    goals.push('enhance analytical depth', 'improve critical analysis');
  }

  // Remove duplicates and return
  return [...new Set(goals)];
}

/**
 * Check if AI writing assistant is available.
 *
 * @returns Promise resolving to service availability
 * @since 1.0.0
 */
export async function isWritingAssistantAvailable(): Promise<{
  available: boolean;
  error?: string;
  model: string;
}> {
  return await checkOpenAIService();
} 