/**
 * @fileoverview New project page component.
 *
 * This page allows users to create a new project using the project form.
 * It provides a clean interface for project creation with proper navigation.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProjectForm } from '@/components/forms/project-form';

/**
 * New project page component.
 *
 * Displays the project creation form with proper navigation and
 * handles project creation success.
 *
 * @returns The new project page component
 */
export default function NewProjectPage() {
  const router = useRouter();

  /**
   * Handle successful project creation.
   *
   * @param projectId - ID of the created project
   */
  const handleProjectCreated = (projectId: string) => {
    // Check network connectivity before navigation
    if (!navigator.onLine) {
      console.error('Cannot navigate to project page while offline');
      return;
    }
    
    // Navigate to the new project
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Create New Project</h1>
        <Link href="/dashboard/projects">
          <Button variant="outline">
            Back to Projects
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-soft border border-primary-200 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            Project Details
          </h2>
          <p className="text-text-secondary">
            Create a new project to start writing with AI assistance. Fill in the details below to get started.
          </p>
        </div>

        <ProjectForm onProjectCreated={handleProjectCreated} />
      </div>
    </div>
  );
} 