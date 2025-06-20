/**
 * @fileoverview New project page component.
 *
 * This page allows users to create a new project. It will be enhanced
 * with full project creation functionality in later phases.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * New project page component.
 *
 * Displays a placeholder form for creating new projects. This will be
 * enhanced with full project creation functionality in later phases.
 *
 * @returns The new project page component
 */
export default function NewProjectPage() {
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
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Project Creation Coming Soon
          </h3>
          <p className="text-text-secondary mb-6">
            This feature will be available in the next phase. You&apos;ll be able to create
            projects, add documents, and start writing with AI assistance.
          </p>
          <Link href="/dashboard/projects">
            <Button variant="default">
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 