/**
 * @fileoverview Main text editor component for the WordWise application.
 *
 * This component provides a comprehensive text editing experience with
 * auto-save functionality, version history, real-time synchronization,
 * and real-time grammar checking with suggestions.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Download, History, Eye, EyeOff, Share2, Settings, AlertCircle, CheckCircle, Edit, PenTool, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { useAuth, useSuggestions } from '@/hooks';
import { updateDocument, createDocumentVersion } from '@/lib/db/documents';
import type { Document } from '@/types/document';
import { CompactConfidenceIndicator } from '@/components/editor/confidence-indicator';
import { getSuggestionTypeDotColor } from '@/lib/utils/suggestion-utils';
import { SuggestionHighlighter } from '@/components/editor/suggestion-highlighter';
import { SuggestionSidebar } from '@/components/editor/suggestion-sidebar';

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
  /** Real-time update function (optional) */
  updateContent?: (content: string, options?: { isAutoSave?: boolean; description?: string }) => Promise<void>;
  /** Function to track content changes for unsaved changes state */
  trackContentChange?: (content: string) => void;
  /** Whether to show the editor in zen mode */
  zenMode?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether the document is currently being saved */
  isSaving?: boolean;
  /** Whether there are unsaved changes */
  hasUnsavedChanges?: boolean;
  /** Timestamp of the last save */
  lastSavedAt?: string;
  /** Whether to enable real-time grammar checking */
  enableGrammarChecking?: boolean;
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
 * auto-save functionality, version history, real-time synchronization,
 * and real-time grammar checking with suggestions.
 *
 * @param document - The document to edit
 * @param onSave - Callback when document is saved
 * @param onContentChange - Callback when document content changes
 * @param updateContent - Real-time update function (optional)
 * @param trackContentChange - Function to track content changes for unsaved changes state
 * @param zenMode - Whether to show the editor in zen mode (distraction-free)
 * @param className - Additional CSS classes
 * @param enableGrammarChecking - Whether to enable real-time grammar checking
 * @returns The text editor component
 *
 * @example
 * ```tsx
 * <TextEditor
 *   document={currentDocument}
 *   onSave={(doc) => console.log('Document saved:', doc)}
 *   onContentChange={(content) => console.log('Content changed:', content)}
 *   updateContent={updateContent}
 *   trackContentChange={trackContentChange}
 *   enableGrammarChecking={true}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function TextEditor({
  document,
  onSave,
  onContentChange,
  updateContent,
  trackContentChange,
  zenMode = false,
  className,
  isSaving = false,
  hasUnsavedChanges = false,
  lastSavedAt,
  enableGrammarChecking = true,
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
  const [isZenMode, setIsZenMode] = useState(zenMode);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Visual suggestion system state
  const [mode, setMode] = useState<'writing' | 'edit'>('writing');

  // Grammar checking with suggestions
  const {
    suggestions,
    isLoading: isCheckingGrammar,
    error: grammarError,
    checkTextRealtime,
    checkText,
    acceptSuggestion,
    ignoreSuggestion,
    clearSuggestions,
    checkTextManual,
  } = useSuggestions(document.id, {
    enabled: enableGrammarChecking,
    debounceDelay: 1500, // 1.5 seconds debounce for better UX
    minTextLength: 20, // Only check if text is at least 20 characters
    maxTextLength: 10000, // Increased limit for larger documents
    checkOnChange: true,
    checkOnBlur: true,
    checkOnFocus: false,
  });

  // Calculate word and character counts
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const characters = content.length;
    setWordCount(words);
    setCharacterCount(characters);
  }, [content]);

  // Update content when document content changes (e.g., from version restoration)
  useEffect(() => {
    setContent(document.content);
    contentRef.current = document.content;
    hasUnsavedChangesRef.current = false;
    setSaveStatus('saved');
  }, [document.content]);

  // Sync with external save status from useDocument hook
  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving');
    } else if (hasUnsavedChanges) {
      setSaveStatus('unsaved');
      hasUnsavedChangesRef.current = true;
    } else {
      setSaveStatus('saved');
      hasUnsavedChangesRef.current = false;
    }
  }, [isSaving, hasUnsavedChanges]);

  // Trigger grammar checking when content changes
  useEffect(() => {
    if (enableGrammarChecking && content.length > 0) {
      checkTextRealtime(content);
    }
  }, [content, enableGrammarChecking, checkTextRealtime]);

  // Clear suggestions when document changes
  useEffect(() => {
    clearSuggestions();
  }, [document.id, clearSuggestions]);

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
      
      if (updateContent) {
        // Use real-time update function if available
        await updateContent(contentRef.current, { 
          isAutoSave: true, 
          description: 'Auto-save' 
        });
        setSaveStatus('saved');
        hasUnsavedChangesRef.current = false;
      } else {
        // Fallback to traditional update method
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

        onSave?.(updatedDocument);
        setSaveStatus('saved');
        hasUnsavedChangesRef.current = false;
      }

      console.log('Auto-save completed successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
    }
  }, [user, document, onSave, updateContent]);

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
    if (!document || !content.trim()) {
      return;
    }

    try {
      setSaveStatus('saving');
      
      if (updateContent) {
        // Use real-time update function if available
        await updateContent(content, { 
          isAutoSave: false, 
          description: 'Manual save' 
        });
        setSaveStatus('saved');
        hasUnsavedChangesRef.current = false;
      } else {
        // Fallback to traditional save method
        await onSave?.(document);
        setSaveStatus('saved');
        hasUnsavedChangesRef.current = false;
      }
      
      console.log('Manual save completed');
    } catch (error) {
      console.error('Manual save failed:', error);
      setSaveStatus('error');
    }
  };

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    contentRef.current = newContent;
    onContentChange?.(newContent);
    
    // Track content changes for unsaved changes state
    trackContentChange?.(newContent);
    
    // Check if content has actually changed from the original document
    if (newContent !== document.content) {
      hasUnsavedChangesRef.current = true;
      setSaveStatus('unsaved');
    } else {
      hasUnsavedChangesRef.current = false;
      setSaveStatus('saved');
    }
    
    if (document?.metadata?.enableAutoSave) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave(newContent);
      }, (document.metadata.autoSaveInterval || 30) * 1000);
    }
  }, [document, onContentChange, trackContentChange]);

  const handleAutoSave = async (contentToSave: string) => {
    if (!document || !contentToSave.trim()) {
      return;
    }

    setIsAutoSaving(true);
    try {
      if (updateContent) {
        // Use real-time update function if available
        await updateContent(contentToSave, { 
          isAutoSave: true, 
          description: 'Auto-save' 
        });
      } else {
        // Fallback to traditional save method
        await onSave?.(document);
      }
      console.log('Auto-save completed');
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S for save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleManualSave();
    }

    // Ctrl/Cmd + Enter for zen mode toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      setIsZenMode(!isZenMode);
    }
  };

  // Export functionality
  const handleExport = () => {
    if (!content.trim()) {
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = globalThis.document.createElement('a');
    a.href = url;
    a.download = `${document?.title || 'document'}.txt`;
    globalThis.document.body.appendChild(a);
    a.click();
    globalThis.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Handle manual grammar check button click.
   * 
   * @since 1.0.0
   */
  const handleManualGrammarCheck = useCallback(async () => {
    if (!content.trim()) {
      console.log("No content to check");
      return;
    }

    console.log(`Starting manual grammar check for ${content.length} characters`);
    
    try {
      await checkTextManual(content);
      console.log(`Grammar check complete. Found ${suggestions.all.length} suggestions.`);
    } catch (error) {
      console.error('Manual grammar check failed:', error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error detected - check API endpoint');
      }
    }
  }, [content, checkTextManual, suggestions.all.length]);

  /**
   * Handle suggestion acceptance with text replacement.
   *
   * @param suggestionId - ID of the suggestion to accept
   * @since 1.0.0
   */
  const handleAcceptSuggestion = useCallback((suggestionId: string) => {
    const suggestion = suggestions.all.find(s => s.id === suggestionId);
    if (!suggestion) {
      console.warn('Suggestion not found:', suggestionId);
      return;
    }

    // Clear all existing suggestions first
    clearSuggestions();
    
    // Apply the suggestion to the content
    const newContent = content.substring(0, suggestion.position.start) + 
                      suggestion.suggestion + 
                      content.substring(suggestion.position.end);
    
    // Update the content (this will trigger the useEffect that re-checks)
    handleContentChange(newContent);
    
    // Mark the suggestion as accepted in the hook
    acceptSuggestion(suggestionId);
    
    console.log('Applied suggestion:', {
      original: suggestion.original,
      suggestion: suggestion.suggestion,
      position: suggestion.position,
      newContentLength: newContent.length
    });
  }, [content, suggestions.all, handleContentChange, acceptSuggestion, clearSuggestions]);

  /**
   * Handle suggestion acceptance with text replacement.
   *
   * @param suggestionId - ID of the suggestion to ignore
   * @since 1.0.0
   */
  const handleIgnoreSuggestion = useCallback((suggestionId: string) => {
    // Mark the suggestion as ignored in the hook
    ignoreSuggestion(suggestionId);
  }, [ignoreSuggestion]);

  /**
   * Handle bulk suggestion actions.
   *
   * @param action - Action to perform
   * @param suggestionIds - Array of suggestion IDs to process
   * @since 1.0.0
   */
  const handleBulkSuggestionAction = useCallback(async (action: 'accept' | 'ignore', suggestionIds: string[]) => {
    if (action === 'accept') {
      // Apply suggestions sequentially to avoid position conflicts
      let currentContent = content;
      const suggestionsToApply = suggestionIds
        .map(id => suggestions.all.find(s => s.id === id))
        .filter(Boolean)
        .sort((a, b) => a!.position.start - b!.position.start); // Sort by position to apply in order
      
      for (const suggestion of suggestionsToApply) {
        if (!suggestion) continue;
        
        // Clear suggestions before applying each one
        clearSuggestions();
        
        // Apply the suggestion to the current content
        currentContent = currentContent.substring(0, suggestion.position.start) + 
                        suggestion.suggestion + 
                        currentContent.substring(suggestion.position.end);
        
        // Mark the suggestion as accepted
        acceptSuggestion(suggestion.id);
        
        console.log('Applied suggestion in bulk:', {
          id: suggestion.id,
          original: suggestion.original,
          suggestion: suggestion.suggestion,
          position: suggestion.position
        });
      }
      
      // Update content once with all changes
      handleContentChange(currentContent);
    } else {
      // For ignore, we can do them all at once
      suggestionIds.forEach(suggestionId => {
        ignoreSuggestion(suggestionId);
      });
    }
  }, [content, suggestions.all, handleContentChange, acceptSuggestion, ignoreSuggestion, clearSuggestions]);

  /**
   * Handle suggestion click for navigation.
   *
   * @param suggestion - The suggestion that was clicked
   * @since 1.0.0
   */
  const handleSuggestionClick = useCallback((suggestion: any) => {
    // TODO: Implement navigation to suggestion position in text
    console.log('Navigate to suggestion:', suggestion);
  }, []);

  /**
   * Toggle between Writing and Edit modes.
   *
   * @since 1.0.0
   */
  const handleToggleMode = useCallback(() => {
    setMode(mode === 'writing' ? 'edit' : 'writing');
  }, [mode]);

  /**
   * Handle sidebar collapse - switch to writing mode.
   *
   * @since 1.0.0
   */
  const handleSidebarCollapse = useCallback(() => {
    setMode('writing');
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-background-primary',
        isZenMode && 'fixed inset-0 z-50',
        className
      )}
    >
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-primary-200 bg-background-primary">
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

          {enableGrammarChecking && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualGrammarCheck}
              disabled={isCheckingGrammar || content.length === 0}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isCheckingGrammar ? 'Checking...' : 'Check Grammar'}
            </Button>
          )}

          {/* Writing Statistics Panel - Hidden in Zen Mode */}
          {!isZenMode && (
            <div className="flex items-center space-x-1 text-sm text-text-secondary">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{characterCount} characters</span>
            </div>
          )}

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

          {/* Grammar checking indicator */}
          {enableGrammarChecking && (
            <div className="flex items-center space-x-1">
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  isCheckingGrammar && 'bg-blue-500 animate-pulse',
                  !isCheckingGrammar && suggestions.stats.total > 0 && 'bg-orange-500',
                  !isCheckingGrammar && suggestions.stats.total === 0 && !grammarError && 'bg-green-500',
                  grammarError && 'bg-red-500'
                )}
              />
              <span className="text-xs text-text-secondary">
                {isCheckingGrammar 
                  ? 'Checking...' 
                  : grammarError
                    ? grammarError.includes('too long') 
                      ? 'Text too long'
                      : 'Check failed'
                    : suggestions.stats.total > 0 
                      ? `${suggestions.stats.total} suggestions`
                      : 'No issues'
                }
              </span>
              {grammarError && (
                <AlertCircle className="w-3 h-3 text-red-500" />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleMode}
          >
            {mode === 'writing' ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Mode
              </>
            ) : (
              <>
                <PenTool className="w-4 h-4 mr-2" />
                Writing Mode
              </>
            )}
          </Button>

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
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export TXT
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsZenMode(!isZenMode)}
          >
            {isZenMode ? (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Exit Zen Mode
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Zen Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Text Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-auto">
            <SuggestionHighlighter
              text={content}
              suggestions={suggestions.all.filter(s => s.status === 'active')}
              onAcceptSuggestion={handleAcceptSuggestion}
              onIgnoreSuggestion={handleIgnoreSuggestion}
              enabled={enableGrammarChecking}
              className="min-h-full"
              isEditable={mode === 'writing'}
              onContentChange={handleContentChange}
              textareaRef={textareaRef}
              onKeyDown={handleKeyDown}
            />
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-100 text-xs">
                <div>Total suggestions: {suggestions.all.length}</div>
                <div>Active suggestions: {suggestions.all.filter(s => s.status === 'active').length}</div>
                <div>Grammar suggestions: {suggestions.grammar.length}</div>
                <div>Spelling suggestions: {suggestions.spelling.length}</div>
                <div>Is checking: {isCheckingGrammar ? 'Yes' : 'No'}</div>
                <div>Grammar error: {grammarError || 'None'}</div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-primary-200 bg-white dark:bg-background-primary overflow-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                Preview
              </h3>
              <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed text-gray-900 dark:text-text-primary">
                {content}
              </pre>
            </div>
          </div>
        )}

        {/* Suggestion Sidebar */}
        {mode === 'edit' && enableGrammarChecking && (
          <SuggestionSidebar
            suggestions={suggestions.all}
            onAcceptSuggestion={handleAcceptSuggestion}
            onIgnoreSuggestion={handleIgnoreSuggestion}
            onBulkAction={handleBulkSuggestionAction}
            onSuggestionClick={handleSuggestionClick}
            isCollapsed={false}
            onToggleCollapse={handleSidebarCollapse}
          />
        )}
      </div>

      {/* Writing Mode Suggestions Panel */}
      {enableGrammarChecking && suggestions.stats.total > 0 && mode === 'writing' && (
        <div className="border-t border-primary-200 bg-background-secondary">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text-primary">
                Writing Suggestions ({suggestions.stats.total})
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSidebarCollapse}
                  className="text-xs"
                >
                  Open Sidebar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSuggestions}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suggestions.all
                .filter(suggestion => suggestion.status === 'active')
                .slice(0, 5) // Show first 5 suggestions
                .map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-start space-x-2 p-2 rounded-md bg-background-primary border border-primary-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          getSuggestionTypeDotColor(suggestion.type)
                        )}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-text-primary">
                          <span className="font-medium">{suggestion.original}</span>
                          <span className="text-text-secondary"> → </span>
                          <span className="font-medium text-green-600">{suggestion.suggestion}</span>
                        </div>
                        <CompactConfidenceIndicator 
                          confidence={suggestion.confidence}
                          className="ml-2"
                        />
                      </div>
                      <p className="text-xs text-text-secondary">
                        {suggestion.explanation}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAcceptSuggestion(suggestion.id)}
                        className="text-xs h-6 px-2"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleIgnoreSuggestion(suggestion.id)}
                        className="text-xs h-6 px-2"
                      >
                        Ignore
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            
            {suggestions.stats.total > 5 && (
              <p className="text-xs text-text-secondary mt-2">
                Showing 5 of {suggestions.stats.total} suggestions
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 