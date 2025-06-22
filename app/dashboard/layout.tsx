/**
 * @fileoverview Dashboard layout for authenticated user pages.
 * 
 * This layout provides the main application structure with header,
 * sidebar navigation, and content area for dashboard pages.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/lib/auth/auth-guard';
import { Header, Sidebar, Breadcrumbs } from '@/components/layout';
import { ErrorBoundary } from '@/components/common';

/**
 * Props for the DashboardLayout component.
 */
interface DashboardLayoutProps {
  /** Child components to render within the dashboard layout */
  children: React.ReactNode;
}

/**
 * Dashboard layout component.
 * 
 * Provides the main application layout with navigation and content area
 * for authenticated users. Includes responsive header, collapsible sidebar,
 * and breadcrumb navigation.
 * 
 * @param children - Child components to render
 * @returns The dashboard layout component
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  /**
   * Check if the current route is a document editor page.
   */
  const isDocumentEditor = pathname?.includes('/documents/') && pathname?.split('/').length >= 6;

  /**
   * Toggle sidebar visibility.
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * Close sidebar (for mobile).
   */
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AuthGuard>
      <ErrorBoundary>
        <div className="min-h-screen bg-background-secondary dark:bg-background-primary">
          {/* Header */}
          <Header
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
          
          <div className="flex">
            {/* Sidebar */}
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
            />
            
            {/* Main content */}
            <main className={`flex-1 ${isDocumentEditor ? '' : 'p-6'}`}>
              {/* Breadcrumbs - only show for non-document-editor pages */}
              {!isDocumentEditor && (
                <div className="mb-6">
                  <Breadcrumbs />
                </div>
              )}
              
              {/* Page content */}
              <div className={isDocumentEditor ? 'h-full' : 'bg-white dark:bg-background-primary rounded-lg shadow-soft p-6'}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </AuthGuard>
  );
} 