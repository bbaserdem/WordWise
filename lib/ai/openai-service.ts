/**
 * @fileoverview OpenAI service for AI-powered writing assistance.
 *
 * This service provides a clean interface for interacting with OpenAI's GPT models
 * to generate writing suggestions, improvements, and analysis. It includes proper
 * error handling, rate limiting, and response processing.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import OpenAI from 'openai';
import type { 
  ChatCompletionCreateParams, 
  ChatCompletionMessageParam,
  ChatCompletionChunk 
} from 'openai/resources/chat/completions';

/**
 * OpenAI service configuration.
 *
 * @since 1.0.0
 */
const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
} as const;

/**
 * OpenAI client instance.
 *
 * @since 1.0.0
 */
let openaiClient: OpenAI | null = null;

/**
 * Initialize OpenAI client.
 *
 * @returns OpenAI client instance
 * @throws Error if API key is not configured
 * @since 1.0.0
 */
function getOpenAIClient(): OpenAI {
  if (!OPENAI_CONFIG.apiKey) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: OPENAI_CONFIG.apiKey,
      timeout: OPENAI_CONFIG.timeout,
      maxRetries: OPENAI_CONFIG.retries,
    });
  }

  return openaiClient;
}

/**
 * AI suggestion request interface.
 *
 * @since 1.0.0
 */
export interface AISuggestionRequest {
  /** Text to analyze and improve */
  text: string;
  /** Document context for better suggestions */
  context: {
    documentType: 'dissertation' | 'research-paper' | 'thesis' | 'article' | 'general';
    subject?: string;
    academicLevel?: 'undergraduate' | 'graduate' | 'phd' | 'postdoc';
    targetAudience?: string;
  };
  /** User's writing goals and preferences */
  userGoals: string[];
  /** Type of suggestion to generate */
  suggestionType: 'style' | 'content' | 'structure' | 'improvement' | 'clarity';
  /** Maximum number of suggestions to generate */
  maxSuggestions?: number;
  /** Whether to include explanations */
  includeExplanations?: boolean;
}

/**
 * AI suggestion response interface.
 *
 * @since 1.0.0
 */
export interface AISuggestionResponse {
  /** Whether the request was successful */
  success: boolean;
  /** Error message if request failed */
  error?: string;
  /** Generated suggestions */
  suggestions: AISuggestion[];
  /** Processing time in milliseconds */
  processingTime: number;
  /** Model used for generation */
  model: string;
  /** Token usage information */
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Individual AI suggestion interface.
 *
 * @since 1.0.0
 */
export interface AISuggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** Type of suggestion */
  type: 'style' | 'content' | 'structure' | 'improvement' | 'clarity';
  /** Original text that needs improvement */
  original: string;
  /** Suggested improvement */
  suggestion: string;
  /** Detailed explanation of the suggestion */
  explanation: string;
  /** Confidence level (0-1) */
  confidence: number;
  /** Position in the original text */
  position: {
    start: number;
    end: number;
  };
  /** Category of the suggestion */
  category: string;
  /** Reasoning behind the suggestion */
  reasoning: string;
  /** Whether this is a major improvement */
  isMajorImprovement: boolean;
}

/**
 * Generate AI-powered writing suggestions.
 *
 * This function sends a request to OpenAI's GPT model to generate
 * context-aware writing suggestions based on the provided text and context.
 *
 * @param request - AI suggestion request parameters
 * @returns Promise resolving to AI suggestion response
 *
 * @example
 * ```typescript
 * const response = await generateAISuggestions({
 *   text: "The data shows that...",
 *   context: {
 *     documentType: 'research-paper',
 *     subject: 'Computer Science',
 *     academicLevel: 'phd'
 *   },
 *   userGoals: ['improve clarity', 'enhance academic tone'],
 *   suggestionType: 'style'
 * });
 * ```
 *
 * @since 1.0.0
 */
export async function generateAISuggestions(
  request: AISuggestionRequest
): Promise<AISuggestionResponse> {
  const startTime = Date.now();

  try {
    const client = getOpenAIClient();
    
    // Build the prompt based on request parameters
    const prompt = buildAIPrompt(request);
    
    // Prepare messages for the chat completion
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: prompt.systemPrompt
      },
      {
        role: 'user',
        content: prompt.userPrompt
      }
    ];

    // Prepare completion parameters
    const completionParams: ChatCompletionCreateParams = {
      model: OPENAI_CONFIG.model,
      messages,
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: OPENAI_CONFIG.temperature,
    };

    // Make the API call
    const completion = await client.chat.completions.create(completionParams);
    
    const processingTime = Date.now() - startTime;

    // Parse the response
    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response content received from OpenAI');
    }

    const parsedResponse = JSON.parse(responseContent);
    const suggestions = parseAISuggestions(parsedResponse, request.text);

    return {
      success: true,
      suggestions,
      processingTime,
      model: OPENAI_CONFIG.model,
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
      } : undefined,
    };

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('[AI] OpenAI API error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      suggestions: [],
      processingTime,
      model: OPENAI_CONFIG.model,
    };
  }
}

/**
 * Build AI prompt based on request parameters.
 *
 * @param request - AI suggestion request
 * @returns Structured prompt with system and user messages
 * @since 1.0.0
 */
function buildAIPrompt(request: AISuggestionRequest): {
  systemPrompt: string;
  userPrompt: string;
} {
  const { text, context, userGoals, suggestionType, maxSuggestions = 5, includeExplanations = true } = request;

  const systemPrompt = `You are an expert academic writing assistant specializing in ${context.documentType} writing. Your role is to provide high-quality, context-aware suggestions for improving academic writing.

Key Guidelines:
- Focus on ${suggestionType} improvements
- Maintain academic tone and rigor
- Consider the document type: ${context.documentType}
- Target audience: ${context.targetAudience || 'academic peers'}
- Academic level: ${context.academicLevel || 'graduate'}
- Subject area: ${context.subject || 'general'}

User Goals: ${userGoals.join(', ')}

Provide exactly ${maxSuggestions} suggestions in JSON format with the following structure:
{
  "suggestions": [
    {
      "type": "${suggestionType}",
      "original": "exact text from input that needs improvement",
      "suggestion": "ONLY the corrected/improved text (no explanations, no meta-commentary)",
      "explanation": "${includeExplanations ? 'detailed explanation of the improvement' : 'brief explanation'}",
      "confidence": 0.0-1.0,
      "category": "specific category",
      "reasoning": "why this improvement helps",
      "isMajorImprovement": true/false
    }
  ]
}

IMPORTANT: The "suggestion" field must contain ONLY the corrected text, not explanations or commentary. The suggestion should be a direct replacement for the original text.

Ensure all suggestions are actionable and specific to the provided text.`;

  const userPrompt = `Please analyze the following text and provide ${suggestionType} suggestions:

"${text}"

Focus on the user's goals: ${userGoals.join(', ')}.

Remember: The "suggestion" field should contain ONLY the corrected text, not explanations or commentary.`;

  return { systemPrompt, userPrompt };
}

/**
 * Parse AI suggestions from OpenAI response.
 *
 * @param parsedResponse - Parsed JSON response from OpenAI
 * @param originalText - Original text that was analyzed
 * @returns Array of structured AI suggestions
 * @since 1.0.0
 */
function parseAISuggestions(
  parsedResponse: any, 
  originalText: string
): AISuggestion[] {
  const suggestions = parsedResponse.suggestions || [];
  
  return suggestions.map((suggestion: any, index: number) => {
    // Clean up the suggestion text - remove any explanations or meta-commentary
    let cleanSuggestion = suggestion.suggestion || '';
    
    // Remove common explanation patterns that might be in the suggestion field
    const explanationPatterns = [
      /^Consider the sentence,?\s*['"`](.*?)['"`]\.?$/i,
      /^The sentence ['"`](.*?)['"`] is suggested\.?$/i,
      /^Here's the corrected version:?\s*['"`](.*?)['"`]\.?$/i,
      /^The corrected text is:?\s*['"`](.*?)['"`]\.?$/i,
      /^Suggested revision:?\s*['"`](.*?)['"`]\.?$/i,
    ];
    
    // Try to extract just the corrected text from explanation patterns
    for (const pattern of explanationPatterns) {
      const match = cleanSuggestion.match(pattern);
      if (match && match[1]) {
        cleanSuggestion = match[1].trim();
        break;
      }
    }
    
    // If the suggestion is still too long or contains meta-commentary, try to extract just the corrected part
    if (cleanSuggestion.length > 200 || cleanSuggestion.includes('Consider') || cleanSuggestion.includes('suggested')) {
      // Look for quoted text that might be the actual suggestion
      const quotedMatch = cleanSuggestion.match(/['"`]([^'"`]+)['"`]/);
      if (quotedMatch && quotedMatch[1]) {
        cleanSuggestion = quotedMatch[1].trim();
      }
    }
    
    // Find the position of the original text in the full text
    const position = findTextPosition(originalText, suggestion.original || '');
    
    return {
      id: `ai_${Date.now()}_${index}`,
      type: suggestion.type || 'improvement',
      original: suggestion.original || '',
      suggestion: cleanSuggestion,
      explanation: suggestion.explanation || '',
      confidence: suggestion.confidence || 0.8,
      position: position,
      category: suggestion.category || 'general',
      reasoning: suggestion.reasoning || '',
      isMajorImprovement: suggestion.isMajorImprovement || false,
    };
  });
}

/**
 * Find the position of a text segment within the full text.
 *
 * @param fullText - Complete text
 * @param segment - Text segment to find
 * @returns Position object with start and end indices
 * @since 1.0.0
 */
function findTextPosition(fullText: string, segment: string): { start: number; end: number } {
  const start = fullText.indexOf(segment);
  if (start === -1) {
    // If exact match not found, return position for the entire text
    return { start: 0, end: fullText.length };
  }
  return { start, end: start + segment.length };
}

/**
 * Check if OpenAI service is available and configured.
 *
 * @returns Promise resolving to service status
 * @since 1.0.0
 */
export async function checkOpenAIService(): Promise<{
  available: boolean;
  error?: string;
  model: string;
}> {
  try {
    const client = getOpenAIClient();
    
    // Make a simple test request
    const response = await client.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10,
    });

    return {
      available: true,
      model: OPENAI_CONFIG.model,
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      model: OPENAI_CONFIG.model,
    };
  }
}

/**
 * Get OpenAI service configuration.
 *
 * @returns Current configuration (without sensitive data)
 * @since 1.0.0
 */
export function getOpenAIConfig(): {
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
} {
  return {
    model: OPENAI_CONFIG.model,
    maxTokens: OPENAI_CONFIG.maxTokens,
    temperature: OPENAI_CONFIG.temperature,
    timeout: OPENAI_CONFIG.timeout,
    retries: OPENAI_CONFIG.retries,
  };
} 