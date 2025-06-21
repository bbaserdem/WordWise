/**
 * @fileoverview Sidebar navigation component for the WordWise application.
 *
 * This component provides the main navigation sidebar with collapsible
 * functionality, responsive design, and navigation links to different
 * sections of the application.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Props for the Sidebar component.
 */
export interface SidebarProps {
  /** Whether the sidebar is currently open */
  isOpen: boolean;
  /** Callback to close the sidebar (for mobile) */
  onClose?: () => void;
  /** Optional custom styling */
  className?: string;
}

/**
 * Navigation item interface.
 */
interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label for the navigation item */
  label: string;
  /** URL path for the navigation item */
  href: string;
  /** Icon for the navigation item */
  icon: React.ReactNode;
  /** Whether this item is currently active */
  isActive?: boolean;
}

/**
 * Sidebar component for the application.
 *
 * Provides the main navigation sidebar with collapsible functionality
 * and responsive design. Includes navigation links to different
 * sections of the application.
 *
 * @param isOpen - Whether the sidebar is currently open
 * @param onClose - Callback to close the sidebar (for mobile)
 * @param className - Optional custom styling
 * @returns The sidebar component
 *
 * @example
 * ```tsx
 * <Sidebar
 *   isOpen={sidebarOpen}
 *   onClose={() => setSidebarOpen(false)}
 * />
 * ```
 */
export function Sidebar({
  isOpen,
  onClose,
  className = '',
}: SidebarProps) {
  const pathname = usePathname();

  /**
   * Navigation items for the sidebar.
   */
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      href: '/dashboard/projects',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '/dashboard/profile',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  /**
   * Check if a navigation item is active.
   */
  const isActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  /**
   * Handle navigation item click (for mobile).
   */
  const handleNavigationClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-background-primary shadow-soft border-r border-gray-200 dark:border-primary-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-primary-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <h2 className="text-lg font-semibold text-text-primary">
                WordWise
              </h2>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={handleNavigationClick}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                      }`}
                    >
                      <span
                        className={`${
                          active ? 'text-primary-600 dark:text-primary-400' : 'text-text-secondary'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-primary-800">
            <div className="text-xs text-text-secondary text-center">
              <p>WordWise v1.0.0</p>
              <p className="mt-1">AI-first writing assistant</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 