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

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks';
import type { Document } from '@/types/document';
import { getProject } from '@/lib/db/projects';
import { getDocumentsByProject } from '@/lib/db/documents';

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
export default function DocumentsPage({ params }: { params: { projectId: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.projectId as string;

  const loadProjectAndDocuments = useCallback(async () => {
    if (!user || !projectId) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await getProject(projectId, user.uid);
      const documentsData = await getDocumentsByProject(projectId, user.uid);
      setDocuments(documentsData);
      setFilteredDocuments(documentsData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading project and documents:', error);
      setError('Failed to load project and documents');
    } finally {
      setIsLoading(false);
    }
  }, [user, projectId]);

  useEffect(() => {
    loadProjectAndDocuments();
  }, [loadProjectAndDocuments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredDocuments(documents);
      return;
    }
    const filtered = documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  };

  const handleDocumentClick = (document: Document) => {
    router.push(`/dashboard/projects/${projectId}/documents/${document.id}`);
  };

  const handleBackToProjects = () => {
    router.push('/dashboard/projects');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Button type="button" variant="outline" onClick={handleBackToProjects} className="mb-4">
        Back to Projects
      </Button>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </form>
      <Button type="button" onClick={() => router.push(`/dashboard/projects/${projectId}/documents/new`)} className="mb-4">
        <Plus className="w-4 h-4 mr-2" /> New Document
      </Button>
      <div>
        {filteredDocuments.length === 0 ? (
          <div>No documents found.</div>
        ) : (
          <ul>
            {filteredDocuments.map(doc => (
              <li key={doc.id} className="mb-2 cursor-pointer" onClick={() => handleDocumentClick(doc)}>
                <div className="p-2 border rounded hover:bg-gray-50">
                  <div className="font-semibold">{doc.title}</div>
                  <div className="text-sm text-gray-500">{doc.metadata.description}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 