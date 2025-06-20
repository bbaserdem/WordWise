/**
 * @fileoverview Authentication layout for login and registration pages.
 * 
 * This layout provides a clean, centered design for authentication pages
 * with proper styling and responsive behavior.
 * 
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import React from 'react';

/**
 * Props for the AuthLayout component.
 */
interface AuthLayoutProps {
  /** Child components to render within the auth layout */
  children: React.ReactNode;
}

/**
 * Authentication layout component.
 * 
 * Provides a centered, minimal layout for authentication pages
 * with consistent styling and responsive design.
 * 
 * @param children - Child components to render
 * @returns The authentication layout component
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary">WordWise</h1>
          <p className="mt-2 text-text-secondary">
            AI-first writing assistant for STEM graduate students
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-soft p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 