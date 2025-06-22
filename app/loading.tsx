/**
 * @fileoverview Global loading component for the WordWise application.
 *
 * This component displays a loading state during page transitions
 * and initial application load.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import React from 'react';

/**
 * Global loading component.
 *
 * Displays a consistent loading state with the WordWise branding
 * during page transitions and initial load.
 *
 * @returns The global loading component
 */
export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="text-center">
        {/* Logo/App Name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">
            WordWise
          </h1>
          <p className="text-text-secondary">
            AI-first writing assistant
          </p>
        </div>
        
        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <p className="text-text-secondary text-sm">
          Loading...
        </p>
        
        {/* Loading Dots Animation */}
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
} 