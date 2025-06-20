/**
 * @fileoverview Breadcrumb navigation component for the WordWise application.
 *
 * This component provides breadcrumb navigation showing the current
 * page location and allowing users to navigate back through the
 * page hierarchy.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';
import { getProject } from '@/lib/db/projects';
import { getDocument } from '@/lib/db/documents';

/**
 * Props for the Breadcrumbs component.
 */
export interface BreadcrumbsProps {
  /** Optional custom styling */
  className?: string;
  /** Whether to show the home breadcrumb */
  showHome?: boolean;
  /** Custom home label */
  homeLabel?: string;
}

/**
 * Breadcrumb item interface.
 */
interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** URL path for the breadcrumb */
  href: string;
  /** Whether this is the current page */
  isCurrent?: boolean;
}

/**
 * Breadcrumbs component for the application.
 *
 * Provides breadcrumb navigation showing the current page location
 * and allowing users to navigate back through the page hierarchy.
 * Automatically generates breadcrumbs based on the current pathname.
 *
 * @param className - Optional custom styling
 * @param showHome - Whether to show the home breadcrumb
 * @param homeLabel - Custom home label
 * @returns The breadcrumbs component
 *
 * @example
 * ```tsx
 * <Breadcrumbs showHome={true} homeLabel="Dashboard" />
 * ```
 */
export function Breadcrumbs({
  className = '',
  showHome = true,
  homeLabel = 'Dashboard',
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const [documentNames, setDocumentNames] = useState<Record<string, string>>({});

  /**
   * Fetch project name for a given project ID.
   */
  const fetchProjectName = async (projectId: string) => {
    if (!user || projectNames[projectId]) return;

    try {
      const project = await getProject(projectId, user.uid);
      if (project) {
        setProjectNames(prev => ({
          ...prev,
          [projectId]: project.name,
        }));
      }
    } catch (error) {
      console.error('Error fetching project name for breadcrumb:', error);
    }
  };

  /**
   * Fetch document title for a given document ID.
   */
  const fetchDocumentTitle = async (documentId: string) => {
    if (!user || documentNames[documentId]) return;

    try {
      const document = await getDocument(documentId, user.uid);
      if (document) {
        setDocumentNames(prev => ({
          ...prev,
          [documentId]: document.title,
        }));
      }
    } catch (error) {
      console.error('Error fetching document title for breadcrumb:', error);
    }
  };

  /**
   * Generate breadcrumb items from the current pathname.
   */
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Check if we're on the dashboard page
    const isOnDashboard = pathname === '/dashboard';

    // Add home breadcrumb if enabled and not already on dashboard
    if (showHome && !isOnDashboard) {
      breadcrumbs.push({
        label: homeLabel,
        href: '/dashboard',
        isCurrent: false,
      });
    }

    // Generate breadcrumbs from path segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip auth routes and dashboard segment (since we handle it as home)
      if (segment === '(auth)' || segment === '(dashboard)' || segment === 'dashboard') {
        return;
      }

      // Handle project ID segments
      if (segment === 'projects' && segments[index + 1] && segments[index + 1] !== 'new') {
        // This is the projects segment, next segment should be project ID
        breadcrumbs.push({
          label: 'Projects',
          href: currentPath,
          isCurrent: false,
        });
        return;
      }

      // Check if this segment might be a project ID (after projects segment)
      if (segments[index - 1] === 'projects' && segment !== 'new') {
        // This is likely a project ID, fetch the project name
        const projectId = segment;
        fetchProjectName(projectId);
        
        // Use project name if available, otherwise show "Loading..." or project ID
        const projectName = projectNames[projectId] || 'Loading...';
        
        breadcrumbs.push({
          label: projectName,
          href: currentPath,
          isCurrent: index === segments.length - 1,
        });
        return;
      }

      // Handle documents segment
      if (segment === 'documents' && segments[index + 1] && segments[index + 1] !== 'new') {
        // This is the documents segment, next segment should be document ID
        breadcrumbs.push({
          label: 'Documents',
          href: currentPath,
          isCurrent: false,
        });
        return;
      }

      // Check if this segment might be a document ID (after documents segment)
      if (segments[index - 1] === 'documents' && segment !== 'new') {
        // This is likely a document ID, fetch the document title
        const documentId = segment;
        fetchDocumentTitle(documentId);
        
        // Use document title if available, otherwise show "Loading..." or document ID
        const documentTitle = documentNames[documentId] || 'Loading...';
        
        breadcrumbs.push({
          label: documentTitle,
          href: currentPath,
          isCurrent: index === segments.length - 1,
        });
        return;
      }

      // Format segment label for other segments
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrent: index === segments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if no breadcrumbs
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      className={`flex items-center space-x-2 text-sm text-text-secondary ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {/* Separator */}
            {index > 0 && (
              <svg
                className="w-4 h-4 mx-2 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}

            {/* Breadcrumb item */}
            {breadcrumb.isCurrent ? (
              <span
                className="text-text-primary font-medium"
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 