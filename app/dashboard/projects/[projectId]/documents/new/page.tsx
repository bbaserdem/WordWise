/**
 * @fileoverview Document creation page for the WordWise application.
 *
 * This page allows users to create new documents within a project.
 * It provides a form for document details and redirects to the editor
 * after creation.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks';
import { getProject } from '@/lib/db/projects';
import { createDocument } from '@/lib/db/documents';
import type { Project } from '@/types/project';
import type { CreateDocumentFormData, DocumentType } from '@/types/document';

/**
 * Document creation page component.
 *
 * This component provides a form for creating new documents within a project.
 * It handles form validation, document creation, and navigation to the editor.
 *
 * @returns The document creation page component
 *
 * @since 1.0.0
 */
export default function CreateDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const projectId = params.projectId as string;

  // Page state
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateDocumentFormData>({
    title: '',
    description: '',
    type: 'chapter',
    content: '',
    tags: [],
    order: 1,
    enableAutoSave: true,
    enableCollaboration: false,
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');

  // Load project on mount
  useEffect(() => {
    if (user && projectId) {
      loadProject();
    }
  }, [user, projectId]);

  /**
   * Load project from the database.
   *
   * @since 1.0.0
   */
  const loadProject = async () => {
    if (!user || !projectId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const projectData = await getProject(projectId, user.uid);
      if (!projectData) {
        setError('Project not found');
        return;
      }
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form field changes.
   *
   * @param field - The field to update
   * @param value - The new value
   * @since 1.0.0
   */
  const handleFieldChange = (field: keyof CreateDocumentFormData, value: any) => {
    setFormData((prev: CreateDocumentFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Add a tag to the document.
   *
   * @param tag - Tag to add
   * @since 1.0.0
   */
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      // Check if we're at the tag limit
      if (formData.tags.length >= 10) {
        setError('Maximum 10 tags allowed');
        return;
      }
      
      // Clear any previous errors
      setError(null);
      handleFieldChange('tags', [...formData.tags, trimmedTag]);
    }
  };

  /**
   * Remove a tag from the document.
   *
   * @param tagToRemove - Tag to remove
   * @since 1.0.0
   */
  const removeTag = (tagToRemove: string) => {
    handleFieldChange(
      'tags',
      formData.tags.filter((tag: string) => tag !== tagToRemove)
    );
  };

  /**
   * Handle tag input key press.
   *
   * @param event - Keyboard event
   * @since 1.0.0
   */
  const handleTagKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
        setTagInput('');
      }
    }
  };

  /**
   * Handle tag input change.
   *
   * @param event - Input change event
   * @since 1.0.0
   */
  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
    // Clear tag-related errors when user starts typing
    if (error === 'Maximum 10 tags allowed') {
      setError(null);
    }
  };

  /**
   * Validate form data.
   *
   * @returns True if form is valid, false otherwise
   * @since 1.0.0
   */
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Document title is required');
      return false;
    }

    if (formData.title.length > 100) {
      setError('Document title must be 100 characters or less');
      return false;
    }

    if (formData.description && formData.description.length > 500) {
      setError('Description must be 500 characters or less');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission.
   *
   * @param event - Form submission event
   * @since 1.0.0
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !project) return;

    if (!validateForm()) {
      return;
    }

    // Prevent multiple submissions
    if (isCreating) {
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      console.log('Creating document...', formData);

      // Create the document
      const newDocument = await createDocument(user.uid, projectId, formData);
      console.log('Document created successfully:', newDocument);

      // Show success state
      setIsSuccess(true);

      // Small delay to ensure UI updates and user sees success
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to the document editor with replace to prevent back button issues
      router.replace(`/dashboard/projects/${projectId}/documents/${newDocument.id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      setError('Failed to create document. Please try again.');
      setIsCreating(false);
    }
  };

  /**
   * Handle form cancellation.
   *
   * @since 1.0.0
   */
  const handleCancel = () => {
    router.push(`/dashboard/projects/${projectId}/documents`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading project...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Project Not Found</h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Create New Document</h1>
            <p className="text-text-secondary">
              Add a new document to {project?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Title */}
        <div>
          <label htmlFor="document-title" className="block text-sm font-medium text-text-primary mb-2">
            Document Title *
          </label>
          <Input
            id="document-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="Enter document title"
            maxLength={100}
            required
            disabled={isCreating}
          />
        </div>

        {/* Document Description */}
        <div>
          <label htmlFor="document-description" className="block text-sm font-medium text-text-primary mb-2">
            Description
          </label>
          <textarea
            id="document-description"
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe your document (optional)"
            rows={3}
            maxLength={500}
            disabled={isCreating}
          />
        </div>

        {/* Document Type */}
        <div>
          <label htmlFor="document-type" className="block text-sm font-medium text-text-primary mb-2">
            Document Type *
          </label>
          <select
            id="document-type"
            value={formData.type}
            onChange={(e) => handleFieldChange('type', e.target.value as DocumentType)}
            className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={isCreating}
          >
            <option value="chapter">Chapter</option>
            <option value="section">Section</option>
            <option value="appendix">Appendix</option>
            <option value="bibliography">Bibliography</option>
            <option value="abstract">Abstract</option>
            <option value="introduction">Introduction</option>
            <option value="conclusion">Conclusion</option>
            <option value="methodology">Methodology</option>
            <option value="results">Results</option>
            <option value="discussion">Discussion</option>
            <option value="literature-review">Literature Review</option>
            <option value="acknowledgments">Acknowledgments</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Document Order */}
        <div>
          <label htmlFor="document-order" className="block text-sm font-medium text-text-primary mb-2">
            Order
          </label>
          <Input
            id="document-order"
            type="number"
            value={formData.order}
            onChange={(e) => handleFieldChange('order', parseInt(e.target.value) || 1)}
            placeholder="1"
            min={1}
            disabled={isCreating}
          />
          <p className="text-xs text-text-tertiary mt-1">
            Order determines the sequence of documents in the project
          </p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="document-tags" className="block text-sm font-medium text-text-primary mb-2">
            Tags
          </label>
          <div className="space-y-2">
            <Input
              id="document-tags"
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyPress={handleTagKeyPress}
              className="w-full"
              placeholder="Add tags (press Enter or comma to add)"
              disabled={isCreating}
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                      disabled={isCreating}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Auto-save Toggle */}
        <div className="flex items-center">
          <input
            id="enable-auto-save"
            type="checkbox"
            checked={formData.enableAutoSave}
            onChange={(e) => handleFieldChange('enableAutoSave', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-200 rounded"
            disabled={isCreating}
          />
          <label htmlFor="enable-auto-save" className="ml-2 block text-sm text-text-primary">
            Enable auto-save (saves every 30 seconds)
          </label>
        </div>

        {/* Collaboration Toggle */}
        <div className="flex items-center">
          <input
            id="enable-collaboration"
            type="checkbox"
            checked={formData.enableCollaboration}
            onChange={(e) => handleFieldChange('enableCollaboration', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-200 rounded"
            disabled={isCreating}
          />
          <label htmlFor="enable-collaboration" className="ml-2 block text-sm text-text-primary">
            Enable real-time collaboration
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Document created successfully! Redirecting...
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isCreating || isSuccess}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreating || isSuccess}
          >
            <Save className="w-4 h-4 mr-2" />
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Document'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 