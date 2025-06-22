/**
 * @fileoverview Main component exports for the WordWise application.
 *
 * This file exports all the main components used throughout the application,
 * providing a centralized import location for better organization and
 * easier component discovery.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Editor components
export { TextEditor } from './editor/text-editor';
export { ConfidenceIndicator, CompactConfidenceIndicator } from './editor/confidence-indicator';
export { VersionHistory } from './editor/version-history';
export { SuggestionHighlighter } from './editor/suggestion-highlighter';
export { SuggestionSidebar } from './editor/suggestion-sidebar';

// UI components
export { Button } from './ui/button';
export { Input } from './ui/input';
export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';
export { ThemeToggle } from './ui/theme-toggle';

// Layout components
export { Header } from './layout/header';
export { Sidebar } from './layout/sidebar';

// Form components
export { ProjectForm } from './forms/project-form';

// Common components
export { LoadingSpinner } from './common/loading-spinner';
export { ErrorBoundary } from './common/error-boundary';

// Common Components
export * from './common/connection-status';
export * from './common/version-display'; 