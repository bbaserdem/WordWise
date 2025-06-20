/**
 * @fileoverview Projects page component.
 *
 * This page displays the user's projects and allows them to create new ones.
 * It uses the useProjects hook to fetch and display projects from Firestore.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/use-projects';

/**
 * Projects page component.
 *
 * Displays the user's projects from Firestore and provides
 * navigation to create new projects.
 *
 * @returns The projects page component
 */
export default function ProjectsPage() {
  const { projects, isLoading, error, refreshProjects } = useProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={refreshProjects}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Link href="/dashboard/projects/new">
            <Button variant="default">
              Create New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-6 rounded-lg shadow-soft border border-primary-200">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading projects...</p>
          </div>
        </div>
      )}

      {/* Projects List */}
      {!isLoading && projects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-lg shadow-soft border border-primary-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-text-primary truncate">
                  {project.name}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800 ml-2 flex-shrink-0">
                  {project.type.replace('-', ' ')}
                </span>
              </div>
              
              {project.description && (
                <p className="text-text-secondary text-sm mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
                  {project.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                <span>Status: {project.status}</span>
                <span>Visibility: {project.visibility}</span>
              </div>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary">
                  {project.stats.documentCount} documents
                </span>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button variant="outline" size="sm">
                    Open Project
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && projects.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-soft border border-primary-200">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No projects yet
            </h3>
            <p className="text-text-secondary mb-6">
              Create your first project to start writing with AI assistance.
            </p>
            <Link href="/dashboard/projects/new">
              <Button variant="default">
                Create Your First Project
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 