# Theme Rules & Design System

## Overview
This document defines the complete design system for WordWise, including colors, typography, spacing, and visual styles that create a consistent minimalist academic theme across the application.

## Color Palette

### Primary Colors
```css
:root {
  /* Primary Blue-Gray Scale */
  --primary-50: #f8fafc;    /* Lightest background */
  --primary-100: #f1f5f9;   /* Light background */
  --primary-200: #e2e8f0;   /* Border, divider */
  --primary-300: #cbd5e1;   /* Disabled text */
  --primary-400: #94a3b8;   /* Placeholder text */
  --primary-500: #64748b;   /* Secondary text */
  --primary-600: #475569;   /* Primary text */
  --primary-700: #334155;   /* Strong text */
  --primary-800: #1e293b;   /* Headings */
  --primary-900: #0f172a;   /* Darkest text */
}
```

### Accent Colors
```css
:root {
  /* Semantic Accent Colors */
  --accent-blue: #3b82f6;     /* Primary accent, links */
  --accent-blue-light: #60a5fa;
  --accent-blue-dark: #2563eb;
  
  --accent-green: #10b981;    /* Success, positive actions */
  --accent-green-light: #34d399;
  --accent-green-dark: #059669;
  
  --accent-yellow: #f59e0b;   /* Warning, attention */
  --accent-yellow-light: #fbbf24;
  --accent-yellow-dark: #d97706;
  
  --accent-red: #ef4444;      /* Error, destructive actions */
  --accent-red-light: #f87171;
  --accent-red-dark: #dc2626;
}
```

### Suggestion Colors
```css
:root {
  /* Writing Suggestion Colors */
  --suggestion-spelling: #ef4444;      /* Red for spelling errors */
  --suggestion-grammar: #3b82f6;       /* Blue for grammar errors */
  --suggestion-style: #10b981;         /* Green for style suggestions */
  --suggestion-ai: #f59e0b;            /* Yellow for AI recommendations */
  --suggestion-other: #8b5cf6;         /* Purple for other suggestions */
}
```

### Background Colors
```css
:root {
  /* Background Colors */
  --bg-primary: #ffffff;      /* Main background */
  --bg-secondary: #f8fafc;    /* Secondary background */
  --bg-tertiary: #f1f5f9;     /* Tertiary background */
  --bg-overlay: rgba(0, 0, 0, 0.5); /* Modal overlays */
  --bg-paper: #fefefe;        /* Writing area background */
}
```

### Surface Colors
```css
:root {
  /* Surface Colors */
  --surface-primary: #ffffff;   /* Cards, panels */
  --surface-secondary: #f8fafc; /* Secondary surfaces */
  --surface-elevated: #ffffff;  /* Elevated surfaces with shadow */
  --surface-overlay: #ffffff;   /* Overlay surfaces */
}
```

### Border Colors
```css
:root {
  /* Border Colors */
  --border-light: #e2e8f0;     /* Light borders */
  --border-medium: #cbd5e1;    /* Medium borders */
  --border-dark: #94a3b8;      /* Dark borders */
  --border-focus: #3b82f6;     /* Focus state borders */
}
```

## Typography

### Font Families
```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
}
```

### Font Sizes
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

### Font Weights
```css
:root {
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Line Heights
```css
:root {
  /* Line Heights */
  --leading-tight: 1.25;    /* Headings */
  --leading-snug: 1.375;    /* UI text */
  --leading-normal: 1.5;    /* Body text */
  --leading-relaxed: 1.625; /* Writing content */
  --leading-loose: 2;       /* Large text blocks */
}
```

## Spacing System

### Base Spacing
```css
:root {
  /* 8px Base Unit System */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Component Spacing
```css
:root {
  /* Component-Specific Spacing */
  --spacing-xs: var(--space-1);    /* Small elements */
  --spacing-sm: var(--space-2);    /* Small components */
  --spacing-md: var(--space-4);    /* Medium components */
  --spacing-lg: var(--space-6);    /* Large components */
  --spacing-xl: var(--space-8);    /* Extra large components */
  --spacing-2xl: var(--space-12);  /* Section spacing */
}
```

## Border Radius

### Border Radius Scale
```css
:root {
  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.25rem;    /* 4px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;   /* Full circle */
}
```

## Shadows

### Shadow System
```css
:root {
  /* Shadow System */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

## Transitions & Animations

### Transition Durations
```css
:root {
  /* Transition Durations */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
}
```

### Transition Easing
```css
:root {
  /* Transition Easing */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Component-Specific Styles

### Button Styles
```css
:root {
  /* Button Variants */
  --btn-primary-bg: var(--accent-blue);
  --btn-primary-text: #ffffff;
  --btn-primary-hover: var(--accent-blue-dark);
  
  --btn-secondary-bg: var(--primary-100);
  --btn-secondary-text: var(--primary-700);
  --btn-secondary-hover: var(--primary-200);
  
  --btn-ghost-bg: transparent;
  --btn-ghost-text: var(--primary-600);
  --btn-ghost-hover: var(--primary-100);
  
  --btn-danger-bg: var(--accent-red);
  --btn-danger-text: #ffffff;
  --btn-danger-hover: var(--accent-red-dark);
}
```

### Input Styles
```css
:root {
  /* Input Styles */
  --input-bg: var(--surface-primary);
  --input-border: var(--border-light);
  --input-border-focus: var(--border-focus);
  --input-text: var(--primary-700);
  --input-placeholder: var(--primary-400);
  --input-disabled: var(--primary-100);
}
```

### Card Styles
```css
:root {
  /* Card Styles */
  --card-bg: var(--surface-primary);
  --card-border: var(--border-light);
  --card-shadow: var(--shadow-sm);
  --card-shadow-hover: var(--shadow-md);
}
```

## Writing Area Styles

### Content Typography
```css
:root {
  /* Writing Area Styles */
  --writing-font: var(--font-serif);
  --writing-size: var(--text-base);
  --writing-line-height: var(--leading-relaxed);
  --writing-color: var(--primary-800);
  --writing-bg: var(--bg-paper);
  --writing-max-width: 65ch;
  --writing-margin: var(--space-8);
}
```

### Suggestion Highlights
```css
:root {
  /* Suggestion Highlight Styles */
  --highlight-spelling: rgba(239, 68, 68, 0.1);
  --highlight-grammar: rgba(59, 130, 246, 0.1);
  --highlight-style: rgba(16, 185, 129, 0.1);
  --highlight-ai: rgba(245, 158, 11, 0.1);
  --highlight-other: rgba(139, 92, 246, 0.1);
}
```

## Dark Mode Colors

### Dark Mode Palette
```css
[data-theme="dark"] {
  /* Dark Mode Primary Colors */
  --primary-50: #0f172a;
  --primary-100: #1e293b;
  --primary-200: #334155;
  --primary-300: #475569;
  --primary-400: #64748b;
  --primary-500: #94a3b8;
  --primary-600: #cbd5e1;
  --primary-700: #e2e8f0;
  --primary-800: #f1f5f9;
  --primary-900: #f8fafc;
  
  /* Dark Mode Backgrounds */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-paper: #1e293b;
  
  /* Dark Mode Surfaces */
  --surface-primary: #1e293b;
  --surface-secondary: #334155;
  --surface-elevated: #334155;
  --surface-overlay: #1e293b;
  
  /* Dark Mode Borders */
  --border-light: #334155;
  --border-medium: #475569;
  --border-dark: #64748b;
}
```

## Responsive Breakpoints

### Breakpoint System
```css
:root {
  /* Responsive Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## Icon System

### Icon Sizes
```css
:root {
  /* Icon Sizes */
  --icon-xs: 0.75rem;   /* 12px */
  --icon-sm: 1rem;      /* 16px */
  --icon-md: 1.25rem;   /* 20px */
  --icon-lg: 1.5rem;    /* 24px */
  --icon-xl: 2rem;      /* 32px */
  --icon-2xl: 2.5rem;   /* 40px */
}
```

### Icon Colors
```css
:root {
  /* Icon Colors */
  --icon-primary: var(--primary-600);
  --icon-secondary: var(--primary-400);
  --icon-disabled: var(--primary-300);
  --icon-success: var(--accent-green);
  --icon-warning: var(--accent-yellow);
  --icon-error: var(--accent-red);
  --icon-info: var(--accent-blue);
}
```

## Z-Index Scale

### Z-Index System
```css
:root {
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```

## Usage Guidelines

### Color Usage
- **Primary colors** for main UI elements and text
- **Accent colors** for interactive elements and feedback
- **Suggestion colors** specifically for writing suggestions
- **Background colors** for different surface levels
- **Border colors** for separation and definition

### Typography Usage
- **Serif fonts** for writing content and long-form text
- **Sans-serif fonts** for UI elements and navigation
- **Monospace fonts** for code snippets and technical content
- **Consistent sizing** using the defined scale

### Spacing Usage
- **8px base unit** for all spacing calculations
- **Component spacing** for consistent component layouts
- **Responsive spacing** that adapts to screen size

### Shadow Usage
- **Subtle shadows** for depth and hierarchy
- **Consistent elevation** across similar components
- **Hover states** with enhanced shadows

This design system ensures visual consistency across the WordWise application while maintaining the minimalist academic aesthetic and supporting the responsive, iconographic design requirements. 