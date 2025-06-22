/**
 * @fileoverview 404 Not Found page for the WordWise application.
 *
 * This component displays when users navigate to a route that doesn't exist.
 *
 * @author WordWise Team
 * @version 1.0.0
 * @since 2024-01-01
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { Home, ArrowLeft, Search } from 'lucide-react';

/**
 * 404 Not Found page component.
 *
 * Displays a user-friendly error page when users navigate to
 * non-existent routes with options to navigate back to safety.
 *
 * @returns The 404 page component
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 leading-none">
            404
          </h1>
        </div>
        
        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
          
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Browse Dashboard
            </Button>
          </Link>
        </div>
        
        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-primary-200">
          <p className="text-sm text-text-secondary mb-3">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link href="/dashboard/projects" className="text-primary-600 hover:text-primary-700 transition-colors">
              Projects
            </Link>
            <span className="text-text-tertiary">•</span>
            <Link href="/dashboard/profile" className="text-primary-600 hover:text-primary-700 transition-colors">
              Profile
            </Link>
            <span className="text-text-tertiary">•</span>
            <Link href="/dashboard/profile/settings" className="text-primary-600 hover:text-primary-700 transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 