# Project Rules & Development Standards

## Overview
This document defines the project structure, file organization, naming conventions, and development standards for WordWise. These rules ensure the codebase is modular, scalable, AI-friendly, and easy to understand for both human developers and AI tools.

## AI-First Development Principles

### Code Organization
- **Modular Architecture**: Each file has a single, clear responsibility
- **Scalable Structure**: Easy to add new features without breaking existing code
- **AI-Friendly**: Clear naming, comprehensive documentation, and logical organization
- **Human-Readable**: Self-documenting code with descriptive names and comments

### File Size Limits
- **Maximum 500 lines per file**: Ensures files remain manageable and AI-friendly
- **Split large components**: Break down complex components into smaller, focused files
- **Extract utilities**: Move reusable logic to dedicated utility files
- **Separate concerns**: Keep different types of logic in separate files

### Documentation Standards
- **File Headers**: Every file must have a descriptive header explaining its purpose
- **Function Documentation**: All functions must have JSDoc/TSDoc comments
- **Component Documentation**: React components must document props and usage
- **Type Documentation**: TypeScript types and interfaces must be documented

## Directory Structure

### Root Level
```
wordwise/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable React components
├── lib/                    # Utility functions and configurations
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
├── context/                # React context providers
├── services/               # External service integrations
├── utils/                  # General utility functions
├── constants/              # Application constants
├── styles/                 # Global styles and CSS modules
├── public/                 # Static assets
├── _docs/                  # Project documentation
├── tests/                  # Test files
├── scripts/                # Build and utility scripts
├── config/                 # Configuration files
└── [config files]          # Root configuration files
```

### App Directory (Next.js App Router)
```
app/
├── (auth)/                 # Authentication route group
│   ├── login/              # Login page
│   │   ├── page.tsx        # Login page component
│   │   ├── loading.tsx     # Loading state
│   │   └── error.tsx       # Error boundary
│   ├── register/           # Registration page
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   └── layout.tsx          # Auth layout
├── (dashboard)/            # Dashboard route group
│   ├── projects/           # Projects management
│   │   ├── [projectId]/    # Dynamic project routes
│   │   │   ├── documents/  # Documents within project
│   │   │   │   ├── [documentId]/ # Dynamic document routes
│   │   │   │   │   ├── page.tsx  # Document editor
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── error.tsx
│   │   │   │   ├── new/    # Create new document
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx # Documents list
│   │   │   ├── settings/   # Project settings
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx    # Project overview
│   │   ├── new/            # Create new project
│   │   │   └── page.tsx
│   │   └── page.tsx        # Projects list
│   ├── profile/            # User profile
│   │   ├── settings/       # User settings
│   │   │   └── page.tsx
│   │   └── page.tsx        # Profile overview
│   └── layout.tsx          # Dashboard layout
├── api/                    # API routes
│   ├── auth/               # Authentication API
│   │   ├── login/          # Login endpoint
│   │   │   └── route.ts
│   │   ├── register/       # Registration endpoint
│   │   │   └── route.ts
│   │   └── logout/         # Logout endpoint
│   │       └── route.ts
│   ├── projects/           # Projects API
│   │   ├── route.ts        # Projects CRUD
│   │   └── [projectId]/    # Individual project API
│   │       ├── route.ts
│   │       └── documents/  # Documents API
│   │           ├── route.ts
│   │           └── [documentId]/
│   │               └── route.ts
│   └── suggestions/        # Writing suggestions API
│       └── route.ts
├── globals.css             # Global styles
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── loading.tsx             # Global loading state
├── error.tsx               # Global error boundary
└── not-found.tsx           # 404 page
```

### Components Directory
```
components/
├── ui/                     # Basic UI components
│   ├── button/             # Button component
│   │   ├── index.tsx       # Main component
│   │   ├── button.tsx      # Button implementation
│   │   ├── button.test.tsx # Tests
│   │   └── button.stories.tsx # Storybook stories
│   ├── input/              # Input component
│   │   ├── index.tsx
│   │   ├── input.tsx
│   │   ├── input.test.tsx
│   │   └── input.stories.tsx
│   ├── modal/              # Modal component
│   ├── dropdown/           # Dropdown component
│   ├── tooltip/            # Tooltip component
│   └── index.ts            # Re-exports
├── forms/                  # Form components
│   ├── auth-form/          # Authentication forms
│   ├── project-form/       # Project creation/editing
│   ├── document-form/      # Document forms
│   └── settings-form/      # Settings forms
├── layout/                 # Layout components
│   ├── header/             # Application header
│   ├── sidebar/            # Navigation sidebar
│   ├── footer/             # Application footer
│   └── navigation/         # Navigation components
├── editor/                 # Writing editor components
│   ├── text-editor/        # Main text editor
│   ├── suggestion-panel/   # Suggestions sidebar
│   ├── toolbar/            # Editor toolbar
│   ├── suggestion-item/    # Individual suggestion
│   └── suggestion-popup/   # Suggestion tooltips
├── dashboard/              # Dashboard-specific components
│   ├── project-card/       # Project display card
│   ├── document-list/      # Document listing
│   ├── stats-panel/        # Statistics display
│   └── recent-activity/    # Recent activity feed
├── common/                 # Shared components
│   ├── loading-spinner/    # Loading indicators
│   ├── error-boundary/     # Error handling
│   ├── empty-state/        # Empty state displays
│   └── breadcrumbs/        # Navigation breadcrumbs
└── index.ts                # Main component exports
```

### Lib Directory
```
lib/
├── firebase/               # Firebase configuration and utilities
│   ├── config.ts           # Firebase configuration
│   ├── auth.ts             # Authentication utilities
│   ├── firestore.ts        # Firestore utilities
│   ├── storage.ts          # Storage utilities
│   └── emulators.ts        # Emulator configuration
├── auth/                   # Authentication logic
│   ├── auth-context.tsx    # Authentication context
│   ├── auth-hooks.ts       # Authentication hooks
│   ├── auth-utils.ts       # Authentication utilities
│   └── auth-guard.tsx      # Route protection
├── db/                     # Database operations
│   ├── projects.ts         # Project CRUD operations
│   ├── documents.ts        # Document CRUD operations
│   ├── users.ts            # User data operations
│   └── suggestions.ts      # Suggestion operations
├── utils/                  # General utilities
│   ├── date.ts             # Date formatting utilities
│   ├── string.ts           # String manipulation
│   ├── validation.ts       # Form validation
│   ├── formatting.ts       # Text formatting
│   └── constants.ts        # Application constants
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts         # Authentication hook
│   ├── use-projects.ts     # Projects management hook
│   ├── use-documents.ts    # Documents management hook
│   ├── use-suggestions.ts  # Suggestions hook
│   └── use-local-storage.ts # Local storage hook
└── api/                    # API utilities
    ├── client.ts           # API client configuration
    ├── endpoints.ts        # API endpoint definitions
    └── types.ts            # API type definitions
```

### Types Directory
```
types/
├── auth.ts                 # Authentication types
├── project.ts              # Project-related types
├── document.ts             # Document-related types
├── suggestion.ts           # Suggestion types
├── user.ts                 # User-related types
├── api.ts                  # API response types
├── ui.ts                   # UI component types
└── index.ts                # Type re-exports
```

## File Naming Conventions

### General Rules
- **kebab-case**: Use kebab-case for all file and directory names
- **Descriptive Names**: Names should clearly indicate the file's purpose
- **Consistent Suffixes**: Use consistent file extensions and suffixes
- **Group Related Files**: Keep related files together in the same directory

### Component Files
```
ComponentName/
├── index.tsx               # Main component export
├── component-name.tsx      # Component implementation
├── component-name.test.tsx # Unit tests
├── component-name.stories.tsx # Storybook stories
└── component-name.module.css # CSS modules (if needed)
```

### Page Files (Next.js)
```
page.tsx                    # Main page component
loading.tsx                 # Loading state
error.tsx                   # Error boundary
not-found.tsx               # 404 page
layout.tsx                  # Layout component
```

### Utility Files
```
utility-name.ts             # TypeScript utility
utility-name.js             # JavaScript utility
utility-name.test.ts        # Test file
utility-name.d.ts           # Type definitions
```

### Configuration Files
```
config-name.config.ts       # TypeScript configuration
config-name.config.js       # JavaScript configuration
config-name.json            # JSON configuration
```

## Code Documentation Standards

### File Headers
Every file must begin with a descriptive header:

```typescript
/**
 * @fileoverview Component for displaying writing suggestions in the editor sidebar.
 * 
 * This component renders a list of writing suggestions with different categories
 * (spelling, grammar, style, AI recommendations) and provides actions to accept
 * or ignore each suggestion. It integrates with the suggestion system to provide
 * real-time feedback to users during their writing process.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import React from 'react';
// ... rest of the file
```

### Function Documentation (JSDoc/TSDoc)
All functions must be documented with comprehensive JSDoc comments:

```typescript
/**
 * Processes writing suggestions and categorizes them by type.
 * 
 * This function takes raw suggestion data from the grammar checking service
 * and processes it into a structured format that can be displayed in the UI.
 * It categorizes suggestions by type (spelling, grammar, style, AI) and
 * applies appropriate styling and priority levels.
 * 
 * @param rawSuggestions - Array of raw suggestion objects from the API
 * @param documentText - The current document text for context
 * @param userPreferences - User's writing preferences and settings
 * @returns Processed suggestions organized by category with metadata
 * 
 * @example
 * ```typescript
 * const processed = processSuggestions(rawData, documentText, preferences);
 * console.log(processed.spelling); // Array of spelling suggestions
 * console.log(processed.grammar);  // Array of grammar suggestions
 * ```
 * 
 * @throws {ValidationError} When suggestion data is malformed
 * @throws {ProcessingError} When document text cannot be parsed
 * 
 * @since 1.0.0
 * @author WordWise Team
 */
function processSuggestions(
  rawSuggestions: RawSuggestion[],
  documentText: string,
  userPreferences: UserPreferences
): ProcessedSuggestions {
  // Implementation...
}
```

### Component Documentation
React components must document props and usage:

```typescript
/**
 * SuggestionPanel component for displaying writing suggestions.
 * 
 * This component renders a sidebar panel that shows categorized writing
 * suggestions to the user. It provides interactive elements to accept
 * or ignore suggestions, and displays statistics about the document's
 * writing quality.
 * 
 * @component
 * @example
 * ```tsx
 * <SuggestionPanel
 *   suggestions={processedSuggestions}
 *   onAccept={handleAcceptSuggestion}
 *   onIgnore={handleIgnoreSuggestion}
 *   isLoading={false}
 * />
 * ```
 */
interface SuggestionPanelProps {
  /** Array of processed suggestions organized by category */
  suggestions: ProcessedSuggestions;
  /** Callback function when user accepts a suggestion */
  onAccept: (suggestionId: string) => void;
  /** Callback function when user ignores a suggestion */
  onIgnore: (suggestionId: string) => void;
  /** Loading state for suggestions */
  isLoading: boolean;
  /** Optional custom styling */
  className?: string;
}

export function SuggestionPanel({
  suggestions,
  onAccept,
  onIgnore,
  isLoading,
  className
}: SuggestionPanelProps) {
  // Component implementation...
}
```

### Type Documentation
TypeScript types and interfaces must be documented:

```typescript
/**
 * Represents a processed writing suggestion with metadata.
 * 
 * This type defines the structure of a suggestion after it has been
 * processed and categorized. It includes all necessary information
 * for display and interaction in the UI.
 * 
 * @since 1.0.0
 */
interface ProcessedSuggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** Type of suggestion (spelling, grammar, style, AI) */
  type: SuggestionType;
  /** The suggested text or correction */
  suggestion: string;
  /** Original text that needs correction */
  original: string;
  /** Position in the document (start and end indices) */
  position: {
    start: number;
    end: number;
  };
  /** Confidence level of the suggestion (0-1) */
  confidence: number;
  /** Detailed explanation of the suggestion */
  explanation: string;
  /** Severity level of the issue */
  severity: 'low' | 'medium' | 'high';
  /** Whether the suggestion has been processed by the user */
  isProcessed: boolean;
}
```

## Code Organization Rules

### Import Organization
Organize imports in the following order:

```typescript
// 1. React and Next.js imports
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. Third-party library imports
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// 3. Internal component imports
import { Button } from '@/components/ui/button';
import { SuggestionItem } from '@/components/editor/suggestion-item';

// 4. Internal utility imports
import { processSuggestions } from '@/lib/utils/suggestions';
import { useAuth } from '@/hooks/use-auth';

// 5. Type imports
import type { Suggestion, User } from '@/types';

// 6. Style imports (if using CSS modules)
import styles from './suggestion-panel.module.css';
```

### Export Organization
Organize exports consistently:

```typescript
// 1. Type exports
export type { SuggestionPanelProps, ProcessedSuggestion };

// 2. Component exports
export { SuggestionPanel } from './suggestion-panel';
export { SuggestionItem } from './suggestion-item';

// 3. Hook exports
export { useSuggestions } from './use-suggestions';

// 4. Utility exports
export { processSuggestions } from './utils';
```

### Function Organization
Organize functions within files:

```typescript
// 1. Type definitions
interface ComponentProps {
  // ...
}

// 2. Constants
const CONSTANTS = {
  // ...
} as const;

// 3. Utility functions
function utilityFunction() {
  // ...
}

// 4. Main component
export function Component({ ... }: ComponentProps) {
  // 4a. Hooks
  const [state, setState] = useState();
  
  // 4b. Event handlers
  const handleClick = () => {
    // ...
  };
  
  // 4c. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 4d. Render
  return (
    // ...
  );
}
```

## Testing Standards

### Test File Organization
```
ComponentName/
├── component-name.test.tsx     # Unit tests
├── component-name.integration.test.tsx # Integration tests
└── __mocks__/                  # Mock files
    └── component-name.mock.ts
```

### Test Documentation
```typescript
/**
 * @fileoverview Unit tests for SuggestionPanel component.
 * 
 * Tests cover rendering, user interactions, accessibility,
 * and integration with the suggestion system.
 * 
 * @jest-environment jsdom
 */

describe('SuggestionPanel', () => {
  /**
   * Test that the component renders correctly with suggestions.
   */
  it('renders suggestions when provided', () => {
    // Test implementation...
  });
  
  /**
   * Test that the component handles empty state correctly.
   */
  it('displays empty state when no suggestions', () => {
    // Test implementation...
  });
});
```

## Performance Standards

### Code Splitting
- Use dynamic imports for large components
- Implement route-based code splitting
- Lazy load non-critical features

### Bundle Optimization
- Keep bundle size under 250KB for initial load
- Use tree shaking for unused code elimination
- Optimize images and assets

### Memory Management
- Clean up event listeners and subscriptions
- Use React.memo for expensive components
- Implement proper cleanup in useEffect

## Accessibility Standards

### Semantic HTML
- Use proper HTML elements for their intended purpose
- Implement ARIA labels and roles
- Ensure keyboard navigation works

### Screen Reader Support
- Provide descriptive alt text for images
- Use proper heading hierarchy
- Implement live regions for dynamic content

### Color and Contrast
- Maintain WCAG AA contrast ratios
- Don't rely solely on color for information
- Support high contrast mode

## Security Standards

### Input Validation
- Validate all user inputs
- Sanitize data before rendering
- Use TypeScript for type safety

### Authentication
- Implement proper session management
- Use secure authentication methods
- Protect sensitive routes

### Data Protection
- Encrypt sensitive data
- Implement proper CORS policies
- Use HTTPS in production

## Version Control Standards

### Commit Messages
Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
```
feat(editor): add real-time grammar checking
fix(auth): resolve login redirect issue
docs(api): update authentication documentation
test(components): add unit tests for SuggestionPanel
```

### Branch Naming
- `feature/feature-name` for new features
- `fix/bug-description` for bug fixes
- `docs/documentation-update` for documentation
- `refactor/component-name` for refactoring

### Pull Request Standards
- Include comprehensive description
- Add screenshots for UI changes
- Ensure all tests pass
- Request code review from team members

This document ensures that the WordWise codebase remains organized, maintainable, and AI-friendly while following industry best practices for modern web development. 