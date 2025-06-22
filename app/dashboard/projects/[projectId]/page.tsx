/**
 * @fileoverview Individual project page component (client component).
 *
 * This page displays a single project and its details. It provides
 * project information and navigation to create and manage documents.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { getProject } from '@/lib/db/projects';
import { getDocumentsByProject } from '@/lib/db/documents';
import type { Project } from '@/types/project';
import type { Document } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Calendar, ArrowRight } from 'lucide-react';

interface ProjectPageProps {
  params: { projectId: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = params;
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectData() {
      if (!user?.uid) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const projectData = await getProject(projectId, user.uid);
        if (!projectData) {
          setError('Project not found');
          return;
        }
        
        setProject(projectData);
        const documentsData = await getDocumentsByProject(projectId, user.uid);
        setDocuments(documentsData);
      } catch (e) {
        setError('Failed to load project data');
        console.error('Error loading project:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId, user?.uid]);

  if (loading) {
    return <div className="p-4 max-w-4xl mx-auto">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 max-w-4xl mx-auto text-red-600">Error: {error}</div>;
  }

  if (!project) {
    return <div className="p-4 max-w-4xl mx-auto text-red-600">Project not found</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Back to Projects */}
      <a href="/dashboard/projects">
        <Button type="button" variant="outline" className="mb-6">
          ← Back to Projects
        </Button>
      </a>

      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        {project.description && (
          <p className="text-gray-600 mb-4">{project.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created: {project.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{documents.length} document{documents.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <a href={`/dashboard/projects/${projectId}/documents`}>
          <Button type="button" variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            View All Documents
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </a>
        <a href={`/dashboard/projects/${projectId}/documents/new`}>
          <Button type="button">
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </a>
      </div>

      {/* Recent Documents Preview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
        {documents.length === 0 ? (
          <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No documents yet</p>
            <p className="text-sm">Create your first document to get started</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {documents.slice(0, 5).map(doc => (
              <a 
                key={doc.id} 
                href={`/dashboard/projects/${projectId}/documents/${doc.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{doc.title}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.metadata?.description || 'No description'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </a>
            ))}
            {documents.length > 5 && (
              <div className="text-center">
                <a 
                  href={`/dashboard/projects/${projectId}/documents`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View all {documents.length} documents →
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Stats */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
            <div className="text-sm text-gray-600">Documents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(doc => doc.content && doc.content.length > 0).length}
            </div>
            <div className="text-sm text-gray-600">With Content</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {project.type || 'Unknown'}
            </div>
            <div className="text-sm text-gray-600">Type</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {project.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Created</div>
          </div>
        </div>
      </div>
    </div>
  );
} 