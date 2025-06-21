/**
 * @fileoverview Theme context for managing dark mode state.
 *
 * This context provides theme management functionality including
 * dark mode toggle, user preference persistence, and browser
 * preference detection.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks';

/**
 * Theme type definition.
 *
 * @since 1.0.0
 */
type Theme = 'light' | 'dark' | 'system';

/**
 * Theme context state interface.
 *
 * @since 1.0.0
 */
interface ThemeContextState {
  /** Current theme (light, dark, or system) */
  theme: Theme;
  /** Whether dark mode is currently active */
  isDark: boolean;
  /** Function to set the theme */
  setTheme: (theme: Theme) => void;
  /** Function to toggle between light and dark */
  toggleTheme: () => void;
}

/**
 * Theme context provider props.
 *
 * @since 1.0.0
 */
interface ThemeProviderProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Theme context.
 *
 * @since 1.0.0
 */
const ThemeContext = createContext<ThemeContextState | undefined>(undefined);

/**
 * Theme provider component.
 *
 * This component manages the application's theme state, including
 * dark mode preferences, user settings, and browser preferences.
 *
 * @param children - Child components to wrap with theme context
 * @returns The theme provider with context
 *
 * @since 1.0.0
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  /**
   * Get the effective theme based on user preference and system preference.
   *
   * @param userTheme - User's preferred theme
   * @returns The effective theme (light or dark)
   * @since 1.0.0
   */
  const getEffectiveTheme = (userTheme: Theme): boolean => {
    if (userTheme === 'light') return false;
    if (userTheme === 'dark') return true;
    
    // For 'system', check browser preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    return false;
  };

  /**
   * Apply theme to the document.
   *
   * @param isDarkMode - Whether to apply dark mode
   * @since 1.0.0
   */
  const applyTheme = (isDarkMode: boolean) => {
    const html = document.documentElement;
    
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    setIsDark(isDarkMode);
  };

  /**
   * Set the theme and persist it.
   *
   * @param newTheme - The new theme to set
   * @since 1.0.0
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordwise-theme', newTheme);
    }
    
    // Save to user preferences if user is logged in
    if (user) {
      // TODO: Update user preferences in database
      console.log('Saving theme preference:', newTheme);
    }
    
    // Apply the theme
    const effectiveTheme = getEffectiveTheme(newTheme);
    applyTheme(effectiveTheme);
  };

  /**
   * Toggle between light and dark themes.
   *
   * @since 1.0.0
   */
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('wordwise-theme') as Theme;
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    } else if (user?.preferences?.enableDarkMode !== undefined) {
      // Use user preference from database
      setThemeState(user.preferences.enableDarkMode ? 'dark' : 'light');
    } else {
      // Default to system preference
      setThemeState('system');
    }
  }, [user]);

  // Apply theme when theme state changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(theme);
    applyTheme(effectiveTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const effectiveTheme = getEffectiveTheme(theme);
      applyTheme(effectiveTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const contextValue: ThemeContextState = {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use the theme context.
 *
 * @returns The theme context state
 * @throws Error if used outside of ThemeProvider
 *
 * @since 1.0.0
 */
export function useTheme(): ThemeContextState {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
} 