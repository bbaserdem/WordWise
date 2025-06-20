/**
 * @fileoverview Documents listing page for the WordWise application.
 *
 * This page displays all documents within a project with the ability
 * to create new documents, view existing ones, and manage document
 * organization. It provides a clean interface for document management.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, FileText, Calendar, User, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks';
import { getProject } from '@/lib/db/projects';
import { getDocumentsByProject } from '@/lib/db/documents';
import { cn } from '@/lib/utils/cn';
import type { Project } from '@/types/project';
import type { Document } from '@/types/document';

/**
 * Documents listing page component.
 *
 * This component displays all documents within a project with the ability
 * to create new documents, view existing ones, and manage document
 * organization. It provides search, filtering, and sorting capabilities.
 *
 * @returns The documents listing page component
 *
 * @since 1.0.0
 */
export default function DocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const projectId = params.projectId as string;

  // Page state
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt'>('updatedAt');

  // Load project and documents on mount
  useEffect(() => {
    if (user && projectId) {
      loadProjectAndDocuments();
    }
  }, [user, projectId]);

  /**
   * Load project and its documents from the database.
   *
   * @since 1.0.0
   */
  const loadProjectAndDocuments = async () => {
    if (!user || !projectId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Load project
      const projectData = await getProject(projectId, user.uid);
      if (!projectData) {
        setError('Project not found');
        return;
      }
      setProject(projectData);

      // Load documents
      const documentsData = await getDocumentsByProject(projectId, user.uid);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error loading project and documents:', error);
      setError('Failed to load project and documents');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle document creation.
   *
   * @since 1.0.0
   */
  const handleCreateDocument = () => {
    router.push(`/dashboard/projects/${projectId}/documents/new`);
  };

  /**
   * Handle document selection.
   *
   * @param documentId - ID of the document to open
   * @since 1.0.0
   */
  const handleDocumentSelect = (documentId: string) => {
    router.push(`/dashboard/projects/${projectId}/documents/${documentId}`);
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
    return date.toLocaleDateString();
  };

  /**
   * Get document type display name.
   *
   * @param type - The document type
   * @returns Display name for the type
   * @since 1.0.0
   */
  const getDocumentTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      'chapter': 'Chapter',
      'section': 'Section',
      'appendix': 'Appendix',
      'bibliography': 'Bibliography',
      'abstract': 'Abstract',
      'introduction': 'Introduction',
      'conclusion': 'Conclusion',
      'methodology': 'Methodology',
      'results': 'Results',
      'discussion': 'Discussion',
      'literature-review': 'Literature Review',
      'acknowledgments': 'Acknowledgments',
      'other': 'Other',
    };
    return typeMap[type] || type;
  };

  /**
   * Get document status display name.
   *
   * @param status - The document status
   * @returns Display name for the status
   * @since 1.0.0
   */
  const getDocumentStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      'draft': 'Draft',
      'in-progress': 'In Progress',
      'review': 'Review',
      'completed': 'Completed',
      'archived': 'Archived',
    };
    return statusMap[status] || status;
  };

  /**
   * Get status color class.
   *
   * @param status - The document status
   * @returns CSS class for status color
   * @since 1.0.0
   */
  const getStatusColorClass = (status: string) => {
    const colorMap: Record<string, string> = {
      'draft': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'archived': 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Filter and sort documents
  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || doc.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        case 'updatedAt':
          return b.updatedAt.toMillis() - a.updatedAt.toMillis();
        default:
          return 0;
      }
    });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading documents...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Project Not Found</h1>
          <p className="text-text-secondary mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/dashboard/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {project.name}
          </h1>
          <p className="text-text-secondary">
            {project.description || 'No description provided'}
          </p>
        </div>
        
        <Button onClick={handleCreateDocument}>
          <Plus className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Types</option>
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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'title' | 'createdAt' | 'updatedAt')}
          className="px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="updatedAt">Last Modified</option>
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Documents Grid */}
      {filteredAndSortedDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {searchTerm || filterType !== 'all' ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className="text-text-secondary mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters.'
              : 'Create your first document to get started.'
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <Button onClick={handleCreateDocument}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Document
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-primary-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleDocumentSelect(doc.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-primary-600">
                    {getDocumentTypeDisplayName(doc.type)}
                  </span>
                </div>
                <span className={cn('text-xs px-2 py-1 rounded-full', getStatusColorClass(doc.status))}>
                  {getDocumentStatusDisplayName(doc.status)}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                {doc.title}
              </h3>

              {doc.metadata.description && (
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {doc.metadata.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-text-tertiary">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatTimestamp(doc.updatedAt)}</span>
                </div>
                <span>{doc.stats.wordCount} words</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 