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
        <div className="bg-background-primary p-6 rounded-lg shadow-soft border border-primary-200">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="bg-background-primary p-6 rounded-lg shadow-soft border border-primary-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-2">
                  {project.description || 'No description'}
                </p>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {project.type}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>
                {project.stats?.documentCount || 0} document{(project.stats?.documentCount || 0) !== 1 ? 's' : ''}
              </span>
              <span>
                {project.updatedAt?.toDate?.()?.toLocaleDateString() || new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="bg-background-primary p-6 rounded-lg shadow-soft border border-primary-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No projects yet
            </h3>
            <p className="text-text-secondary mb-4">
              Create your first project to get started with WordWise.
            </p>
            <Link href="/dashboard/projects/new">
              <Button>Create Your First Project</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 