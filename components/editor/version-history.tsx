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

import React, { useState, useEffect } from 'react';
import { History, RotateCcw, Eye, Calendar, User } from 'lucide-react';
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
  /** Current document content for comparison */
  currentContent: string;
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
 * @param currentContent - Current document content for comparison
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
 *   currentContent="Current document content..."
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
  currentContent,
  onVersionRestore,
  isVisible,
  onClose,
  className,
}: VersionHistoryProps) {
  const { user } = useAuth();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);

  // Load versions when component becomes visible
  useEffect(() => {
    if (isVisible && user) {
      loadVersions();
    }
  }, [isVisible, user, documentId]);

  /**
   * Load document versions from the database.
   *
   * @since 1.0.0
   */
  const loadVersions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const documentVersions = await getDocumentVersions(documentId, user.uid, 50);
      setVersions(documentVersions);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
  const handleVersionRestore = (version: DocumentVersion) => {
    if (confirm('Are you sure you want to restore this version? This will replace your current content.')) {
      onVersionRestore?.(version);
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

  if (!isVisible) return null;

  return (
    <div className={cn('fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center', className)}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary-200">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-text-primary">Version History</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Version List */}
          <div className="w-1/3 border-r border-primary-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-text-primary mb-3">Versions</h3>
              
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-sm text-text-secondary mt-2">Loading versions...</p>
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-text-secondary">No versions found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {versions.map((version) => {
                    const diff = calculateDiff(version.content, currentContent);
                    const isSelected = selectedVersion?.id === version.id;
                    
                    return (
                      <div
                        key={version.id}
                        className={cn(
                          'p-3 rounded-lg border cursor-pointer transition-colors',
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-primary-200 hover:border-primary-300 hover:bg-primary-25'
                        )}
                        onClick={() => handleVersionSelect(version)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-text-primary">
                              Version {version.version}
                            </span>
                            {version.isAutoSave && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Auto-save
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVersionRestore(version);
                            }}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="text-xs text-text-secondary mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatTimestamp(version.createdAt)}</span>
                          </div>
                        </div>
                        
                        {version.description && (
                          <p className="text-xs text-text-secondary mb-2">
                            {version.description}
                          </p>
                        )}
                        
                        <div className="text-xs text-text-secondary">
                          <span>{version.content.split(/\s+/).length} words</span>
                          {diff.added > 0 && (
                            <span className="text-green-600 ml-2">+{diff.added} added</span>
                          )}
                          {diff.removed > 0 && (
                            <span className="text-red-600 ml-2">-{diff.removed} removed</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Version Content */}
          <div className="flex-1 flex flex-col">
            {selectedVersion ? (
              <>
                <div className="p-4 border-b border-primary-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-text-primary">
                      Version {selectedVersion.version} Content
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVersionRestore(selectedVersion)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restore This Version
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-serif text-text-primary text-sm leading-relaxed">
                      {selectedVersion.content}
                    </pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                  <p className="text-text-secondary">Select a version to view its content</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 