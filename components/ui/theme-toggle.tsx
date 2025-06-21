/**
 * @fileoverview Theme toggle component for switching between light, dark, and system themes.
 *
 * This component provides a dropdown menu for users to select their preferred theme
 * and displays the current theme with an appropriate icon.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { useState } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-context';

/**
 * Theme toggle component props.
 *
 * @since 1.0.0
 */
interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the dropdown menu */
  showDropdown?: boolean;
}

/**
 * Theme toggle component.
 *
 * This component provides a button to toggle between light and dark themes,
 * with an optional dropdown to select system theme as well.
 *
 * @param className - Additional CSS classes
 * @param showDropdown - Whether to show the dropdown menu
 * @returns The theme toggle component
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * <ThemeToggle showDropdown={true} />
 * ```
 *
 * @since 1.0.0
 */
export function ThemeToggle({ className = '', showDropdown = false }: ThemeToggleProps) {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /**
   * Get the appropriate icon for the current theme.
   *
   * @returns The theme icon component
   * @since 1.0.0
   */
  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Monitor className="w-4 h-4" />;
    }
    return isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
  };

  /**
   * Get the theme label for display.
   *
   * @returns The theme label
   * @since 1.0.0
   */
  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  /**
   * Handle theme selection.
   *
   * @param selectedTheme - The selected theme
   * @since 1.0.0
   */
  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
    setIsDropdownOpen(false);
  };

  /**
   * Toggle dropdown visibility.
   *
   * @since 1.0.0
   */
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!showDropdown) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={`p-2 ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {getThemeIcon()}
      </Button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDropdown}
        className="flex items-center space-x-2"
        aria-label="Theme options"
      >
        {getThemeIcon()}
        <span className="hidden sm:inline">{getThemeLabel()}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-background-primary rounded-md shadow-lg border border-gray-200 dark:border-primary-800 py-1 z-50">
            <button
              onClick={() => handleThemeSelect('light')}
              className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-background-secondary transition-colors ${
                theme === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-text-primary'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </button>
            
            <button
              onClick={() => handleThemeSelect('dark')}
              className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-background-secondary transition-colors ${
                theme === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-text-primary'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </button>
            
            <button
              onClick={() => handleThemeSelect('system')}
              className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-background-secondary transition-colors ${
                theme === 'system' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-text-primary'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>System</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
} 