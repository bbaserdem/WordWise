/**
 * @fileoverview Custom hook for real-time document management.
 *
 * This hook provides real-time document synchronization across browser sessions,
 * including document loading, updates, and conflict resolution. It uses Firestore
 * real-time listeners to keep documents in sync across multiple tabs and windows.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks';
import { 
  getDocument, 
  listenToDocument, 
  updateDocumentContent,
  updateDocument,
  createDocumentVersion,
  getDocumentVersions,
} from '@/lib/db/documents';
import type {
  Document,
  DocumentVersion,
  UpdateDocumentFormData,
} from '@/types/document';

/**
 * Document loading and sync status.
 *
 * @since 1.0.0
 */
export type DocumentStatus = 'loading' | 'loaded' | 'error' | 'syncing' | 'offline';

/**
 * Real-time document hook return type.
 *
 * @since 1.0.0
 */
export interface UseDocumentReturn {
  /** Current document data */
  document: Document | null;
  /** Document loading status */
  status: DocumentStatus;
  /** Error message if any */
  error: string | null;
  /** Whether document is being saved */
  isSaving: boolean;
  /** Whether document has unsaved changes */
  hasUnsavedChanges: boolean;
  /** Last save timestamp */
  lastSavedAt: Date | null;
  /** Document versions */
  versions: DocumentVersion[];
  /** Load document by ID */
  loadDocument: (documentId: string) => Promise<void>;
  /** Update document content with real-time sync */
  updateContent: (content: string, options?: { isAutoSave?: boolean; description?: string }) => Promise<void>;
  /** Track content changes for unsaved changes state */
  trackContentChange: (content: string) => void;
  /** Save document manually */
  saveDocument: (updateData: UpdateDocumentFormData) => Promise<void>;
  /** Restore document version */
  restoreVersion: (version: DocumentVersion) => Promise<void>;
  /** Refresh document data */
  refreshDocument: () => Promise<void>;
  /** Clear document data */
  clearDocument: () => void;
}

/**
 * Hook for real-time document management.
 *
 * This hook provides comprehensive document management with real-time
 * synchronization across browser sessions. It handles document loading,
 * updates, version management, and conflict resolution.
 *
 * @param documentId - ID of the document to manage (optional, can be set later)
 * @returns Object containing document state and management functions
 *
 * @example
 * ```tsx
 * const { 
 *   document, 
 *   status, 
 *   updateContent, 
 *   saveDocument 
 * } = useDocument('doc123');
 * 
 * // Update content with real-time sync
 * await updateContent('New content...', { isAutoSave: true });
 * 
 * // Save document manually
 * await saveDocument({ title: 'Updated Title', content: 'New content' });
 * ```
 *
 * @since 1.0.0
 */
export function useDocument(initialDocumentId?: string): UseDocumentReturn {
  const { user } = useAuth();
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastContentRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Document state
  const [document, setDocument] = useState<Document | null>(null);
  const [status, setStatus] = useState<DocumentStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);

  /**
   * Track content changes to update unsaved changes state.
   *
   * @param content - Current content
   * @since 1.0.0
   */
  const trackContentChange = useCallback((content: string) => {
    if (!document) return;
    
    const hasChanges = content !== lastContentRef.current;
    setHasUnsavedChanges(hasChanges);
  }, [document]);

  /**
   * Load document by ID with real-time listener.
   *
   * @param documentId - ID of the document to load
   * @since 1.0.0
   */
  const loadDocument = useCallback(async (documentId: string) => {
    if (!user) {
      setError('User not authenticated');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      setError(null);

      // Clear any existing listener
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      // Set up real-time listener
      const unsubscribe = listenToDocument(
        documentId,
        user.uid,
        (updatedDocument) => {
          if (updatedDocument) {
            setDocument(updatedDocument);
            lastContentRef.current = updatedDocument.content;
            setLastSavedAt(updatedDocument.updatedAt.toDate());
            setHasUnsavedChanges(false);
            setStatus('loaded');
          } else {
            setError('Document not found');
            setStatus('error');
          }
        },
        (error) => {
          console.error('Document listener error:', error);
          setError(error.message);
          setStatus('error');
        }
      );

      unsubscribeRef.current = unsubscribe;

      // Load initial document data
      const initialDocument = await getDocument(documentId, user.uid);
      if (initialDocument) {
        setDocument(initialDocument);
        lastContentRef.current = initialDocument.content;
        setLastSavedAt(initialDocument.updatedAt.toDate());
        setStatus('loaded');

        // Load document versions
        try {
          const documentVersions = await getDocumentVersions(documentId, user.uid, 20);
          setVersions(documentVersions);
        } catch (versionError) {
          console.warn('Failed to load document versions:', versionError);
        }
      } else {
        setError('Document not found');
        setStatus('error');
      }
    } catch (error) {
      console.error('Error loading document:', error);
      setError(error instanceof Error ? error.message : 'Failed to load document');
      setStatus('error');
    }
  }, [user]);

  /**
   * Update document content with real-time synchronization.
   *
   * @param content - New document content
   * @param options - Update options
   * @since 1.0.0
   */
  const updateContent = useCallback(async (
    content: string,
    options: { isAutoSave?: boolean; description?: string } = {}
  ) => {
    if (!user || !document) {
      console.warn('Cannot update content: user not authenticated or document not loaded');
      return;
    }

    // Check if content actually changed
    if (content === lastContentRef.current) {
      return;
    }

    try {
      setIsSaving(true);
      setStatus('syncing');

      await updateDocumentContent(document.id, user.uid, content, {
        isAutoSave: options.isAutoSave,
        description: options.description,
        updateStats: true,
      });

      lastContentRef.current = content;
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
    } catch (error) {
      console.error('Error updating document content:', error);
      setError(error instanceof Error ? error.message : 'Failed to update document');
      setStatus('error');
    } finally {
      setIsSaving(false);
      if (status === 'syncing') {
        setStatus('loaded');
      }
    }
  }, [user, document, status]);

  /**
   * Save document manually with full update data.
   *
   * @param updateData - Document update data
   * @since 1.0.0
   */
  const saveDocument = useCallback(async (updateData: UpdateDocumentFormData) => {
    if (!user || !document) {
      console.warn('Cannot save document: user not authenticated or document not loaded');
      return;
    }

    try {
      setIsSaving(true);
      setStatus('syncing');

      const updatedDocument = await updateDocument(document.id, user.uid, updateData);

      // Create version for manual save
      await createDocumentVersion(
        document.id,
        user.uid,
        updateData.content,
        'Manual save',
        false
      );

      setDocument(updatedDocument);
      lastContentRef.current = updateData.content;
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
    } catch (error) {
      console.error('Error saving document:', error);
      setError(error instanceof Error ? error.message : 'Failed to save document');
      setStatus('error');
    } finally {
      setIsSaving(false);
      if (status === 'syncing') {
        setStatus('loaded');
      }
    }
  }, [user, document, status]);

  /**
   * Restore document to a previous version.
   *
   * @param version - Version to restore
   * @since 1.0.0
   */
  const restoreVersion = useCallback(async (version: DocumentVersion) => {
    if (!user || !document) {
      console.warn('Cannot restore version: user not authenticated or document not loaded');
      return;
    }

    try {
      setIsSaving(true);
      setStatus('syncing');

      await updateDocumentContent(document.id, user.uid, version.content, {
        isAutoSave: false,
        description: `Restored to version ${version.version}`,
        updateStats: true,
      });

      // Create version for restoration
      await createDocumentVersion(
        document.id,
        user.uid,
        version.content,
        `Restored to version ${version.version}`,
        false
      );

      lastContentRef.current = version.content;
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
    } catch (error) {
      console.error('Error restoring version:', error);
      setError(error instanceof Error ? error.message : 'Failed to restore version');
      setStatus('error');
    } finally {
      setIsSaving(false);
      if (status === 'syncing') {
        setStatus('loaded');
      }
    }
  }, [user, document, status]);

  /**
   * Refresh document data and versions.
   *
   * @since 1.0.0
   */
  const refreshDocument = useCallback(async () => {
    if (!user || !document) {
      return;
    }

    try {
      setStatus('syncing');

      // Refresh document data
      const refreshedDocument = await getDocument(document.id, user.uid);
      if (refreshedDocument) {
        setDocument(refreshedDocument);
        lastContentRef.current = refreshedDocument.content;
        setLastSavedAt(refreshedDocument.updatedAt.toDate());
      }

      // Refresh versions
      const documentVersions = await getDocumentVersions(document.id, user.uid, 20);
      setVersions(documentVersions);

      setStatus('loaded');
    } catch (error) {
      console.error('Error refreshing document:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh document');
      setStatus('error');
    }
  }, [user, document]);

  /**
   * Clear document data and stop listeners.
   *
   * @since 1.0.0
   */
  const clearDocument = useCallback(() => {
    // Clear any existing listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Clear timeouts
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Reset state
    setDocument(null);
    setStatus('loading');
    setError(null);
    setIsSaving(false);
    setHasUnsavedChanges(false);
    setLastSavedAt(null);
    setVersions([]);
    lastContentRef.current = '';
  }, []);

  // Load document on mount if documentId is provided
  useEffect(() => {
    if (initialDocumentId && user) {
      loadDocument(initialDocumentId);
    }
  }, [initialDocumentId, user, loadDocument]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    document,
    status,
    error,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt,
    versions,
    loadDocument,
    updateContent,
    trackContentChange,
    saveDocument,
    restoreVersion,
    refreshDocument,
    clearDocument,
  };
} 