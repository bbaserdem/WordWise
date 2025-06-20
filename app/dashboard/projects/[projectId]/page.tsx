/**
 * @fileoverview Individual project page component.
 *
 * This page displays a single project and its details. It provides
 * project information and navigation to create and manage documents.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Plus, FileText, Calendar, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { getProject } from '@/lib/db/projects';
import { getDocumentsByProject } from '@/lib/db/documents';
import type { Project } from '@/types/project';
import type { Document } from '@/types/document';

/**
 * Individual project page component.
 *
 * Displays project details and provides navigation to documents.
 * Shows project information, document count, and creation options.
 *
 * @returns The project page component
 */
export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const projectId = params.projectId as string;

  // Page state
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load project and documents on mount
  useEffect(() => {
    if (user && projectId) {
      loadProjectData();
    }
  }, [user, projectId]);

  /**
   * Load project data and documents.
   */
  const loadProjectData = async () => {
    if (!user || !projectId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Load project details
      const projectData = await getProject(projectId, user.uid);
      if (!projectData) {
        setError('Project not found');
        return;
      }
      setProject(projectData);

      // Load project documents
      const projectDocuments = await getDocumentsByProject(projectId, user.uid);
      setDocuments(projectDocuments);
    } catch (error) {
      console.error('Error loading project data:', error);
      setError('Failed to load project data');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle document creation.
   */
  const handleCreateDocument = () => {
    router.push(`/dashboard/projects/${projectId}/documents/new`);
  };

  /**
   * Handle document selection.
   */
  const handleDocumentSelect = (documentId: string) => {
    router.push(`/dashboard/projects/${projectId}/documents/${documentId}`);
  };

  /**
   * Format timestamp for display.
   */
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  /**
   * Get project type display name.
   */
  const getProjectTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      'dissertation': 'Dissertation',
      'research-paper': 'Research Paper',
      'thesis': 'Thesis',
      'book': 'Book',
      'article': 'Article',
      'other': 'Other',
    };
    return typeMap[type] || type;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary">Project Details</h1>
          <Link href="/dashboard/projects">
            <Button variant="outline">
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-soft border border-primary-200">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-primary">Project Details</h1>
          <Link href="/dashboard/projects">
            <Button variant="outline">
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-soft border border-primary-200">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Project Not Found
            </h3>
            <p className="text-text-secondary mb-6">
              {error || 'The project you are looking for does not exist.'}
            </p>
            <Link href="/dashboard/projects">
              <Button variant="outline">
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{project.name}</h1>
          <p className="text-text-secondary mt-1">
            {getProjectTypeDisplayName(project.type)} • {documents.length} documents
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement project settings
              console.log('Project settings');
            }}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Link href="/dashboard/projects">
            <Button variant="outline">
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-soft border border-primary-200">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Project Overview</h2>
          
          {project.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Description</h3>
              <p className="text-text-primary">{project.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-text-tertiary" />
              <div>
                <p className="text-xs text-text-secondary">Created</p>
                <p className="text-sm text-text-primary">{formatTimestamp(project.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-text-tertiary" />
              <div>
                <p className="text-xs text-text-secondary">Owner</p>
                <p className="text-sm text-text-primary">{user?.email}</p>
              </div>
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-soft border border-primary-200">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
          
          <div className="space-y-3">
            <Button
              onClick={handleCreateDocument}
              className="w-full justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Document
            </Button>
            
            <Link href={`/dashboard/projects/${projectId}/documents`}>
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                View All Documents
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-primary-200">
            <h3 className="text-sm font-medium text-text-secondary mb-3">Project Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Documents</span>
                <span className="text-text-primary font-medium">{documents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Type</span>
                <span className="text-text-primary">{getProjectTypeDisplayName(project.type)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Status</span>
                <span className="text-text-primary capitalize">{project.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      {documents.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-soft border border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">Recent Documents</h2>
            <Link href={`/dashboard/projects/${projectId}/documents`}>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.slice(0, 6).map((document) => (
              <div
                key={document.id}
                className="p-4 border border-primary-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => handleDocumentSelect(document.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-text-primary truncate flex-1">
                    {document.title}
                  </h3>
                  <span className="text-xs text-text-secondary ml-2">
                    {document.type}
                  </span>
                </div>
                <p className="text-sm text-text-secondary mb-2">
                  {document.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>{document.stats.wordCount} words</span>
                  <span>{formatTimestamp(document.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-soft border border-primary-200">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No Documents Yet
            </h3>
            <p className="text-text-secondary mb-6">
              Get started by creating your first document in this project.
            </p>
            <Button onClick={handleCreateDocument}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 