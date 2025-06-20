/**
 * @fileoverview Document type definitions for the WordWise application.
 *
 * This file defines TypeScript interfaces and types related to documents,
 * including document data structures, version management, and
 * document-related operations.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Represents a document in the WordWise application.
 *
 * This interface defines the structure of document data stored in Firestore,
 * including content, metadata, and relationships to projects.
 *
 * @since 1.0.0
 */
export interface Document {
  /** Unique identifier for the document */
  id: string;
  /** ID of the project this document belongs to */
  projectId: string;
  /** ID of the user who owns the document */
  userId: string;
  /** Document title */
  title: string;
  /** Document content in markdown format */
  content: string;
  /** Document type/category */
  type: DocumentType;
  /** Document status */
  status: DocumentStatus;
  /** Document order within the project */
  order: number;
  /** Parent folder ID (if organized in folders) */
  folderId?: string;
  /** Document tags for organization */
  tags: string[];
  /** Document metadata */
  metadata: DocumentMetadata;
  /** Document statistics */
  stats: DocumentStats;
  /** Current version number */
  version: number;
  /** When the document was created */
  createdAt: Timestamp;
  /** When the document was last updated */
  updatedAt: Timestamp;
  /** When the document was last accessed */
  lastAccessedAt?: Timestamp;
}

/**
 * Document types/categories.
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
  | 'literature-review'
  | 'acknowledgments'
  | 'other';

/**
 * Document status values.
 *
 * @since 1.0.0
 */
export type DocumentStatus =
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'archived';

/**
 * Document metadata and settings.
 *
 * @since 1.0.0
 */
export interface DocumentMetadata {
  /** Document description/summary */
  description?: string;
  /** Whether auto-save is enabled for this document */
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
  /** Document language */
  language: string;
  /** Document word count target */
  wordCountTarget?: number;
  /** Document character count target */
  characterCountTarget?: number;
  /** Document deadline */
  deadline?: Timestamp;
}

/**
 * Document statistics and metrics.
 *
 * @since 1.0.0
 */
export interface DocumentStats {
  /** Current word count */
  wordCount: number;
  /** Current character count */
  characterCount: number;
  /** Current paragraph count */
  paragraphCount: number;
  /** Current sentence count */
  sentenceCount: number;
  /** Number of suggestions applied */
  suggestionsApplied: number;
  /** Number of suggestions ignored */
  suggestionsIgnored: number;
  /** Time spent writing (in minutes) */
  timeSpentWriting: number;
  /** Last writing session duration (in minutes) */
  lastSessionDuration: number;
  /** Number of versions created */
  versionCount: number;
  /** Number of collaborators */
  collaboratorCount: number;
  /** Last save timestamp */
  lastSavedAt?: Timestamp;
}

/**
 * Document version for version history.
 *
 * @since 1.0.0
 */
export interface DocumentVersion {
  /** Unique identifier for the version */
  id: string;
  /** ID of the document this version belongs to */
  documentId: string;
  /** ID of the user who created this version */
  userId: string;
  /** Version number */
  version: number;
  /** Document content at this version */
  content: string;
  /** Version description/commit message */
  description?: string;
  /** Whether this was an auto-save */
  isAutoSave: boolean;
  /** When this version was created */
  createdAt: Timestamp;
}

/**
 * Document creation form data structure.
 *
 * @since 1.0.0
 */
export interface CreateDocumentFormData {
  /** Document title */
  title: string;
  /** Document description */
  description?: string;
  /** Document type */
  type: DocumentType;
  /** Document content */
  content: string;
  /** Document tags */
  tags: string[];
  /** Document order */
  order: number;
  /** Parent folder ID */
  folderId?: string;
  /** Whether to enable auto-save */
  enableAutoSave: boolean;
  /** Whether to enable collaboration */
  enableCollaboration: boolean;
}

/**
 * Document update form data structure.
 *
 * @since 1.0.0
 */
export interface UpdateDocumentFormData {
  /** Document title */
  title: string;
  /** Document description */
  description?: string;
  /** Document type */
  type: DocumentType;
  /** Document status */
  status: DocumentStatus;
  /** Document content */
  content: string;
  /** Document tags */
  tags: string[];
  /** Document order */
  order: number;
  /** Parent folder ID */
  folderId?: string;
  /** Document metadata */
  metadata: Partial<DocumentMetadata>;
}

/**
 * Document filter options for listing documents.
 *
 * @since 1.0.0
 */
export interface DocumentFilters {
  /** Filter by document type */
  type?: DocumentType;
  /** Filter by document status */
  status?: DocumentStatus;
  /** Filter by tags */
  tags?: string[];
  /** Search term for document title/content */
  search?: string;
  /** Filter by folder ID */
  folderId?: string;
  /** Sort field */
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'lastAccessedAt' | 'order';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Page number for pagination */
  page?: number;
  /** Number of items per page */
  limit?: number;
}

/**
 * Document list response structure.
 *
 * @since 1.0.0
 */
export interface DocumentListResponse {
  /** List of documents */
  documents: Document[];
  /** Total number of documents matching filters */
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
 * Document template for creating new documents.
 *
 * @since 1.0.0
 */
export interface DocumentTemplate {
  /** Template ID */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Template type */
  type: DocumentType;
  /** Template content */
  content: string;
  /** Template tags */
  tags: string[];
  /** Whether this is a default template */
  isDefault: boolean;
  /** Template metadata */
  metadata: DocumentMetadata;
}

/**
 * Document export options.
 *
 * @since 1.0.0
 */
export interface DocumentExportOptions {
  /** Export format */
  format: 'pdf' | 'docx' | 'txt' | 'md' | 'html';
  /** Whether to include metadata */
  includeMetadata: boolean;
  /** Whether to include version history */
  includeVersionHistory: boolean;
  /** Whether to include suggestions */
  includeSuggestions: boolean;
  /** Custom styling options */
  styling?: {
    /** Font family */
    fontFamily?: string;
    /** Font size */
    fontSize?: number;
    /** Line spacing */
    lineSpacing?: number;
    /** Page margins */
    margins?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
} 