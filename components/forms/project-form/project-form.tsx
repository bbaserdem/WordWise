/**
 * @fileoverview Project creation form component.
 *
 * This component provides a form for creating new projects with all
 * necessary fields and validation. It integrates with the project
 * management hook for seamless project creation.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createProject } from '@/lib/db/projects';
import { useAuth } from '@/lib/auth/auth-context';
import type {
  CreateProjectFormData,
  ProjectType,
  ProjectVisibility,
  WritingStyle,
  CitationFormat,
} from '@/types/project';

/**
 * Props for the ProjectForm component.
 *
 * @since 1.0.0
 */
interface ProjectFormProps {
  /** Callback function when project is successfully created */
  onProjectCreated?: (projectId: string) => void;
  /** Whether the form is in a modal context */
  isModal?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Project creation form component.
 *
 * This component renders a comprehensive form for creating new projects
 * with fields for name, description, type, visibility, and settings.
 * It includes validation and error handling.
 *
 * @param props - Component props
 * @returns The project form component
 *
 * @example
 * ```tsx
 * <ProjectForm
 *   onProjectCreated={(projectId) => {
 *     router.push(`/dashboard/projects/${projectId}`);
 *   }}
 * />
 * ```
 *
 * @since 1.0.0
 */
export function ProjectForm({
  onProjectCreated,
  isModal = false,
  className = '',
}: ProjectFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Form state
  const [formData, setFormData] = useState<CreateProjectFormData>({
    name: '',
    description: '',
    type: 'research-paper',
    tags: [],
    visibility: 'private',
    enableCollaboration: false,
    writingStyle: 'academic',
    citationFormat: 'apa',
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network: Online');
      setIsOnline(true);
      setError(null); // Clear any network errors when coming back online
    };
    
    const handleOffline = () => {
      console.log('Network: Offline');
      setIsOnline(false);
    };

    // Set initial status
    const initialStatus = navigator.onLine;
    console.log('Initial network status:', initialStatus);
    setIsOnline(initialStatus);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Add interval-based monitoring for dev tools offline mode
    const networkCheckInterval = setInterval(() => {
      const currentStatus = navigator.onLine;
      if (currentStatus !== isOnline) {
        console.log('Network status changed via interval check:', currentStatus);
        setIsOnline(currentStatus);
        if (currentStatus) {
          setError(null); // Clear network errors when coming back online
        }
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(networkCheckInterval);
    };
  }, [isOnline]); // Add isOnline to dependencies

  /**
   * Handle form field changes.
   *
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const handleFieldChange = (
    field: keyof CreateProjectFormData,
    value: string | boolean | string[]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  /**
   * Add a tag to the project.
   *
   * @param tag - Tag to add
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
   * Remove a tag from the project.
   *
   * @param tagToRemove - Tag to remove
   */
  const removeTag = (tagToRemove: string) => {
    handleFieldChange(
      'tags',
      formData.tags.filter(tag => tag !== tagToRemove)
    );
  };

  /**
   * Handle tag input key press.
   *
   * @param event - Keyboard event
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
   */
  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
    // Clear tag-related errors when user starts typing
    if (error === 'Maximum 10 tags allowed') {
      setError(null);
    }
  };

  /**
   * Validate the form data.
   *
   * @returns True if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    console.log('Validating form with name length:', formData.name.length);
    
    if (!formData.name.trim()) {
      console.log('Validation failed: Project name is required');
      setError('Project name is required');
      return false;
    }

    if (formData.name.length >= 100) {
      console.log('Validation failed: Project name too long');
      setError('Project name must be less than 100 characters');
      return false;
    }

    if (formData.description && formData.description.length >= 500) {
      console.log('Validation failed: Description too long');
      setError('Project description must be less than 500 characters');
      return false;
    }

    if (formData.tags.length > 10) {
      console.log('Validation failed: Too many tags');
      setError('Maximum 10 tags allowed');
      return false;
    }

    console.log('Validation passed');
    return true;
  };

  /**
   * Check network connectivity manually.
   *
   * @returns True if online, false if offline
   */
  const checkNetworkStatus = (): boolean => {
    const status = navigator.onLine;
    console.log('Manual network check:', status);
    setIsOnline(status);
    return status;
  };

  /**
   * Handle form submission.
   *
   * @param event - Form submission event
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if user is authenticated
    if (!user) {
      setError('You must be logged in to create a project.');
      return;
    }

    // Clear any previous errors
    setError(null);

    // Check network connectivity
    const networkStatus = checkNetworkStatus();
    if (!networkStatus) {
      setError('You are currently offline. Please check your internet connection and try again.');
      return;
    }

    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      // Don't proceed if validation fails
      return;
    }

    setIsSubmitting(true);

    try {
      // Double-check network status before proceeding
      if (!checkNetworkStatus()) {
        throw new Error('Network connection lost. Please check your internet connection and try again.');
      }

      // Create project in Firestore
      const newProject = await createProject(user.uid, formData);
      console.log('Project created successfully:', newProject);

      // Final network check before navigation
      if (!checkNetworkStatus()) {
        throw new Error('Network connection lost during project creation. Please try again.');
      }

      // Call the success callback
      if (onProjectCreated) {
        onProjectCreated(newProject.id);
      } else {
        // Default navigation - only if still online
        if (checkNetworkStatus()) {
          router.push(`/dashboard/projects/${newProject.id}`);
        } else {
          throw new Error('Cannot navigate to project page while offline.');
        }
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form cancellation.
   */
  const handleCancel = () => {
    if (isModal) {
      // Close modal logic would go here
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      {/* Network Status */}
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          ⚠️ You are currently offline. Some features may not work properly.
        </div>
      )}

      {/* Debug Network Status (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <span>Network Status: {isOnline ? '🟢 Online' : '🔴 Offline'}</span>
            <button
              type="button"
              onClick={checkNetworkStatus}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Refresh Status
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Project Name */}
      <div>
        <label htmlFor="project-name" className="block text-sm font-medium text-text-primary mb-2">
          Project Name *
        </label>
        <input
          id="project-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter project name"
        />
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="project-description" className="block text-sm font-medium text-text-primary mb-2">
          Description
        </label>
        <textarea
          id="project-description"
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe your project (optional)"
          rows={3}
          maxLength={500}
        />
      </div>

      {/* Project Type */}
      <div>
        <label htmlFor="project-type" className="block text-sm font-medium text-text-primary mb-2">
          Project Type *
        </label>
        <select
          id="project-type"
          value={formData.type}
          onChange={(e) => handleFieldChange('type', e.target.value as ProjectType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="research-paper">Research Paper</option>
          <option value="dissertation">Dissertation</option>
          <option value="thesis">Thesis</option>
          <option value="journal-article">Journal Article</option>
          <option value="conference-paper">Conference Paper</option>
          <option value="book-chapter">Book Chapter</option>
          <option value="technical-report">Technical Report</option>
          <option value="proposal">Proposal</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Project Visibility */}
      <div>
        <label htmlFor="project-visibility" className="block text-sm font-medium text-text-primary mb-2">
          Visibility *
        </label>
        <select
          id="project-visibility"
          value={formData.visibility}
          onChange={(e) => handleFieldChange('visibility', e.target.value as ProjectVisibility)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="private">Private</option>
          <option value="shared">Shared</option>
          <option value="public">Public</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="project-tags" className="block text-sm font-medium text-text-primary mb-2">
          Tags
        </label>
        <div className="space-y-2">
          <input
            id="project-tags"
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyPress={handleTagKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Add tags (press Enter or comma to add)"
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
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Writing Style */}
      <div>
        <label htmlFor="writing-style" className="block text-sm font-medium text-text-primary mb-2">
          Writing Style
        </label>
        <select
          id="writing-style"
          value={formData.writingStyle}
          onChange={(e) => handleFieldChange('writingStyle', e.target.value as WritingStyle)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="academic">Academic</option>
          <option value="technical">Technical</option>
          <option value="creative">Creative</option>
          <option value="casual">Casual</option>
        </select>
      </div>

      {/* Citation Format */}
      <div>
        <label htmlFor="citation-format" className="block text-sm font-medium text-text-primary mb-2">
          Citation Format
        </label>
        <select
          id="citation-format"
          value={formData.citationFormat}
          onChange={(e) => handleFieldChange('citationFormat', e.target.value as CitationFormat)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="apa">APA</option>
          <option value="mla">MLA</option>
          <option value="chicago">Chicago</option>
          <option value="ieee">IEEE</option>
          <option value="harvard">Harvard</option>
        </select>
      </div>

      {/* Collaboration Toggle */}
      <div className="flex items-center">
        <input
          id="enable-collaboration"
          type="checkbox"
          checked={formData.enableCollaboration}
          onChange={(e) => handleFieldChange('enableCollaboration', e.target.checked)}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="enable-collaboration" className="ml-2 block text-sm text-text-primary">
          Enable real-time collaboration
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting || !isOnline}
        >
          {isSubmitting ? 'Creating...' : isOnline ? 'Create Project' : 'Offline - Cannot Create'}
        </Button>
      </div>
    </form>
  );
} 