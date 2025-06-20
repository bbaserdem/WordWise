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

import React from 'react';

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
 * for authenticated users. This will be enhanced with actual header
 * and sidebar components in subsequent phases.
 * 
 * @param children - Child components to render
 * @returns The dashboard layout component
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header placeholder */}
      <header className="bg-white shadow-soft border-b border-gray-200">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-text-primary">WordWise</h1>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar placeholder */}
        <aside className="w-64 bg-white shadow-soft min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="/dashboard/projects" className="block px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-md">
                  Projects
                </a>
              </li>
              <li>
                <a href="/dashboard/profile" className="block px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-md">
                  Profile
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 