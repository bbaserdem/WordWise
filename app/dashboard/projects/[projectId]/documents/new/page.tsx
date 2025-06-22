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

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks';
import { getProject } from '@/lib/db/projects';
import { createDocument } from '@/lib/db/documents';

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
export default function NewDocumentPage({ params }: { params: { projectId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.projectId as string;

  const loadProject = useCallback(async () => {
    if (!user || !projectId) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const projectData = await getProject(projectId, user.uid);
      if (!projectData) {
        setError('Project not found');
        return;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading project:', error);
      setError('Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }, [user, projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const newDocument = await createDocument(user!.uid, projectId, {
        title: title.trim(),
        content: content.trim(),
        type: 'chapter',
        description: description.trim() || undefined,
        order: 1,
        tags: [],
        enableAutoSave: true,
        enableCollaboration: false,
      });
      router.push(`/dashboard/projects/${projectId}/documents/${newDocument.id}`);
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error creating document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create document';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value.trim()) {
      setError(null);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleBackToProject = () => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto">
      <Button type="button" variant="outline" onClick={handleBackToProject} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project
      </Button>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <textarea
          className="w-full h-40 p-2 border rounded"
          placeholder="Start writing your document..."
          value={content}
          onChange={handleContentChange}
        />
      </div>
      <div className="mb-4">
        <textarea
          className="w-full h-20 p-2 border rounded"
          placeholder="Description (optional)"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        <Save className="w-4 h-4 mr-2" />
        {isSubmitting ? 'Creating...' : 'Create Document'}
      </Button>
    </form>
  );
} 