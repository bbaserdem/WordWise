/**
 * @fileoverview Main text editor component for the WordWise application.
 *
 * This component provides a comprehensive text editing experience with
 * auto-save functionality, version history, real-time synchronization,
 * and basic export capabilities. It's designed for academic writing
 * with support for markdown formatting.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Download, History, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/hooks';
import { updateDocument, createDocumentVersion } from '@/lib/db/documents';
import type { Document } from '@/types/document';

/**
 * Text editor component props interface.
 *
 * @since 1.0.0
 */
interface TextEditorProps {
  /** The document to edit */
  document: Document;
  /** Callback when document is saved */
  onSave?: (document: Document) => void;
  /** Callback when document content changes */
  onContentChange?: (content: string) => void;
  /** Whether to show the editor in full-screen mode */
  fullScreen?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Save status for the editor.
 *
 * @since 1.0.0
 */
type SaveStatus = 'saved' | 'saving' | 'error' | 'offline' | 'unsaved';

/**
 * Main text editor component for document editing.
 *
 * This component provides a comprehensive text editing experience with
 * auto-save functionality, version history, and real-time synchronization.
 * It supports markdown formatting and is optimized for academic writing.
 *
 * @param document - The document to edit
 * @param onSave - Callback when document is saved
 * @param onContentChange - Callback when document content changes
 * @param fullScreen - Whether to show the editor in full-screen mode
 * @param className - Additional CSS classes
 * @returns The text editor component
 *
 * @example
 * ```tsx
 * <TextEditor
 *   document={currentDocument}
 *   onSave={(doc) => console.log('Document saved:', doc)}
 *   onContentChange={(content) => console.log('Content changed:', content)}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function TextEditor({
  document,
  onSave,
  onContentChange,
  fullScreen = false,
  className,
}: TextEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(0);
  const hasUnsavedChangesRef = useRef<boolean>(false);
  const contentRef = useRef<string>(document.content);

  // Editor state
  const [content, setContent] = useState(document.content);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [isFullScreen, setIsFullScreen] = useState(fullScreen);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Calculate word and character counts
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const characters = content.length;
    setWordCount(words);
    setCharacterCount(characters);
  }, [content]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    console.log('Auto-save triggered:', {
      user: !!user,
      hasUnsavedChanges: hasUnsavedChangesRef.current,
      content: contentRef.current.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
    
    if (!user || !hasUnsavedChangesRef.current) return;

    // Prevent rapid successive saves (minimum 2 seconds between saves)
    const now = Date.now();
    if (now - lastSaveTimeRef.current < 2000) {
      console.log('Auto-save skipped: too soon since last save');
      return;
    }

    try {
      setSaveStatus('saving');
      lastSaveTimeRef.current = now;
      
      // Update document content
      const updatedDocument = await updateDocument(document.id, user.uid, {
        title: document.title,
        description: document.metadata.description || '',
        type: document.type,
        status: document.status,
        content: contentRef.current,
        tags: document.tags,
        order: document.order,
        metadata: {
          ...document.metadata,
        },
      });

      // Create version for auto-save
      await createDocumentVersion(
        document.id,
        user.uid,
        contentRef.current,
        'Auto-save',
        true
      );

      setSaveStatus('saved');
      hasUnsavedChangesRef.current = false;
      onSave?.(updatedDocument);
      console.log('Auto-save completed successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
    }
  }, [user, document, onSave]);

  // Set up auto-save interval
  useEffect(() => {
    if (document.metadata.enableAutoSave) {
      // Ensure minimum 30-second interval to prevent abuse
      const autoSaveInterval = Math.max(document.metadata.autoSaveInterval || 30, 30);
      
      // Clear any existing interval
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      
      // Set up new interval that runs every autoSaveInterval seconds
      autoSaveIntervalRef.current = setInterval(autoSave, autoSaveInterval * 1000);
      
      // Cleanup on unmount
      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [document.metadata.enableAutoSave, document.metadata.autoSaveInterval, autoSave]);

  // Manual save functionality
  const handleManualSave = async () => {
    if (!user) return;

    // Prevent rapid successive saves (minimum 2 seconds between saves)
    const now = Date.now();
    if (now - lastSaveTimeRef.current < 2000) {
      return;
    }

    try {
      setSaveStatus('saving');
      lastSaveTimeRef.current = now;
      
      // Update document content
      const updatedDocument = await updateDocument(document.id, user.uid, {
        title: document.title,
        description: document.metadata.description || '',
        type: document.type,
        status: document.status,
        content: content,
        tags: document.tags,
        order: document.order,
        metadata: {
          ...document.metadata,
        },
      });

      // Create version for manual save
      await createDocumentVersion(
        document.id,
        user.uid,
        content,
        'Manual save',
        false
      );

      setSaveStatus('saved');
      hasUnsavedChangesRef.current = false;
      onSave?.(updatedDocument);
    } catch (error) {
      console.error('Manual save failed:', error);
      setSaveStatus('error');
    }
  };

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    contentRef.current = newContent;
    onContentChange?.(newContent);
    
    // Mark that there are unsaved changes and update status
    if (newContent !== document.content) {
      hasUnsavedChangesRef.current = true;
      if (saveStatus === 'saved') {
        setSaveStatus('unsaved');
      }
    } else {
      hasUnsavedChangesRef.current = false;
      setSaveStatus('saved');
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S for save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleManualSave();
    }

    // Ctrl/Cmd + Enter for full-screen toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      setIsFullScreen(!isFullScreen);
    }
  };

  // Export functionality
  const handleExport = (format: 'txt' | 'md') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = globalThis.document.createElement('a');
    a.href = url;
    a.download = `${document.title}.${format}`;
    globalThis.document.body.appendChild(a);
    a.click();
    globalThis.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background-primary',
        isFullScreen && 'fixed inset-0 z-50',
        className
      )}
    >
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-primary-200 bg-white">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </Button>

          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{characterCount} characters</span>
          </div>

          {/* Save status indicator */}
          <div className="flex items-center space-x-1">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                saveStatus === 'saved' && 'bg-green-500',
                saveStatus === 'saving' && 'bg-yellow-500',
                saveStatus === 'error' && 'bg-red-500',
                saveStatus === 'offline' && 'bg-gray-500',
                saveStatus === 'unsaved' && 'bg-orange-500'
              )}
            />
            <span className="text-xs text-text-secondary capitalize">
              {saveStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('txt')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export TXT
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('md')}
          >
            <Download className="w-4 h-4 mr-2" />
            Export MD
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Text Editor */}
        <div className="flex-1 flex flex-col">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder="Start writing your document..."
            className="flex-1 w-full p-6 resize-none border-none outline-none bg-background-primary text-text-primary font-serif text-lg leading-relaxed"
            style={{
              fontFamily: 'Georgia, serif',
              lineHeight: '1.8',
            }}
          />
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-primary-200 bg-white overflow-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Preview
              </h3>
              <div className="prose prose-lg max-w-none">
                <pre className="whitespace-pre-wrap font-serif text-text-primary">
                  {content}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 