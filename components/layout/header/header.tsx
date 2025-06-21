/**
 * @fileoverview Header component for the WordWise application.
 *
 * This component provides the main application header with navigation,
 * user menu, and responsive design. It includes the application logo,
 * user profile dropdown, and sidebar toggle for mobile devices.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks';
import { ThemeToggle } from '@/components/ui/theme-toggle';

/**
 * Props for the Header component.
 */
export interface HeaderProps {
  /** Whether the sidebar is currently open */
  isSidebarOpen: boolean;
  /** Callback to toggle sidebar visibility */
  onToggleSidebar: () => void;
  /** Optional custom styling */
  className?: string;
}

/**
 * Header component for the application.
 *
 * Provides the main navigation header with logo, user menu,
 * and responsive controls. Includes user authentication status
 * and profile management options.
 *
 * @param isSidebarOpen - Whether the sidebar is currently open
 * @param onToggleSidebar - Callback to toggle sidebar visibility
 * @param className - Optional custom styling
 * @returns The header component
 *
 * @example
 * ```tsx
 * <Header
 *   isSidebarOpen={sidebarOpen}
 *   onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
 * />
 * ```
 */
export function Header({
  onToggleSidebar,
  className = '',
}: HeaderProps) {
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  /**
   * Handle user sign out.
   */
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // Log error for debugging
      console.error('Sign out failed:', error);
    }
  };

  /**
   * Toggle user menu visibility.
   */
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header
      className={`bg-white dark:bg-background-primary shadow-soft border-b border-gray-200 dark:border-primary-800 sticky top-0 z-40 ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Logo and sidebar toggle */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle for mobile */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <h1 className="text-xl font-semibold text-text-primary hidden sm:block">
              WordWise
            </h1>
          </div>
        </div>

        {/* Right side - Theme toggle and user menu */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <ThemeToggle showDropdown={true} />
          
          {/* User profile */}
          {user && (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
                aria-label="User menu"
              >
                {/* User avatar */}
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                      {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </span>
                  )}
                </div>
                
                {/* User name (hidden on mobile) */}
                <span className="hidden md:block text-sm font-medium">
                  {user.displayName || user.email}
                </span>
                
                {/* Dropdown arrow */}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-background-primary rounded-md shadow-lg border border-gray-200 dark:border-primary-800 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-primary-700">
                    <p className="text-sm font-medium text-text-primary">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  <a
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile Settings
                  </a>
                  
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 