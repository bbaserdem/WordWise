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
import { ArrowLeft, History, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextEditor } from '@/components/editor/text-editor';
import { VersionHistory } from '@/components/editor/version-history';
import { useAuth } from '@/hooks';
import { getDocument } from '@/lib/db/documents';
import type { Document, DocumentVersion } from '@/types/document';

/**
 * Document editor page component.
 *
 * This component provides a comprehensive document editing experience
 * with the text editor, version history, and document management features.
 * It handles document loading, saving, and version management.
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

  // Page state
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [currentContent, setCurrentContent] = useState('');

  // Load document on mount
  useEffect(() => {
    if (user && documentId) {
      loadDocument();
    }
  }, [user, documentId]);

  /**
   * Load document from the database.
   *
   * @since 1.0.0
   */
  const loadDocument = async () => {
    if (!user || !documentId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const doc = await getDocument(documentId, user.uid);
      if (!doc) {
        setError('Document not found');
        return;
      }

      setDocument(doc);
      setCurrentContent(doc.content);
    } catch (error) {
      console.error('Error loading document:', error);
      setError('Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle document save.
   *
   * @param updatedDocument - The updated document
   * @since 1.0.0
   */
  const handleDocumentSave = (updatedDocument: Document) => {
    setDocument(updatedDocument);
    setCurrentContent(updatedDocument.content);
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
  const handleVersionRestore = (version: DocumentVersion) => {
    if (document) {
      setCurrentContent(version.content);
      // The TextEditor will handle the actual save when content changes
    }
  };

  /**
   * Navigate back to project.
   *
   * @since 1.0.0
   */
  const handleBackToProject = () => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  // Loading state
  if (isLoading) {
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
  if (error || !document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Document Not Found</h1>
          <p className="text-text-secondary mb-6">{error || 'The document you are looking for does not exist.'}</p>
          <Button onClick={handleBackToProject}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-200 bg-white">
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
            <p className="text-sm text-text-secondary">
              {document.type} • {document.status}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
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