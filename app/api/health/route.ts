/**
 * @fileoverview Health check API endpoint for the WordWise application.
 *
 * This endpoint provides comprehensive health status information including
 * environment configuration, Firebase connectivity, and system resources.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { NextRequest, NextResponse } from 'next/server';
import { performHealthCheck, quickHealthCheck } from '@/lib/config';

/**
 * GET handler for health check endpoint.
 *
 * Returns comprehensive health status information for the application.
 * Supports both detailed and quick health checks based on query parameters.
 *
 * @param request - Next.js request object
 * @returns Health status response
 *
 * @example
 * ```bash
 * # Quick health check
 * GET /api/health
 * 
 * # Detailed health check
 * GET /api/health?detailed=true
 * ```
 *
 * @since 1.0.0
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    
    // Set appropriate cache headers
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (detailed) {
      // Perform comprehensive health check
      const healthStatus = await performHealthCheck();
      
      return NextResponse.json(healthStatus, {
        status: healthStatus.healthy ? 200 : 503,
        headers,
      });
    } else {
      // Perform quick health check
      const quickStatus = await quickHealthCheck();
      
      return NextResponse.json({
        healthy: quickStatus.healthy,
        message: quickStatus.message,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      }, {
        status: quickStatus.healthy ? 200 : 503,
        headers,
      });
    }
  } catch (error) {
    console.error('Health check endpoint error:', error);
    
    return NextResponse.json({
      healthy: false,
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
} 