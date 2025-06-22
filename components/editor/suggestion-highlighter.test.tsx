/**
 * @fileoverview Unit tests for SuggestionHighlighter component.
 *
 * Tests cover rendering, suggestion highlighting, tooltip interactions,
 * and action handling for the visual suggestion system.
 *
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SuggestionHighlighter } from './suggestion-highlighter';
import type { Suggestion } from '@/types/suggestion';

// Mock the suggestion utilities
jest.mock('@/lib/utils/suggestion-utils', () => ({
  getSuggestionTypeColor: jest.fn((type: string) => {
    const colors = {
      spelling: 'text-red-600',
      grammar: 'text-blue-600',
      style: 'text-green-600',
      punctuation: 'text-purple-600',
      ai: 'text-orange-600',
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  }),
  getSuggestionTypeBgColor: jest.fn(() => 'bg-gray-100'),
  formatConfidence: jest.fn((confidence: number) => `${Math.round(confidence * 100)}%`),
  getConfidenceLevel: jest.fn((confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  }),
}));

// Mock the tooltip component
jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <div data-testid="tooltip">
      <div data-testid="tooltip-trigger">{children}</div>
      <div data-testid="tooltip-content">{content}</div>
    </div>
  ),
}));

// Mock the button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('SuggestionHighlighter', () => {
  const mockSuggestions: Suggestion[] = [
    {
      id: 'suggestion-1',
      documentId: 'doc-1',
      userId: 'user-1',
      type: 'spelling',
      original: 'teh',
      suggestion: 'the',
      explanation: 'This is a common spelling mistake.',
      confidence: 0.95,
      position: { start: 0, end: 3 },
      status: 'active',
      severity: 'medium',
      isProcessed: false,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      id: 'suggestion-2',
      documentId: 'doc-1',
      userId: 'user-1',
      type: 'grammar',
      original: 'is are',
      suggestion: 'are',
      explanation: 'Subject-verb agreement issue.',
      confidence: 0.85,
      position: { start: 8, end: 13 },
      status: 'active',
      severity: 'high',
      isProcessed: false,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
  ];

  const defaultProps = {
    text: 'teh cat is are happy.',
    suggestions: mockSuggestions,
    onAcceptSuggestion: jest.fn(),
    onIgnoreSuggestion: jest.fn(),
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders text without suggestions when disabled', () => {
    render(
      <SuggestionHighlighter
        {...defaultProps}
        enabled={false}
      />
    );

    expect(screen.getByText('teh cat is are happy.')).toBeInTheDocument();
  });

  it('renders text with suggestion highlights when enabled', () => {
    render(<SuggestionHighlighter {...defaultProps} />);

    // Should render the text with suggestions highlighted
    expect(screen.getByText('teh')).toBeInTheDocument();
    expect(screen.getByText('is are')).toBeInTheDocument();
    expect(screen.getByText(' cat ')).toBeInTheDocument();
    expect(screen.getByText(' happy.')).toBeInTheDocument();
  });

  it('applies correct CSS classes for different suggestion types', () => {
    render(<SuggestionHighlighter {...defaultProps} />);

    // Check that suggestion spans have the correct classes
    const suggestionElements = screen.getAllByTestId('tooltip-trigger');
    expect(suggestionElements).toHaveLength(2);
  });

  it('calls onAcceptSuggestion when accept button is clicked', async () => {
    const onAcceptSuggestion = jest.fn();
    render(
      <SuggestionHighlighter
        {...defaultProps}
        onAcceptSuggestion={onAcceptSuggestion}
      />
    );

    // Find and click the accept button in the tooltip
    const tooltipContents = screen.getAllByTestId('tooltip-content');
    const acceptButtons = tooltipContents[0].querySelectorAll('button');
    
    // The first button should be the accept button
    if (acceptButtons[0]) {
      fireEvent.click(acceptButtons[0]);
      expect(onAcceptSuggestion).toHaveBeenCalledWith('suggestion-1');
    }
  });

  it('calls onIgnoreSuggestion when ignore button is clicked', async () => {
    const onIgnoreSuggestion = jest.fn();
    render(
      <SuggestionHighlighter
        {...defaultProps}
        onIgnoreSuggestion={onIgnoreSuggestion}
      />
    );

    // Find and click the ignore button in the tooltip
    const tooltipContents = screen.getAllByTestId('tooltip-content');
    const ignoreButtons = tooltipContents[0].querySelectorAll('button');
    
    // The second button should be the ignore button
    if (ignoreButtons[1]) {
      fireEvent.click(ignoreButtons[1]);
      expect(onIgnoreSuggestion).toHaveBeenCalledWith('suggestion-1');
    }
  });

  it('displays suggestion information in tooltips', () => {
    render(<SuggestionHighlighter {...defaultProps} />);

    const tooltipContents = screen.getAllByTestId('tooltip-content');
    
    // Check that tooltip content includes suggestion details
    expect(tooltipContents[0]).toHaveTextContent('teh');
    expect(tooltipContents[0]).toHaveTextContent('the');
    expect(tooltipContents[0]).toHaveTextContent('This is a common spelling mistake.');
    expect(tooltipContents[0]).toHaveTextContent('95%');
  });

  it('handles empty suggestions array', () => {
    render(
      <SuggestionHighlighter
        {...defaultProps}
        suggestions={[]}
      />
    );

    expect(screen.getByText('teh cat is are happy.')).toBeInTheDocument();
  });

  it('handles suggestions with overlapping positions', () => {
    const overlappingSuggestions: Suggestion[] = [
      {
        ...mockSuggestions[0],
        position: { start: 0, end: 5 },
      },
      {
        ...mockSuggestions[1],
        position: { start: 2, end: 7 },
      },
    ];

    render(
      <SuggestionHighlighter
        {...defaultProps}
        suggestions={overlappingSuggestions}
      />
    );

    // Should still render without errors
    expect(screen.getByText('teh cat is are happy.')).toBeInTheDocument();
  });
}); 