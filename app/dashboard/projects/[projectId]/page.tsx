/**
 * @fileoverview Individual project page component.
 *
 * This page displays a single project and its details. It will be enhanced
 * with full project management functionality in later phases.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Individual project page component.
 *
 * Displays project details and provides navigation to documents.
 * This will be enhanced with full project management functionality in later phases.
 *
 * @returns The project page component
 */
export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;

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
            Project Created Successfully!
          </h3>
          <p className="text-text-secondary mb-4">
            Project ID: {projectId}
          </p>
          <p className="text-text-secondary mb-6">
            This project page will be enhanced with full project management functionality in the next phase.
            You&apos;ll be able to add documents, edit project settings, and start writing with AI assistance.
          </p>
          <div className="space-x-4">
            <Link href="/dashboard/projects">
              <Button variant="outline">
                Back to Projects
              </Button>
            </Link>
            <Link href="/dashboard/projects/new">
              <Button variant="default">
                Create Another Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 