/**
 * @fileoverview Type exports for the WordWise application.
 *
 * This file exports all TypeScript types and interfaces used throughout
 * the application for easier imports and better organization.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Auth types
export type {
  User,
  UserRole,
  AcademicLevel,
  UserPreferences,
  WritingStyle,
  CitationFormat,
  AuthState,
  LoginFormData,
  RegisterFormData,
  PasswordResetFormData,
  ProfileUpdateFormData,
  AuthErrorType,
  AuthError
} from './auth';

// Document types
export type {
  Document,
  DocumentType,
  DocumentStatus,
  DocumentMetadata,
  DocumentStats,
  DocumentVersion,
  CreateDocumentFormData,
  UpdateDocumentFormData,
  DocumentFilters,
  DocumentListResponse,
  DocumentTemplate,
  DocumentExportOptions
} from './document';

// Project types
export type {
  Project,
  ProjectType,
  ProjectStatus,
  ProjectVisibility,
  ProjectSettings,
  ProjectStats,
  CreateProjectFormData,
  UpdateProjectFormData,
  ProjectFilters,
  ProjectListResponse,
  ProjectTemplate,
  ProjectTemplateStructure,
  TemplateDocument,
  TemplateFolder
} from './project';

// Suggestion types
export type {
  Suggestion,
  SuggestionType,
  SuggestionStatus,
  SuggestionSeverity,
  RawSuggestion,
  ProcessedSuggestions,
  SuggestionStats,
  CreateSuggestionFormData,
  UpdateSuggestionFormData,
  SuggestionFilters,
  SuggestionListResponse,
  BulkSuggestionAction,
  GrammarCheckRequest,
  GrammarCheckResponse,
  SuggestionProcessingOptions,
  RealtimeCheckOptions,
  SuggestionHighlight,
  SuggestionTooltip,
  SuggestionBatchResult,
  SuggestionMetrics
} from './suggestion'; 