/**
 * @fileoverview Document editor page for the WordWise application.
 *
 * This page provides a comprehensive document editing experience with
 * the text editor, version history, and document management features.
 * It integrates all the editor components for a complete writing experience.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, History, Settings, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextEditor } from '@/components/editor/text-editor';
import { VersionHistory } from '@/components/editor/version-history';
import { useAuth, useDocument } from '@/hooks';
import type { Document, DocumentVersion } from '@/types/document';

/**
 * Document editor page component.
 *
 * This component provides a comprehensive document editing experience
 * with the text editor, version history, and document management features.
 * It handles document loading, saving, and version management with real-time
 * synchronization across browser sessions.
 *
 * @returns The document editor page component
 *
 * @since 1.0.0
 */
export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const projectId = params.projectId as string;
  const documentId = params.documentId as string;

  // Real-time document management
  const {
    document,
    status,
    error,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt,
    versions,
    updateContent,
    saveDocument,
    restoreVersion,
    refreshDocument,
    clearDocument,
  } = useDocument(documentId);

  // UI state
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [currentContent, setCurrentContent] = useState('');

  // Update current content when document changes
  useEffect(() => {
    if (document) {
      setCurrentContent(document.content);
    }
  }, [document]);

  /**
   * Handle document save.
   *
   * @param updatedDocument - The updated document
   * @since 1.0.0
   */
  const handleDocumentSave = (updatedDocument: Document) => {
    // The real-time hook handles document updates automatically
    // This callback is mainly for UI feedback
    console.log('Document saved:', updatedDocument.title);
  };

  /**
   * Handle content change.
   *
   * @param content - The new content
   * @since 1.0.0
   */
  const handleContentChange = (content: string) => {
    setCurrentContent(content);
  };

  /**
   * Handle version restoration.
   *
   * @param version - The version to restore
   * @since 1.0.0
   */
  const handleVersionRestore = async (version: DocumentVersion) => {
    try {
      await restoreVersion(version);
      setShowVersionHistory(false);
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  /**
   * Navigate back to project.
   *
   * @since 1.0.0
   */
  const handleBackToProject = () => {
    // Clear document data before navigating
    clearDocument();
    router.push(`/dashboard/projects/${projectId}`);
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading document...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error' || !document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Document Not Found</h1>
          <p className="text-text-secondary mb-6">{error || 'The document you are looking for does not exist.'}</p>
          <div className="space-x-4">
            <Button onClick={handleBackToProject}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
            {error && (
              <Button variant="outline" onClick={refreshDocument}>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-200 bg-background-primary">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToProject}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold text-text-primary">
              {document.title}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <span>{document.type} • {document.status}</span>
              {status === 'syncing' && (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600 mr-1"></div>
                  <span>Syncing...</span>
                </div>
              )}
              {isSaving && (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600 mr-1"></div>
                  <span>Saving...</span>
                </div>
              )}
              {lastSavedAt && (
                <span>• Last saved {lastSavedAt.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Connection Status */}
          <div className="flex items-center text-sm text-text-secondary">
            {status === 'loaded' ? (
              <Wifi className="w-4 h-4 mr-1 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 mr-1 text-red-600" />
            )}
            <span>{status === 'loaded' ? 'Connected' : 'Offline'}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVersionHistory(true)}
          >
            <History className="w-4 h-4 mr-2" />
            Version History
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement document settings
              console.log('Document settings');
            }}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <TextEditor
          document={document}
          onSave={handleDocumentSave}
          onContentChange={handleContentChange}
          updateContent={updateContent}
          className="h-full"
        />
      </div>

      {/* Version History Modal */}
      <VersionHistory
        documentId={document.id}
        currentContent={currentContent}
        onVersionRestore={handleVersionRestore}
        isVisible={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
      />
    </div>
  );
} 