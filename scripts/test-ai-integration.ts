/**
 * @fileoverview Comprehensive test script for AI integration.
 *
 * This script tests all components of the AI integration including:
 * - OpenAI service connectivity and configuration
 * - Writing assistant functionality
 * - AI suggestion generator
 * - API endpoints
 * - Error handling and fallbacks
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });

// Test data
const TEST_TEXT = `The quick brown fox jumps over the lazy dog. This is a test sentence to verify that our AI integration is working properly. We want to ensure that the writing assistant can provide meaningful suggestions for improving text quality and style.`;

const TEST_CONTEXT = {
  documentType: 'academic' as const,
  userGoals: ['improve clarity', 'enhance style'],
  writingLevel: 'intermediate',
  targetAudience: 'academic',
};

/**
 * Display test results with formatting.
 *
 * @param testName - Name of the test
 * @param success - Whether the test passed
 * @param message - Test message
 * @param details - Additional details
 * @since 1.0.0
 */
function displayTestResult(
  testName: string,
  success: boolean,
  message: string,
  details?: any
): void {
  const status = success ? '✅ PASS' : '❌ FAIL';
  const color = success ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  
  console.log(`${color}${status}${reset} ${testName}`);
  console.log(`   ${message}`);
  
  if (details) {
    console.log(`   Details:`, JSON.stringify(details, null, 2));
  }
  console.log('');
}

/**
 * Test OpenAI service configuration.
 *
 * @returns Promise resolving to test result
 * @since 1.0.0
 */
async function testOpenAIConfiguration(): Promise<boolean> {
  try {
    const { checkOpenAIService, getOpenAIConfig } = await import('../lib/ai/openai-service');
    
    // Test configuration
    const config = getOpenAIConfig();
    const hasValidConfig = config.model && config.maxTokens > 0;
    
    if (!hasValidConfig) {
      displayTestResult(
        'OpenAI Configuration',
        false,
        'Invalid OpenAI configuration',
        config
      );
      return false;
    }
    
    // Test service connectivity
    const serviceStatus = await checkOpenAIService();
    
    displayTestResult(
      'OpenAI Service',
      serviceStatus.available,
      serviceStatus.available 
        ? `Service is available (Model: ${serviceStatus.model})`
        : `Service unavailable: ${serviceStatus.error}`,
      serviceStatus
    );
    
    return serviceStatus.available;
  } catch (error) {
    displayTestResult(
      'OpenAI Configuration',
      false,
      `Error testing OpenAI configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { error: error instanceof Error ? error.stack : error }
    );
    return false;
  }
}

/**
 * Test AI suggestion generation.
 *
 * @returns Promise resolving to test result
 * @since 1.0.0
 */
async function testAISuggestions(): Promise<boolean> {
  try {
    const { generateWritingSuggestions } = await import('../lib/ai/writing-assistant');
    
    const startTime = Date.now();
    const result = await generateWritingSuggestions({
      text: TEST_TEXT,
      context: {
        documentType: 'research-paper',
        subject: 'Computer Science',
        academicLevel: 'graduate',
        targetAudience: 'academic',
      },
      userGoals: ['improve clarity', 'enhance style'],
      suggestionTypes: ['style', 'clarity'],
    });
    const processingTime = Date.now() - startTime;
    
    const success = result.success && result.suggestions.all.length > 0;
    
    displayTestResult(
      'AI Suggestions Generation',
      success,
      success
        ? `Generated ${result.suggestions.all.length} suggestions in ${processingTime}ms`
        : `Failed to generate suggestions: ${result.error}`,
      {
        suggestionsCount: result.suggestions.all.length,
        processingTime,
        model: result.stats.model,
        usage: result.stats.tokenUsage,
      }
    );
    
    if (success && result.suggestions.all.length > 0) {
      console.log('   Sample suggestions:');
      result.suggestions.all.slice(0, 2).forEach((suggestion: any, index: number) => {
        console.log(`   ${index + 1}. ${suggestion.type}: ${suggestion.suggestion.substring(0, 100)}...`);
      });
      console.log('');
    }
    
    return success;
  } catch (error) {
    displayTestResult(
      'AI Suggestions Generation',
      false,
      `Error testing AI suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { error: error instanceof Error ? error.stack : error }
    );
    return false;
  }
}

/**
 * Test AI suggestion generator integration.
 *
 * @returns Promise resolving to test result
 * @since 1.0.0
 */
async function testAISuggestionGenerator(): Promise<boolean> {
  try {
    const { generateAISuggestions } = await import('../lib/suggestions/ai-suggestion-generator');
    
    const startTime = Date.now();
    const result = await generateAISuggestions({
      text: TEST_TEXT,
      language: 'en-US',
      documentId: 'test-doc',
      writingContext: {
        documentType: 'research-paper',
        subject: 'Computer Science',
        academicLevel: 'graduate',
      },
      userGoals: ['improve clarity'],
      aiSuggestionTypes: ['style', 'clarity'],
      includeAI: true,
    });
    const processingTime = Date.now() - startTime;
    
    const success = result.success && result.suggestions.all.length > 0;
    
    displayTestResult(
      'AI Suggestion Generator',
      success,
      success
        ? `Generated ${result.suggestions.all.length} integrated suggestions in ${processingTime}ms`
        : 'No suggestions generated',
      {
        suggestionsCount: result.suggestions.all.length,
        processingTime,
        aiStats: result.aiStats,
      }
    );
    
    return success;
  } catch (error) {
    displayTestResult(
      'AI Suggestion Generator',
      false,
      `Error testing AI suggestion generator: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { error: error instanceof Error ? error.stack : error }
    );
    return false;
  }
}

/**
 * Test API endpoint.
 *
 * @returns Promise resolving to test result
 * @since 1.0.0
 */
async function testAPIEndpoint(): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/suggestions/ai`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: TEST_TEXT,
        language: 'en-US',
        context: TEST_CONTEXT,
        userGoals: ['improve clarity'],
        documentType: 'academic',
      }),
    });
    
    const data = await response.json();
    const success = response.ok && data.success;
    
    displayTestResult(
      'AI Suggestions API',
      success,
      success
        ? `API responded successfully with ${data.suggestions?.length || 0} suggestions`
        : `API error: ${data.error || response.statusText}`,
      {
        status: response.status,
        processingTime: data.processingTime,
        model: data.model,
        suggestionsCount: data.suggestions?.length || 0,
      }
    );
    
    return success;
  } catch (error) {
    displayTestResult(
      'AI Suggestions API',
      false,
      `Error testing API endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { error: error instanceof Error ? error.stack : error }
    );
    return false;
  }
}

/**
 * Test environment variables.
 *
 * @returns Promise resolving to test result
 * @since 1.0.0
 */
function testEnvironmentVariables(): boolean {
  const requiredVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  const success = missing.length === 0;
  
  displayTestResult(
    'Environment Variables',
    success,
    success
      ? 'All required environment variables are set'
      : `Missing environment variables: ${missing.join(', ')}`,
    {
      present: requiredVars.filter(varName => process.env[varName]),
      missing,
    }
  );
  
  return success;
}

/**
 * Test fallback functionality.
 *
 * @returns Promise resolving to test result
 * @since 1.0.0
 */
async function testFallbackFunctionality(): Promise<boolean> {
  try {
    const { generateAISuggestions } = await import('../lib/suggestions/ai-suggestion-generator');
    
    // Test with invalid API key to trigger fallback
    const originalKey = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'invalid-key';
    
    const result = await generateAISuggestions({
      text: TEST_TEXT,
      language: 'en-US',
      documentId: 'test-doc',
      writingContext: {
        documentType: 'research-paper',
        subject: 'Computer Science',
        academicLevel: 'graduate',
      },
      userGoals: ['improve clarity'],
      aiSuggestionTypes: ['style', 'clarity'],
      includeAI: true,
    });
    
    // Restore original key
    process.env.OPENAI_API_KEY = originalKey;
    
    const success = result.success && result.suggestions.all.length > 0;
    
    displayTestResult(
      'Fallback Functionality',
      success,
      success
        ? 'Fallback suggestions generated when AI was unavailable'
        : 'No fallback suggestions generated',
      {
        suggestionsCount: result.suggestions.all.length,
        serviceStatus: result.serviceStatus,
      }
    );
    
    return success;
  } catch (error) {
    displayTestResult(
      'Fallback Functionality',
      false,
      `Error testing fallback: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { error: error instanceof Error ? error.stack : error }
    );
    return false;
  }
}

/**
 * Main test function.
 *
 * @since 1.0.0
 */
async function runTests(): Promise<void> {
  console.log('🧪 Testing AI Integration\n');
  console.log('=' .repeat(50));
  
  const results = {
    environment: testEnvironmentVariables(),
    openaiConfig: await testOpenAIConfiguration(),
    aiSuggestions: await testAISuggestions(),
    suggestionGenerator: await testAISuggestionGenerator(),
    apiEndpoint: await testAPIEndpoint(),
    fallback: await testFallbackFunctionality(),
  };
  
  console.log('=' .repeat(50));
  console.log('📊 Test Summary\n');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests > 0) {
    console.log('\n🔧 Failed Tests:');
    Object.entries(results).forEach(([test, result]) => {
      if (!result) {
        console.log(`   - ${test}`);
      }
    });
  }
  
  console.log('\n' + '=' .repeat(50));
  
  if (failedTests === 0) {
    console.log('🎉 All tests passed! AI integration is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the configuration and try again.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch((error) => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
} 