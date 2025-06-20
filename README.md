# WordWise

> An AI-first writing assistant for STEM graduate students

WordWise is a modern, distraction-free writing assistant designed specifically for STEM graduate students drafting dissertations and research papers. It provides real-time grammar, clarity, and citation feedback in a minimalist academic interface.

## 🎯 Project Overview

### Phase 1: Core Grammarly Clone

- Real-time grammar and spell checking
- Basic style suggestions and readability analysis
- Clean, responsive text editor interface
- User authentication and project management
- Document versioning and export capabilities

### Phase 2: AI Enhancement

- Context-aware suggestions powered by large language models
- Personalized writing recommendations based on user goals
- Advanced style analysis beyond rule-based corrections
- Document version comparison
- Export to DOCX and LaTeX formats

## 🚀 Tech Stack

### Frontend

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Backend & Services

- **Firebase Auth** for authentication
- **Firestore** for real-time database
- **Firebase Hosting** for deployment
- **Firebase Emulator Suite** for local development

### Development Environment

- **Nix + Flakes** for reproducible development
- **pnpm** for package management
- **TypeScript** for type safety
- **ESLint + Prettier** for code quality

## 📁 Project Structure

```
wordwise/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── components/             # Reusable React components
│   ├── ui/                # Basic UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── editor/            # Writing editor components
├── lib/                    # Utility functions and configurations
│   ├── firebase/          # Firebase configuration
│   ├── auth/              # Authentication utilities
│   └── utils/             # General utilities
├── types/                  # TypeScript type definitions
├── hooks/                  # Custom React hooks
├── _docs/                  # Project documentation
└── _docs/phases/          # Development phases
```

## 🎨 Design Principles

### UI/UX Guidelines

- **Distraction-free**: Minimal interface focused on writing
- **Academic Professionalism**: Clean, scholarly aesthetic
- **Accessibility**: WCAG AA compliance
- **Responsive**: Works seamlessly across devices
- **Semantic Iconography**: Clear, meaningful icons

### Theme System

- **Color Palette**: Blue-gray primary with semantic accents
- **Typography**: Georgia for content, Inter for UI
- **Spacing**: 8px grid system
- **Dark Mode**: Full support with proper contrast
- **Transitions**: Smooth, purposeful animations

## 🔧 Development Conventions

### Code Standards

- **File Naming**: kebab-case for files and directories
- **Component Naming**: PascalCase for components
- **Documentation**: Comprehensive JSDoc/TSDoc comments
- **File Size**: Maximum 500 lines per file
- **Testing**: Unit tests for all components and utilities

### Git Workflow

- **Branch Naming**: `feature/feature-name`, `fix/bug-description`
- **Commit Messages**: Conventional commit format
- **Pull Requests**: Comprehensive descriptions with screenshots

### Import Organization

```typescript
// 1. React and Next.js imports
import React, { useState, useEffect } from 'react';

// 2. Third-party library imports
import { motion } from 'framer-motion';

// 3. Internal component imports
import { Button } from '@/components/ui/button';

// 4. Internal utility imports
import { useAuth } from '@/hooks/use-auth';

// 5. Type imports
import type { User } from '@/types';
```

## 📋 Development Phases

### Phase 1: Setup (2-3 weeks)

Barebones foundation with basic authentication and project structure.

### Phase 2: MVP (4-6 weeks)

Core writing assistant with grammar checking and visual feedback.

### Phase 3: Enhanced (6-8 weeks)

AI-powered features and real-time collaboration.

### Phase 4: Polished (8-10 weeks)

Enterprise-ready platform with advanced features.

[View detailed phase documentation →](_docs/phases/)

## 🚀 Getting Started

### Prerequisites

- NixOS or Nix package manager
- Node.js 20.x (provided by Nix shell)
- pnpm (provided by Nix shell)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd wordwise

# Enter development shell
direnv allow

# Install dependencies
pnpm install

# Set up Firebase project and configuration
# (See Firebase setup documentation)

# Start development server
pnpm dev

# Start Firebase emulators
pnpm emulators
```

### Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm type-check   # Run TypeScript check
```

## 📚 Documentation

- [Project Overview](_docs/project-overview.md) - High-level project description
- [User Flow](_docs/user-flow.md) - Complete user journey documentation
- [Tech Stack](_docs/tech-stack.md) - Detailed technology specifications
- [Project Rules](_docs/project-rules.md) - Development standards and conventions
- [UI Rules](_docs/ui-rules.md) - Design system and UI guidelines
- [Theme Rules](_docs/theme-rules.md) - Color, typography, and styling standards

## 🎯 Key Features

### Writing Assistant

- Real-time grammar and spell checking
- Visual suggestion system with color-coded feedback
- Distraction-free writing environment
- Auto-save and version history
- Export to multiple formats (DOCX, LaTeX, PDF)

### Project Management

- Organize documents into projects
- Template system for academic documents
- Collaboration and sharing features
- Progress tracking and analytics

### AI Enhancement

- Context-aware writing suggestions
- Personalized recommendations
- Advanced style analysis
- Intelligent content improvement

## 🤝 Contributing

1. Follow the project conventions and coding standards
2. Write comprehensive tests for new features
3. Update documentation for any changes
4. Ensure accessibility compliance
5. Follow the iterative development approach

## 📄 License

[Add your license information here]

## 🔗 Links

- [Live Demo](https://wordwise.app)
- [Documentation](https://docs.wordwise.app)
- [Issues](https://github.com/your-org/wordwise/issues)
- [Discussions](https://github.com/your-org/wordwise/discussions)
