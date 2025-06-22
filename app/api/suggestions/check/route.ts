/**
 * @fileoverview API route for real-time grammar and spell checking.
 *
 * This route provides grammar, spelling, and style checking functionality
 * using LanguageTool. It processes text and returns structured suggestions
 * for improving writing quality with performance optimization for real-time use.
 * Now includes AI-powered writing suggestions for enhanced assistance.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkGrammar } from '@/lib/suggestions/grammar-checker';
import { processSuggestions } from '@/lib/suggestions/suggestion-processor';
import { generateAISuggestions } from '@/lib/suggestions/ai-suggestion-generator';
import type { GrammarCheckRequest, ProcessedSuggestions } from '@/types/suggestion';
import type { AISuggestionGenerationRequest } from '@/lib/suggestions/ai-suggestion-generator';

/**
 * Validate grammar check request data.
 *
 * @param request - The grammar check request to validate
 * @returns Validation result with error message if invalid
 * @since 1.0.0
 */
function validateGrammarCheckRequest(request: GrammarCheckRequest): { isValid: boolean; error?: string } {
  if (!request.text || request.text.trim().length === 0) {
    return { isValid: false, error: 'Text is required' };
  }

  // For manual checks, allow longer texts (up to 50,000 characters)
  const maxLength = request.manual ? 50000 : 10000;
  if (request.text.length > maxLength) {
    return { 
      isValid: false, 
      error: `Text too long. Maximum ${maxLength.toLocaleString()} characters for ${request.manual ? 'manual' : 'real-time'} checking` 
    };
  }

  if (!request.language || request.language.trim().length === 0) {
    return { isValid: false, error: 'Language is required' };
  }

  return { isValid: true };
}

/**
 * POST handler for grammar checking requests.
 *
 * This endpoint processes text for grammar, spelling, and style issues
 * and returns structured suggestions. It's optimized for real-time use
 * with performance constraints and error handling. Now includes AI-powered
 * suggestions for enhanced writing assistance.
 *
 * @param request - Next.js request object
 * @returns Next.js response with grammar check results
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/suggestions/check', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     text: 'This is a test sentence with some errors.',
 *     language: 'en-US',
 *     preferences: {
 *       enableSpellCheck: true,
 *       enableGrammarCheck: true
 *     },
 *     // New AI options
 *     includeAI: true,
 *     writingContext: {
 *       documentType: 'research-paper',
 *       subject: 'Computer Science'
 *     },
 *     userGoals: ['improve clarity', 'enhance academic tone']
 *   })
 * });
 * ```
 *
 * @since 1.0.0
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Parse request body
    const body = await request.json();
    console.log('[API] /api/suggestions/check POST body:', body);
    const grammarRequest: GrammarCheckRequest = body;

    // Validate request
    const validation = validateGrammarCheckRequest(grammarRequest);
    if (!validation.isValid) {
      console.log('[API] Validation failed:', validation.error);
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          processingTime: Date.now() - startTime 
        },
        { status: 400 }
      );
    }

    // Check if AI suggestions are requested
    const includeAI = (body as any).includeAI === true;
    const writingContext = (body as any).writingContext;
    const userGoals = (body as any).userGoals || [];
    const aiSuggestionTypes = (body as any).aiSuggestionTypes || ['style', 'clarity'];

    let processedSuggestions: ProcessedSuggestions;
    let aiStats: any = undefined;

    if (includeAI && writingContext) {
      // Use AI-enhanced suggestion generation
      const aiRequest: AISuggestionGenerationRequest = {
        ...grammarRequest,
        writingContext,
        userGoals,
        aiSuggestionTypes,
        includeAI: true,
        aiMinConfidence: 0.6,
        maxAISuggestionsPerType: 3,
      };

      const aiResponse = await generateAISuggestions(aiRequest);
      
      if (aiResponse.success) {
        processedSuggestions = aiResponse.suggestions;
        aiStats = aiResponse.aiStats;
      } else {
        console.log('[API] AI suggestions failed, falling back to grammar-only:', aiResponse.error);
        // Fallback to grammar-only suggestions
        const grammarResponse = await checkGrammar(grammarRequest);
        
        if (!grammarResponse.success) {
          console.log('[API] Grammar check failed:', grammarResponse.error);
          return NextResponse.json(
            { 
              success: false, 
              error: grammarResponse.error || 'Grammar check failed',
              processingTime: Date.now() - startTime 
            },
            { status: 500 }
          );
        }

        processedSuggestions = processSuggestions(
          grammarResponse.suggestions,
          grammarRequest.documentId || 'temp',
          'system', // Will be replaced with actual user ID in production
          {
            minConfidence: 0.5,
            maxSuggestions: 50,
            filterBySeverity: ['low', 'medium', 'high', 'critical'],
          }
        );
      }
    } else {
      // Use traditional grammar-only checking
      const grammarResponse = await checkGrammar(grammarRequest);
      console.log('[API] Grammar check response:', grammarResponse);

      if (!grammarResponse.success) {
        console.log('[API] Grammar check failed:', grammarResponse.error);
        return NextResponse.json(
          { 
            success: false, 
            error: grammarResponse.error || 'Grammar check failed',
            processingTime: Date.now() - startTime 
          },
          { status: 500 }
        );
      }

      processedSuggestions = processSuggestions(
        grammarResponse.suggestions,
        grammarRequest.documentId || 'temp',
        'system', // Will be replaced with actual user ID in production
        {
          minConfidence: 0.5,
          maxSuggestions: 50, // Limit for real-time performance
          filterBySeverity: ['low', 'medium', 'high', 'critical'],
        }
      );
    }

    const processingTime = Date.now() - startTime;

    // Return success response
    console.log('[API] Returning suggestions:', processedSuggestions);
    return NextResponse.json({
      success: true,
      suggestions: processedSuggestions,
      language: grammarRequest.language,
      processingTime,
      aiStats,
      stats: {
        totalSuggestions: processedSuggestions.stats.total,
        spellingSuggestions: processedSuggestions.stats.spelling,
        grammarSuggestions: processedSuggestions.stats.grammar,
        styleSuggestions: processedSuggestions.stats.style,
        aiSuggestions: processedSuggestions.stats.ai,
        highSeveritySuggestions: processedSuggestions.stats.highSeverity,
      },
    });

  } catch (error) {
    console.error('[API] Grammar check API error:', error);
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        processingTime 
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for health check and service status.
 *
 * @param request - Next.js request object
 * @returns Next.js response with service status
 * @since 1.0.0
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const healthCheck = url.searchParams.get('health');

    if (healthCheck === 'true') {
      return NextResponse.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Grammar checking API is available',
      endpoints: {
        'POST /api/suggestions/check': 'Check text for grammar and spelling issues',
        'GET /api/suggestions/check?health=true': 'Health check',
        'POST /api/suggestions/ai': 'Generate AI writing suggestions',
        'GET /api/suggestions/ai?health=true': 'AI service health check',
      },
      features: {
        grammarChecking: true,
        spellChecking: true,
        styleChecking: true,
        aiSuggestions: true,
        realTimeProcessing: true,
      },
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Service unavailable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
} 