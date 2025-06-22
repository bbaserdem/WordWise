/**
 * @fileoverview Tests for suggestion utility functions.
 *
 * This file contains unit tests for the suggestion utility functions,
 * including confidence score formatting and color utilities.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import {
  formatConfidence,
  getConfidenceLevel,
  getConfidenceColor,
  getConfidenceBgColor,
  getSuggestionTypeColor,
  getSuggestionTypeDotColor,
} from './suggestion-utils';

describe('Suggestion Utilities', () => {
  describe('formatConfidence', () => {
    it('formats confidence as percentage by default', () => {
      expect(formatConfidence(0.85)).toBe('85%');
      expect(formatConfidence(0.5)).toBe('50%');
      expect(formatConfidence(0.99)).toBe('99%');
    });

    it('formats confidence as decimal when specified', () => {
      expect(formatConfidence(0.85, 'decimal')).toBe('0.85');
      expect(formatConfidence(0.5, 'decimal')).toBe('0.50');
      expect(formatConfidence(0.99, 'decimal')).toBe('0.99');
    });

    it('formats confidence as stars when specified', () => {
      expect(formatConfidence(0.8, 'stars')).toBe('★★★★☆');
      expect(formatConfidence(0.5, 'stars')).toBe('★★☆☆☆');
      expect(formatConfidence(0.9, 'stars')).toBe('★★★★☆');
    });

    it('clamps confidence values to valid range', () => {
      expect(formatConfidence(-0.1)).toBe('0%');
      expect(formatConfidence(1.5)).toBe('100%');
    });
  });

  describe('getConfidenceLevel', () => {
    it('returns correct confidence levels', () => {
      expect(getConfidenceLevel(0.95)).toBe('Very High');
      expect(getConfidenceLevel(0.85)).toBe('High');
      expect(getConfidenceLevel(0.75)).toBe('Good');
      expect(getConfidenceLevel(0.65)).toBe('Moderate');
      expect(getConfidenceLevel(0.55)).toBe('Fair');
      expect(getConfidenceLevel(0.35)).toBe('Low');
    });

    it('clamps confidence values to valid range', () => {
      expect(getConfidenceLevel(-0.1)).toBe('Low');
      expect(getConfidenceLevel(1.5)).toBe('Very High');
    });
  });

  describe('getConfidenceColor', () => {
    it('returns correct colors for confidence levels', () => {
      expect(getConfidenceColor(0.9)).toBe('text-green-600');
      expect(getConfidenceColor(0.7)).toBe('text-blue-600');
      expect(getConfidenceColor(0.5)).toBe('text-yellow-600');
      expect(getConfidenceColor(0.3)).toBe('text-red-600');
    });
  });

  describe('getConfidenceBgColor', () => {
    it('returns correct background colors for confidence levels', () => {
      expect(getConfidenceBgColor(0.9)).toBe('bg-green-100');
      expect(getConfidenceBgColor(0.7)).toBe('bg-blue-100');
      expect(getConfidenceBgColor(0.5)).toBe('bg-yellow-100');
      expect(getConfidenceBgColor(0.3)).toBe('bg-red-100');
    });
  });

  describe('getSuggestionTypeColor', () => {
    it('returns correct colors for suggestion types', () => {
      expect(getSuggestionTypeColor('spelling')).toBe('text-red-600');
      expect(getSuggestionTypeColor('grammar')).toBe('text-blue-600');
      expect(getSuggestionTypeColor('style')).toBe('text-green-600');
      expect(getSuggestionTypeColor('punctuation')).toBe('text-purple-600');
      expect(getSuggestionTypeColor('ai')).toBe('text-orange-600');
    });

    it('returns default color for unknown types', () => {
      expect(getSuggestionTypeColor('unknown')).toBe('text-gray-600');
    });
  });

  describe('getSuggestionTypeDotColor', () => {
    it('returns correct dot colors for suggestion types', () => {
      expect(getSuggestionTypeDotColor('spelling')).toBe('bg-red-500');
      expect(getSuggestionTypeDotColor('grammar')).toBe('bg-blue-500');
      expect(getSuggestionTypeDotColor('style')).toBe('bg-green-500');
      expect(getSuggestionTypeDotColor('punctuation')).toBe('bg-purple-500');
      expect(getSuggestionTypeDotColor('ai')).toBe('bg-orange-500');
    });

    it('returns default color for unknown types', () => {
      expect(getSuggestionTypeDotColor('unknown')).toBe('bg-gray-500');
    });
  });
}); 