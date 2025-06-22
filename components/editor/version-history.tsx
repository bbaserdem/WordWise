/**
 * @fileoverview Version history component for the WordWise application.
 *
 * This component displays a list of document versions with the ability
 * to view, compare, and restore previous versions. It shows both
 * manual saves and auto-saves with timestamps and descriptions.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Download, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/hooks';
import { getDocumentVersions } from '@/lib/db/documents';
import type { DocumentVersion } from '@/types/document';

/**
 * Version history component props interface.
 *
 * @since 1.0.0
 */
interface VersionHistoryProps {
  /** ID of the document to show versions for */
  documentId: string;
  /** ID of the user to show versions for */
  userId: string;
  /** Callback when a version is selected */
  onVersionSelect?: (version: DocumentVersion) => void;
  /** Callback when a version is restored */
  onVersionRestore?: (version: DocumentVersion) => void;
  /** Whether the component is visible */
  isVisible: boolean;
  /** Callback to close the version history */
  onClose: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Version history component for document version management.
 *
 * This component displays a list of document versions with the ability
 * to view, compare, and restore previous versions. It shows both
 * manual saves and auto-saves with timestamps and descriptions.
 *
 * @param documentId - ID of the document to show versions for
 * @param userId - ID of the user to show versions for
 * @param onVersionSelect - Callback when a version is selected
 * @param onVersionRestore - Callback when a version is restored
 * @param isVisible - Whether the component is visible
 * @param onClose - Callback to close the version history
 * @param className - Additional CSS classes
 * @returns The version history component
 *
 * @example
 * ```tsx
 * <VersionHistory
 *   documentId="doc123"
 *   userId="user123"
 *   onVersionSelect={(version) => console.log('Selected version:', version)}
 *   onVersionRestore={(version) => console.log('Restoring version:', version)}
 *   isVisible={true}
 *   onClose={() => setShowHistory(false)}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function VersionHistory({
  documentId,
  userId,
  onVersionSelect,
  onVersionRestore,
  isVisible,
  onClose,
  className,
}: VersionHistoryProps) {
  const { user } = useAuth();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  /**
   * Load document versions from the database.
   *
   * @since 1.0.0
   */
  const loadVersions = useCallback(async () => {
    if (!documentId || !userId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const versionsData = await getDocumentVersions(documentId, userId);
      setVersions(versionsData);
    } catch (error) {
      console.error('Error loading versions:', error);
      setError('Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  }, [documentId, userId]);

  // Load versions on mount
  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  /**
   * Handle version selection for viewing.
   *
   * @param version - The version to select
   * @since 1.0.0
   */
  const handleVersionSelect = (version: DocumentVersion) => {
    setSelectedVersion(version);
    setShowDiff(true);
  };

  /**
   * Handle version restoration.
   *
   * @param version - The version to restore
   * @since 1.0.0
   */
  const handleVersionRestore = async (version: DocumentVersion) => {
    if (confirm('Are you sure you want to restore this version? This will replace your current content.')) {
      await onVersionRestore?.(version);
      onClose();
    }
  };

  /**
   * Format timestamp for display.
   *
   * @param timestamp - The timestamp to format
   * @returns Formatted date string
   * @since 1.0.0
   */
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  /**
   * Calculate simple diff between two strings.
   *
   * @param oldText - The old text
   * @param newText - The new text
   * @returns Diff information
   * @since 1.0.0
   */
  const calculateDiff = (oldText: string, newText: string) => {
    const oldWords = oldText.split(/\s+/);
    const newWords = newText.split(/\s+/);
    
    const added = newWords.filter(word => !oldWords.includes(word)).length;
    const removed = oldWords.filter(word => !newWords.includes(word)).length;
    
    return { added, removed };
  };

  const handleShowDiff = () => {
    if (versions.length > 1) {
      setShowDiff(!showDiff);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={cn('fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center', className)}>
      <div className="bg-background-primary rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-primary-800 bg-background-primary">
          <h2 className="text-lg font-semibold text-text-primary">Version History</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden bg-background-primary">
          {/* Versions List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-primary-800 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-text-primary mb-3">Versions</h3>
            <div className="space-y-2">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors bg-background-primary ${
                    selectedVersion?.id === version.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">
                      Version {versions.length - index}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {formatTimestamp(version.createdAt)}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    {version.isAutoSave ? 'Auto-save' : 'Manual save'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Version Preview */}
          <div className="flex-1 flex flex-col">
            {selectedVersion ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-primary-800 bg-background-primary">
                  <h3 className="text-sm font-medium text-text-primary">
                    Version {versions.findIndex(v => v.id === selectedVersion.id) + 1} Preview
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatTimestamp(selectedVersion.createdAt)}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-background-primary">
                  <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed text-text-primary bg-gray-50 dark:bg-background-secondary p-4 rounded-lg border border-gray-200 dark:border-primary-800">
                    {selectedVersion.content}
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-background-primary">
                <p className="text-text-secondary">Select a version to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 