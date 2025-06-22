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

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextEditor } from '@/components/editor/text-editor';
import { VersionHistory } from '@/components/editor/version-history';
import { useAuth, useDocument } from '@/hooks';
import type { DocumentVersion } from '@/types/document';

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
export default function DocumentEditorPage({
  params,
}: {
  params: { projectId: string; documentId: string };
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [error] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const projectId = params.projectId as string;
  const documentId = params.documentId as string;

  const {
    document,
    status,
    restoreVersion,
    refreshDocument,
    clearDocument,
    updateContent,
    trackContentChange,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt,
  } = useDocument(documentId);

  const handleVersionRestore = async (version: DocumentVersion) => {
    try {
      await restoreVersion(version);
      setShowVersionHistory(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error restoring version:', error);
    }
  };

  const handleBackToProject = () => {
    clearDocument();
    router.push(`/dashboard/projects/${projectId}`);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading document...</p>
        </div>
      </div>
    );
  }

  if (status === 'error' || !document) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
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
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-primary-200 bg-background-primary">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleBackToProject}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">{document.title}</h1>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowVersionHistory(true)}>
          Version History
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <TextEditor
          document={document}
          updateContent={updateContent}
          trackContentChange={trackContentChange}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          lastSavedAt={lastSavedAt?.toISOString()}
          onContentChange={() => {
            // Content change handling is done within the TextEditor component
          }}
        />
      </div>
      {showVersionHistory && (
        <VersionHistory
          documentId={documentId}
          userId={user!.uid}
          onVersionRestore={handleVersionRestore}
          isVisible={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
    </div>
  );
} 