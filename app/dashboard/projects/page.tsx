/**
 * @fileoverview Projects page component.
 *
 * This page displays the user's projects and allows them to create new ones.
 * It will be enhanced with full project management functionality in later phases.
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
 * Projects page component.
 *
 * Displays a placeholder for the projects list. This will be enhanced
 * with full project management functionality in later phases.
 *
 * @returns The projects page component
 */
export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button variant="default">
            Create New Project
          </Button>
        </Link>
      </div>

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
    </div>
  );
} 