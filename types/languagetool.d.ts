/**
 * @fileoverview Type declarations for @343dev/languagetool-node package.
 *
 * This file provides TypeScript type definitions for the LanguageTool
 * Node.js wrapper package to ensure proper type checking.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

declare module '@343dev/languagetool-node' {
  /**
   * LanguageTool configuration options.
   */
  interface LanguageToolConfig {
    /** API URL for LanguageTool service */
    apiUrl?: string;
    /** API key for premium features */
    apiKey?: string;
    /** Default language for checking */
    language?: string;
    /** Request timeout in milliseconds */
    timeout?: number;
  }

  /**
   * LanguageTool check options.
   */
  interface CheckOptions {
    /** Language to use for checking */
    language?: string;
    /** Whether to only check enabled rules */
    enabledOnly?: boolean;
    /** Checking level */
    level?: 'PICKY' | 'DEFAULT' | 'STYLE' | 'CONVENTIONAL' | 'FORMAL';
  }

  /**
   * LanguageTool check result.
   */
  interface CheckResult {
    /** Array of matches found */
    matches: Array<{
      /** Rule information */
      rule: {
        /** Rule ID */
        id: string;
        /** Rule category */
        category: {
          /** Category ID */
          id: string;
          /** Category name */
          name: string;
        };
        /** Rule level */
        level: string;
      };
      /** Error message */
      message: string;
      /** Short error message */
      shortMessage: string;
      /** Suggested replacements */
      replacements: Array<{
        /** Replacement value */
        value: string;
      }>;
      /** Position in text */
      offset: number;
      /** Length of problematic text */
      length: number;
      /** Context around the error */
      context: {
        /** Context text */
        text: string;
        /** Context offset */
        offset: number;
        /** Context length */
        length: number;
      };
    }>;
  }

  /**
   * LanguageTool class for grammar checking.
   */
  export class LanguageTool {
    /**
     * Create a new LanguageTool instance.
     */
    constructor(config?: LanguageToolConfig);

    /**
     * Check text for grammar and spelling errors.
     */
    check(text: string, options?: CheckOptions): Promise<CheckResult>;
  }
} 