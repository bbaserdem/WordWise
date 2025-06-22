/**
 * @fileoverview API route for AI-powered writing suggestions.
 *
 * This route provides AI-powered writing suggestions using OpenAI's GPT models.
 * It integrates with the existing suggestion system to provide comprehensive
 * writing assistance with context-aware improvements.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAISuggestions } from '@/lib/suggestions/ai-suggestion-generator';
import { isAISuggestionGenerationAvailable } from '@/lib/suggestions/ai-suggestion-generator';
import type { AISuggestionGenerationRequest } from '@/lib/suggestions/ai-suggestion-generator';

/**
 * Validate AI suggestion request data.
 *
 * @param request - The AI suggestion request to validate
 * @returns Validation result with error message if invalid
 * @since 1.0.0
 */
function validateAISuggestionRequest(request: AISuggestionGenerationRequest): { isValid: boolean; error?: string } {
  if (!request.text || request.text.trim().length === 0) {
    return { isValid: false, error: 'Text is required' };
  }

  // For AI suggestions, allow longer texts (up to 20,000 characters)
  const maxLength = request.manual ? 50000 : 20000;
  if (request.text.length > maxLength) {
    return { 
      isValid: false, 
      error: `Text too long. Maximum ${maxLength.toLocaleString()} characters for ${request.manual ? 'manual' : 'AI'} suggestions` 
    };
  }

  if (!request.language || request.language.trim().length === 0) {
    return { isValid: false, error: 'Language is required' };
  }

  // Validate writing context if provided
  if (request.writingContext) {
    const { documentType } = request.writingContext;
    const validDocumentTypes = ['dissertation', 'research-paper', 'thesis', 'article', 'general'];
    
    if (!validDocumentTypes.includes(documentType)) {
      return { 
        isValid: false, 
        error: `Invalid document type. Must be one of: ${validDocumentTypes.join(', ')}` 
      };
    }
  }

  return { isValid: true };
}

/**
 * POST handler for AI writing suggestions.
 *
 * This endpoint generates AI-powered writing suggestions for the provided text.
 * It uses OpenAI's GPT models to provide context-aware improvements and
 * integrates with the existing suggestion system.
 *
 * @param request - Next.js request object
 * @returns Next.js response with AI suggestion results
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/suggestions/ai', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     text: 'The research findings indicate...',
 *     language: 'en-US',
 *     documentId: 'doc123',
 *     writingContext: {
 *       documentType: 'research-paper',
 *       subject: 'Computer Science',
 *       academicLevel: 'phd'
 *     },
 *     userGoals: ['improve clarity', 'enhance academic tone'],
 *     aiSuggestionTypes: ['style', 'clarity'],
 *     includeAI: true
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
    console.log('[API] /api/suggestions/ai POST body:', body);
    const aiRequest: AISuggestionGenerationRequest = body;

    // Validate request
    const validation = validateAISuggestionRequest(aiRequest);
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

    // Check if AI service is available
    const aiStatus = await isAISuggestionGenerationAvailable();
    if (!aiStatus.available) {
      console.log('[API] AI service unavailable:', aiStatus.error);
      return NextResponse.json(
        { 
          success: false, 
          error: `AI service unavailable: ${aiStatus.error}`,
          processingTime: Date.now() - startTime 
        },
        { status: 503 }
      );
    }

    // Generate AI suggestions
    const aiResponse = await generateAISuggestions(aiRequest);
    console.log('[API] AI suggestions response:', aiResponse);

    if (!aiResponse.success) {
      console.log('[API] AI suggestions failed:', aiResponse.error);
      return NextResponse.json(
        { 
          success: false, 
          error: aiResponse.error || 'AI suggestions generation failed',
          processingTime: Date.now() - startTime 
        },
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;

    // Return success response
    console.log('[API] Returning AI suggestions:', aiResponse);
    return NextResponse.json({
      success: true,
      suggestions: aiResponse.suggestions,
      aiStats: aiResponse.aiStats,
      serviceStatus: aiResponse.serviceStatus,
      processingTime,
      stats: {
        totalSuggestions: aiResponse.suggestions.stats.total,
        spellingSuggestions: aiResponse.suggestions.stats.spelling,
        grammarSuggestions: aiResponse.suggestions.stats.grammar,
        styleSuggestions: aiResponse.suggestions.stats.style,
        aiSuggestions: aiResponse.suggestions.stats.ai,
        highSeveritySuggestions: aiResponse.suggestions.stats.highSeverity,
      },
    });

  } catch (error) {
    console.error('[API] AI suggestions API error:', error);
    
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
 * GET handler for AI service status and information.
 *
 * @param request - Next.js request object
 * @returns Next.js response with AI service status
 * @since 1.0.0
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const healthCheck = url.searchParams.get('health');
    const statusCheck = url.searchParams.get('status');

    if (healthCheck === 'true') {
      const aiStatus = await isAISuggestionGenerationAvailable();
      
      return NextResponse.json({
        success: true,
        status: aiStatus.available ? 'healthy' : 'unhealthy',
        aiAvailable: aiStatus.available,
        model: aiStatus.model,
        error: aiStatus.error,
        timestamp: new Date().toISOString(),
      });
    }

    if (statusCheck === 'true') {
      const aiStatus = await isAISuggestionGenerationAvailable();
      
      return NextResponse.json({
        success: true,
        aiService: {
          available: aiStatus.available,
          model: aiStatus.model,
          error: aiStatus.error,
        },
        endpoints: {
          'POST /api/suggestions/ai': 'Generate AI writing suggestions',
          'GET /api/suggestions/ai?health=true': 'Health check',
          'GET /api/suggestions/ai?status=true': 'Service status',
        },
        features: {
          contextAwareSuggestions: true,
          multipleSuggestionTypes: ['style', 'content', 'structure', 'improvement', 'clarity'],
          academicWritingSupport: true,
          personalizedGoals: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'AI writing suggestions API is available',
      endpoints: {
        'POST /api/suggestions/ai': 'Generate AI writing suggestions',
        'GET /api/suggestions/ai?health=true': 'Health check',
        'GET /api/suggestions/ai?status=true': 'Service status',
      },
      documentation: {
        description: 'AI-powered writing suggestions using OpenAI GPT models',
        features: [
          'Context-aware writing improvements',
          'Academic writing assistance',
          'Multiple suggestion types',
          'Personalized writing goals',
          'Integration with existing suggestion system',
        ],
      },
    });

  } catch (error) {
    console.error('AI suggestions API status error:', error);
    
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