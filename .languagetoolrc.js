/**
 * @fileoverview LanguageTool configuration file.
 *
 * This file configures LanguageTool for the WordWise application.
 * It sets up the language checking options and API endpoints.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

module.exports = {
  // LanguageTool API configuration
  apiUrl: process.env.LANGUAGETOOL_API_URL || 'https://api.languagetool.org/v2',
  apiKey: process.env.LANGUAGETOOL_API_KEY || '',
  
  // Default language
  language: 'en-US',
  
  // Request timeout in milliseconds
  timeout: 10000,
  
  // Whether to enable spell checking
  enableSpellCheck: true,
  
  // Whether to enable grammar checking
  enableGrammarCheck: true,
  
  // Whether to enable style checking
  enableStyleCheck: true,
  
  // Custom dictionary words (words to ignore)
  customDictionary: [],
  
  // Disabled rules (rule IDs to ignore)
  disabledRules: [],
  
  // Performance settings
  maxTextLength: 10000,
  debounceDelay: 1000,
  
  // Logging
  enableLogging: process.env.NODE_ENV === 'development',
}; 