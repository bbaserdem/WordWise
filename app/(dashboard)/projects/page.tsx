/**
 * @fileoverview Projects page component for project management.
 * 
 * This page displays a list of user projects and provides functionality
 * to create new projects. It will be enhanced with proper data fetching
 * and project management features in subsequent phases.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import React from 'react';

/**
 * Projects page component.
 * 
 * Displays a list of user projects with options to create new projects.
 * This is a placeholder that will be enhanced with proper data fetching
 * and project management features in subsequent phases.
 * 
 * @returns The projects page component
 */
export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Projects</h1>
          <p className="text-text-secondary">
            Manage your academic writing projects
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
          New Project
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No projects yet</h3>
          <p className="text-text-secondary mb-4">
            Get started by creating your first academic writing project.
          </p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
            Create your first project
          </button>
        </div>
      </div>
    </div>
  );
} 