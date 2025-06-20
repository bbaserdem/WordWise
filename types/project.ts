/**
 * @fileoverview Project type definitions for the WordWise application.
 * 
 * This file defines TypeScript interfaces and types related to projects,
 * including project data structures, document management, and
 * project-related operations.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

// Fallback type for Timestamp until Firebase is installed
type Timestamp = any;

/**
 * Represents a project in the WordWise application.
 * 
 * This interface defines the structure of project data stored in Firestore,
 * including metadata, settings, and relationships to documents.
 * 
 * @since 1.0.0
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;
  /** ID of the user who owns the project */
  userId: string;
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
  /** Project type/category */
  type: ProjectType;
  /** Project status */
  status: ProjectStatus;
  /** Project visibility settings */
  visibility: ProjectVisibility;
  /** Project tags for organization */
  tags: string[];
  /** Project settings and preferences */
  settings: ProjectSettings;
  /** Project statistics */
  stats: ProjectStats;
  /** When the project was created */
  createdAt: Timestamp;
  /** When the project was last updated */
  updatedAt: Timestamp;
  /** When the project was last accessed */
  lastAccessedAt?: Timestamp;
}

/**
 * Project types/categories.
 * 
 * @since 1.0.0
 */
export type ProjectType = 
  | 'dissertation'
  | 'research-paper'
  | 'thesis'
  | 'journal-article'
  | 'conference-paper'
  | 'book-chapter'
  | 'technical-report'
  | 'proposal'
  | 'other';

/**
 * Project status values.
 * 
 * @since 1.0.0
 */
export type ProjectStatus = 
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'archived';

/**
 * Project visibility settings.
 * 
 * @since 1.0.0
 */
export type ProjectVisibility = 'private' | 'shared' | 'public';

/**
 * Writing style preferences.
 * 
 * @since 1.0.0
 */
export type WritingStyle = 'academic' | 'technical' | 'creative' | 'casual';

/**
 * Citation format preferences.
 * 
 * @since 1.0.0
 */
export type CitationFormat = 'apa' | 'mla' | 'chicago' | 'ieee' | 'harvard';

/**
 * Document types.
 * 
 * @since 1.0.0
 */
export type DocumentType = 
  | 'chapter'
  | 'section'
  | 'appendix'
  | 'bibliography'
  | 'abstract'
  | 'introduction'
  | 'conclusion'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'other';

/**
 * Project settings and preferences.
 * 
 * @since 1.0.0
 */
export interface ProjectSettings {
  /** Whether auto-save is enabled for this project */
  enableAutoSave: boolean;
  /** Auto-save interval in seconds */
  autoSaveInterval: number;
  /** Whether real-time collaboration is enabled */
  enableCollaboration: boolean;
  /** Whether version history is enabled */
  enableVersionHistory: boolean;
  /** Maximum number of versions to keep */
  maxVersions: number;
  /** Whether suggestions are enabled */
  enableSuggestions: boolean;
  /** Writing style for this project */
  writingStyle: WritingStyle;
  /** Citation format for this project */
  citationFormat: CitationFormat;
  /** Language for this project */
  language: string;
  /** Whether spell checking is enabled */
  enableSpellCheck: boolean;
  /** Whether grammar checking is enabled */
  enableGrammarCheck: boolean;
  /** Whether style checking is enabled */
  enableStyleCheck: boolean;
}

/**
 * Project statistics and metrics.
 * 
 * @since 1.0.0
 */
export interface ProjectStats {
  /** Total number of documents in the project */
  documentCount: number;
  /** Total word count across all documents */
  totalWordCount: number;
  /** Total character count across all documents */
  totalCharacterCount: number;
  /** Number of suggestions applied */
  suggestionsApplied: number;
  /** Number of suggestions ignored */
  suggestionsIgnored: number;
  /** Time spent writing (in minutes) */
  timeSpentWriting: number;
  /** Last writing session duration (in minutes) */
  lastSessionDuration: number;
  /** Number of collaborators */
  collaboratorCount: number;
  /** Number of versions created */
  versionCount: number;
}

/**
 * Project creation form data structure.
 * 
 * @since 1.0.0
 */
export interface CreateProjectFormData {
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Project type */
  type: ProjectType;
  /** Project tags */
  tags: string[];
  /** Project visibility */
  visibility: ProjectVisibility;
  /** Whether to enable collaboration */
  enableCollaboration: boolean;
  /** Writing style for the project */
  writingStyle: WritingStyle;
  /** Citation format for the project */
  citationFormat: CitationFormat;
}

/**
 * Project update form data structure.
 * 
 * @since 1.0.0
 */
export interface UpdateProjectFormData {
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Project type */
  type: ProjectType;
  /** Project status */
  status: ProjectStatus;
  /** Project tags */
  tags: string[];
  /** Project visibility */
  visibility: ProjectVisibility;
  /** Project settings */
  settings: Partial<ProjectSettings>;
}

/**
 * Project filter options for listing projects.
 * 
 * @since 1.0.0
 */
export interface ProjectFilters {
  /** Filter by project type */
  type?: ProjectType;
  /** Filter by project status */
  status?: ProjectStatus;
  /** Filter by project visibility */
  visibility?: ProjectVisibility;
  /** Filter by tags */
  tags?: string[];
  /** Search term for project name/description */
  search?: string;
  /** Sort field */
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'lastAccessedAt';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Page number for pagination */
  page?: number;
  /** Number of items per page */
  limit?: number;
}

/**
 * Project list response structure.
 * 
 * @since 1.0.0
 */
export interface ProjectListResponse {
  /** List of projects */
  projects: Project[];
  /** Total number of projects matching filters */
  total: number;
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages */
  hasMore: boolean;
}

/**
 * Project template for creating new projects.
 * 
 * @since 1.0.0
 */
export interface ProjectTemplate {
  /** Template ID */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Template type */
  type: ProjectType;
  /** Template settings */
  settings: ProjectSettings;
  /** Template structure/documents */
  structure: ProjectTemplateStructure;
  /** Whether this is a default template */
  isDefault: boolean;
  /** Template tags */
  tags: string[];
}

/**
 * Project template structure defining initial documents.
 * 
 * @since 1.0.0
 */
export interface ProjectTemplateStructure {
  /** List of documents to create */
  documents: TemplateDocument[];
  /** Default folder structure */
  folders: TemplateFolder[];
}

/**
 * Template document definition.
 * 
 * @since 1.0.0
 */
export interface TemplateDocument {
  /** Document title */
  title: string;
  /** Document content template */
  content: string;
  /** Document type */
  type: DocumentType;
  /** Document order in the project */
  order: number;
  /** Parent folder ID */
  folderId?: string;
}

/**
 * Template folder definition.
 * 
 * @since 1.0.0
 */
export interface TemplateFolder {
  /** Folder name */
  name: string;
  /** Folder description */
  description?: string;
  /** Parent folder ID */
  parentId?: string;
  /** Folder order */
  order: number;
} 