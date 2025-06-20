# Testing Data Guide

## Overview

This document explains how to use the markdown test files in the `_example` directory for testing WordWise features throughout development. These files provide realistic academic content for comprehensive testing of the writing assistant's capabilities.

## Test Data Sources

The `_example` directory contains 6 markdown files converted from LaTeX academic documents:

| File                           | Size  | Lines | Content Type                    | Use Case                                           |
| ------------------------------ | ----- | ----- | ------------------------------- | -------------------------------------------------- |
| `0-intro.md`                   | 15KB  | 160   | Introduction to neural networks | Basic grammar checking, academic writing patterns  |
| `1-connclone.md`               | 21KB  | 205   | Connectome encoding research    | Complex scientific terminology, technical writing  |
| `2-mapseq.md`                  | 33KB  | 307   | Mapping and sequencing methods  | Large document performance, detailed methodology   |
| `3-odor_navigation.md`         | 22KB  | 219   | Olfactory navigation research   | Diverse content testing, interdisciplinary writing |
| `a1-reinforcement_learning.md` | 9.3KB | 108   | RL concepts                     | Concise technical writing, concept explanations    |
| `a2-neural_networks.md`        | 17KB  | 196   | Neural network architectures    | Technical documentation, mathematical content      |

## Development Phase Usage

### Phase 1: Setup

**Purpose**: Establish test data infrastructure

**Tasks**:

- Import markdown files into Firebase emulators
- Create seed data scripts for development
- Set up test user accounts with sample projects
- Implement markdown parsing utilities

**Test Files**: All 6 files for comprehensive coverage

### Phase 2: MVP

**Purpose**: Test core writing assistant features

**Grammar & Spell Checking**:

- Use `0-intro.md` and `1-connclone.md` for academic writing patterns
- Test with complex scientific terminology and technical terms
- Verify suggestion accuracy with domain-specific vocabulary

**Suggestion System**:

- Use `2-mapseq.md` and `3-odor_navigation.md` for diverse content
- Test suggestion categorization with different writing styles
- Verify confidence scoring with various error types

**Performance Testing**:

- Load `2-mapseq.md` (33KB) to test large document handling
- Use `a1-reinforcement_learning.md` and `a2-neural_networks.md` for real-time checking
- Test auto-save with complex formatting

**Export Testing**:

- Export all files to DOCX format
- Test LaTeX export with mathematical content
- Verify formatting preservation

### Phase 3: Enhanced

**Purpose**: Test AI-powered features

**AI Suggestion Testing**:

- Use all files to test context-aware suggestions
- Verify AI understands academic writing patterns
- Test personalized recommendations

**Collaboration Features**:

- Test real-time collaboration with multiple users
- Verify document sharing and commenting
- Test version control with complex documents

### Phase 4: Polished

**Purpose**: Enterprise and performance testing

**Enterprise Features**:

- Test team management with shared documents
- Verify RBAC with different user roles
- Test advanced analytics with real content

**Performance Optimization**:

- Load multiple large documents simultaneously
- Test search and indexing with real content
- Verify scalability with realistic data volumes

## Implementation Guidelines

### Database Seeding

```typescript
// Example seed data structure
interface TestProject {
  id: string;
  name: string;
  description: string;
  documents: TestDocument[];
}

interface TestDocument {
  id: string;
  title: string;
  content: string; // Markdown content from _example files
  type: 'dissertation' | 'research-paper' | 'technical-doc';
}
```

### Import Process

1. Read markdown files from `_example` directory
2. Parse markdown content and extract metadata
3. Create test projects with appropriate structure
4. Import documents with realistic titles and descriptions
5. Set up test user accounts with access to projects

### Test Scenarios

#### Scenario 1: Academic Writing Flow

1. Import `0-intro.md` as a new document
2. Verify grammar checking identifies academic writing patterns
3. Test suggestion acceptance and rejection
4. Verify auto-save works with complex content

#### Scenario 2: Technical Document Testing

1. Load `1-connclone.md` and `2-mapseq.md`
2. Test with technical terminology and mathematical notation
3. Verify export to DOCX preserves formatting
4. Test collaboration features with technical content

#### Scenario 3: Performance Benchmarking

1. Load `2-mapseq.md` (largest file) for performance testing
2. Measure real-time grammar checking response times
3. Test auto-save with large document
4. Verify UI responsiveness with complex content

#### Scenario 4: Edge Case Testing

1. Test with documents containing special characters
2. Verify handling of mathematical equations
3. Test with documents containing citations and references
4. Verify export functionality with complex formatting

## Quality Assurance

### Content Validation

- Verify markdown parsing preserves document structure
- Test with documents containing headers, lists, and formatting
- Ensure mathematical notation is handled correctly
- Verify citation and reference formatting

### Performance Benchmarks

- Document load time: < 2 seconds for largest files
- Grammar checking response: < 500ms for real-time feedback
- Auto-save frequency: Every 30 seconds without blocking UI
- Export generation: < 5 seconds for DOCX, < 10 seconds for LaTeX

### User Experience Testing

- Test with actual academic writing workflows
- Verify suggestions are relevant and helpful
- Test accessibility with screen readers
- Verify mobile responsiveness with test content

## Maintenance

### Updating Test Data

- Keep original LaTeX files for reference
- Update markdown files if conversion process improves
- Add new test files as needed for specific features
- Document any changes to test data structure

### Version Control

- Include test data in version control
- Tag test data versions with application releases
- Maintain compatibility with different development phases
- Document test data dependencies

## Troubleshooting

### Common Issues

1. **Markdown Parsing Errors**: Check for special characters or formatting
2. **Performance Issues**: Verify document size and complexity
3. **Import Failures**: Check Firebase emulator configuration
4. **Export Problems**: Verify formatting preservation

### Debugging

- Use browser dev tools to inspect document loading
- Check Firebase emulator logs for import errors
- Verify markdown content structure
- Test with smaller document subsets

## Conclusion

The test data in the `_example` directory provides a comprehensive foundation for testing WordWise features throughout development. By using realistic academic content, we can ensure the writing assistant works effectively with the target user base and provides valuable assistance for STEM graduate students writing their dissertations and research papers.
